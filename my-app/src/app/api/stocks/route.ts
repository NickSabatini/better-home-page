import { NextResponse } from 'next/server';

interface PolygonStockData {
  ticker: string;
  prevDay: {
    c: number;  // close price
    o: number;  // open price
    h: number;  // high
    l: number;  // low
    v: number;  // volume
    t: number;  // timestamp
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbols = searchParams.get('symbols')?.split(',') || [];
  
  if (!symbols.length) {
    return NextResponse.json({ error: 'No symbols provided' }, { status: 400 });
  }

  try {
    const apiKey = process.env.POLYGON_API_KEY;
    if (!apiKey) {
      throw new Error('Polygon API key not configured');
    }

    // Fetch data for each symbol in parallel
    const stockPromises = symbols.map(async (symbol) => {
      const response = await fetch(
        `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${apiKey}`,
        { next: { revalidate: 120 } } // Cache for 2 minutes
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data for ${symbol}`);
      }

      const data = await response.json();
      
      // Polygon returns an array of results, we want the most recent
      const latestData = data.results[0];
      
      // Calculate the previous day's change
      const prevClose = latestData.c;
      const open = latestData.o;
      const change = prevClose - open;
      const changePercent = (change / open) * 100;

      return {
        symbol,
        price: prevClose,
        change,
        changePercent
      };
    });

    const stocks = await Promise.all(stockPromises);
    return NextResponse.json(stocks);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    );
  }
} 