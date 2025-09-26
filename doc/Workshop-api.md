## **Workshop API Endpoints**

This document outlines the available API endpoints for the Skill Swap Club backend, focusing on Workshop.

**Base URL:** `http://localhost:8080`

For every request to our backend API (`http://localhost:8080`) that requires authentication, you **must** include this token in the `Authorization` header.

*   **Header Key**: `Authorization`
*   **Header Value**: `Bearer <the_jwt_token>`

---

### **Create a Workshop**

*   `POST /api/v1/workshops`
*   **Description**: Creates a new workshop. The currently authenticated user will automatically be set as the facilitator, and will be awarded credits for the creation.
*   **Authorization**: `Bearer Token` required.

**Test Method:**
1.  **URL**: `http://localhost:8080/api/v1/workshops`
2.  **Method**: `POST`
3.  **Authorization**:
    *   **Type**: Bearer Token
    *   **Token**: Paste the `access_token` of a logged-in user.
4.  **Body**:
    *   **Type**: raw
    *   **Format**: JSON
    *   **Content**: Provide a JSON object with the workshop details.

**Request Body (`application/json`)**

```json
{
  "title": "My First Awesome Workshop",
  "description": "Learning how to build amazing REST APIs.",
  "category": "Backend Development",
  "skillLevel": "Beginner",
  "duration": 90,
  "maxParticipants": 15,
  "creditCost": 10,
  "creditReward": 20,
  "date": "2025-11-10",
  "time": "19:00:00",
  "location": ["Online"],
  "isOnline": true,
  "tags": ["Java", "Spring Boot", "API"],
  "materials": ["Slides PDF", "GitHub Repo Link"],
  "requirements": ["Basic Java knowledge"]
}
```

**Success Response (`201 Created`)**

The server will respond with the complete object of the newly created workshop.

```json
{
    "id": "w_1",
    "title": "My First Awesome Workshop",
    "description": "Learning how to build amazing REST APIs.",
    "category": "Backend Development",
    "skillLevel": "Beginner",
    "status": "upcoming",
    "date": "2025-11-10",
    "time": "19:00:00",
    "isOnline": true,
    "location": [
        "Online"
    ],
    "maxParticipants": 15,
    "creditReward": 20,
    "facilitator": {
        "id": "u_932c2a5d-14f8-4fd5-bc6a-85db34035d4b",
        "name": "lichenyang_christy_cJOy",
        "avatar": "null"
    },
    "createdAt": "2025-09-27T00:28:57.3057653"
}
```

**Error Responses**

*   `401 Unauthorized`: Returned if the `Bearer Token` is missing, invalid, or expired.
*   `404 Not Found`: Returned if the user ID from the valid JWT does not exist in the database.
    ```json
    {
        "timestamp": "2025-09-25T10:00:00.000Z",
        "status": 404,
        "error": "Not Found",
        "message": "UserAccount not found with ID: d312c2cb-dd75-4b5e-9ebf-edcd22ba5ccb",
        "path": "/api/v1/workshops"
    }
    ```

---

### **Get Public Workshop by ID**

*   `GET /api/v1/workshops/{id}`
*   **Description**: Retrieves the public details for a specific workshop by its unique ID.
*   **Authorization**: **None required.** This is a public endpoint.

**Test Method:**
1.  **URL**: `http://localhost:8080/api/v1/workshops/1` (Replace '1' with a valid workshop ID).
2.  **Method**: `GET`
3.  **Authorization**:
    *   **Type**: No Auth

**Path Parameters:**
*   `id` (Long, required): The unique identifier of the workshop.

**Success Response (`200 OK`)**

```json
{
    "id": "w_1",
    "title": "My First Awesome Workshop",
    "description": "Learning how to build amazing REST APIs.",
    "category": "Backend Development",
    "skillLevel": "Beginner",
    "status": "upcoming",
    "date": "2025-11-10",
    "time": "19:00:00",
    "isOnline": true,
    "location": [
        "Online"
    ],
    "maxParticipants": 15,
    "creditReward": 20,
    "facilitator": {
        "id": "u_932c2a5d-14f8-4fd5-bc6a-85db34035d4b",
        "name": "lichenyang_christy_cJOy",
        "avatar": "null"
    },
    "createdAt": "2025-09-27T00:28:57.305765"
}
```

**Error Responses**

*   `404 Not Found`: Returned if no workshop exists with the provided ID.
    ```json
    {
        "timestamp": "2025-09-25T10:05:00.000Z",
        "status": 404,
        "error": "Not Found",
        "message": "Workshop not found with ID: 999",
        "path": "/api/v1/workshops/999"
    }
    ```

---

#### **Get All Public Workshops**

*   `GET /api/v1/workshops`
*   **Description**: Retrieves a list of all publicly available workshops.
*   **Authorization**: **None required.** This is a public endpoint.

**Test Method:**
1.  **URL**: `http://localhost:8080/api/v1/workshops`
2.  **Method**: `GET`
3.  **Authorization**:
    *   **Type**: No Auth

**Success Response (`200 OK`)**

The server will respond with a JSON array of workshop objects.

```json
[
    {
        "id": "w_1",
        "title": "My First Awesome Workshop",
        "description": "Learning how to build amazing REST APIs.",
        "category": "Backend Development",
        "skillLevel": "Beginner",
        "status": "upcoming",
        "date": "2025-11-10",
        "time": "19:00:00",
        "isOnline": true,
        "location": [
            "Online"
        ],
        "maxParticipants": 15,
        "creditReward": 20,
        "facilitator": {
            "id": "u_932c2a5d-14f8-4fd5-bc6a-85db34035d4b",
            "name": "lichenyang_christy_cJOy",
            "avatar": "null"
        },
        "createdAt": "2025-09-27T00:28:57.305765"
    }
]
```

---

#### **Delete Workshop**

* `DELETE /api/v1/workshops/{id}`
* **Description**: Deletes a specific workshop. Only the workshop’s **facilitator (creator)** or a user with **admin privileges** can perform this action.
  When deletion is successful, the server responds with a confirmation message.
* **Authorization**: **Required.**

  * The request must include a valid authentication token (e.g., Bearer JWT).
  * The authenticated user must either be:

    * The facilitator who created the workshop, **or**
    * An admin user.

**Test Method:**

1. **URL**: `http://localhost:8080/api/v1/workshops/{id}`

   * Replace `{id}` with the numeric workshop ID (e.g., `1`).
2. **Method**: `DELETE`
3. **Authorization**:

   * **Type**: Bearer Token
   * **Token**: Valid access token of an admin user or the workshop facilitator.

**Success Response (`200 OK`)**

If the deletion succeeds, the server returns a JSON object confirming the deletion.

```json
{
    "message": "delete success"
}
```

**Error Responses**

| Status Code        | Reason                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| `401 Unauthorized` | The request does not include a valid authentication token.                                        |
| `403 Forbidden`    | The user is not the facilitator of this workshop and is not an admin.                             |
| `404 Not Found`    | No workshop exists with the provided ID.                                                          |
| `409 Conflict`     | The workshop cannot be deleted because related records (e.g., participants, reviews) still exist. |

**Example**

```bash
curl -X DELETE \
  http://localhost:8080/api/v1/workshops/1 \
  -H "Authorization: Bearer <your_access_token>"
```

This request deletes the workshop with ID `1` if the authenticated user is authorized.
