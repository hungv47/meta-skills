# Authentication & Authorization Patterns

Common patterns for implementing auth in modern applications.

## Authentication Strategies

### 1. JWT (JSON Web Tokens)

**Best for:** Stateless APIs, mobile apps, microservices

```typescript
// Login endpoint
POST /api/auth/login
Body: { email, password }

// Generate tokens
const accessToken = jwt.sign(
 { userId, email, role },
 process.env.JWT_SECRET,
 { expiresIn: '15m' }
);

const refreshToken = jwt.sign(
 { userId, tokenVersion: user.tokenVersion },
 process.env.REFRESH_SECRET,
 { expiresIn: '7d' }
);

Response: {
 accessToken,
 refreshToken,
 expiresIn: 900
}

// Use access token
GET /api/users/me
Headers: Authorization: Bearer <accessToken>

// Middleware
const auth = (req, res, next) => {
 const token = req.headers.authorization?.split(' ')[1];
 try {
 const decoded = jwt.verify(token, process.env.JWT_SECRET);
 req.user = decoded;
 next();
 } catch (err) {
 res.status(401).json({ error: 'Invalid token' });
 }
};
```

**Pros:**
- Stateless (no DB lookup per request)
- Works across domains
- Mobile-friendly

**Cons:**
- Can't invalidate tokens immediately
- Token size larger than session ID
- Need refresh token strategy

### 2. Session-Based Auth

**Best for:** Traditional web apps, admin panels

```typescript
// Setup session middleware
import session from 'express-session';
import RedisStore from 'connect-redis';

app.use(session({
 store: new RedisStore({ client: redisClient }),
 secret: process.env.SESSION_SECRET,
 resave: false,
 saveUninitialized: false,
 cookie: {
 secure: true, // HTTPS only
 httpOnly: true, // No JS access
 maxAge: 24 * 60 * 60 * 1000, // 24 hours
 sameSite: 'lax'
 }
}));

// Login
POST /api/auth/login
req.session.userId = user.id;
req.session.save();

// Middleware
const auth = (req, res, next) => {
 if (!req.session.userId) {
 return res.status(401).json({ error: 'Not authenticated' });
 }
 next();
};

// Logout
POST /api/auth/logout
req.session.destroy();
```

**Pros:**
- Can invalidate immediately
- Smaller cookie size
- Easy to implement

**Cons:**
- Requires session store (Redis)
- Harder to scale
- Not great for mobile

### 3. OAuth 2.0 / Social Login

**Best for:** Consumer apps, quick onboarding

```typescript
// Using Clerk
import { ClerkProvider, SignIn, SignUp, UserButton } from 'practitioner source/nextjs';

// Or manual OAuth flow
// 1. Redirect to provider
GET https://github.com/login/oauth/authorize?
 client_id=...&
 redirect_uri=...&
 scope=user:email

// 2. Handle callback
GET /api/auth/callback/github?code=...

// Exchange code for token
const { access_token } = await fetch('https://github.com/login/oauth/access_token', {
 method: 'POST',
 body: { code, client_id, client_secret }
});

// Get user info
const user = await fetch('https://api.github.com/user', {
 headers: { Authorization: `Bearer ${access_token}` }
});

// Create or update user in DB
// Create session/token
```

**Providers:**
- Google (most common)
- GitHub (developers)
- Facebook (social apps)
- Apple (iOS apps)

### 4. Magic Links (Passwordless)

**Best for:** B2B SaaS, low-friction auth

```typescript
// Request magic link
POST /api/auth/magic-link
Body: { email }

// Generate token
const token = crypto.randomBytes(32).toString('hex');
await db.insert({
 email,
 token,
 expiresAt: Date.now() + 15 * 60 * 1000 // 15 min
});

// Send email
await sendEmail({
 to: email,
 subject: 'Login to App',
 body: `Click here: ${APP_URL}/auth/verify?token=${token}`
});

// Verify token
GET /api/auth/verify?token=...
const record = await db.findByToken(token);
if (!record || record.expiresAt < Date.now()) {
 return error;
}
// Create session
req.session.userId = record.userId;
```

