"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn, getUserRole } from "@/utils/auth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    const handleRoute = () => {
      if (!isLoggedIn()) {
        router.replace("/auth/login");
      } else {
        const role = getUserRole();
        if (role === "admin") {
          router.replace("/admin");
        } else {
          router.replace("/home/posts");
        }
      }
    };

    handleRoute();
  }, [router]);
  return <>{children}</>;
}
