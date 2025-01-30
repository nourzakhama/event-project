import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';

import { NextResponse } from 'next/server';
import { addParticipant, updateParticipant, deleteParticipant } from '@/lib/actions/participant';
export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error: Could not verify webhook:', err);
    return new Response('Error: Verification error', {
      status: 400,
    });
  }

  // Handle the event
  const eventType = evt.type;
  console.log('Webhook event type:', eventType);

  if (eventType === 'user.created') {
    const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;

    const user = {
      cin: id,
      email: email_addresses[0].email_address,
      name: username || `${first_name} ${last_name}`,
      firstName: first_name,
      lastName: last_name,
      imageUrl: image_url,
    };

    console.log('User data:', user);

    try {
      // Add the participant to your database
      const response = await addParticipant({
        "cin": "22747083",
        "email": "chi5@gmail.com",
        "name": "hnin",
        "firstName": "mibrouk",
        "lastName": "aziz",
        "imageUrl": "aziz.jpg"


      });
     

      return new Response('Webhook received and participant added', { status: 200 });
    } catch (error) {
      console.error('Error adding participant:', error);
      return new Response('Error: Failed to add participant', { status: 500 });
    }

    // Return a response for other event types
    return new Response('Webhook received', { status: 200 });
  }

  if (eventType === 'user.updated') {
    const { id, image_url, first_name, last_name, username } = evt.data

    const user = {
      firstName: first_name,
      lastName: last_name,
      username: username!,
      photo: image_url,
    }


    const updatedUser = await updateParticipant(id, user)

    return NextResponse.json({ message: 'OK', user: updatedUser })
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data

    const deletedUser = await deleteParticipant(id!)

    return NextResponse.json({ message: 'OK', user: deletedUser })
  }

  return new Response('', { status: 200 })
}
