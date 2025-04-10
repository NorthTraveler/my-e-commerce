import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Variant = {
  variantID: number
  quantity: number
}

export type CartItem = {
  name: string
  image: string
  id: number
  variant: Variant
  price: number
}

export type CartState = {
  //实例
  cart: CartItem[]
  // 可选值
  checkoutProgress: "cart-page" | "payment-page" | "confirmation-page"
  // 设定可选值
  setCheckoutProgress: (
    val: "cart-page" | "payment-page" | "confirmation-page"
  ) => void
  // 
  addToCart: (item: CartItem) => void
  removeFromCart: (item: CartItem) => void
  clearCart: () => void
  cartOpen: boolean
  setCartOpen: (val: boolean) => void
}
// 创建购物车store， 并传递内容范式，使用set访问state状态
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      // 默认设定cart
      cart: [],
      // 默认设定cartopen状态
      cartOpen: false,
      //打开cart
      setCartOpen: (val) => set({ cartOpen: val }),
      // 清空cart
      clearCart: () => set({ cart: [] }),
      //默认设定 pg
      checkoutProgress: "cart-page",
      setCheckoutProgress: (val) => set((state) => ({ checkoutProgress: val })),
      // 增加购物车操作
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cart.find(
            (cartItem) => cartItem.variant.variantID === item.variant.variantID
          )
          if (existingItem) {
            const updatedCart = state.cart.map((cartItem) => {
              if (cartItem.variant.variantID === item.variant.variantID) {
                return {
                  ...cartItem,
                  variant: {
                    ...cartItem.variant,
                    quantity: cartItem.variant.quantity + item.variant.quantity,
                  },
                }
              }
              return cartItem
            })
            return { cart: updatedCart }
          } else {
            return {
              cart: [
                ...state.cart,
                {
                  ...item,
                  variant: {
                    variantID: item.variant.variantID,
                    quantity: item.variant.quantity,
                  },
                },
              ],
            }
          }
        }),
      // 移除Cart表单
      removeFromCart: (item) =>
        set((state) => {
          const updatedCart = state.cart.map((cartItem) => {
            if (cartItem.variant.variantID === item.variant.variantID) {
              return {
                ...cartItem,
                variant: {
                  ...cartItem.variant,
                  quantity: cartItem.variant.quantity - 1,
                },
              }
            }
            return cartItem
          })
          return {
            cart: updatedCart.filter((item) => item.variant.quantity > 0),
          }
        }),
    }),
    { name: "cart-storage" }
  )
)
