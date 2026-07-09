import Stripe from "stripe"
import { STRIPE } from "@/constants"

export const stripe = new Stripe(STRIPE.SECRET_KEY!)
