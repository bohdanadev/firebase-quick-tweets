"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/getUser";
import DataLoading from "@/app/loading";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    if (!user && !loading) {
      router.push("/?mode=login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <DataLoading />;
  }

  return <>{user ? children : null}</>;
};

export default ProtectedRoute;
