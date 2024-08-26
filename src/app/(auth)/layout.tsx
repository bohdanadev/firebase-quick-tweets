import React from "react";
import "../globals.css";

export const metadata = {
  title: "Auth",
  description: "Firebase Authentication",
};

export default function AuthRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return { children };
}
