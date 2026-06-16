# API Design Patterns

Best practices and common patterns for REST API design.

## RESTful Resource Design

### URL Structure
```
/api/v1/resources GET - List all resources
/api/v1/resources POST - Create new resource
/api/v1/resources/:id GET - Get single resource
/api/v1/resources/:id PATCH - Update resource (partial)
/api/v1/resources/:id PUT - Replace resource (full)
/api/v1/resources/:id DELETE - Delete resource
```

### Nested Resources
```
/api/v1/users/:userId/posts - User's posts
/api/v1/posts/:postId/comments - Post's comments
/api/v1/organizations/:orgId/members - Org members
```

**Limit nesting to 2 levels max** for clarity.

### Common Endpoints by Feature

#### Authentication
```
POST /api/v1/auth/register - Create account
POST /api/v1/auth/login - Login
POST /api/v1/auth/logout - Logout
POST /api/v1/auth/refresh - Refresh token
POST /api/v1/auth/forgot-password - Request reset
POST /api/v1/auth/reset-password - Reset password
GET /api/v1/auth/me - Current user
```

#### User Management
```
GET /api/v1/users - List users
GET /api/v1/users/:id - Get user
PATCH /api/v1/users/:id - Update user
DELETE /api/v1/users/:id - Delete user
GET /api/v1/users/:id/profile - User profile
PATCH /api/v1/users/:id/profile - Update profile
POST /api/v1/users/:id/avatar - Upload avatar
```

#### Social Features
```
POST /api/v1/users/:id/follow - Follow user
DELETE /api/v1/users/:id/follow - Unfollow
GET /api/v1/users/:id/followers - Get followers
GET /api/v1/users/:id/following - Get following

GET /api/v1/posts - List posts
POST /api/v1/posts - Create post
GET /api/v1/posts/:id - Get post
PATCH /api/v1/posts/:id - Update post
DELETE /api/v1/posts/:id - Delete post
POST /api/v1/posts/:id/like - Like post
DELETE /api/v1/posts/:id/like - Unlike post
GET /api/v1/posts/:id/likes - Get likes
POST /api/v1/posts/:id/comments - Add comment
GET /api/v1/posts/:id/comments - Get comments
```

#### Content/Blog
```
GET /api/v1/articles - List articles
GET /api/v1/articles/:slug - Get article by slug
POST /api/v1/articles - Create article
PATCH /api/v1/articles/:id - Update article
DELETE /api/v1/articles/:id - Delete article
POST /api/v1/articles/:id/publish - Publish draft
GET /api/v1/tags - List tags
GET /api/v1/articles?tag=:slug - Filter by tag
```

#### E-Commerce
```
GET /api/v1/products - List products
GET /api/v1/products/:id - Get product
POST /api/v1/products - Create product
PATCH /api/v1/products/:id - Update product
DELETE /api/v1/products/:id - Delete product

GET /api/v1/cart - Get cart
POST /api/v1/cart/items - Add item
PATCH /api/v1/cart/items/:id - Update item
DELETE /api/v1/cart/items/:id - Remove item
DELETE /api/v1/cart - Clear cart

POST /api/v1/checkout - Initiate checkout
POST /api/v1/orders - Create order
GET /api/v1/orders - List orders
GET /api/v1/orders/:id - Get order
```

## Request/Response Patterns

### Standard Response Format
```typescript
// Success Response
{
 "data": { /* resource or array */ },
 "meta": {
 "requestId": "uuid",
 "timestamp": "2024-11-16T10:30:00Z"
 }
}

// Error Response
{
 "error": {
 "code": "VALIDATION_ERROR",
 "message": "Validation failed",
 "details": [
 {
 "field": "email",
 "message": "Invalid email format"
 }
 ]
 },
 "meta": {
 "requestId": "uuid",
 "timestamp": "2024-11-16T10:30:00Z"
 }
}
```

### Pagination
```typescript
// Request
GET /api/v1/posts?page=2&limit=20

// Cursor-based (preferred for large datasets)
GET /api/v1/posts?cursor=abc123&limit=20

// Response
{
 "data": [...],
 "pagination": {
 "page": 2,
 "limit": 20,
 "total": 150,
 "totalPages": 8,
 "hasNext": true,
 "hasPrev": true,
 "nextCursor": "xyz789"
 }
}
```

### Filtering & Sorting
```typescript
// Filtering
GET /api/v1/products?category=electronics&minPrice=100&maxPrice=500

// Sorting
GET /api/v1/products?sort=-price,name // - for desc, no prefix for asc

// Field selection
GET /api/v1/users?fields=id,name,email

// Search
GET /api/v1/articles?q=react
```

## HTTP Status Codes

```
200 OK - Successful GET, PATCH, PUT
201 Created - Successful POST
204 No Content - Successful DELETE
400 Bad Request - Invalid request data
401 Unauthorized - Not authenticated
403 Forbidden - Authenticated but not authorized
404 Not Found - Resource doesn't exist
409 Conflict - Duplicate or conflict (e.g., email exists)
422 Unprocessable - Validation errors
429 Too Many Requests - Rate limit exceeded
500 Internal Error - Server error
```

## Authentication Patterns

### JWT Bearer Token
```typescript
// Request Header
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

// Token payload
{
 "userId": "uuid",
 "email": "user@example.com",
 "role": "user",
 "iat": 1700000000,
 "exp": 1700003600
}
```

