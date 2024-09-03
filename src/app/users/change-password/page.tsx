import { FC } from "react";
import ChangePassword from "@/components/change-password";
import ProtectedRoute from "@/components/protected-route";

const ChangePasswordPage: FC = () => {
  return (
    <ProtectedRoute>
      <ChangePassword />
    </ProtectedRoute>
  );
};
export default ChangePasswordPage;
