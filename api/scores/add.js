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
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, count } = req.body;

    // Validate input
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }

    if (!count || count <= 0 || !Number.isInteger(count)) {
      return res.status(400).json({ error: 'Count must be a positive integer' });
    }

    const kv = await getKV();
    
    // Get existing scores
    const existingScores = await kv.get('scores:leaderboard') || [];
    
    // Find existing user or create new entry
    const normalizedName = name.trim();
    const existingIndex = existingScores.findIndex(score => 
      score.name.toLowerCase() === normalizedName.toLowerCase()
    );

    let updatedScores;
    if (existingIndex !== -1) {
      // Update existing user's score
      updatedScores = [...existingScores];
      updatedScores[existingIndex] = {
        ...updatedScores[existingIndex],
        count: updatedScores[existingIndex].count + count,
        lastUpdated: new Date().toISOString()
      };
    } else {
      // Add new user
      const newScore = {
        id: Date.now(),
        name: normalizedName,
        count: count,
        lastUpdated: new Date().toISOString()
      };
      updatedScores = [...existingScores, newScore];
    }

    // Calculate stats
    const totalUnalived = updatedScores.reduce((sum, score) => sum + score.count, 0);
    const totalContributors = updatedScores.length;
    const averagePerContributor = totalContributors > 0 ? Math.round(totalUnalived / totalContributors) : 0;

    const stats = {
      totalUnalived,
      totalContributors,
      averagePerContributor
    };

    // Save to KV storage
    await Promise.all([
      kv.set('scores:leaderboard', updatedScores),
      kv.set('scores:stats', stats)
    ]);

    // Return updated data
    res.status(200).json({
      success: true,
      scores: updatedScores,
      stats
    });

  } catch (error) {
    console.error('Error adding score:', error);
    res.status(500).json({ error: 'Failed to add score' });
  }
}