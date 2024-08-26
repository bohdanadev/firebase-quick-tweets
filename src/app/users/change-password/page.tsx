import ChangePassword from "@/components/change-password";
import ProtectedRoute from "@/components/protected-route";

const ChangePasswordPage = () => {
  return (
    <ProtectedRoute>
      <ChangePassword />
    </ProtectedRoute>
  );
};
export default ChangePasswordPage;
