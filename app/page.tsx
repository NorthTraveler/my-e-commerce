import Products from "@/components/products/products";
import { productVariants } from "@/server/schema";
import { db } from "@/src/db";
import Image from "next/image";

export default async function Home() {
  const data = await db.query.productVariants.findMany({
    with:{
      variantImages:true,
      variantTags:true,
      product:true,
    },
    orderBy:(productVariants,{desc}) => [desc(productVariants.id)],
  })
  // console.log(data)
  return (
    <main>
        <Products variants={data} />
    </main>
  );
}
