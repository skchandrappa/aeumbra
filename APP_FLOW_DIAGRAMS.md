# Security Guard App - Visual Flow Diagrams

## 🔐 **Complete User Registration & Onboarding Flow**

```mermaid
graph TD
    A[User Visits App] --> B{User Type?}
    B -->|Guard| C[Guard Registration]
    B -->|Consumer| D[Consumer Registration]
    
    C --> E[POST /api/auth/register]
    D --> E
    
    E --> F[Email Verification Required]
    F --> G[POST /api/auth/verify-email]
    G --> H[Account Activated]
    
    H --> I[Complete Profile Setup]
    I --> J[PUT /api/users/profile]
    J --> K[Configure Settings]
    K --> L[PUT /api/users/settings]
    
    L --> M{User Type?}
    M -->|Guard| N[Guard Verification Flow]
    M -->|Consumer| O[Consumer Setup Flow]
    
    N --> P[Upload Documents]
    P --> Q[POST /api/verification/documents]
    Q --> R[Admin Review Process]
    R --> S[Verification Approved]
    
    O --> T[Search for Guards]
    T --> U[Ready to Book]
    
    S --> V[Set Availability & Pricing]
    V --> W[Ready to Accept Bookings]
```

## 🛡️ **Guard Complete Workflow**

```mermaid
graph TD
    A[Guard Login] --> B[Check Notifications]
    B --> C[GET /api/notifications]
    
    C --> D{New Bookings?}
    D -->|Yes| E[Review Booking Requests]
    D -->|No| F[Check Social Feed]
    
    E --> G[GET /api/bookings]
    G --> H{Accept Booking?}
    H -->|Yes| I[POST /api/bookings/{id}/confirm]
    H -->|No| J[POST /api/bookings/{id}/cancel]
    
    I --> K[Prepare for Event]
    K --> L[Arrive at Location]
    L --> M[POST /api/bookings/{id}/complete]
    
    M --> N[Update Social Media]
    N --> O[POST /api/posts]
    O --> P[Share Work Updates]
    
    P --> Q[Check Earnings]
    Q --> R[GET /api/analytics/user/dashboard]
    R --> S[Manage Payments]
    S --> T[GET /api/payments/methods]
    
    T --> U[Engage Community]
    U --> V[Like/Comment on Posts]
    V --> W[Build Professional Network]
    
    W --> X[Wait for Next Booking]
    X --> A
```

## 👥 **Consumer Complete Workflow**

```mermaid
graph TD
    A[Consumer Login] --> B[Check Notifications]
    B --> C[GET /api/notifications]
    
    C --> D{Need Security?}
    D -->|Yes| E[Search for Guards]
    D -->|No| F[Browse Community]
    
    E --> G[GET /api/search/guards]
    G --> H[Filter by Location/Rating]
    H --> I[View Guard Profiles]
    I --> J[Check Reviews]
    J --> K[GET /api/reviews]
    
    K --> L[Create Booking Request]
    L --> M[POST /api/bookings]
    M --> N[Wait for Guard Response]
    
    N --> O{Guard Accepted?}
    O -->|Yes| P[Process Payment]
    O -->|No| Q[Search Other Guards]
    
    P --> R[POST /api/payments/process]
    R --> S[Event Day]
    S --> T[Guard Arrives]
    T --> U[Event Completed]
    
    U --> V[Leave Review]
    V --> W[POST /api/reviews]
    W --> X[Rate Experience]
    
    X --> Y[Update Social Media]
    Y --> Z[POST /api/posts]
    Z --> AA[Share Event Photos]
    
    AA --> BB[Plan Next Event]
    BB --> E
```

## 🔄 **Social Interaction Flow**

```mermaid
graph TD
    A[User Login] --> B[Check Feed]
    B --> C[GET /api/posts]
    
    C --> D{Interact with Post?}
    D -->|Like| E[POST /api/posts/{id}/like]
    D -->|Comment| F[POST /api/posts/{id}/comments]
    D -->|Share| G[Share to External]
    
    E --> H[Update Like Count]
    F --> I[Add Comment]
    G --> J[External Share]
    
    H --> K[Continue Browsing]
    I --> K
    J --> K
    
    K --> L{Create Own Post?}
    L -->|Yes| M[POST /api/posts]
    L -->|No| N[Follow Users]
    
    M --> O[Add Media]
    O --> P[POST /api/posts/{id}/media]
    P --> Q[Publish Post]
    
    N --> R[Follow Other Users]
    R --> S[Build Network]
    S --> T[Get Notifications]
    T --> U[GET /api/notifications]
    
    U --> V[Engage with Notifications]
    V --> W[Mark as Read]
    W --> X[POST /api/notifications/mark-read]
    
    X --> Y[Continue Social Activity]
    Y --> B
```

