import { FC } from "react";
import AuthForm from "@/components/auth-form";
import AuthRedirect from "@/components/auth-redirect";

interface IProps {
  searchParams: {
    mode: string;
  };
}

const HomePage: FC<IProps> = async ({ searchParams }) => {
  const formMode = searchParams.mode;

  if (formMode)
    return (
      <AuthRedirect>
        <AuthForm mode={formMode} />
      </AuthRedirect>
    );
};

export default HomePage;
