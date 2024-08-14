import "../globals.css";

export const metadata = {
  title: "Auth",
  description: "Firebase Authentication",
};

export default function AuthRootLayout({ children }) {
  return (
    <>
      <header id="auth-header">
        <p>Welcome back!</p>
      </header>
      {children}
    </>
  );
}
