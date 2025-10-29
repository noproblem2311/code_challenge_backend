# Live Scoreboard API Service - Execution Flow Diagram

## System Architecture Flow

```mermaid
graph TB
    subgraph "Client Layer"
        A[User Action<br/>Game/Competition] --> B[Frontend App]
        B --> C[Score Submission<br/>API Call]
    end

    subgraph "API Gateway Layer"
        C --> D[Load Balancer]
        D --> E[Rate Limiter]
        E --> F[Authentication<br/>Middleware]
    end

    subgraph "Application Layer"
        F --> G[Score Validation<br/>Service]
        G --> H[Fraud Detection<br/>Engine]
        H --> I[Score Update<br/>Service]
        I --> J[Leaderboard<br/>Calculation]
    end

    subgraph "Data Layer"
        J --> K[(PostgreSQL<br/>Scores DB)]
        J --> L[(Redis<br/>Cache)]
        I --> M[Audit Log<br/>Service]
    end

    subgraph "Real-time Layer"
        J --> N[WebSocket<br/>Manager]
        N --> O[Event Broadcasting]
        O --> P[Connected Clients]
    end

    subgraph "Monitoring Layer"
        M --> Q[Log Aggregation]
        Q --> R[Monitoring<br/>Dashboard]
        I --> S[Metrics<br/>Collection]
        S --> R
    end

    style A fill:#e1f5fe
    style B fill:#e8f5e8
    style C fill:#fff3e0
    style D fill:#f3e5f5
    style E fill:#ffebee
    style F fill:#e0f2f1
    style G fill:#fff8e1
    style H fill:#fce4ec
    style I fill:#e8f5e8
    style J fill:#e1f5fe
    style K fill:#f3e5f5
    style L fill:#fff3e0
    style M fill:#ffebee
    style N fill:#e0f2f1
    style O fill:#fff8e1
    style P fill:#fce4ec
    style Q fill:#e8f5e8
    style R fill:#e1f5fe
    style S fill:#f3e5f5
```

## Score Submission Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API Gateway
    participant R as Rate Limiter
    participant Auth as Auth Service
    participant V as Validation Service
    participant FD as Fraud Detection
    participant S as Score Service
    participant DB as Database
    participant WS as WebSocket
    participant C as Connected Clients

    U->>F: Complete Action
    F->>A: POST /api/scores/submit
    A->>R: Check Rate Limit
    R-->>A: Rate Limit OK
    A->>Auth: Validate JWT Token
    Auth-->>A: Token Valid
    A->>V: Validate Request Data
    V-->>A: Data Valid
    A->>FD: Check for Fraud
    FD-->>A: No Fraud Detected
    A->>S: Update Score
    S->>DB: Store Score Update
    DB-->>S: Score Stored
    S->>DB: Update Leaderboard
    DB-->>S: Leaderboard Updated
    S-->>A: Success Response
    A-->>F: Score Updated
    F-->>U: Show Success
    S->>WS: Broadcast Update
    WS->>C: Send Live Update
```

## Security & Validation Flow

```mermaid
flowchart TD
    A[Incoming Request] --> B{Valid JWT Token?}
    B -->|No| C[Return 401 Unauthorized]
    B -->|Yes| D{Rate Limit OK?}
    D -->|No| E[Return 429 Too Many Requests]
    D -->|Yes| F{Valid Request Format?}
    F -->|No| G[Return 400 Bad Request]
    F -->|Yes| H{Score Increase Reasonable?}
    H -->|No| I[Flag as Suspicious]
    H -->|Yes| J{User Behavior Normal?}
    J -->|No| K[Trigger Additional Verification]
    J -->|Yes| L[Process Score Update]
    I --> M[Log Suspicious Activity]
    K --> N{Additional Verification Pass?}
    N -->|No| O[Block Request]
    N -->|Yes| L
    M --> P[Alert Security Team]
    O --> Q[Return 403 Forbidden]
    L --> R[Update Score Successfully]
