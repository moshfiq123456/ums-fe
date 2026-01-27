"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

import type { RootState, AppDispatch } from "@/store/store";
import { logout, setCredentials } from "@/lib/authSlice";
import { api } from "@/lib/api";

type DecodedToken = {
  sub: string;
  exp: number;
};

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const accessToken = useSelector(
    (state: RootState) => state.auth.accessToken
  );

  const [refreshToken] = api.useRefreshTokenMutation();
  const [fetchUser] = api.useLazyGetUserByIdQuery();

  const [checking, setChecking] = useState(true);

  // 🔑 new: prevent rendering children until auth is checked
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const runAuth = async () => {
      try {
        let token = accessToken;

        // 🔁 Refresh if no token
        if (!token) {
          const res = await refreshToken().unwrap();
          token = res.access_token;
        }

        if (!token) throw new Error("No token");

        const decoded: DecodedToken = jwtDecode(token);

        if (decoded.exp * 1000 < Date.now()) {
          throw new Error("Token expired");
        }

        // ✅ Dispatch token before fetching user
        dispatch(setCredentials({ accessToken: token, user: null }));

        const user = await fetchUser(decoded.sub).unwrap();
        dispatch(setCredentials({ accessToken: token, user }));

        setAuthChecked(true); // ✅ ready to render children
      } catch {
        dispatch(logout());
        router.replace("/login");
      } finally {
        setChecking(false);
      }
    };

    runAuth();
  }, []);

  // 🔒 Do not render children until auth check is complete
  if (checking || !authChecked) return null; // or a spinner

  return <>{children}</>;
}
