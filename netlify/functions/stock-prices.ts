/**
 * Netlify Serverless Function Proxy for Live Stock / REIT / InvIT Market Data
 * Solves browser CORS restrictions by proxying queries directly to Yahoo Finance.
 *
 * Endpoint: /.netlify/functions/stock-prices?symbols=EMBASSY.NS,MINDSPACE.NS,BIRET.NS,PGINVIT.NS
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
  'Cache-Control': 'public, max-age=15, s-maxage=30'
};

// Standard Netlify Function v1 / AWS Lambda Handler
export const handler = async (event: {
  httpMethod?: string;
  queryStringParameters?: Record<string, string>;
  rawUrl?: string;
}) => {
  // Handle CORS preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ status: 'OK' })
    };
  }

  const symbols = event.queryStringParameters?.symbols || 'EMBASSY.NS,MINDSPACE.NS,BIRET.NS,PGINVIT.NS';

  try {
    const targetUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbols)}`;

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: corsHeaders,
        body: JSON.stringify({
          error: `Yahoo Finance API responded with status ${response.status}`,
          symbols
        })
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(data)
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: error?.message || 'Failed to fetch live market prices',
        symbols
      })
    };
  }
};

// Netlify Functions v2 default export (Fetch API standard)
export default async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(JSON.stringify({ status: 'OK' }), {
      status: 200,
      headers: corsHeaders
    });
  }

  const url = new URL(req.url);
  const symbols = url.searchParams.get('symbols') || 'EMBASSY.NS,MINDSPACE.NS,BIRET.NS,PGINVIT.NS';

  try {
    const targetUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbols)}`;

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status || 200,
      headers: corsHeaders
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: error?.message || 'Failed to fetch live market prices',
        symbols
      }),
      {
        status: 500,
        headers: corsHeaders
      }
    );
  }
};

