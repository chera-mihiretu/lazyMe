"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn, getUserRole } from "@/utils/auth";

export default function ProtectedRoute({ children, role }: { children: React.ReactNode, role : string }) {
  const router = useRouter();
  
  useEffect(() => {
    const handleRoute = () => {
      if (!isLoggedIn()) {
        router.replace("/auth/login");
      } else {
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
    };

    handleRoute();
  }, [router, role]);
  return <>{children}</>;
}
