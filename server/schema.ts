import {
  boolean,
  int,
  timestamp,
  mysqlTable,
  primaryKey,
  varchar,
  text,
  mysqlEnum,
  serial,
  real,
  index,
} from "drizzle-orm/mysql-core"
import type { AdapterAccount } from "next-auth/adapters"
import { createId } from '@paralleldrive/cuid2'
import { or, relations } from "drizzle-orm"
import { table } from "console"


export const users = mysqlTable("user", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => createId()),
  // .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).unique(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }),
  twoFactorEnabled: boolean("twoFactorEnabled").default(false),
  image: varchar("image", { length: 255 }),
  password: varchar('password', { length: 255 }),
  role: mysqlEnum("roles", ["user", "admin"]).default("user"),
  customerID: text("customerID"),
})

export const accounts = mysqlTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: varchar("refresh_token", { length: 255 }),
    access_token: varchar("access_token", { length: 255 }),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: varchar("id_token", { length: 2048 }),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)

export const emailTokens = mysqlTable(
  "email_tokens",
  {
    id: varchar("id", { length: 255 }).primaryKey().notNull().$defaultFn(() => createId()),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text('email').notNull(),
  },
  //用于建立索引，产生关联，从临近的地方进行查询，加快查询速度
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.id, verificationToken.token],
    }),
  })
)

export const passwordResetTokens = mysqlTable('password_reset_tokens',
  {
    id: varchar("id", { length: 255 }).primaryKey().notNull().$defaultFn(() => createId()),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text('email').notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.id, verificationToken.token],
    }),
  })
)


export const twoFactorTokens = mysqlTable('two_factor_tokens',
  {
    id: varchar("id", { length: 255 }).primaryKey().notNull().$defaultFn(() => createId()),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text('email').notNull(),
    userID: varchar("userID", { length: 255 }).references(() => users.id, { onDelete: "cascade" })
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.id, verificationToken.token],
    }),
  })
)

export const products = mysqlTable('products', {
  id: int('id').primaryKey().autoincrement(),
  description: text('description').notNull(),
  title: text("title").notNull(),
  created: timestamp("created").defaultNow(),
  price: real("price").notNull(),
})

export const productVariants = mysqlTable("productVariants", {
  id: int("id").primaryKey().autoincrement(),
  color: text("color").notNull(),
  productType: text("productType").notNull(),
  updated: timestamp("updated").defaultNow(),
  productID: int("productID").notNull()
    .references(() => products.id, { onDelete: "cascade" }),
})

export const variantImages = mysqlTable("VariantImage", {
  id: int("id").primaryKey().autoincrement(),
  url: text("url").notNull(),
  size: real("size").notNull(),
  name: text("name").notNull(),
  order: real("order").notNull(),
  variantID: int("variantID").notNull()
    .references(() => productVariants.id, { onDelete: "cascade" })
})

export const variantTags = mysqlTable("VariantTags", {
  id: int("id").primaryKey().autoincrement(),
  tag: text("tag").notNull(),
  variantID: int("variantID").notNull()
    .references(() => productVariants.id, { onDelete: "cascade" })
})

export const productRelations = relations(products, ({ many }) => ({
  productVariants: many(productVariants, { relationName: "productVariants" }),
  reviews: many(reviews, { relationName: "reviews" })
}))

export const productVariantsRelations = relations(productVariants, ({ many, one }) => ({
  product: one(products, {
    fields: [productVariants.productID],
    references: [products.id],
    relationName: "productVariants"
  }),
  variantImages: many(variantImages, { relationName: 'variantImages' }),
  variantTags: many(variantTags, { relationName: 'variantTags' })
}))

export const variantImagesRelations = relations(variantImages, ({ one }) => ({
  productVariants: one(productVariants, {
    fields: [variantImages.variantID],
    references: [productVariants.id],
    relationName: "variantImages"
  })
}))

export const variantTagsRelations = relations(variantTags, ({ one }) => ({
  productVariants: one(productVariants, {
    fields: [variantTags.variantID],
    references: [productVariants.id],
    relationName: "variantTags"
  })
}))

export const reviews = mysqlTable("review", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => createId()),
  rating: real('rating').notNull(),
  userID: varchar("userID", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  productID: int("productID").notNull().references(() => products.id, { onDelete: "cascade" }),
  comment: text("comment").notNull(),
  created: timestamp("created").defaultNow()
},
  (table) => {
    return {
      productIdx: index('productIdx').on(table.productID),
      userIdx: index('userIdx').on(table.userID)
    }
  })

export const reviewRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userID],
    references: [users.id],
    relationName: "user_reviews",
  }),
  product: one(products, {
    fields: [reviews.productID],
    references: [products.id],
    relationName: "reviews",
  })
}))

export const userRelations = relations(users, ({ many }) => ({
  reviews: many(reviews, { relationName: "user_reviews" }),
  orders:many(orders,{relationName:'user_orders'}),
}))
export const localorders = mysqlTable("localorders",{
  id: varchar("id", { length: 255 })
  .primaryKey()
  .$defaultFn(() => createId()),
  userID:varchar("userID", { length: 255 }).references(() => users.id, { onDelete: "cascade" }),
  total:real("total").notNull(),
  status:text("status").notNull(),
  created:timestamp("created").defaultNow(),
  destination:text("destination").notNull(),
  paymentIntentID: text("paymentIntentID"),
})

export const orders = mysqlTable("orders",{
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => createId()),
    userID: varchar("userID", { length: 255 }).references(() => users.id, { onDelete: "cascade" }),
    total:real("total").notNull(),
    status:text("status").notNull(),
    created:timestamp("created").defaultNow(),
    receiptURL:text("receiptURL"),
    paymentIntentID: text("paymentIntentID"),
}) 

export const oredersRelations = relations(localorders,({one,many}) => ({
  user:one(users,{
    fields:[localorders.userID],
    references:[users.id],
    relationName:"user_orders"
  }),
  orederProduct:many(orderProduct,{relationName:'orderProduct'})
}))

export const orderProduct = mysqlTable("orderProduct",{
  id: varchar("id", { length: 255 })
  .primaryKey()
  .$defaultFn(() => createId()),
  quantity:int('quantity').notNull(),
  productVariantID:int("productVariantID").notNull().references(() => productVariants.id,{onDelete:'cascade'}),
  productID:int("userID").references(() => products.id,{onDelete:"cascade"}),
  orderID:varchar("orderID",{length:255 }).notNull().references(() => localorders.id,{onDelete:"cascade"})
})

export const loaclorderProductRelations = relations(orderProduct,({one}) =>({
  order:one(localorders,{
    fields:[orderProduct.orderID],
    references:[localorders.id],
    relationName:"localorderProduct",
  }),
  product:one(products,{
    fields:[orderProduct.productID],
    references:[products.id],
    relationName:"products",
  }),
  productVariants:one(productVariants,{
    fields:[orderProduct.productVariantID],
    references:[productVariants.id],
    relationName:"productVariants",
  })
}))

export const orderProductRelations = relations(orderProduct,({one}) => ({
  order:one(localorders,{
    fields:[orderProduct.orderID],
    references:[localorders.id],
    relationName:"orderProduct",
  }),
  product:one(products,{
    fields:[orderProduct.productID],
    references:[products.id],
    relationName:"products",
  }),
  productVariants:one(productVariants,{
    fields:[orderProduct.productVariantID],
    references:[productVariants.id],
    relationName:"productVariants",
  })
}))