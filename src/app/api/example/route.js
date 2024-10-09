import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { amount, uid } = await req.json();

    // Valid amounts in cents (for EUR)
    const validAmounts = new Set([3900, 9500, 29000]);

    if (!validAmounts.has(amount)) {
      throw new Error("Invalid amount");
    }

    // Determine the number of tokens
    let tokens;
    switch (amount) {
      case 3900: 
        tokens = 2500;
        break;
      case 9500: 
        tokens = 6500;
        break;
      case 29000: 
        tokens = 20000;
        break;
      default:
        throw new Error("Invalid amount");
    }

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Credits',
          },
          unit_amount: amount, 
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}`, 
      metadata: { uid },  // Pass user ID in metadata for later use
    });

    // Return the session URL to the frontend for redirection
    return new Response(JSON.stringify({ url: session.url }), { status: 200 });
  } catch (error) {
    console.error('Stripe Checkout Error:', error); // Log the error for debugging
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
