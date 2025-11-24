// components/UserMenu.tsx
"use client";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import ai6 from "../../assets/images/ai6.png";
import { signOut } from "next-auth/react";

interface UserMenuProps {
  username?: string;
}

export function UserMenu({ username }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Image
            src={ai6}
            alt="Avatar"
            className="rounded-full"
            height={32}
            width={32}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>{username ?? ""}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut({ redirectTo: "/" })}>
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}