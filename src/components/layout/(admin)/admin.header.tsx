"use client";

import { Bell, Link, Search, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

import ai6 from "../../../assets/images/ai6.png"
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { ThemeSwitcher } from "@/components/(shadcn)/theme-switcher"; 

const Header = (props: any) => {
  const { session } = props;

  console.log(">>> check session header: ", session);
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
        <div className="flex flex-1 items-center gap-4">
          <form className="flex-1 md:max-w-sm lg:max-w-lg">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-muted"
              />
            </div>
          </form>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-red-600 text-[10px] font-medium text-white">
              5
            </span>
          </Button>

          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-red-600 text-[10px] font-medium text-white">
              3
            </span>
          </Button>

          <ThemeToggle />

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
              <DropdownMenuItem>
                {session?.user?.username ?? ""}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut({ redirectTo: "/" })}>
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