## Authorization Patterns

### 1. Role-Based Access Control (RBAC)

**Best for:** Most applications

```typescript
// Define roles
enum Role {
 USER = 'user',
 ADMIN = 'admin',
 MODERATOR = 'moderator'
}

// User table
CREATE TABLE users (
 id UUID PRIMARY KEY,
 email VARCHAR(255),
 role VARCHAR(50) DEFAULT 'user'
);

// Middleware
const requireRole = (allowedRoles: Role[]) => {
 return (req, res, next) => {
 if (!allowedRoles.includes(req.user.role)) {
 return res.status(403).json({ error: 'Forbidden' });
 }
 next();
 };
};

// Usage
app.delete('/api/users/:id',
 auth,
 requireRole([Role.ADMIN]),
 deleteUser
);
```

### 2. Permission-Based

**Best for:** Complex enterprise apps

```typescript
// Permissions table
CREATE TABLE permissions (
 id UUID PRIMARY KEY,
 name VARCHAR(100) UNIQUE -- 'posts:create', 'users:delete'
);

CREATE TABLE role_permissions (
 role_id UUID REFERENCES roles(id),
 permission_id UUID REFERENCES permissions(id)
);

// Check permission
const hasPermission = async (userId, permission) => {
 const result = await db.query(`
 SELECT 1 FROM users u
 JOIN role_permissions rp ON u.role_id = rp.role_id
 JOIN permissions p ON rp.permission_id = p.id
 WHERE u.id = $1 AND p.name = $2
 `, [userId, permission]);
 return result.rows.length > 0;
};

// Middleware
const requirePermission = (permission) => {
 return async (req, res, next) => {
 const allowed = await hasPermission(req.user.id, permission);
 if (!allowed) {
 return res.status(403).json({ error: 'Forbidden' });
 }
 next();
 };
};
```

### 3. Resource Ownership

**Best for:** User-generated content

```typescript
// Check ownership
const isOwner = async (req, res, next) => {
 const post = await db.posts.findById(req.params.id);

 if (!post) {
 return res.status(404).json({ error: 'Not found' });
 }

 if (post.userId !== req.user.id && req.user.role !== 'admin') {
 return res.status(403).json({ error: 'Forbidden' });
 }

 req.post = post;
 next();
};

// Usage
app.patch('/api/posts/:id',
 auth,
 isOwner,
 updatePost
);
```

### 4. Organization/Team-Based

**Best for:** B2B SaaS with teams

```typescript
// Check org membership
const requireOrgMembership = async (req, res, next) => {
 const { orgId } = req.params;

 const member = await db.query(`
 SELECT role FROM organization_members
 WHERE organization_id = $1 AND user_id = $2
 `, [orgId, req.user.id]);

 if (!member.rows.length) {
 return res.status(403).json({ error: 'Not a member' });
 }

 req.orgRole = member.rows[0].role;
 next();
};

// Check org role
const requireOrgRole = (allowedRoles) => {
 return (req, res, next) => {
 if (!allowedRoles.includes(req.orgRole)) {
 return res.status(403).json({ error: 'Insufficient permissions' });
 }
 next();
 };
};

// Usage
app.post('/api/orgs/:orgId/members',
 auth,
 requireOrgMembership,
 requireOrgRole(['owner', 'admin']),
 addMember
);
```

## Security Best Practices

### Password Security

```typescript
import bcrypt from 'bcrypt';

// Hash password
const hashPassword = async (password: string) => {
 const saltRounds = 10;
 return await bcrypt.hash(password, saltRounds);
};

// Verify password
const verifyPassword = async (password: string, hash: string) => {
 return await bcrypt.compare(password, hash);
};

// Password requirements
const validatePassword = (password: string) => {
 return (
 password.length >= 8 &&
 /[A-Z]/.test(password) && // Uppercase
 /[a-z]/.test(password) && // Lowercase
 /[0-9]/.test(password) && // Number
 /[^A-Za-z0-9]/.test(password) // Special char
 );
};
```

