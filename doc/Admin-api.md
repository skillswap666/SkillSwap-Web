## **User-api**

This document outlines the available API endpoints for the Skill Swap Club backend, focusing on Authentication and User Profiles.

**Base URL:** `http://localhost:8080`

For every request to our backend API (`http://localhost:8080`) that requires authentication, you **must** include this token in the `Authorization` header.

*   **Header Key**: `Authorization`
*   **Header Value**: `Bearer <the_jwt_token>`


### **3. Admin API Endpoints**

These endpoints are restricted and can only be accessed by users with the `ADMIN` role.

#### **3.1 Admin Health Check**

*   `GET /api/v1/admin/hello`
*   **Description**: A simple endpoint to verify if the authenticated user has `ADMIN` privileges.
*   **Authorization**: `Bearer Token` required. The user **must** have the `ADMIN` role.

**Test Method:**
1.  **URL**: `http://localhost:8080/api/v1/admin/hello`
2.  **Method**: `GET`
3.  **Authorization**:
    *   **Type**: Bearer Token
    *   **Token**: Paste the `access_token` of a user who has been assigned the ADMIN role in Supabase.

**Success Response (`200 OK`)**

```
Hello Admin! You have successfully accessed a protected resource.
```

**Error Responses**

*   `401 Unauthorized`: Returned if the `Bearer Token` is missing, invalid, or expired.
*   `403 Forbidden`: Returned if a valid, authenticated user who is **not an admin** tries to access this endpoint.
    ```json
    {
        "timestamp": "2025-09-24T09:00:00.000Z",
        "status": 403,
        "error": "Forbidden",
        "message": "You do not have permission to access this resource.",
        "path": "/api/v1/admin/hello"
    }
    ```
