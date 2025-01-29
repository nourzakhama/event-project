import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { addParticipant, deleteParticipant, updateParticipant } from '@/lib/actions/participant';
import { NextResponse } from 'next/server';
import { Participant } from '@/types';

export async function POST(req: Request) {
  console.log('➡️ Webhook received'); // Log principal

  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    console.error('❌ Missing WEBHOOK_SECRET');
    return NextResponse.json({ error: 'Missing WEBHOOK_SECRET' }, { status: 500 });
  }

  const headerPayload = headers();
  const svixHeaders = {
    'svix-id': headerPayload.get('svix-id') ?? '',
    'svix-timestamp': headerPayload.get('svix-timestamp') ?? '',
    'svix-signature': headerPayload.get('svix-signature') ?? ''
  };

  if (!svixHeaders['svix-id'] || !svixHeaders['svix-timestamp'] || !svixHeaders['svix-signature']) {
    console.error('❌ Missing Svix headers');
    return NextResponse.json({ error: 'Missing Svix headers' }, { status: 400 });
  }

  const payload = await req.json();
  console.log('📦 Webhook Payload:', JSON.stringify(payload, null, 2));

  const body = JSON.stringify(payload);
  let evt: WebhookEvent;

  try {
    console.log('🔐 Verifying webhook signature...');
    const wh = new Webhook(WEBHOOK_SECRET);
    evt = wh.verify(body, svixHeaders) as WebhookEvent;
    console.log('✅ Webhook verified successfully');
  } catch (err) {
    console.error('❌ Webhook verification failed:', err);
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
  }

  if (!evt?.data) {
    console.error('❌ No event data found');
    return NextResponse.json({ error: 'Invalid event data' }, { status: 400 });
  }

  const eventType = evt.type;
  console.log(`📢 Event type received: ${eventType}`);

  // Ensure evt.data contains necessary fields before proceeding
  if ("email_addresses" in evt.data) {
    const { id, email_addresses, first_name, last_name, username } = evt.data;

    // Handle profile_image_url separately if it exists
    const profileImageUrl = "profile_image_url" in evt.data ? evt.data.profile_image_url : '';

    if (!id) {
      console.error('❌ Missing user ID');
      return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
    }

    try {
      switch (eventType) {
        case 'user.created': {
          const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;

          const user = {
            cin: id,
            email: email_addresses[0].email_address,
            name: username!,
            firstName: first_name,
            lastName: last_name,
            photo: image_url,
          }

          console.log('🆕 Adding new user:', user);
          const newUser = await addParticipant(user);
          console.log('✅ User successfully added:', newUser);

          return NextResponse.json({ message: 'User created', user: newUser });
        }

        case 'user.updated': {
          const user = {
            firstName: first_name || '',
            lastName: last_name || '',
            username: username || '',
            photo: profileImageUrl || ''
          };

          console.log('🔄 Updating user:', user);
          const updatedUser = await updateParticipant(id, user);
          console.log('✅ User successfully updated:', updatedUser);

          return NextResponse.json({ message: 'User updated', user: updatedUser });
        }

        case 'user.deleted': {
          console.log(`🗑️ Deleting user with ID: ${id}`);
          const deletedUser = await deleteParticipant(id);
          console.log('✅ User successfully deleted:', deletedUser);

          return NextResponse.json({ message: 'User deleted', user: deletedUser });
        }

        default:
          console.warn('⚠️ Unhandled event type:', eventType);
          return NextResponse.json({ message: 'Unhandled event type' }, { status: 200 });
      }
    } catch (error) {
      console.error(`❌ Error processing ${eventType}:`, error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  } else {
    console.error('❌ Missing required data fields in event');
    return NextResponse.json({ error: 'Invalid data structure' }, { status: 400 });
  }
}
