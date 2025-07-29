"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn, getUserRole, getUserExpiryTime } from "@/utils/auth";

export default function ProtectedRoute({ children, role }: { children: React.ReactNode, role : string }) {
  const router = useRouter();
  
  useEffect(() => {
    const handleRoute = () => {
      if (!isLoggedIn()) {
        router.replace("/auth/login");
      } else {
        const thisRole = getUserRole();
        const thisTime = getUserExpiryTime();
        if (!thisRole || (new Date().getTime() > thisTime)) {
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
