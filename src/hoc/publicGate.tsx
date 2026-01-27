"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { api } from "@/lib/api";
import { setCredentials } from "@/lib/authSlice";

export default function PublicGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const { accessToken, hasLoggedOut } = useSelector(
    (state: RootState) => state.auth
  );

  const [refreshToken] = api.useRefreshTokenMutation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // ✅ If user explicitly logged out → DO NOT refresh
      if (hasLoggedOut) {
        setChecking(false);
        return;
      }

      // Already logged in
      if (accessToken) {
        router.replace("/");
        return;
      }

      // Try silent refresh
      try {
        const res = await refreshToken().unwrap();
        dispatch(setCredentials({ accessToken: res.access_token, user: null }));
        router.replace("/");
      } catch {
        // Not logged in → allow public route
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, []);

  if (checking) return null;

  return <>{children}</>;
}
