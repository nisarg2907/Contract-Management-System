"use client";

import LoginForm from "@/components/ui/auth/loginForm";

export default function Home() {
  return (
    <div className="flex items-center min-w-screen justify-center min-h-screen bg-gray-100">
      <LoginForm />
    </div>
  );
}
