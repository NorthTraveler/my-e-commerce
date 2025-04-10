import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
} from "@/components/ui/card"
import { db } from "@/src/db"

import Sales from "./sales"
import Earnings from "./earnings"

export const revalidate = 0

export default async function Analytics() {
  const totalOrders = await db.query.orderProduct.findMany({
    with: {
      order: { with: { user: true } },
      product: true,
      productVariants: { with: { variantImages: true } },
    },
  })

  if (totalOrders.length === 0)
    return (
      <Card>
        <CardHeader>
          <CardTitle>未找到现存订单</CardTitle>
        </CardHeader>
      </Card>
    )

  if (totalOrders)
    return (
      <Card>
        <CardHeader>
          <CardTitle>订单分析</CardTitle>
          <CardDescription>
            检查销售，顾客，和其他。
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col lg:flex-row gap-8 ">
          <Sales totalOrders={totalOrders} />
          <Earnings totalOrders={totalOrders} />
        </CardContent>
      </Card>
    )
}