### Token Storage

```typescript
// Frontend - Access token
// Store in memory (React state) - most secure
const [accessToken, setAccessToken] = useState('');

// Or sessionStorage (lost on tab close)
sessionStorage.setItem('accessToken', token);

// NEVER localStorage for sensitive tokens

// Refresh token
// HTTP-only cookie (set by backend)
res.cookie('refreshToken', token, {
 httpOnly: true,
 secure: true,
 sameSite: 'strict',
 maxAge: 7 * 24 * 60 * 60 * 1000
});
```

### CSRF Protection

```typescript
import csrf from 'csurf';

// Session-based apps
app.use(csrf({ cookie: true }));

// Send token to frontend
app.get('/api/csrf-token', (req, res) => {
 res.json({ csrfToken: req.csrfToken() });
});

// Frontend includes token
fetch('/api/endpoint', {
 method: 'POST',
 headers: {
 'CSRF-Token': csrfToken
 }
});
```

### Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

// Login endpoint
const loginLimiter = rateLimit({
 windowMs: 15 * 60 * 1000, // 15 minutes
 max: 5, // 5 attempts
 message: 'Too many login attempts'
});

app.post('/api/auth/login', loginLimiter, login);

// Per-user rate limiting
const userLimiter = rateLimit({
 windowMs: 15 * 60 * 1000,
 max: 100,
 keyGenerator: (req) => req.user.id
});
```

### Token Invalidation

```typescript
// JWT with token versioning
CREATE TABLE users (
 id UUID PRIMARY KEY,
 token_version INTEGER DEFAULT 0
);

// Generate token
const token = jwt.sign(
 { userId, tokenVersion: user.tokenVersion },
 secret
);

// Verify includes version check
const decoded = jwt.verify(token, secret);
const user = await db.users.findById(decoded.userId);
if (decoded.tokenVersion !== user.tokenVersion) {
 throw new Error('Token invalid');
}

// Invalidate all tokens
await db.users.update(userId, {
 tokenVersion: user.tokenVersion + 1
});
```

### Two-Factor Authentication

```typescript
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

// Generate secret
const secret = speakeasy.generateSecret({
 name: 'App Name (user@email.com)'
});

// Show QR code to user
const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

// Save secret (encrypted)
await db.users.update(userId, {
 twoFactorSecret: encrypt(secret.base32)
});

// Verify TOTP
const verified = speakeasy.totp.verify({
 secret: decrypt(user.twoFactorSecret),
 encoding: 'base32',
 token: req.body.code,
 window: 2 // Allow 2 steps before/after
});
```

## Common Auth Flows

### Registration
```
1. POST /api/auth/register
 - Validate input
 - Check if email exists
 - Hash password
 - Create user
 - Send verification email
 - Return tokens OR require email verification

2. GET /api/auth/verify-email?token=...
 - Verify token
 - Mark email as verified
 - Return tokens
```

### Login
```
1. POST /api/auth/login
 - Validate input
 - Find user by email
 - Verify password
 - Check email verified (if required)
 - Check 2FA (if enabled)
 - Generate tokens
 - Return tokens
```

### Password Reset
```
1. POST /api/auth/forgot-password
 - Validate email
 - Generate reset token
 - Send email with link

2. POST /api/auth/reset-password
 - Verify token
 - Validate new password
 - Hash password
 - Update user
 - Invalidate all sessions
```

### Token Refresh
```
1. POST /api/auth/refresh
 - Verify refresh token
 - Check token version
 - Generate new access token
 - Optionally rotate refresh token
 - Return new tokens
```

## Quick Decision Guide

**Choose JWT when:**
- Building API for mobile apps
- Need stateless auth
- Microservices architecture
- Can accept delayed token invalidation

**Choose Sessions when:**
- Traditional web app
- Need immediate logout
- Fine with Redis dependency
- Admin panels

**Choose OAuth when:**
- Consumer app
- Want social login
- Quick onboarding priority

**Choose Magic Links when:**
- B2B SaaS
- Security priority
- No password management needed
