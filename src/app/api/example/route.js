import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const { amount, uid } = await req.json();

  try {
    let tokens, designs, upscale;

    switch (amount) {
      case 3900: // 39 EUR in cents
        tokens = 2500;
        break;
      case 9500: // 65 EUR in cents
        tokens = 6500;
        break;
      case 29000: // 290 EUR in cents
        tokens = 20000;
        break;
      default:
        throw new Error("Invalid amount");
    }

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
      metadata: { uid },  
    });


    return new Response(JSON.stringify({ url: session.url }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
