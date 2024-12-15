"use client"
import { 
  ChevronUp,
  FileText, Library, User2
} from "lucide-react"

import Link from 'next/link';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarFooter,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar"

import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils"
import { usePathname } from 'next/navigation';
import { SocketIndicator } from "@/components/ui/show-notification";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./dropDownMenu";
import { useSession, signOut } from "next-auth/react";

type SidebarItem = {
  title: string;
  url?: string;
  icon: React.ComponentType;
};

const masterList: SidebarItem[] = [
  { title: "Updates", url: "/admin/liveUpdates", icon: FileText },
  { title: "Manage Contracts", url: "/admin", icon: Library },
  { title: "Manage Users", url: "/admin/user", icon: User2 },
  { title: "Update Settings", url: "/admin/settings", icon: ChevronUp }
];

export function AppSidebar() {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const handleSignOut = () => {
    signOut();

  };

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
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {session?.user?.name ?? ""}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem onClick={handleSignOut}>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}