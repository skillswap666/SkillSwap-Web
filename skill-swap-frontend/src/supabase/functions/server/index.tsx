import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable CORS and logging
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['*'],
}));
app.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// User routes
app.post('/make-server-d985f1e8/auth/signup', async (c) => {
  try {
    const { name, email, password } = await c.req.json();
    
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (authError) {
      console.log('Auth signup error:', authError);
      return c.json({ error: authError.message }, 400);
    }

    // Store user profile in KV store
    const userProfile = {
      id: authData.user.id,
      name,
      email,
      credits: 50, // Initial credits
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      bio: '',
      skills: [],
      totalWorkshopsHosted: 0,
      totalWorkshopsAttended: 0,
      rating: 5.0,
      joinedAt: new Date().toISOString(),
    };

    await kv.set(`user:${authData.user.id}`, userProfile);

    return c.json({ 
      user: userProfile,
      message: 'User created successfully' 
    });
  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

app.get('/make-server-d985f1e8/user/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      console.log('Get user error:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userProfile = await kv.get(`user:${user.id}`);
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    return c.json({ user: userProfile });
  } catch (error) {
    console.log('Get profile error:', error);
    return c.json({ error: 'Internal server error getting profile' }, 500);
  }
});

app.put('/make-server-d985f1e8/user/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const updates = await c.req.json();
    const currentProfile = await kv.get(`user:${user.id}`);
    
    if (!currentProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    const updatedProfile = { ...currentProfile, ...updates };
    await kv.set(`user:${user.id}`, updatedProfile);

    return c.json({ user: updatedProfile });
  } catch (error) {
    console.log('Update profile error:', error);
    return c.json({ error: 'Internal server error updating profile' }, 500);
  }
});

// Workshop routes
app.get('/make-server-d985f1e8/workshops', async (c) => {
  try {
    const workshops = await kv.getByPrefix('workshop:');
    const sortedWorkshops = workshops.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    return c.json({ workshops: sortedWorkshops });
  } catch (error) {
    console.log('Get workshops error:', error);
    return c.json({ error: 'Internal server error getting workshops' }, 500);
  }
});

app.post('/make-server-d985f1e8/workshops', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const workshopData = await c.req.json();
    const facilitator = await kv.get(`user:${user.id}`);
    
    if (!facilitator) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    const workshop = {
      ...workshopData,
      id: `workshop-${Date.now()}`,
      facilitatorId: user.id,
      facilitator,
      currentParticipants: 0,
      participants: [],
      status: 'upcoming',
      createdAt: new Date().toISOString(),
    };

    await kv.set(`workshop:${workshop.id}`, workshop);

    // Update facilitator's workshop count
    const updatedFacilitator = {
      ...facilitator,
      totalWorkshopsHosted: facilitator.totalWorkshopsHosted + 1
    };
    await kv.set(`user:${user.id}`, updatedFacilitator);

    return c.json({ workshop, message: 'Workshop created successfully' });
  } catch (error) {
    console.log('Create workshop error:', error);
    return c.json({ error: 'Internal server error creating workshop' }, 500);
  }
});

app.post('/make-server-d985f1e8/workshops/:workshopId/attend', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const workshopId = c.req.param('workshopId');
    const workshop = await kv.get(`workshop:${workshopId}`);
    const userProfile = await kv.get(`user:${user.id}`);

    if (!workshop) {
      return c.json({ error: 'Workshop not found' }, 404);
    }

    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    // Check if user has enough credits
    if (userProfile.credits < workshop.creditCost) {
      return c.json({ error: 'Not enough credits' }, 400);
    }

    // Check if workshop is full
    if (workshop.currentParticipants >= workshop.maxParticipants) {
      return c.json({ error: 'Workshop is full' }, 400);
    }

    // Check if user is already attending
    if (workshop.participants.some(p => p.id === user.id)) {
      return c.json({ error: 'Already attending this workshop' }, 400);
    }

    // Update workshop
    const updatedWorkshop = {
      ...workshop,
      currentParticipants: workshop.currentParticipants + 1,
      participants: [...workshop.participants, userProfile]
    };

    // Update user credits and attendance count
    const updatedUser = {
      ...userProfile,
      credits: userProfile.credits - workshop.creditCost,
      totalWorkshopsAttended: userProfile.totalWorkshopsAttended + 1
    };

    // Create transaction record
    const transaction = {
      id: `tx-${Date.now()}`,
      userId: user.id,
      workshopId,
      type: 'spent',
      amount: workshop.creditCost,
      description: `Attended: ${workshop.title}`,
      timestamp: new Date().toISOString(),
    };

    // Save all updates
    await Promise.all([
      kv.set(`workshop:${workshopId}`, updatedWorkshop),
      kv.set(`user:${user.id}`, updatedUser),
      kv.set(`transaction:${transaction.id}`, transaction)
    ]);

    return c.json({ 
      workshop: updatedWorkshop,
      user: updatedUser,
      transaction,
      message: 'Successfully registered for workshop' 
    });
  } catch (error) {
    console.log('Attend workshop error:', error);
    return c.json({ error: 'Internal server error attending workshop' }, 500);
  }
});

app.delete('/make-server-d985f1e8/workshops/:workshopId/attend', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const workshopId = c.req.param('workshopId');
    const workshop = await kv.get(`workshop:${workshopId}`);
    const userProfile = await kv.get(`user:${user.id}`);

    if (!workshop || !userProfile) {
      return c.json({ error: 'Workshop or user not found' }, 404);
    }

    // Check if user is attending
    if (!workshop.participants.some(p => p.id === user.id)) {
      return c.json({ error: 'Not attending this workshop' }, 400);
    }

    // Calculate refund (80% for cancellation)
    const refundAmount = Math.floor(workshop.creditCost * 0.8);

    // Update workshop
    const updatedWorkshop = {
      ...workshop,
      currentParticipants: Math.max(0, workshop.currentParticipants - 1),
      participants: workshop.participants.filter(p => p.id !== user.id)
    };

    // Update user credits
    const updatedUser = {
      ...userProfile,
      credits: userProfile.credits + refundAmount
    };

    // Create refund transaction
    const transaction = {
      id: `tx-${Date.now()}`,
      userId: user.id,
      workshopId,
      type: 'earned',
      amount: refundAmount,
      description: `Refund: ${workshop.title} (80%)`,
      timestamp: new Date().toISOString(),
    };

    // Save all updates
    await Promise.all([
      kv.set(`workshop:${workshopId}`, updatedWorkshop),
      kv.set(`user:${user.id}`, updatedUser),
      kv.set(`transaction:${transaction.id}`, transaction)
    ]);

    return c.json({ 
      workshop: updatedWorkshop,
      user: updatedUser,
      transaction,
      message: 'Workshop cancelled successfully' 
    });
  } catch (error) {
    console.log('Cancel workshop error:', error);
    return c.json({ error: 'Internal server error cancelling workshop' }, 500);
  }
});

// Transactions routes
app.get('/make-server-d985f1e8/transactions', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const allTransactions = await kv.getByPrefix('transaction:');
    const userTransactions = allTransactions
      .filter(tx => tx.userId === user.id)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return c.json({ transactions: userTransactions });
  } catch (error) {
    console.log('Get transactions error:', error);
    return c.json({ error: 'Internal server error getting transactions' }, 500);
  }
});

// Health check
app.get('/make-server-d985f1e8/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);