"use client";

import { useState } from "react";
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
import { LogOut, ChevronDown, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/features/auth/contexts/auth-context";
import { getRoleDisplayName } from "@/features/auth/types/roles";

interface UserMenuProps {
  className?: string;
}

export function UserMenu({ className }: UserMenuProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { toast } = useToast();
  const { user, role, logout } = useAuth();

  // Derive initials from the authenticated user supplied by the shared auth system
  const getInitials = (): string => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.username) return user.username[0].toUpperCase();
    return "U";
  };

  const displayName = user?.displayName ?? (user ? `${user.firstName} ${user.lastName}`.trim() : "User");
  const roleLabel = role ? getRoleDisplayName(role) : "";

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    } catch {
      toast({
        title: "Logout failed",
        description: "An error occurred while logging out.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`h-10 px-3 hover:bg-gray-100 ${className ?? ""}`}
        >
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-red-600 text-white text-sm font-semibold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block text-left">
              <div className="text-sm font-medium text-gray-800">{displayName}</div>
              {roleLabel && (
                <div className="text-xs text-gray-500">{roleLabel}</div>
              )}
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-64 bg-white border border-gray-200 shadow-lg"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center space-x-3 p-2">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-red-600 text-white font-semibold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-800 truncate">{displayName}</div>
              {user?.email && (
                <div className="text-xs text-gray-500 truncate mt-0.5">{user.email}</div>
              )}
              {roleLabel && (
                <div className="text-xs text-red-600 font-medium mt-0.5">{roleLabel}</div>
              )}
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-gray-100" />

        <DropdownMenuItem
          className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer focus:bg-red-50 focus:text-red-700"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <>
              <Loader2 className="mr-3 h-4 w-4 animate-spin" />
              Signing out...
            </>
          ) : (
            <>
              <LogOut className="mr-3 h-4 w-4" />
              Sign out
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
