## **User-api**

This document outlines the available API endpoints for the Skill Swap Club backend, focusing on Authentication and User Profiles.

**Base URL:** `http://localhost:8080`

For every request to our backend API (`http://localhost:8080`) that requires authentication, you **must** include this token in the `Authorization` header.

*   **Header Key**: `Authorization`
*   **Header Value**: `Bearer <the_jwt_token>`

### **1. User API Endpoints**

#### **1.1 Get Current User Profile**

*   `GET /api/v1/users/me`
*   **Description**: Retrieves the profile information for the currently authenticated user. If this is the user's first time accessing the backend, a profile will be automatically created for them in our database.
*   **Authorization**: `Bearer Token` required.

**Test Method:**
1.  **URL**: `http://localhost:8080/api/v1/users/me`
2.  **Method**: `GET`
3.  **Authorization**:
    *   **Type**: Bearer Token
    *   **Token**: Paste the `access_token` obtained from Supabase after logging in. (Because we do not have frontend now)

**Success Response (`200 OK`)**

```json
{
    "id": "d312c2cb-dd75-4b5e-9ebf-edcd22ba5ccb",
    "username": "lichenyang_christy",
    "avatarUrl": null,
    "bio": null,
    "createdAt": "2025-09-24T06:53:10.137680Z"
}
```

**Error Responses**

*   `401 Unauthorized`: Returned if the `Bearer Token` is missing, invalid, or expired.
*   `500 Internal Server Error`: Returned if there's an unexpected issue on the server.

---

#### **2.2 Get Public User Profile by ID**

*   `GET /api/v1/users/{id}`
*   **Description**: Retrieves the public profile information for any user by their unique ID.
*   **Authorization**: **None required.** This is a public endpoint.

**Test Method:**
1.  **URL**: `http://localhost:8080/api/v1/users/d312c2cb-dd75-4b5e-9ebf-edcd22ba5ccb` (Replace the UUID with a valid user ID).
2.  **Method**: `GET`
3.  **Authorization**:
    *   **Type**: No Auth

**Path Parameters:**
*   `id` (UUID, required): The unique identifier of the user.

**Success Response (`200 OK`)**

```json
{
    "id": "d312c2cb-dd75-4b5e-9ebf-edcd22ba5ccb",
    "username": "lichenyang_christy",
    "avatarUrl": null,
    "bio": null,
    "createdAt": "2025-09-24T06:53:10.137680Z"
}
```

**Error Responses**

*   `404 Not Found`: Returned if no user exists with the provided ID.
    ```json
    {
        "timestamp": "2025-09-24T08:00:00.000Z",
        "status": 404,
        "error": "Not Found",
        "message": "UserAccount not found with ID : '123e4567-e89b-12d3-a456-426614174000'",
        "path": "/api/v1/users/123e4567-e89b-12d3-a456-426614174000"
    }
    ```

---

#### **2.3 Update Current User Profile**

*   `PATCH /api/v1/users/me`
*   **Description**: Updates the profile information (username, avatar URL, bio, etc.) for the currently authenticated user. This is a partial update; you only need to send the fields you want to change.
*   **Authorization**: Bearer Token required.

**Test Method:**
1.  **URL**: `http://localhost:8080/api/v1/users/me`
2.  **Method**: `PATCH`
3.  **Authorization**:
    *   **Type**: Bearer Token
    *   **Token**: Paste the `access_token` obtained from Supabase after logging in. (Because we do not have frontend now)
4.  **Body:**
    *   **Type**: raw
    *   **Format:** JSON
    *   **Content:** Provide a JSON object with only the fields you wish to update.

**Example update:**
```json
{
    "bio": "I am a passionate learner and love to share my knowledge!"
}
```

**Success Response (`200 OK`)**

The server will respond with the **complete, updated user profile object**.

```json
{
    "id": "d312c2cb-dd75-4b5e-9ebf-edcd22ba5ccb",
    "username": "lichenyang_christy",
    "avatarUrl": null,
    "bio": "I am a passionate learner and love to share my knowledge!",
    "createdAt": "2025-09-24T06:53:10.137680Z"
}
```

**Error Responses**

*   401 Unauthorized: Returned if the Bearer Token is missing, invalid, or expired.

*   404 Not Found: Returned if, for some reason, the user profile associated with the valid JWT does not exist in the database.

*   500 Internal Server Error: Could be returned if the new username you are trying to set already exists for another user, violating the unique constraint.