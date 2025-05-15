import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categories = searchParams.get('categories')?.split(',') || [];
  
  try {
    // The API key will only be used server-side
    const apiKey = process.env.NEWS_API_KEY;
    
    // Example implementation (you'll need to adjust based on your chosen news API)
    const response = await fetch(
      `https://your-news-api-endpoint?categories=${categories.join(',')}&apikey=${apiKey}`
    );
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching news data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news data' },
      { status: 500 }
    );
  }
} 