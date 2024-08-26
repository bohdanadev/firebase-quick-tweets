"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/getUser";
import DataLoading from "@/app/loading";

const AuthRedirect = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading && user) {
      router.push("/posts");
    }
  }, [user, loading, router]);

  if (loading) {
    return <DataLoading />;
  }

  return <>{user ? null : children}</>;
};

export default AuthRedirect;
