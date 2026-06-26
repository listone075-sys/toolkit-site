"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut, User } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";

interface UserMenuProps {
  session: Session | null;
}

export function UserMenu({ session }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("common");

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (!session?.user) return null;

  const avatarUrl = session.user.image;
  const userName = session.user.name ?? "User";
  const userEmail = session.user.email ?? "";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full hover:ring-2 hover:ring-blue-100 transition-all"
        title={userName}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={userName}
            className="h-8 w-8 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
            {userName.charAt(0).toUpperCase()}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-lg bg-white shadow-lg border border-zinc-200 py-1.5 z-50">
          {/* User info */}
          <div className="px-4 py-2.5 border-b border-zinc-100">
            <div className="text-sm font-semibold text-zinc-900 truncate">
              {userName}
            </div>
            <div className="text-xs text-zinc-500 truncate">{userEmail}</div>
          </div>

          {/* Sign out */}
          <button
            onClick={() => {
              setOpen(false);
              signOut({ callbackUrl: "/" });
            }}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            {t("auth.signOut")}
          </button>
        </div>
      )}
    </div>
  );
}
