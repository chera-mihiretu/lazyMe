"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserRole, isLoggedIn } from "@/utils/auth";

export default function RedirectIfLoggedIn({ children, role = 'none' }: { children: React.ReactNode, role?: string }) {
  const router = useRouter();
  useEffect(() => {
    if (isLoggedIn()) {
      const thisRole = getUserRole();
      if (!thisRole) {
        router.replace("/auth/login");
        return;
      }
      if (thisRole !== role) {
        if (thisRole === "student") {
          router.replace("/home/posts");
        } else if (thisRole === "admin") {
          router.replace("/admin/dashboard");
        }
      }
    }
  }, [router, role]);
  return <>{children}</>;
}
