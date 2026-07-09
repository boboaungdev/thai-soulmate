import Stripe from "stripe";
import { STRIPE } from "@/constants";

export const stripe = new Stripe(STRIPE.secretKey!);