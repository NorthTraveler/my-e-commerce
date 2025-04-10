import { cn } from "@/lib/utils";
import { auth } from "@/server/auth";
import { BarChart, Package, PenSquare, Settings, Truck } from "lucide-react"
import Link from "next/link";
import {motion,AnimatePresence} from "framer-motion"
import DashboardNav from "@/components/navigation/dashboard-nav";
export default async function DashboardLayout({
    children
}:{
    children:React.ReactNode
}) {
    const session = await auth();
    
    const userLinks = [{
        label:'订单',
        path:'/dashboard/orders',
        icon: <Truck size={16}/>
    },
    {
        label:'设置',
        path:'/dashboard/settings',
        icon: <Settings size={16}/>
    },
    //as const 用于固定某个值不可改否则为type
    ]as const
    //如果用 && 错位是因为可能会返回false，需要返回数组，所以使用 ？ [] :[]
    const adminLinks = session?.user.role === "admin" ? [
        {
            label:"分析",
            path:"/dashboard/analytics",
            icon:<BarChart size={16} />
        },
        {
            label:"创建",
            path:"/dashboard/add-product",
            icon:<PenSquare size={16} />
        },
        {
            label:"产品",
            path:"/dashboard/products",
            icon:<Package size={16} />
        }
    ] : []

    const allLinks = [...adminLinks,...userLinks]

    return(
        <div>
            <DashboardNav  allLinks={allLinks} />

            {children}
        </div>
    )
}