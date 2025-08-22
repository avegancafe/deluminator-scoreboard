import { prisma } from '../../lib/prisma.js'

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Clear all scores using Prisma
    await prisma.score.deleteMany()

    const emptyStats = {
      totalUnalived: 0,
      totalContributors: 0,
      averagePerContributor: 0
    };

    res.status(200).json({
      success: true,
      message: 'All scores cleared successfully',
      scores: [],
      stats: emptyStats
    });

  } catch (error) {
    console.error('Error clearing scores:', error);
    res.status(500).json({ error: 'Failed to clear scores' });
  }
}