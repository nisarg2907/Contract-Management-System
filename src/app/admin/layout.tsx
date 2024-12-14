import { AppSidebar } from '@/components/ui/app-sidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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