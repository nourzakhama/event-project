import { addParticipant, updateParticipant, deleteParticipant } from '@/lib/actions/participant';
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Clerk Webhook Secret from environment variables
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // Validate headers
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- missing svix headers', { status: 400 });
  }

  // Parse request body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix webhook instance
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the webhook payload
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred during verification', { status: 400 });
  }

  // Extract event details
  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { email_addresses, image_url, first_name, last_name, username } = evt.data;

    if (!email_addresses || email_addresses.length === 0) {
      return new Response('Error: User email is missing', { status: 400 });
    }

    const user = {
      cin: id, // Ensure this is correctly mapped
      email: email_addresses[0]?.email_address || '',
      name: username || `user_${id}`, // Fallback username
      firstName: first_name || '',
      lastName: last_name || '',
      imageUrl: image_url || '',
    };

    try {
      const newUser = await addParticipant(user);
      return new Response("", {status:200});
    } catch (error) {
      console.error('Error adding participant:', error);
      return new Response('Error creating user', { status: 500 });
    }
  }

  if (eventType === 'user.updated') {
    const { image_url, first_name, last_name, username } = evt.data;

    const user = {
      cin: id,
      firstName: first_name || '',
      lastName: last_name || '',
      username: username || `user_${id}`,
      imageUrl: image_url || '',
    };

    try {
      const updatedUser = await updateParticipant(user.cin!, user);
      return NextResponse.json({ message: 'User updated', user: updatedUser });
    } catch (error) {
      console.error('Error updating participant:', error);
      return new Response('Error updating user', { status: 500 });
    }
  }

  if (eventType === 'user.deleted') {
    try {
      const deletedUser = await deleteParticipant(id);
      return NextResponse.json({ message: 'User deleted', user: deletedUser });
    } catch (error) {
      console.error('Error deleting participant:', error);
      return new Response('Error deleting user', { status: 500 });
    }
  }

  return new Response('Event not handled', { status: 200 });
}
