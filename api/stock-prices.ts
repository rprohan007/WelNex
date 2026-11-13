/**
 * Vercel Serverless Function Proxy for Live Stock / REIT / InvIT Market Data
 * Solves browser CORS restrictions by proxying queries directly to Yahoo Finance.
 *
 * Endpoint: /api/stock-prices?symbols=EMBASSY.NS,MINDSPACE.NS,BIRET.NS,PGINVIT.NS
 */

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
  'Cache-Control': 'public, max-age=15, s-maxage=30'
};

// Universal Vercel Handler: Supports both Node.js (req, res) and Web Fetch API (Request -> Response)
export default async function handler(req: any, res?: any) {
  // 1. Node.js Serverless Handler (req: VercelRequest, res: VercelResponse)
  if (res && typeof res.status === 'function') {
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    if (req.method === 'OPTIONS') {
      return res.status(200).json({ status: 'OK' });
    }

    const symbols = req.query?.symbols || 'EMBASSY.NS,MINDSPACE.NS,BIRET.NS,PGINVIT.NS';

    try {
      const targetUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbols)}`;
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        return res.status(response.status).json({
          error: `Yahoo Finance API responded with status ${response.status}`,
          symbols
        });
      }

      const data = await response.json();
      return res.status(200).json(data);
    } catch (error: any) {
      return res.status(500).json({
        error: error?.message || 'Failed to fetch live market prices',
        symbols
      });
    }
  }

  // 2. Web Standard / Edge / Fetch API Handler (req: Request)
  if (req.method === 'OPTIONS') {
    return new Response(JSON.stringify({ status: 'OK' }), {
      status: 200,
      headers: corsHeaders
    });
  }

  const url = new URL(req.url, 'http://localhost');
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
}
