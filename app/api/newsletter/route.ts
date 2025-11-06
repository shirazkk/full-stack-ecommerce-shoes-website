import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // In a real application, you would save the email to a database
    // or integrate with an email marketing service (e.g., Mailchimp).
    console.log(`Newsletter subscription: ${email}`);

    return NextResponse.json({ message: 'Successfully subscribed to the newsletter!' }, { status: 200 });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return NextResponse.json({ error: 'Failed to subscribe to the newsletter' }, { status: 500 });
  }
}
