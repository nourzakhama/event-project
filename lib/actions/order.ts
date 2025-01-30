"use server";
import { Order } from "@/types";
import { redirect } from "next/navigation";
import Stripe from "stripe";

export const checkoutOrder = async (order: Order) => {
  if (!order || !order.price || !order.eventTitle || !order.eventId || !order.buyerId) {
    throw new Error("Missing required order details");
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-12-18.acacia", // specify Stripe API version (make sure to match your Stripe API version)
  });

  const price = order.price * 100; // Stripe expects price in cents

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: price, // Price in cents
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
      mode: "payment", // Ensures it's a one-time payment
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile?session_id={CHECKOUT_SESSION_ID}`, // Add session_id for easy retrieval
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`, // Redirect if payment fails or is canceled
    });

    // Redirect the user to the checkout page
    redirect(session.url!); // This should take the user to Stripe's checkout page
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw new Error("Something went wrong while processing your payment. Please try again later.");
  }
};
