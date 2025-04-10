import { auth } from "@/server/auth"
import { orders } from "@/server/schema"
import { db } from "@/src/db"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { z } from "zod"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { formatDistance, subMinutes } from "date-fns"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import Image from "next/image"

export default async function Orders() {
    const user = await auth()
    if (!user) {
        redirect('/login')
    }
    const userOrders = await db.query.localorders.findMany({
        where: eq(orders.userID, user.user.id),
        with: {
            orederProduct: {
                with: {
                    product: true,
                    productVariants: { with: { variantImages: true } },
                    order: true,
                }
            }
        }
    })

    // const form = useForm<z.infer<typeof order>>({
    //     defaultValues:{

    //     }
    // })
    return (
        <Card >
            <CardHeader>
                <CardTitle>你的订单</CardTitle>
                <CardDescription>检查你的订单状态</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableCaption>你的近期订单列表.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>订单号</TableHead>
                            <TableHead>总计</TableHead>
                            <TableHead>状态</TableHead>
                            <TableHead>创建</TableHead>
                            <TableHead>操作</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {userOrders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>${order.total}</TableCell>
                                <TableCell>
                                    <Badge className={order.status === "succeeded"
                                        ? "bg-green-700"
                                        : "bg-secondary-foreground"
                                    }>{order.status} </Badge>
                                </TableCell>
                                <TableCell>{formatDistance(subMinutes(order.created!, 0), new Date(), {
                                    addSuffix: true,
                                })}</TableCell>
                                <TableCell>
                                    <Dialog>
                                        <DropdownMenu >
                                            <DropdownMenuTrigger asChild>
                                                <Button variant={'ghost'}>
                                                    <MoreHorizontal size={16} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DialogTrigger>
                                                    <Button className="w-full" variant={'ghost'}>
                                                        查看详情
                                                    </Button>
                                                </DialogTrigger>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>
                                                    订单详情 #{order.id}
                                                </DialogTitle>
                                                <DialogDescription>
                                                    你的订单总价为 ￥{order.total}
                                                </DialogDescription>
                                            </DialogHeader>
                                            <Card className="overflow-auto p-2 flex flex-col gap-4">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>图像</TableHead>
                                                            <TableHead>价格</TableHead>
                                                            <TableHead>产品</TableHead>
                                                            <TableHead>颜色</TableHead>
                                                            <TableHead>数量</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                    {order.orederProduct.map(
                                                        ({ product, productVariants, quantity }) => (
                                                            <TableRow key={product?.id} >
                                                                <TableCell>
                                                                <Image src={productVariants.variantImages[0].url}
                                                                    width={48}
                                                                    height={48}
                                                                    alt={product!.title} />
                                                                </TableCell>
                                                                <TableCell>{product?.price}</TableCell>
                                                                <TableCell>{product?.title}</TableCell>
                                                                <TableCell>
                                                                    <div style={{background:productVariants.color}} className="w-4 h-4 rounded-full"></div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {quantity}
                                                                </TableCell>
                                                            </TableRow>

                                                        ))}
                                                        </TableBody>
                                                </Table>

                                            </Card>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

    )
}