```

## Real-time Update Flow

```mermaid
graph LR
    subgraph "Score Update Process"
        A[Score Updated] --> B[Calculate New Rankings]
        B --> C[Update Cache]
        C --> D[Generate Update Event]
    end

    subgraph "WebSocket Broadcasting"
        D --> E[WebSocket Manager]
        E --> F[Filter Connected Users]
        F --> G[Broadcast to Subscribers]
    end

    subgraph "Client Updates"
        G --> H[Leaderboard Viewers]
        G --> I[User Profile Viewers]
        G --> J[Game Lobby Viewers]
    end

    subgraph "Fallback Mechanisms"
        G --> K[Server-Sent Events]
        K --> L[Long Polling]
        L --> M[Periodic Refresh]
    end

    style A fill:#e8f5e8
    style B fill:#e1f5fe
    style C fill:#fff3e0
    style D fill:#f3e5f5
    style E fill:#ffebee
    style F fill:#e0f2f1
    style G fill:#fff8e1
    style H fill:#fce4ec
    style I fill:#e8f5e8
    style J fill:#e1f5fe
    style K fill:#fff3e0
    style L fill:#f3e5f5
    style M fill:#ffebee
```

## Error Handling Flow

```mermaid
flowchart TD
    A[Request Received] --> B{Authentication Valid?}
    B -->|No| C[401 Unauthorized]
    B -->|Yes| D{Rate Limit OK?}
    D -->|No| E[429 Rate Limited]
    D -->|Yes| F{Input Valid?}
    F -->|No| G[400 Bad Request]
    F -->|Yes| H{Database Available?}
    H -->|No| I[503 Service Unavailable]
    H -->|Yes| J{Score Update Success?}
    J -->|No| K[500 Internal Error]
    J -->|Yes| L[200 Success]

    C --> M[Log Security Event]
    E --> N[Log Rate Limit Event]
    G --> O[Log Validation Error]
    I --> P[Alert Operations Team]
    K --> Q[Log Error Details]
    L --> R[Log Success Event]

    M --> S[Return Error Response]
    N --> S
    O --> S
    P --> S
    Q --> S
    R --> T[Return Success Response]
```

## Database Schema Relationships

```mermaid
erDiagram
    USERS ||--o{ SCORES : has
    SCORES ||--o{ AUDIT_LOGS : generates
    USERS ||--o{ LEADERBOARD_ENTRIES : appears_in

    USERS {
        string id PK
        string username
        string email
        boolean is_active
        datetime created_at
        datetime last_activity_at
    }

    SCORES {
        string id PK
        string user_id FK
        integer score
        integer previous_score
        integer increase
        string action_type
        datetime timestamp
        boolean verified
        json metadata
    }

    LEADERBOARD_ENTRIES {
        string user_id FK
        integer rank
        integer score
        datetime last_updated
        string timeframe
    }

    AUDIT_LOGS {
        string id PK
        string user_id FK
        string action
        json details
        datetime timestamp
        string ip_address
        string user_agent
    }
```

## Performance Monitoring Flow

```mermaid
graph TB
    subgraph "Application Metrics"
        A[Request Count] --> E[Metrics Aggregator]
        B[Response Time] --> E
        C[Error Rate] --> E
        D[Active Connections] --> E
    end

    subgraph "Business Metrics"
        F[Score Submissions] --> E
        G[Leaderboard Views] --> E
        H[User Engagement] --> E
        I[Fraud Attempts] --> E
    end

    subgraph "Infrastructure Metrics"
        J[CPU Usage] --> E
        K[Memory Usage] --> E
        L[Database Connections] --> E
        M[Cache Hit Rate] --> E
    end

    E --> N[Time Series Database]
    N --> O[Dashboard]
    N --> P[Alerting System]
    P --> Q[Slack/Email Alerts]

    style A fill:#e8f5e8
    style B fill:#e1f5fe
    style C fill:#fff3e0
    style D fill:#f3e5f5
    style E fill:#ffebee
    style F fill:#e0f2f1
    style G fill:#fff8e1
    style H fill:#fce4ec
    style I fill:#e8f5e8
    style J fill:#e1f5fe
    style K fill:#fff3e0
    style L fill:#f3e5f5
    style M fill:#ffebee
    style N fill:#e0f2f1
    style O fill:#fff8e1
    style P fill:#fce4ec
    style Q fill:#e8f5e8
```
