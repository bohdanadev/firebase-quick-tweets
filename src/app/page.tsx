import { FC } from "react";
import AuthForm from "@/components/auth-form";

interface IProps {
  searchParams: {
    mode: string;
  };
}

const HomePage: FC<IProps> = async ({ searchParams }) => {
  const formMode = searchParams.mode;

  if (formMode) return <AuthForm mode={formMode} />;
};

export default HomePage;
