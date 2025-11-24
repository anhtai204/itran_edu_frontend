
'use client'

import { useContext } from 'react';
import { signOut } from "next-auth/react";
import { UserContext } from '@/library/user.context';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Menu, PanelLeftClose } from 'lucide-react';

const UserHeader = (props: any) => {
  const { session } = props;
  const { collapseMenu, setCollapseMenu } = useContext(UserContext)!;

  return (
    <header className="flex justify-between items-center px-0 py-0 bg-gray-100 border-b">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapseMenu(!collapseMenu)}
        className="w-16 h-16 text-base"
      >
        {collapseMenu ? <Menu /> : <PanelLeftClose />}
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="mr-5 flex items-center gap-2">
            Welcome {session?.user?.email ?? ""}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="text-destructive focus:text-destructive" 
            onClick={() => signOut({ redirectTo: "/" })}
          >
            Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

export default UserHeader;
