import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { verifySupabaseToken, AuthenticatedRequest } from '../lib/supabaseAuth';

const router = Router();

// ---------------------------------------------
// Helper: format user response for frontend
// ---------------------------------------------
const formatUserResponse = (user: any) => {
  const attendedWorkshops = user.attendedWorkshops?.map((a: any) => a.workshop) || [];

  // Parse skills JSON safely
  let skills: string[] = [];
  try {
    skills = user.skills ? JSON.parse(user.skills) : [];
  } catch {
    skills = [];
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    bio: user.bio,
    credits: user.credits,
    skills, // 👈 return parsed array
    rating: user.rating,
    profilePicture: user.profilePicture,
    hostedWorkshops: user.hostedWorkshops || [],
    attendedWorkshops,
  };
};

// ---------------------------------------------
// Helper: include user relations for Prisma
// ---------------------------------------------
const userInclude = {
  hostedWorkshops: true,
  attendedWorkshops: {
    include: { workshop: true },
  },
};

// ---------------------------------------------
// GET /api/users/profile
// ---------------------------------------------
router.get('/profile', verifySupabaseToken, async (req: AuthenticatedRequest, res) => {
  try {
    const email = req.user?.email;
    if (!email) return res.status(401).json({ error: 'Authentication required' });

    let user = await prisma.user.findUnique({
      where: { email },
      include: userInclude,
    });

    // Create user if not exists
    if (!user) {
      const name = req.user?.user_metadata?.name || email.split('@')[0];
      const bio = req.user?.user_metadata?.bio || '';

      user = await prisma.user.create({
        data: {
          email,
          name,
          bio,
          credits: 100,
          skills: '[]', // 👈 default empty JSON string
        },
        include: userInclude,
      });
    }

    res.json(formatUserResponse(user));
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// ---------------------------------------------
// PUT /api/users/profile
// ---------------------------------------------
router.put('/profile', verifySupabaseToken, async (req: AuthenticatedRequest, res) => {
  try {
    const email = req.user?.email;
    const { name, bio, skills, profilePicture } = req.body;

    if (!email) return res.status(401).json({ error: 'Authentication required' });

    // Validate inputs
    if (name && typeof name !== 'string') return res.status(400).json({ error: 'Invalid name' });
    if (bio && typeof bio !== 'string') return res.status(400).json({ error: 'Invalid bio' });
    if (skills && !Array.isArray(skills)) return res.status(400).json({ error: 'Skills must be an array' });
    if (profilePicture && typeof profilePicture !== 'string') return res.status(400).json({ error: 'Invalid profile picture' });

    const updateData: any = {};
    if (name) updateData.name = name.trim();
    if (bio) updateData.bio = bio.trim();
    if (skills) updateData.skills = JSON.stringify(skills); // 👈 store as JSON string
    if (profilePicture) updateData.profilePicture = profilePicture;

    const user = await prisma.user.update({
      where: { email },
      data: updateData,
      include: userInclude,
    });

    res.json(formatUserResponse(user));
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    if (error.code === 'P2025') return res.status(404).json({ error: 'User not found' });
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

export default router;
