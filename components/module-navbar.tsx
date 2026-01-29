'use client';

import { ChevronDown, User, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { NatureXLogo } from '@/components/naturex-logo';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type ModuleTab = 'streetcare' | 'eia' | 'forest-management';

interface ModuleNavbarProps {
  activeModule?: ModuleTab;
}

export function ModuleNavbar({ activeModule }: ModuleNavbarProps) {
  const modules = [
    {
      id: 'streetcare' as ModuleTab,
      label: '가로수 관리',
      sublabel: 'StreetCare',
      href: '/streetcare',
    },
    {
      id: 'eia' as ModuleTab,
      label: '환경영향평가',
      sublabel: 'EIA',
      href: '/eia',
    },
    {
      id: 'forest-management' as ModuleTab,
      label: '산림경영',
      sublabel: 'Forest Management',
      href: '/forest-management',
    },
  ];

  return (
    <header className="border-b border-border bg-card sticky top-0 z-10">
      <div className="px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <NatureXLogo className="h-8" />
          </Link>
          <div className="h-6 w-px bg-border" />

          {/* Module Tabs */}
          <nav className="flex items-center gap-1">
            {modules.map((module) => (
              <Link key={module.id} href={module.href}>
                <Button
                  variant={activeModule === module.id ? 'secondary' : 'ghost'}
                  size="sm"
                  className={cn(
                    'flex flex-col items-start h-auto py-2 px-4 gap-0',
                    activeModule === module.id &&
                      'bg-primary/10 text-primary font-semibold',
                  )}
                >
                  <span className="text-sm leading-tight">{module.label}</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    {module.sublabel}
                  </span>
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Project Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                Project: Seoul Street Trees 2025
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Recent Projects</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Seoul Street Trees 2025</DropdownMenuItem>
              <DropdownMenuItem>Gangnam EIA Assessment</DropdownMenuItem>
              <DropdownMenuItem>Han River Restoration</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View All Projects</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button variant="ghost" size="icon">
            <Bell size={20} />
          </Button>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <User size={16} />
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">Dr. Shin</span>
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
