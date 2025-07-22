import { useState } from 'react';
import { Settings, Mail } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

interface FabricaSidebarProps {
  onNavigate: (view: string) => void;
  currentView: string;
}

export function FabricaSidebar({ onNavigate, currentView }: FabricaSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const items = [
    { 
      title: "Convites", 
      key: "convites", 
      icon: Mail,
      description: "Gerenciar convites de usuários"
    }
  ];

  return (
    <Sidebar
      collapsible="icon"
      className="bg-brand-yellow-200"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-brand-brown-700">
            {!isCollapsed && "Administração"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton 
                    onClick={() => onNavigate(item.key)}
                    className={`${
                      currentView === item.key 
                        ? "bg-brand-yellow-400 text-brand-brown-800 font-medium" 
                        : "hover:bg-brand-yellow-300 text-brand-brown-700"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}