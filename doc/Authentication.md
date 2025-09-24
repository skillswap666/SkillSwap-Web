## **Authentication Intro**

This document outlines the available API endpoints for the Skill Swap Club backend, focusing on Authentication.

**Base URL:** `http://localhost:8080`

### **1. Authentication Flow (Handled by Supabase)**

Our backend is a **Resource Server**. All user authentication (Sign Up, Sign In, Password Reset, etc.) is handled directly by **Supabase**, which acts as our **Authentication Server**.

The frontend application **must** use the official `supabase-js` library to interact with these authentication services. The backend **does not** have endpoints like `/login` or `/signup`.

#### **How the Frontend Should Implement:**

**A. User Sign Up**

The frontend calls `supabase.auth.signUp()`. Supabase will automatically send a confirmation email to the user. The user is not active until they click the link in the email.

```javascript
// Frontend Code Example
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');

async function signUpNewUser(email, password, username) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      // You can pass extra data that might be useful later
      data: {
        username: username,
      }
    }
  });

  if (error) {
    console.error('Sign up error:', error.message);
  } else {
    // Tell the user to check their email for verification
    console.log('Sign up successful! Please check your email to verify your account.');
  }
}
```

**B. User Sign In**

The frontend calls `supabase.auth.signInWithPassword()`.

```javascript
// Frontend Code Example
async function signInUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    console.error('Sign in error:', error.message);
  } else {
    // Sign in successful. The session is now stored.
    // You can get the JWT from the session object.
    const jwt = data.session.access_token;
    console.log('Successfully signed in!');
    // Store this JWT to use for API calls to our backend.
    return jwt;
  }
}
```

**C. Making Authenticated API Calls**

After a successful sign-in, the frontend will receive a session object containing an `access_token`. This is the **JWT (Bearer Token)**.

For every request to our backend API (`http://localhost:8080`) that requires authentication, you **must** include this token in the `Authorization` header.

*   **Header Key**: `Authorization`
*   **Header Value**: `Bearer <the_jwt_token>`
