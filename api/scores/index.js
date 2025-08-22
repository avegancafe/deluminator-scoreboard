// Use global kv for local development, or import from @vercel/kv for production
const getKV = async () => {
  if (global.kv) return global.kv;
  const { kv } = await import('@vercel/kv');
  return kv;
};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const kv = await getKV();
    
    // Get scores from Vercel KV
    const scores = await kv.get('scores:leaderboard');
    const stats = await kv.get('scores:stats');

    // Return empty arrays if no data exists
    const responseData = {
      scores: scores || [],
      stats: stats || {
        totalUnalived: 0,
        totalContributors: 0,
        averagePerContributor: 0
      }
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching scores:', error);
    res.status(500).json({ 
      error: 'Failed to fetch scores',
      scores: [],
      stats: {
        totalUnalived: 0,
        totalContributors: 0,
        averagePerContributor: 0
      }
    });
  }
}