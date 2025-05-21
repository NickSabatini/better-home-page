import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return NextResponse.json({ error: 'No symbol provided' }, { status: 400 });
  }

  try {
    const apiKey = process.env.FINNHUB_API_KEY;
    if (!apiKey) {
      throw new Error('Finnhub API key not configured');
    }

    // Use Finnhub's quote endpoint to validate the symbol
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      return NextResponse.json({ isValid: false });
    }

    const data = await response.json();
    
    // If we get a response with a current price, the symbol is valid
    const isValid = typeof data.c === 'number' && !isNaN(data.c);
    
    return NextResponse.json({ isValid });
  } catch (error) {
    console.error('Error validating stock symbol:', error);
    return NextResponse.json({ isValid: false });
  }
} 