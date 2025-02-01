"use client"
import { Event } from '@/types';
import { useAuth } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import { Button } from '../button';
import { loadStripe } from '@stripe/stripe-js';
import { checkoutOrder } from '@/lib/actions/order';
import axios from 'axios'; // Import axios

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckOutButton = ({ event }: { event: Event }) => {
  const [payed, setPayed] = useState(false);
  const { userId } = useAuth();
  const userid = userId?.trim();

  // Ensure `prix` is always a number
  let prix: number = event.prix ? +event.prix : 0;

  const onCheckOut = async () => {
    const order = {
      eventTitle: event.title,
      eventId: event.id,
      price: prix,
      buyerId: userId
    };

    await checkoutOrder(order);
  };

  useEffect(() => {
    const checkPayement = async () => {
      if (userId) {
        const test = await checkclientOrder(userId);
        setPayed(test);
      }
    };

    checkPayement();

    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      console.log('Order placed! You will receive an email confirmation.');
    }

    if (query.get('canceled')) {
      console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
    }
  }, [userId]);

  return (
    <form action={onCheckOut} method="POST">
      <Button type="submit" role="link" size="lg" className="button sm:w-fit">
        {payed ? "payé ": prix === 0 ? "get ticket" : "buy ticket"}
      </Button>
    </form>
  );
};

export default CheckOutButton;

export const checkclientOrder = async (userId: string | null | undefined) => {
  if (!userId) return false; // Vérifie si l'ID utilisateur est fourni

  try {
    const response = await axios.get(`http://localhost:4000/order/user/${userId}`);
    const order = response.data; // Récupère les données de la commande

    if (!order) return false; // Si aucune commande trouvée, retourne false

    return order.status === "valider"; // Vérifie si le statut est "valider"

  } catch (error) {
    console.error("Problème lors de la vérification du paiement :", error);
    return false; // Retourne false en cas d'erreur
  }
};