import { Readable } from 'stream'; // For raw body handling
import Stripe from 'stripe';
import * as admin from 'firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

console.log("Endpoint", endpointSecret)

// Initialize Firebase Admin

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Handling newline characters in env variables
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL, // Your Firebase database URL
  });
}

const db = admin.database(); // Use admin.database() to get the database instance

console.log("DB" , db)


// Function to get raw body from the request
async function getRawBody(req) {
  const buffer = await req.arrayBuffer(); // Get the raw body as an ArrayBuffer
  return Buffer.from(buffer); // Convert it to a Buffer
}

// Handle POST request for the webhook
export async function POST(req) {
  const buf = await getRawBody(req);
  const sig = req.headers.get('stripe-signature');
  

  let event;

  // Verify the event
  try {
    event = stripe.webhooks.constructEvent(buf.toString(), sig, endpointSecret);
  } catch (err) {
    return new Response(`Webhook error: ${err.message}`, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const amount = session.amount_total; // Amount in cents
    const uid = session.metadata.uid; // User ID from metadata


    if (!uid) {
      return new Response('UID not found', { status: 400 });
    }

    let tokensToAdd = 0;
    // let designsToAdd = 0;
    // let upscalesToAdd = 0;

    // Determine how many tokens, designs, and upscales to add based on the amount
    if (amount === 3900) { // 39 EUR
      tokensToAdd = 2500;
      // designsToAdd = 200;
      // upscalesToAdd = 100;
    } else if (amount === 9500) { // 65 EUR
      tokensToAdd = 6500;
      // designsToAdd = 500;
      // upscalesToAdd = 250;
    } else if (amount === 29000) { // 290 EUR
      tokensToAdd = 20000;
      // designsToAdd = 1600;
      // upscalesToAdd = 800;
    }


    // Check if the session has already been processed (atomic check)
    const sessionRef = db.ref(`sessions/${session.id}`);

    // Use a transaction to check if session was processed and if not, process it atomically
    await sessionRef.transaction((currentData) => {
      if (currentData === null) {
        // If session doesn't exist, mark it as processed and proceed
        return { processed: true };
      }
      // If session already exists (was processed), abort the transaction
      return;
    }, async (error, committed, snapshot) => {
      if (error) {
        return new Response('Transaction failed', { status: 500 });
      }

      if (!committed) {
        return new Response('Session already processed', { status: 200 });
      }


      // Update user's tokens, designs, and upscales in the database if the transaction was successful and session was not already processed
      if (tokensToAdd > 0 ) {
        const userRef = db.ref(`users/${uid}`);

        // Use Firebase `transaction` to update tokens, designs, and upscales atomically
        await userRef.transaction((userData) => {
          if (userData === null) {
            return null; // If user does not exist, return null (no operation)
          }

          // Increment tokens, designs, and upscales for the user
          userData.tokens = (userData.tokens || 0) + tokensToAdd;
          // userData.designs = (userData.designs || 0) + designsToAdd;
          // userData.upscales = (userData.upscales || 0) + upscalesToAdd;

          return userData;
        });
      }
    });
console.log( "Event" , event)

  }

  // Respond with a 200 status to acknowledge receipt of the event
  return new Response(JSON.stringify({ received: true }), { status: 200 });
}


// Handle other HTTP methods if needed (optional)
export async function GET(req) {
  return new Response('Method Not Allowed', { status: 405 });
}
