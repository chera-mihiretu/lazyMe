"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/utils/auth";

export default function RedirectIfLoggedIn({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    if (isLoggedIn()) {
      router.replace("/home");
    }
  }, [router]);
  return <>{children}</>;
}
