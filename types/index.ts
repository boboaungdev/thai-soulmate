export interface Plan {
  id: string
  name: string
  priceIds: {
    subscription: string
    oneTime: string
  }
  price: string
  features: string[]
  popular?: boolean
  pricePerMonth?: string
  duration: {
    paid: string
    total: string
  }
  recurringInterval: {
    paid: string
    total: string
  }
}

export interface User {
  prefix?: string
  name?: string
  gender?: string
  dob?: string
  email?: string
  phone?: string
  nationality?: string
  currentLocation?: string
  hobbies?: string[]
  plan?: Plan
  paymentStatus?: "paid" | null
}
