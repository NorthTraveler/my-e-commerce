'use client'

import { Session } from "next-auth"
import { signOut } from "next-auth/react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { LogOut, Moon, Settings, Sun, TruckIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { useState } from "react"
import { Switch } from "../ui/switch"
import { useRouter } from "next/navigation"

export const UserButton = ({user}:Session) =>{
    const {setTheme,theme} = useTheme();
    const [checked,setChecked] = useState(false);
    const router = useRouter();
    function setSwitchchState(){
        switch(theme){
            case "dark":
                return setChecked(true);
            case "light":
                return setChecked(false);
            case "system":
                return setChecked(false);
        }
    }
     if (user)
    return(
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
                <Avatar className="w-8 h-8">
                {user.image && (
                    <Image
                        src = {user.image}
                        alt = {user.name!}
                        width ={32}
                        height = {32}
                        className = "rounded-full"
                    />
                )}
                {!user.image && (
                <AvatarFallback className="bg-primary/25">
                    <div className="font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                    </div>
                    </AvatarFallback>
                    )}
                </Avatar>
            </DropdownMenuTrigger>

            {theme &&(
            <DropdownMenuContent className="w-64 p-6" align="end">
                <DropdownMenuLabel>
                    <div className="mb-4 p-4 flex flex-col items-center bg-primary/25">
                        {user.image && (
                            <Image 
                            src={user.image} 
                            alt={user.name!} 
                            className="rounded-full"
                            width={36} 
                            height={36} />
                        )}
                        <p className="font-bold text-xs">{user.name}</p>
                        <span className="text-xs font-medium text-secondary-foreground">{user.email}</span>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem 
                onClick={() => router.push('/dashboard/orders')}
                className="group py-2 font-medium cursor-pointer transition-all duration-500 ease-in-out">
                    <TruckIcon 
                    size ={14} 
                    className="mr-3 group-hover:translate-x-1 transition-all duration-500 ease-in-out" 
                    />{" "}
                    我的订单
                </DropdownMenuItem>

                <DropdownMenuItem 
                onClick={() => router.push('/dashboard/settings')}
                className="group py-2 font-medium cursor-pointer transition-all duration-500 ease-in-out">
                    <Settings 
                    size ={14} 
                    className="mr-3 group-hover:rotate-180 transition-all duration-300 ease-in-out"  
                    />{" "}
                    设置
                </DropdownMenuItem>

                <DropdownMenuItem className="py-2 font-medium cursor-pointer transition-all duration-500 ease-in-out">
                    <div 
                    onClick={(e) =>e.stopPropagation()}
                    className="flex items-center group">
                        <div 

                        className="relative flex mr-3">
                            <Sun 
                        className="group-hover:text-yellow-600 absolute group-hover:rotate-180 dark:scale-0 dark:-rotate-90 transition-all duration-500 ease-in-out" size={14} 
                        />
                        <Moon 
                        className="group-hover:text-blue-400 dark dark:scale-100 scale-0" size={14} 
                        />
                        </div>
                        <p className="dark:text-blue-400 text-secondary-foreground/75 font-bold text-yellow-600">
                            切换主题
                            <Switch 
                                className="scale-75 ml-4"
                                checked={checked} onCheckedChange={(e)=>{
                                setChecked((prev) => !prev)
                                if(e) setTheme("dark")
                                if(!e) setTheme("light")
                            }}/>
                        </p>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem 
                onClick={() => signOut()}
                className="py-2 group focus:bg-destructive/30 font-medium cursor-pointer transition-all duration-500">
                    <LogOut  size={14} className="mr-3 group-hover:scale-75 transition-all duration-300 ease-in-out" />
                    登出
                </DropdownMenuItem>
            </DropdownMenuContent>
            )}
        </DropdownMenu>
    )
}   