"use client"
import { Event } from '@/types';
import { useAuth } from '@clerk/nextjs';
import React, { useEffect } from 'react'
import { Button } from '../button';
import { loadStripe } from '@stripe/stripe-js';
import { checkoutOrder } from '@/lib/actions/order';


// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
// loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckOutButton = ({event}:{event:Event}) => {
    const {userId} = useAuth();
   const  userid=userId?.trim();
   let prix: number;
   if (event.prix! === "" ||event.prix==undefined) {
    prix = 0; // Default to 0 if empty or undefined
  } else {
    prix = +event.prix; // Convert the string to a number
  }
    const hasEventFinished = new Date(event.dateF) < new Date();
   const onCheckOut=async()=>{
    const order = {
        eventTitle: event.title,
        eventId: event.id,
        price:prix,
        buyerId: userId
      }
  
      await checkoutOrder(order);
   }
   useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      console.log('Order placed! You will receive an email confirmation.');
    }

    if (query.get('canceled')) {
      console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
    }
  }, []);

  return (
  hasEventFinished ? (
    <p className="p-2 text-red-400">Sorry, tickets are no longer available.</p>
  ) : (
    <form action={onCheckOut} method="post">
      <Button type="submit" role="link" size="lg" className="button sm:w-fit">
        {prix === 0 ? "Get ticket" : "Buy ticket"}
      </Button>
    </form>
  )
);
}


export default CheckOutButton;