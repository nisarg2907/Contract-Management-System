"use client"
import { AppSidebar } from '@/components/ui/app-sidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingScreen from '@/components/ui/loadingScreen';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session && session.status === "unauthenticated") {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [session, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingScreen className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen">
      <AppSidebar />
      <div className="flex-1 h-full overflow-auto">
        <SidebarTrigger />
        {children}
      </div>
    </div>
  );
}