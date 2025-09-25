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
  "title": "Intro to Java Spring Boot",
  "description": "Learn the basics of building REST APIs with Spring Boot.",
  "category": "Web Development",
  "skillLevel": "Beginner",
  "date": "2025-10-15",
  "time": "18:00:00",
  "isOnline": true,
  "location": "Virtual",
  "maxParticipants": 20,
  "creditCost": 10
}
```

**Success Response (`201 Created`)**

The server will respond with the complete object of the newly created workshop.

```json
{
    "id": 1,
    "title": "Intro to Java Spring Boot",
    "description": "Learn the basics of building REST APIs with Spring Boot.",
    "category": "Web Development",
    "skillLevel": "Beginner",
    "status": "upcoming",
    "date": "2025-10-15",
    "time": "18:00:00",
    "isOnline": true,
    "location": "Virtual",
    "maxParticipants": 20,
    "creditCost": 10,
    "facilitatorName": "lichenyang_christy"
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
    "id": 1,
    "title": "Intro to Java Spring Boot",
    "description": "Learn the basics of building REST APIs with Spring Boot.",
    "category": "Web Development",
    "skillLevel": "Beginner",
    "status": "upcoming",
    "date": "2025-10-15",
    "time": "18:00:00",
    "isOnline": true,
    "location": "Virtual",
    "maxParticipants": 20,
    "creditCost": 10,
    "facilitatorName": "lichenyang_christy"
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
        "id": 1,
        "title": "Intro to Java Spring Boot",
        "description": "Learn the basics of building REST APIs with Spring Boot.",
        "category": "Web Development",
        "skillLevel": "Beginner",
        "status": "upcoming",
        "date": "2025-10-15",
        "time": "18:00:00",
        "isOnline": true,
        "location": "Virtual",
        "maxParticipants": 20,
        "creditCost": 10,
        "facilitatorName": "lichenyang_christy"
    },
    {
        "id": 2,
        "title": "Advanced React Patterns",
        "description": "A deep dive into hooks, context, and performance optimization.",
        "category": "Web Development",
        "skillLevel": "Advanced",
        "status": "upcoming",
        "date": "2025-11-02",
        "time": "14:00:00",
        "isOnline": false,
        "location": "Community Tech Hub",
        "maxParticipants": 15,
        "creditCost": 25,
        "facilitatorName": "another_user"
    }
]```