"use server";
import { Order } from "@/types";
import { redirect } from "next/navigation";
import Stripe from 'stripe';

export const checkoutOrder = async (order: Order) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const price = order.price! * 100; // Stripe expects price in cents

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: price,
            product_data: {
              name: order.eventTitle,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        eventId: order.eventId,
        buyerId: order.buyerId,
      },
      mode: 'payment', // Ensures it's a payment mode session
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`, // Redirect after successful payment
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`, // Redirect on payment cancellation
    });

    redirect(session.url!); // Redirect user to Stripe's checkout page
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
};
