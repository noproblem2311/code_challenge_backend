# API Endpoint Specifications

## Base URL

```
Production: https://api.scoreboard.com/v1
Development: http://localhost:3000/api/v1
```

## Authentication

All endpoints require JWT authentication via the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

## Rate Limiting

- **Score submissions**: 100 requests per minute per user
- **Leaderboard requests**: 1000 requests per minute per user
- **WebSocket connections**: 5 concurrent connections per user

## Response Format

All responses follow this structure:

```json
{
  "success": boolean,
  "data": object | null,
  "message": string,
  "error": string | null,
  "timestamp": string,
  "requestId": string
}
```

---

## 1. Score Submission Endpoint

### POST `/scores/submit`

Submit a score increase after completing an action.

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
X-Request-ID: <optional_request_id>
```

**Request Body:**

```json
{
  "actionType": "game_completion" | "quiz_completion" | "challenge_completion" | "custom_action",
  "scoreIncrease": number,
  "metadata": {
    "level": number,
    "timeSpent": number,
    "difficulty": "easy" | "medium" | "hard",
    "bonusMultiplier": number,
    "customData": object
  },
  "timestamp": string, // ISO 8601 format
  "clientVersion": string,
  "deviceId": string
}
```

**Validation Rules:**

- `scoreIncrease`: Must be between 1 and 10000
- `actionType`: Must be from predefined list
- `metadata.level`: Must be positive integer
- `metadata.timeSpent`: Must be positive integer (seconds)
- `timestamp`: Must be within 5 minutes of current time

**Success Response (201):**

```json
{
  "success": true,
  "data": {
    "userId": "user_123",
    "newScore": 1500,
    "previousScore": 1400,
    "increase": 100,
    "rank": 3,
    "leaderboardUpdated": true,
    "achievements": [
      {
        "id": "first_1000",
        "name": "First Thousand",
        "description": "Reached 1000 points"
      }
    ]
  },
  "message": "Score updated successfully",
  "timestamp": "2024-01-15T10:30:00Z",
  "requestId": "req_123456"
}
```

**Error Responses:**

**400 Bad Request:**

```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Invalid request data",
  "details": {
    "scoreIncrease": "Must be between 1 and 10000",
    "actionType": "Invalid action type"
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "requestId": "req_123456"
}
```

**401 Unauthorized:**

```json
{
  "success": false,
  "error": "UNAUTHORIZED",
  "message": "Invalid or expired token",
  "timestamp": "2024-01-15T10:30:00Z",
  "requestId": "req_123456"
}
```

**429 Too Many Requests:**

```json
{
  "success": false,
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Too many requests. Please wait before submitting again.",
  "retryAfter": 60,
  "timestamp": "2024-01-15T10:30:00Z",
  "requestId": "req_123456"
}
```

---

## 2. Leaderboard Retrieval

### GET `/leaderboard`

Get the current leaderboard with optional filtering.

**Query Parameters:**

- `timeframe`: `daily` | `weekly` | `monthly` | `alltime` (default: `alltime`)
- `limit`: Number of entries (default: 10, max: 100)
- `offset`: Starting position (default: 0)
- `includeSelf`: Include current user's position (default: `true`)

**Example Request:**

```
GET /leaderboard?timeframe=weekly&limit=20&includeSelf=true
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "userId": "user_456",
        "username": "champion_player",
        "score": 5000,
        "lastUpdated": "2024-01-15T10:25:00Z",
        "avatar": "https://cdn.example.com/avatars/user_456.jpg",
        "badges": ["top_player", "weekly_champion"]
      },
      {
        "rank": 2,
        "userId": "user_789",
        "username": "speed_demon",
        "score": 4800,
        "lastUpdated": "2024-01-15T10:20:00Z",
        "avatar": "https://cdn.example.com/avatars/user_789.jpg",
        "badges": ["speed_master"]
      }
    ],
    "currentUser": {
      "rank": 15,
      "userId": "user_123",
      "username": "my_username",
      "score": 1500,
      "lastUpdated": "2024-01-15T10:30:00Z"
    },
    "totalPlayers": 1250,
    "lastUpdated": "2024-01-15T10:30:00Z",
    "timeframe": "weekly"
  },
  "message": "Leaderboard retrieved successfully",
  "timestamp": "2024-01-15T10:30:00Z",
  "requestId": "req_123456"
}
```

---

## 3. User Score History

### GET `/scores/history/:userId`

Get detailed score history for a specific user.

**Path Parameters:**

- `userId`: User ID (must be current user or admin)

**Query Parameters:**

- `limit`: Number of entries (default: 50, max: 200)
- `offset`: Starting position (default: 0)
- `startDate`: Start date filter (ISO 8601)
- `endDate`: End date filter (ISO 8601)
- `actionType`: Filter by action type

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "userId": "user_123",
    "username": "my_username",
    "currentScore": 1500,
    "rank": 15,
    "totalSubmissions": 45,
    "history": [
      {
        "id": "score_789",
        "score": 1500,
        "increase": 100,
        "actionType": "game_completion",
        "timestamp": "2024-01-15T10:30:00Z",
        "metadata": {
          "level": 5,
          "timeSpent": 300,
          "difficulty": "hard"
        },
        "verified": true
      }
    ],
    "statistics": {
      "averageIncrease": 33.3,
      "maxIncrease": 100,
      "minIncrease": 10,
      "totalPlayTime": 13500,
      "favoriteActionType": "game_completion"
    }
  },
  "message": "Score history retrieved successfully",
  "timestamp": "2024-01-15T10:30:00Z",
  "requestId": "req_123456"
}
```

