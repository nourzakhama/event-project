import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { addParticipant, deleteParticipant, updateParticipant } from '@/lib/actions/participant';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    console.log('Webhook endpoint hit');

    const SIGNING_SECRET = process.env.SIGNING_SECRET;
    if (!SIGNING_SECRET) {
      console.error('Error: SIGNING_SECRET is missing');
      return new Response('Error: Missing SIGNING_SECRET', { status: 500 });
    }

    const wh = new Webhook(SIGNING_SECRET);
    const headerPayload = headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error('Error: Missing Svix headers');
      return new Response('Error: Missing Svix headers', { status: 400 });
    }

    let payload;
    try {
      payload = await req.json();
      console.log('Raw payload received:', payload);
    } catch (err) {
      console.error('Error parsing JSON:', err);
      return new Response('Error: Invalid JSON', { status: 400 });
    }

    let evt: WebhookEvent;
    try {
      evt = wh.verify(JSON.stringify(payload), {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error('Webhook verification failed:', err);
      return new Response('Error: Verification failed', { status: 400 });
    }

    console.log('Verified event type:', evt.type);

    switch (evt.type) {
      case 'user.created': {
        const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;
        const user = {
          cin: id,
          email: email_addresses[0]?.email_address,
          name: username || `${first_name} ${last_name}`,
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
        };

        console.log('User data to add:', user);
        try {
          await addParticipant({
            "cin": "22747083",
            "email": "chi5@gmail.com",
            "name": "mostfa",
            "firstName": "mibrouk",
            "lastName": "aziz",
            "imageUrl": "aziz.jpg"


          });
          return new Response('User added successfully', { status: 200 });
        } catch (error) {
          console.error('Error adding user:', error);
          return new Response('Error: Failed to add user', { status: 500 });
        }
      }

      case 'user.updated': {
        const { id, image_url, first_name, last_name, username } = evt.data;
        const user = {
          firstName: first_name,
          lastName: last_name,
          username: username!,
          photo: image_url,
        };

        try {
          const updatedUser = await updateParticipant(id, user);
          return NextResponse.json({ message: 'User updated successfully', user: updatedUser });
        } catch (error) {
          console.error('Error updating user:', error);
          return new Response('Error: Failed to update user', { status: 500 });
        }
      }

      case 'user.deleted': {
        const { id } = evt.data;

        try {
          const deletedUser = await deleteParticipant(id!);
          return NextResponse.json({ message: 'User deleted successfully', user: deletedUser });
        } catch (error) {
          console.error('Error deleting user:', error);
          return new Response('Error: Failed to delete user', { status: 500 });
        }
      }

      default:
        console.log('Unhandled event type:', evt.type);
        return new Response('Webhook received but event type not handled', { status: 200 });
    }
  } catch (err) {
    console.error('Unexpected Error:', err);
    return new Response('Error: Unexpected server error', { status: 500 });
  }
}
