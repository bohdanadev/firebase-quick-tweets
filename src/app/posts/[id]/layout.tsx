import ProtectedRoute from "@/components/protected-route";

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
