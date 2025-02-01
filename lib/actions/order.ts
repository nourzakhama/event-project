"use server";
import { Order } from "@/types";
import axios from "axios";
import { redirect } from "next/navigation";
import Stripe from "stripe";
type order= {
  eventTitle: string | undefined;
  eventId: string | undefined;
  price: number;
  buyerId: string | null | undefined;
}
export const checkoutOrder = async (order: order) => {
  // Initialize Stripe with your secret key
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-12-18.acacia", // Use the correct API version
  });

  // Validate required fields
  if (!order.price || isNaN(order.price)) {
    throw new Error("Invalid price provided.");
  }
  if (!order.eventTitle) {
    throw new Error("Event title is required.");
  }
  if (!order.eventId) {
    throw new Error("Event ID is required.");
  }
  if (!order.buyerId) {
    throw new Error("Buyer ID is required.");
  }

  // Convert price to cents (Stripe expects amounts in cents)
  const price = Math.round(order.price * 100);

  try {
    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // Specify payment methods
      line_items: [
        {
          price_data: {
            currency: "usd", // Currency
            unit_amount: price, // Price in cents
            product_data: {
              name: order.eventTitle, // Product name
            },
          },
          quantity: 1, // Quantity of the product
        },
      ],
      metadata: {
        eventId: order.eventId, // Add metadata for your reference
        buyerId: order.buyerId,
        eventTitle: order.eventTitle,
      },
      mode: "payment", // Payment mode
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`, // Redirect URL after success
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`, // Redirect URL on cancellation
    });

    // Redirect the user to the Stripe Checkout page
    if (session.url) {
      redirect(session.url);
    } else {
      throw new Error("Failed to create Stripe Checkout session.");
    }
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
};

type CreateOrder = {
  stripeId: string;
  eventId: string;
  buyerId: string;
  totalAmount: string;
  createdAt: Date;
}
export const createOrder = async (order: CreateOrder) => {

  try {
    axios.post('http://localhost:4000/order',  { 
      stripeId: order.stripeId,
      eventId: order.eventId,
      buyerId: order.buyerId,
      price: order.totalAmount, // Ensure the correct field name
      createdAt: order.createdAt
    });
  return;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

  export const getOrders = async () => {
    try {
      const response = await axios.get('http://localhost:4000/order');
      return response.data;
    } catch (error) {
      console.error("Erreur dans getEmploye:", error);
      return [];
    }

  }
  export const addOrder = async (order: Order) => {

    try {
      let res = axios.post('http://localhost:4000/order', order);

    } catch (error) {
      console.error('Error adding resource:', error);
      throw error;
    }

  }
  export const deleteOrder = async (id: string | undefined) => {
    try {
      let res = axios.delete(`http://localhost:4000/order/${id}`);
    } catch (error) {
      console.error('Error deleting resource:', error);
      throw error;
    }

  }
  export const updateOrder = async (orId: string, orderData: any) => {
    try {
      axios.patch(`http://localhost:4000/order/${orId}`,orderData);

    } catch (error) {
      console.error('Error updating orders:', error);
      throw error;
    }
}
export const checkclientOrder = async (userId: string | null | undefined) => {
  if (!userId) return false; // Vérifie si l'ID utilisateur est fourni

  try {
    const response = await axios.get(`http://localhost:4000/order/user/${userId}`);

    const order = response.data; // Récupère les données de la commande
    console.log(order)
    if (!order) return false; // Si aucune commande trouvée, retourne false

    return order.status === "valider"; // Vérifie si le statut est "valider"

  } catch (error) {
    console.error("Problème lors de la vérification du paiement :", error);
    return false; // Retourne false en cas d'erreur
  }
};