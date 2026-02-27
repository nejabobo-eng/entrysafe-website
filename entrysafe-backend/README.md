# EntrySafe Backend API 🚀

Production-ready FastAPI backend for EntrySafe SaaS platform.

## Features

- ✅ **FastAPI** - Modern Python web framework
- ✅ **MongoDB** - Document database via Motor (async)
- ✅ **Firebase Auth** - JWT token verification
- ✅ **Role-Based Access** - Admin/Client separation
- ✅ **Document Management** - Upload/download with signed URLs
- ✅ **User Management** - CRUD operations
- ✅ **Admin Operations** - User & document management
- ✅ **CORS Enabled** - Frontend integration ready

---

## 📦 Installation

### Prerequisites

- Python 3.9+
- MongoDB (local or Atlas)
- Firebase Admin SDK credentials

### Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Firebase Admin SDK:**
   - Download your Firebase service account JSON from Firebase Console
   - Save as `firebase-admin.json` in backend root
   - Update `FIREBASE_CREDENTIALS_PATH` in `.env`

4. **MongoDB:**
   - Local: `mongodb://localhost:27017`
   - Atlas: Get connection string from MongoDB Atlas
   - Update `MONGODB_URL` in `.env`

---

## 🚀 Running the Server

### Development Mode:
```bash
python -m app.main
```

Or using uvicorn directly:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Production Mode:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

Server will start at: **http://localhost:8000**

API Docs: **http://localhost:8000/docs**

---

## 📡 API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/api/health` | Detailed health status |
| POST | `/api/contact` | Submit contact form |

### User Endpoints (Authentication Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/me` | Get current user profile |
| PUT | `/api/users/me` | Update current user profile |
| GET | `/api/users/stats` | Get user statistics |

### Document Endpoints (Authentication Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/documents/` | Get user's documents |
| GET | `/api/documents/{id}/download-url` | Get signed download URL |
| POST | `/api/documents/upload` | Upload document metadata |
| DELETE | `/api/documents/{id}` | Delete document |

### Admin Endpoints (Admin Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | Get all users |
| PUT | `/api/admin/users/{uid}/role` | Update user role |
| DELETE | `/api/admin/users/{uid}` | Delete user |
| GET | `/api/admin/actions` | Get admin action logs |
| GET | `/api/admin/stats` | Get platform statistics |
| GET | `/api/admin/documents` | Get all documents |

---

## 🔐 Authentication

All protected endpoints require a Firebase JWT token in the Authorization header:

```javascript
headers: {
  'Authorization': 'Bearer <firebase-id-token>'
}
```

### Getting a Token (Frontend):

```javascript
import { auth } from './lib/firebase'

const user = auth.currentUser
const token = await user.getIdToken()

// Use in API requests
fetch('http://localhost:8000/api/users/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

---

## 🗄️ Database Collections

### `users`
```javascript
{
  uid: string,              // Firebase UID
  email: string,
  role: "admin" | "client",
  emailVerified: boolean,
  createdAt: datetime,
  lastLogin: datetime
}
```

### `documents`
```javascript
{
  _id: ObjectId,
  filename: string,
  fileType: string,
  fileSize: number,
  userId: string,
  storagePath: string,
  uploadedAt: datetime,
  downloadUrl: string (optional)
}
```

### `contacts`
```javascript
{
  _id: ObjectId,
  name: string,
  email: string,
  phone: string (optional),
  message: string,
  submittedAt: datetime,
  status: "new" | "contacted" | "resolved"
}
```

### `admin_actions`
```javascript
{
  _id: ObjectId,
  adminId: string,
  action: string,
  targetUserId: string (optional),
  targetDocumentId: string (optional),
  details: object (optional),
  timestamp: datetime
}
```

### `downloads`
```javascript
{
  _id: ObjectId,
  documentId: string,
  userId: string,
  downloadedAt: datetime
}
```

---

## 🧪 Testing the API

### Using cURL:

```bash
# Health check
curl http://localhost:8000/api/health

# Get current user (requires token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8000/api/users/me

# Submit contact form
curl -X POST http://localhost:8000/api/contact \
     -H "Content-Type: application/json" \
     -d '{"name":"John","email":"john@test.com","message":"Hello"}'
```

### Using Interactive Docs:

Visit: **http://localhost:8000/docs**

FastAPI provides automatic interactive API documentation!

---

## 🔧 Environment Variables

### Required:
- `MONGODB_URL` - MongoDB connection string
- `MONGODB_DB_NAME` - Database name
- `FIREBASE_CREDENTIALS_PATH` - Path to Firebase Admin SDK JSON

### Optional:
- `API_HOST` - Server host (default: 0.0.0.0)
- `API_PORT` - Server port (default: 8000)
- `API_RELOAD` - Auto-reload in dev (default: True)
- `CORS_ORIGINS` - Allowed origins (default: http://localhost:5173)
- `ENVIRONMENT` - development/production

---

## 📁 Project Structure

```
entrysafe-backend/
├── app/
│   ├── main.py              ← FastAPI app
│   ├── database.py          ← MongoDB connection
│   ├── models.py            ← Pydantic models
│   ├── auth.py              ← JWT verification
│   └── routers/
│       ├── users.py         ← User endpoints
│       ├── documents.py     ← Document endpoints
│       └── admin.py         ← Admin endpoints
├── requirements.txt         ← Dependencies
├── .env                     ← Environment config
├── .env.example             ← Example config
└── README.md               ← This file
```

---

## 🚨 Common Issues & Solutions

### Issue: MongoDB connection error
**Solution:** Ensure MongoDB is running or check Atlas connection string

### Issue: Firebase token verification fails
**Solution:** 
- Verify `firebase-admin.json` exists
- Check `FIREBASE_CREDENTIALS_PATH` in `.env`
- Ensure token is valid (not expired)

### Issue: CORS errors
**Solution:** Add your frontend URL to `CORS_ORIGINS` in `.env`

### Issue: Module not found
**Solution:** 
```bash
pip install -r requirements.txt
```

---

## 🔒 Security Notes

### Development Mode:
- CORS allows `localhost:5173`
- Debug mode enabled
- Detailed error messages

### Production Mode:
- ✅ Use HTTPS only
- ✅ Restrict CORS origins
- ✅ Set `API_RELOAD=False`
- ✅ Use environment-specific configs
- ✅ Enable MongoDB authentication
- ✅ Use Firebase Admin SDK with service account

---

## 📊 Monitoring & Logs

### Health Check:
```bash
curl http://localhost:8000/api/health
```

### View Logs:
Server logs print to console showing:
- MongoDB connection status
- API requests
- Errors and warnings

---

## 🎯 Next Steps

1. **Test API endpoints** using `/docs`
2. **Connect frontend** to backend
3. **Set up Firebase Storage** for real document uploads
4. **Configure MongoDB Atlas** for production
5. **Deploy** to cloud (Railway, Render, AWS, etc.)

---

## 📞 Support

For issues or questions:
- Check `/docs` for API reference
- Review error logs
- Verify environment configuration

---

**Built with ❤️ for EntrySafe**
