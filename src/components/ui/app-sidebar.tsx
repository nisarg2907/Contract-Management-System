"use client"
import { 
  FileText, Library ,User2
} from "lucide-react"

import Link from 'next/link';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarFooter
} from "@/components/ui/sidebar"

import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils"
import { usePathname } from 'next/navigation';
import { SocketIndicator } from "@/components/ui/show-notification";

type SidebarItem = {
  title: string;
  url?: string;
  icon: React.ComponentType;
};

const masterList: SidebarItem[] = [
  { title: "Updates", url: "/admin/liveUpdates", icon: FileText },
  { title: "Manage Contracts", url: "/admin", icon: Library }
];

export function AppSidebar() {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div className="text-xl font-bold m-4 p-2">Manage Contracts</div>
          <SidebarMenu className='ml-2'>
            {masterList.map((masterItem) => (
              <div key={masterItem.title} className="mb-2">
                <Link 
                  href={masterItem.url || '#'} 
                  className={cn(
                    "flex items-center w-full gap-2 p-2",
                    "hover:bg-accent hover:text-accent-foreground",
                    pathname?.startsWith(masterItem.url ?? "") && "bg-accent text-accent-foreground"
                  )}
                >
                  <masterItem.icon />
                  <span>{masterItem.title}</span>
                  {masterItem.url === "/admin/liveUpdates" && <SocketIndicator />}
                </Link>
              </div>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-4 flex items-center gap-2">
          <User2 />
          <span>Contract Admin</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}