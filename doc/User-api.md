## **User-api Endpoints**

This document outlines the available API endpoints for the Skill Swap Club backend, focusing on User Profiles.

**Base URL:** `http://localhost:8080`

For every request to our backend API (`http://localhost:8080`) that requires authentication, you **must** include this token in the `Authorization` header.

*   **Header Key**: `Authorization`
*   **Header Value**: `Bearer <the_jwt_token>`

---

### **User Profile**

#### **Get Current User Profile**

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
    "skills": [],
    "createdAt": "2025-09-24T06:53:10.137680Z",
    "updatedAt": "2025-09-25T08:10:25.318675Z"
}
```

**Error Responses**

*   `401 Unauthorized`: Returned if the `Bearer Token` is missing, invalid, or expired.
*   `500 Internal Server Error`: Returned if there's an unexpected issue on the server.

---

#### **Get Public User Profile by ID**

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
    "skills": [
        "spring boot",
        "postgresql",
        "react"
    ],
    "createdAt": "2025-09-24T06:53:10.137680Z",
    "updatedAt": "2025-09-25T08:10:25.318675Z"
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

#### **Update Current User Profile**

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

*   update bio

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
    "skills": [],
    "createdAt": "2025-09-24T06:53:10.137680Z",
    "updatedAt": "2025-09-25T08:10:25.318675Z"
}
```
*   update skills (This would completely replace the skills list)

```json
{
    "skills": ["spring boot", "postgresql", "react"],
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
    "skills": [
        "spring boot",
        "postgresql",
        "react"
    ],
    "createdAt": "2025-09-24T06:53:10.137680Z",
    "updatedAt": "2025-09-25T08:10:25.318675Z"
}
```

*   To clear all skills from the profile

```json
{
    "skills": [],
}
```

Fields:

*   username (String, optional): The user's new display name.

*   avatarUrl (String, optional): A URL to the user's new avatar image.

*   bio (String, optional): The user's new biography text.

*   skills (Array of Strings, optional): A complete list of the user's skills. If this field is provided, it will replace the user's entire existing skill set.
   

**Error Responses**

*   400 Bad Request: Returned if a skill name within the skills array is blank or invalid.

*   401 Unauthorized: Returned if the Bearer Token is missing, invalid, or expired.

*   404 Not Found: Returned if, for some reason, the user profile associated with the valid JWT does not exist in the database.

*   500 Internal Server Error: Could be returned if the new username you are trying to set already exists for another user, violating the unique constraint.

---

### User Skill

#### **Add a Skill to Profile**

*   `POST /api/v1/users/me/skills`
*   **Description**: Adds a new skill to the currently authenticated user's profile. Skill names are case-insensitive and duplicates are ignored (e.g., adding "java" when "Java" already exists will have no effect).
*   **Authorization**: `Bearer Token` required.

**Request Body (`application/json`)**

```json
{
    "skillName": "TypeScript"
}
```
*   `skillName` (String, required): The name of the skill.

**Success Response (`201 Created`)**

The server will respond with the **complete, updated user profile object**. The `skills` field will be a simple array of strings.

```json
{
    "id": "d312c2cb-dd75-4b5e-9ebf-edcd22ba5ccb",
    "username": "chris_the_explorer",
    "avatarUrl": null,
    "bio": "Passionate about clean code.",
    "createdAt": "2025-09-24T06:53:10.137680Z",
    "skills": [
        "java",
        "typescript"
    ]
}
```

**Error Responses**

*   `400 Bad Request`: Returned if business rules are violated.
    *   If `skillName` is missing, empty, or contains only whitespace.

    ```json
    {
        "timestamp": "2025-09-24T10:00:00.000Z",
        "status": 400,
        "error": "Bad Request",
        "message": "Skill name must not be blank.",
        "path": "/api/v1/users/me/skills"
    }
    ```
*   `401 Unauthorized`: Returned if the `Bearer Token` is missing, invalid, or expired.

---

#### **Remove a Skill from Profile**

*   `POST /api/v1/users/me/skills/delete`
*   **Description**: Removes a specific skill from the currently authenticated user's profile by its name. The match is case-insensitive.
*   **Authorization**: `Bearer Token` required.

**Request Body (`application/json`)**

```json
{
    "skillName": "Java"
}
```
*   `skillName` (String, required): The name of the skill to be removed.

**Success Response `200 OK` (If the skill was found and deleted)**

```json
{
    "message": "Skill successfully deleted."
}
```

**Success Response `200 OK` (If the skill was not found)**

```json
{
    "message": "Nothing to delete. Skill not found."
}
```

**Error Responses**

*   `401 Unauthorized`: Returned if the `Bearer Token` is missing, invalid, or expired.

