"use client";

import { ChevronDown, User, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NatureXLogo } from "@/components/naturex-logo";
import Link from "next/link";

export function DashboardNavbar() {
  return (
    <header className="border-b border-border bg-card sticky top-0 z-10">
      <div className="px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <NatureXLogo className="h-8" />
          </Link>
          <div className="h-6 w-px bg-border" />
          <h1 className="text-xl font-semibold text-foreground">Service Hub</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Project Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                Current Project: Seoul Street Trees 2025
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
