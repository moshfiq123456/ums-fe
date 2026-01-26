"use client";

import { useEffect } from "react";
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

export default function AuthGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const accessToken = useSelector(
    (state: RootState) => state.auth.accessToken
  );

  const [refreshToken] = api.useRefreshTokenMutation();
  const [fetchUser] = api.useLazyGetUserByIdQuery();

  useEffect(() => {
    const runAuth = async () => {
      try {
        let token = accessToken;

        // 🔁 No token → try refresh
        if (!token) {
          const res = await refreshToken().unwrap();
          token = res.access_token;
          dispatch(setCredentials({ accessToken: token, user: null }));
        }

        const decoded: DecodedToken = jwtDecode(token);

        if (decoded.exp * 1000 < Date.now()) {
          throw new Error("Token expired");
        }

        // 👤 Load user
        const user = await fetchUser(decoded.sub).unwrap();

        dispatch(setCredentials({ accessToken: token, user }));
      } catch (err) {
        dispatch(logout());
        router.push("/login");
      }
    };

    runAuth();
  }, []);

  return <>{children}</>;
}
