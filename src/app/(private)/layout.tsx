"use client";

import { Provider, useDispatch } from "react-redux";
import { store } from "@/store/store";
import withAuth from "@/hoc/withAdmitAuth";
import AuthGate from "@/hoc/authGate";
import { logout as logoutAction } from "@/lib/authSlice";
import { Providers } from "../providers";
import { useRouter } from "next/navigation";
import { useLogoutMutation } from "@/lib/api";

function PrivateLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap(); // clears refresh cookie
    } catch (err) {
      console.warn("Logout API failed, clearing client state anyway");
    } finally {
      dispatch(logoutAction());   // clear Redux
      router.push("/login");      // redirect
    }
  };
  return (
    <AuthGate>
        <button
          onClick={handleLogout}
          className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Logout
        </button>
        <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
    </AuthGate>
  );
}

export default PrivateLayout;
