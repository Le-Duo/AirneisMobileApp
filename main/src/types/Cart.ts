import { Category } from "./Category"
import { Stock } from "./Stock"

export type CartItem = {
  image: string | undefined
  slug: string
  quantity: number
  stock: number
  price: number
  _id: string
  name: string
  category: Category | undefined
}

export type ShippingAddress = {
  user?: string
  fullName: string
  street: string
  city: string
  postalCode: string
  country: string
}

export type Cart = {
  cartItems: CartItem[]
  shippingAddress: ShippingAddress
  paymentMethod: string
  itemsPrice: number
  shippingPrice: number
  taxPrice: number
  totalPrice: number
}
