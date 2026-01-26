"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";


import type { RootState, AppDispatch } from "@/store/store";
import { setCredentials, logout } from "@/lib/authSlice";
import { api } from "@/lib/api";
import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  sub: string;
  exp: number;
};

const withAuth = <P extends object>(Component: React.ComponentType<P>) => {
  return function AuthenticatedComponent(props: P) {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const accessToken = useSelector(
      (state: RootState) => state.auth.accessToken
    );
    const user = useSelector(
      (state: RootState) => state.auth.user
    );

    const [refreshToken] =
      api.endpoints.refreshToken.useMutation();
    const [getUserById] =
      api.endpoints.getUserById.useLazyQuery();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const authenticate = async () => {
        try {
          let token = accessToken;

          // 🔄 No token → try refresh
          if (!token) {
            const refreshRes = await refreshToken().unwrap();
            token = refreshRes.access_token;

            dispatch(
              setCredentials({
                accessToken: token,
                user: null,
              })
            );
          }

          // 🔐 Decode token
          const decoded: DecodedToken = jwtDecode(token);

          if (decoded.exp * 1000 < Date.now()) {
            throw new Error("Token expired");
          }

          // 👤 Fetch user only if not already loaded
          if (!user) {
            const userData = await getUserById(decoded.sub).unwrap();
            console.log(userData)
            dispatch(
              setCredentials({
                accessToken: token,
                user: userData,
              })
            );
          }

          setLoading(false);
        } catch (err) {
          dispatch(logout());
          router.push("/login");
        }
      };

      authenticate();
    }, []);

    if (loading) return <div>Loading...</div>;

    return <Component {...props} />;
  };
};

export default withAuth;
