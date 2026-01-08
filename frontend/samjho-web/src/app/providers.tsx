"use client";

import { AuthProvider } from "../context/AuthContext";
import LoadingProvider from "../context/LoadingContext";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <LoadingProvider>{children}</LoadingProvider>
    </AuthProvider>
  );
}
