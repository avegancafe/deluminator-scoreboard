import { prisma } from '../../lib/prisma.js'

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
    // Get all scores ordered by count desc, then by creation date
    const scores = await prisma.score.findMany({
      orderBy: [
        { count: 'desc' },
        { createdAt: 'asc' }
      ],
      select: {
        name: true,
        count: true
      }
    })

    // Calculate stats
    const totalUnalived = scores.reduce((sum, score) => sum + score.count, 0);
    const totalContributors = scores.length;
    const averagePerContributor = totalContributors > 0 ? Math.round(totalUnalived / totalContributors) : 0;

    const stats = {
      totalUnalived,
      totalContributors,
      averagePerContributor
    };

    res.status(200).json({
      success: true,
      scores,
      stats
    });

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