"use client";

import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import { logout as logoutAction } from "@/lib/authSlice";
import { useLogoutMutation } from "@/lib/api";
import AuthGate from "@/hoc/authGate";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (err) {
      console.warn("Logout failed but clearing client state anyway");
    } finally {
      dispatch(logoutAction());
      router.push("/login");
    }
  };

  return (
    <AuthGate>
      <div className="flex justify-between items-center p-4 gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/")}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Go to Root
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            Go to Dashboard
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
    </AuthGate>
  );
}
