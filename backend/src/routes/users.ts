import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { verifySupabaseToken, AuthenticatedRequest } from '../lib/supabaseAuth';

const router = Router();

// GET /api/users/profile - Get or create user profile
router.get('/profile', verifySupabaseToken, async (req: AuthenticatedRequest, res) => {
  try {
    const email = req.user?.email;
    
    if (!email) {
      return res.status(400).json({ error: 'No email in token' });
    }

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Create new user from Supabase data
      user = await prisma.user.create({
        data: {
          email,
          name: req.user?.user_metadata?.name || email.split('@')[0],
          bio: req.user?.user_metadata?.bio || '',
          credits: 100,
        },
      });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      bio: user.bio,
      credits: user.credits,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/users/profile - Update user profile
router.put('/profile', verifySupabaseToken, async (req: AuthenticatedRequest, res) => {
  try {
    const email = req.user?.email;
    const { name, bio } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'No email in token' });
    }

    const user = await prisma.user.update({
      where: { email },
      data: { name, bio },
    });

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      bio: user.bio,
      credits: user.credits,
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;