## 💰 **Payment & Transaction Flow**

```mermaid
graph TD
    A[Booking Created] --> B[Calculate Pricing]
    B --> C[Apply Platform Fee]
    C --> D[Generate Invoice]
    
    D --> E[Consumer Payment]
    E --> F[POST /api/payments/process]
    F --> G{Payment Success?}
    
    G -->|Yes| H[Create Transaction]
    G -->|No| I[Payment Failed]
    
    H --> J[POST /api/payments/methods]
    J --> K[Store Payment Method]
    K --> L[Process Payment]
    
    L --> M[Update Booking Status]
    M --> N[Notify Guard]
    N --> O[Send Notifications]
    
    O --> P[Event Completion]
    P --> Q[Release Payment]
    Q --> R[Guard Receives Payment]
    
    R --> S[Update Earnings]
    S --> T[Generate Receipt]
    T --> U[Send Confirmation]
    
    I --> V[Retry Payment]
    V --> W[Alternative Payment Method]
    W --> F
```

## 🔍 **Verification & Admin Flow**

```mermaid
graph TD
    A[User Submits Document] --> B[POST /api/verification/documents]
    B --> C[Document Stored]
    C --> D[Status: Pending]
    
    D --> E[Admin Notification]
    E --> F[GET /api/verification/admin/pending]
    F --> G[Review Document]
    
    G --> H{Document Valid?}
    H -->|Yes| I[POST /api/verification/admin/{id}/approve]
    H -->|No| J[POST /api/verification/admin/{id}/reject]
    
    I --> K[Status: Approved]
    J --> L[Status: Rejected]
    
    K --> M[User Notification]
    L --> N[Rejection Reason]
    
    M --> O[User Can Accept Bookings]
    N --> P[User Must Resubmit]
    
    P --> Q[Upload New Document]
    Q --> B
    
    O --> R[Background Check Process]
    R --> S[POST /api/verification/background-checks]
    S --> T[Third-party Verification]
    T --> U[Results Stored]
    U --> V[Verification Complete]
```

## 📊 **Analytics & Reporting Flow**

```mermaid
graph TD
    A[User Dashboard] --> B[GET /api/analytics/user/dashboard]
    B --> C[Calculate Metrics]
    
    C --> D[Booking Statistics]
    C --> E[Earnings Summary]
    C --> F[Performance Metrics]
    C --> G[Social Engagement]
    
    D --> H[Completed Bookings]
    D --> I[Cancelled Bookings]
    D --> J[Upcoming Bookings]
    
    E --> K[Total Earnings]
    E --> L[Payment History]
    E --> M[Platform Fees]
    
    F --> N[Average Rating]
    F --> O[Response Time]
    F --> P[Completion Rate]
    
    G --> Q[Post Engagement]
    G --> R[Follower Growth]
    G --> S[Community Activity]
    
    H --> T[Generate Report]
    I --> T
    J --> T
    K --> T
    L --> T
    M --> T
    N --> T
    O --> T
    P --> T
    Q --> T
    R --> T
    S --> T
    
    T --> U[Display Dashboard]
    U --> V[Export Data]
    V --> W[Share Insights]
```

## 🚨 **Dispute Resolution Flow**

```mermaid
graph TD
    A[Issue Occurs] --> B[User Files Complaint]
    B --> C[POST /api/complaints]
    C --> D[Complaint Created]
    
    D --> E[Admin Notification]
    E --> F[GET /api/complaints]
    F --> G[Review Complaint]
    
    G --> H{Complaint Valid?}
    H -->|Yes| I[Investigate Issue]
    H -->|No| J[Reject Complaint]
    
    I --> K[Gather Evidence]
    K --> L[Contact Parties]
    L --> M[Review Documentation]
    
    M --> N{Resolution Found?}
    N -->|Yes| O[Implement Resolution]
    N -->|No| P[Escalate to Higher Authority]
    
    O --> Q[Update Complaint Status]
    P --> R[External Mediation]
    
    Q --> S[Notify All Parties]
    R --> T[External Resolution]
    
    S --> U[Monitor Compliance]
    T --> V[Update System]
    
    U --> W[Close Complaint]
    V --> W
    
    J --> X[Provide Rejection Reason]
    X --> Y[User Can Appeal]
    Y --> Z[Appeal Process]
    Z --> G
```

These flow diagrams provide a comprehensive visual representation of all user journeys, API interactions, and business processes in the security guard freelancing platform.