---

## 4. User Statistics

### GET `/users/:userId/stats`

Get comprehensive statistics for a user.

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "userId": "user_123",
    "username": "my_username",
    "overallStats": {
      "currentScore": 1500,
      "rank": 15,
      "totalRank": 1250,
      "joinDate": "2024-01-01T00:00:00Z",
      "lastActivity": "2024-01-15T10:30:00Z"
    },
    "scoreStats": {
      "totalSubmissions": 45,
      "averageIncrease": 33.3,
      "maxIncrease": 100,
      "minIncrease": 10,
      "totalPlayTime": 13500
    },
    "achievements": [
      {
        "id": "first_1000",
        "name": "First Thousand",
        "description": "Reached 1000 points",
        "unlockedAt": "2024-01-10T15:30:00Z"
      }
    ],
    "rankings": {
      "daily": 5,
      "weekly": 15,
      "monthly": 25,
      "alltime": 15
    }
  },
  "message": "User statistics retrieved successfully",
  "timestamp": "2024-01-15T10:30:00Z",
  "requestId": "req_123456"
}
```

---

## 5. WebSocket Events

### Connection

```
ws://api.scoreboard.com/socket?token=<jwt_token>
```

### Event Types

#### Score Update Event

```json
{
  "type": "score_update",
  "data": {
    "userId": "user_123",
    "username": "my_username",
    "newScore": 1500,
    "previousScore": 1400,
    "increase": 100,
    "rank": 3,
    "previousRank": 5,
    "leaderboardChanged": true,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

#### Leaderboard Update Event

```json
{
  "type": "leaderboard_update",
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "userId": "user_456",
        "username": "champion_player",
        "score": 5000
      }
    ],
    "timeframe": "alltime",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

#### Achievement Unlocked Event

```json
{
  "type": "achievement_unlocked",
  "data": {
    "userId": "user_123",
    "achievement": {
      "id": "first_1000",
      "name": "First Thousand",
      "description": "Reached 1000 points",
      "unlockedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

#### System Notification Event

```json
{
  "type": "system_notification",
  "data": {
    "message": "Maintenance scheduled for 2:00 AM UTC",
    "type": "info",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

---

## 6. Health Check Endpoint

### GET `/health`

Check system health and status.

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-15T10:30:00Z",
    "uptime": 86400,
    "version": "1.0.0",
    "environment": "production",
    "services": {
      "database": "healthy",
      "cache": "healthy",
      "websocket": "healthy",
      "rateLimiter": "healthy"
    },
    "metrics": {
      "activeConnections": 1250,
      "requestsPerSecond": 45.2,
      "averageResponseTime": 120,
      "errorRate": 0.01
    }
  }
}
```

---

## Error Codes Reference

| Code                  | HTTP Status | Description                       |
| --------------------- | ----------- | --------------------------------- |
| `VALIDATION_ERROR`    | 400         | Request data validation failed    |
| `UNAUTHORIZED`        | 401         | Invalid or missing authentication |
| `FORBIDDEN`           | 403         | Insufficient permissions          |
| `NOT_FOUND`           | 404         | Resource not found                |
| `RATE_LIMIT_EXCEEDED` | 429         | Too many requests                 |
| `FRAUD_DETECTED`      | 403         | Suspicious activity detected      |
| `SERVICE_UNAVAILABLE` | 503         | Service temporarily unavailable   |
| `INTERNAL_ERROR`      | 500         | Internal server error             |

---

## Request/Response Examples

### Complete Score Submission Flow

**Request:**

```bash
curl -X POST https://api.scoreboard.com/v1/scores/submit \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "actionType": "game_completion",
    "scoreIncrease": 100,
    "metadata": {
      "level": 5,
      "timeSpent": 300,
      "difficulty": "hard",
      "bonusMultiplier": 1.5
    },
    "timestamp": "2024-01-15T10:30:00Z",
    "clientVersion": "1.2.3",
    "deviceId": "device_123"
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "userId": "user_123",
    "newScore": 1500,
    "previousScore": 1400,
    "increase": 100,
    "rank": 3,
    "leaderboardUpdated": true,
    "achievements": []
  },
  "message": "Score updated successfully",
  "timestamp": "2024-01-15T10:30:00Z",
  "requestId": "req_123456"
}
```

### WebSocket Connection Example

**JavaScript Client:**

```javascript
const socket = io('https://api.scoreboard.com', {
  auth: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  }
})

socket.on('score_update', (data) => {
  console.log('Score updated:', data)
  updateLeaderboard(data)
})

socket.on('leaderboard_update', (data) => {
  console.log('Leaderboard updated:', data)
  refreshLeaderboard(data.leaderboard)
})
```