### Refresh Token Flow
```typescript
// 1. Login returns both tokens
POST /api/v1/auth/login
Response: {
 "accessToken": "...", // Short-lived (15min)
 "refreshToken": "...", // Long-lived (7 days)
 "expiresIn": 900
}

// 2. Use access token for requests
GET /api/v1/users/me
Authorization: Bearer <accessToken>

// 3. When access token expires, refresh
POST /api/v1/auth/refresh
Body: { "refreshToken": "..." }
Response: {
 "accessToken": "...",
 "expiresIn": 900
}
```

### Session-Based Auth
```typescript
// Login creates session
POST /api/v1/auth/login
Response: Sets HTTP-only cookie

// Subsequent requests send cookie automatically
GET /api/v1/users/me
Cookie: sessionId=abc123

// Logout destroys session
POST /api/v1/auth/logout
```

## Rate Limiting

### Implementation
```typescript
// Response headers
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1700003600

// When limit exceeded
429 Too Many Requests
{
 "error": {
 "code": "RATE_LIMIT_EXCEEDED",
 "message": "Too many requests",
 "retryAfter": 60
 }
}
```

### Common Limits
```
- Public endpoints: 10-20 req/min per IP
- Auth endpoints: 5 req/min per IP
- Authenticated: 100-1000 req/min per user
- Search/expensive ops: 10 req/min per user
```

## Validation Patterns

### Request Validation
```typescript
// Input sanitization
- Trim whitespace
- Convert to lowercase (emails)
- Remove HTML tags (if not needed)
- Validate against schema

// Common validations
- Email: regex + DNS check
- Password: min length, complexity
- URL: valid format
- UUID: valid format
- Dates: valid ISO 8601
```

### Validation Errors Response
```typescript
{
 "error": {
 "code": "VALIDATION_ERROR",
 "message": "Validation failed",
 "details": [
 {
 "field": "email",
 "message": "Invalid email format",
 "code": "INVALID_FORMAT"
 },
 {
 "field": "password",
 "message": "Password must be at least 8 characters",
 "code": "MIN_LENGTH"
 }
 ]
 }
}
```

## Error Handling

### Standard Error Codes
```typescript
// Client errors (4xx)
VALIDATION_ERROR - Invalid input
UNAUTHORIZED - Not logged in
FORBIDDEN - No permission
NOT_FOUND - Resource doesn't exist
CONFLICT - Duplicate/conflict
RATE_LIMIT_EXCEEDED - Too many requests

// Server errors (5xx)
INTERNAL_ERROR - Generic server error
DATABASE_ERROR - DB operation failed
THIRD_PARTY_ERROR - External service failed
```

### Error Response Pattern
```typescript
{
 "error": {
 "code": "NOT_FOUND",
 "message": "Post not found",
 "requestId": "req_123", // For support
 "timestamp": "2024-11-16T..."
 }
}

// Include details in dev, hide in production
{
 "error": {
 "code": "DATABASE_ERROR",
 "message": "Operation failed",
 "details": process.env.NODE_ENV === 'development'
 ? { stack: "..." }
 : undefined
 }
}
```

## File Upload Patterns

### Single File
```typescript
POST /api/v1/users/:id/avatar
Content-Type: multipart/form-data

Response:
{
 "data": {
 "url": "https://cdn.example.com/avatars/...",
 "size": 102400,
 "mimeType": "image/jpeg"
 }
}
```

### Multiple Files
```typescript
POST /api/v1/posts/:id/images
Content-Type: multipart/form-data

Response:
{
 "data": [
 {
 "url": "https://...",
 "size": 102400,
 "mimeType": "image/jpeg"
 }
 ]
}
```

### Presigned URLs (internal pattern)
```typescript
// 1. Get upload URL
POST /api/v1/upload/presigned
Body: {
 "filename": "photo.jpg",
 "mimeType": "image/jpeg",
 "size": 102400
}
Response: {
 "uploadUrl": "https://internal...",
 "fileUrl": "https://cdn...",
 "expiresIn": 300
}

// 2. Upload directly to internal
PUT <uploadUrl>
Body: <file>

// 3. Confirm upload
POST /api/v1/posts/:id/images
Body: {
 "fileUrl": "https://cdn..."
}
```

## Webhooks Pattern

### Receiving Webhooks
```typescript
POST /api/v1/webhooks/stripe
Headers:
 Stripe-Signature: signature
Body: {
 "type": "payment_intent.succeeded",
 "data": {...}
}

// Verify signature
// Process async (queue)
// Return 200 immediately
Response: 200 OK
```

### Sending Webhooks
```typescript
// Store webhook subscriptions
{
 "url": "https://customer.com/webhook",
 "events": ["order.created", "order.shipped"],
 "secret": "whsec_..."
}

// Send webhook
POST <customer_url>
Headers:
 X-Webhook-Signature: signature
 X-Webhook-Event: order.created
Body: {
 "id": "evt_123",
 "type": "order.created",
 "data": {...},
 "timestamp": "..."
}
```

## Best Practices

1. **Versioning**: Use `/api/v1/` in URLs or `Accept: application/vnd.api.v1+json` header
2. **HTTPS Only**: Always use HTTPS in production
3. **CORS**: Configure properly for frontend origins
4. **Idempotency**: Support idempotency keys for POST requests
5. **Caching**: Use ETag/Last-Modified headers
6. **Compression**: Enable gzip/brotli
7. **Request IDs**: Generate unique ID per request for tracing
8. **Timeouts**: Set reasonable timeouts (30s typical)
9. **Graceful Errors**: Never expose stack traces in production
10. **API Docs**: Auto-generate from code (OpenAPI/Swagger)
