# Backend Setup Guide

This document describes the backend requirements for the Vox App token generation service.

## Overview

The backend is responsible for generating LiveKit JWT tokens. It should be implemented in Go and deployed as a Netlify Function.

## Endpoint Specification

### GET /token

Generates a LiveKit JWT token for a user joining a room.

**Query Parameters:**

- `role` (required): Either `"guide"` or `"listener"`
- `room` (required): The room ID (UUID format)

**Example Request:**

```
GET /.netlify/functions/token?role=guide&room=123e4567-e89b-12d3-a456-426614174000
```

**Success Response (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (400/500):**

```json
{
  "error": "Invalid role parameter"
}
```

## Token Generation Requirements

The JWT token must include:

1. **Header:**
   - Algorithm: HS256 (or RS256 if using RSA keys)
   - Type: JWT

2. **Payload:**
   - `iss`: API key from LiveKit
   - `sub`: Unique identity for the participant (can be generated)
   - `name`: Optional display name
   - `video`: Object with publish/subscribe permissions
   - `audio`: Object with publish/subscribe permissions
   - `room`: Room name (the room ID)
   - `exp`: Expiration time (Unix timestamp)

3. **Permissions by Role:**

   **Guide:**

   ```json
   {
     "video": {
       "publish": false,
       "subscribe": false
     },
     "audio": {
       "publish": true,
       "subscribe": false
     }
   }
   ```

   **Listener:**

   ```json
   {
     "video": {
       "publish": false,
       "subscribe": false
     },
     "audio": {
       "publish": false,
       "subscribe": true
     }
   }
   ```

## Implementation Example (Go)

```go
package main

import (
    "encoding/json"
    "fmt"
    "net/http"
    "os"
    "time"

    "github.com/livekit/protocol/auth"
    "github.com/livekit/protocol/livekit"
)

func handler(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodGet {
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        return
    }

    role := r.URL.Query().Get("role")
    room := r.URL.Query().Get("room")

    if role == "" || room == "" {
        http.Error(w, "Missing required parameters", http.StatusBadRequest)
        return
    }

    if role != "guide" && role != "listener" {
        http.Error(w, "Invalid role", http.StatusBadRequest)
        return
    }

    // Get LiveKit credentials from environment
    apiKey := os.Getenv("LIVEKIT_API_KEY")
    apiSecret := os.Getenv("LIVEKIT_API_SECRET")

    if apiKey == "" || apiSecret == "" {
        http.Error(w, "LiveKit credentials not configured", http.StatusInternalServerError)
        return
    }

    // Create access token
    at := auth.NewAccessToken(apiKey, apiSecret)

    // Set identity and room
    grant := &livekit.VideoGrant{
        Room: room,
    }

    // Set permissions based on role
    if role == "guide" {
        grant.AudioPublish = true
        grant.AudioSubscribe = false
    } else {
        grant.AudioPublish = false
        grant.AudioSubscribe = true
    }

    grant.VideoPublish = false
    grant.VideoSubscribe = false

    at.AddGrant(grant).
        SetIdentity(fmt.Sprintf("%s-%s", role, generateID())).
        SetName(role).
        SetValidFor(24 * time.Hour)

    token, err := at.ToJWT()
    if err != nil {
        http.Error(w, fmt.Sprintf("Failed to generate token: %v", err), http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]string{
        "token": token,
    })
}

func generateID() string {
    // Generate unique ID for participant
    // Implementation depends on your UUID library
    return "unique-id"
}
```

## Environment Variables

The backend needs the following environment variables:

- `LIVEKIT_API_KEY`: Your LiveKit API key
- `LIVEKIT_API_SECRET`: Your LiveKit API secret

## Netlify Function Deployment

1. Create a `netlify/functions/token/main.go` file
2. Configure build settings in `netlify.toml`:

```toml
[build]
  command = "go build -o netlify/functions/token/token ./netlify/functions/token"
  functions = "netlify/functions"

[[redirects]]
  from = "/token"
  to = "/.netlify/functions/token"
  status = 200
```

3. Set environment variables in Netlify dashboard
4. Deploy the function

## Testing

Test the endpoint:

```bash
curl "https://your-app.netlify.app/.netlify/functions/token?role=guide&room=test-room-123"
```

Expected response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Security Considerations

1. **Validate Input**: Ensure room IDs are valid UUIDs
2. **Rate Limiting**: Implement rate limiting to prevent abuse
3. **CORS**: Configure CORS if needed for web clients
4. **Token Expiration**: Set reasonable expiration times (e.g., 24 hours)
5. **Secret Management**: Never expose API secrets in client code
