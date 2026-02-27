# 🚀 EntrySafe Backend - Quick Start Guide

## ✅ Server is Running!

**Backend:** http://localhost:8000  
**API Docs:** http://localhost:8000/docs  
**Frontend:** http://localhost:5173 (if started)

---

## 🧪 Quick Tests

### Test 1: Health Check
Open browser: http://localhost:8000/api/health

Or in PowerShell:
```powershell
curl http://localhost:8000/api/health
```

### Test 2: Contact Form (No Auth)
```powershell
curl -X POST http://localhost:8000/api/contact `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Test User\",\"email\":\"test@example.com\",\"message\":\"Hello from backend!\"}'
```

### Test 3: Interactive Documentation
Open: http://localhost:8000/docs
- Click any endpoint → "Try it out" → Execute

---

## 🔗 Next: Connect Frontend to Backend

### Create API Service (entrysafe-frontend/src/services/api.js):

```javascript
import axios from 'axios';
import { auth } from '../lib/firebase';

const api = axios.create({
  baseURL: 'http://localhost:8000/api'
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Use in Components:

```javascript
import api from '../services/api';

// Get current user from backend
const response = await api.get('/users/me');
console.log(response.data);

// Get user stats
const stats = await api.get('/users/stats');
console.log(stats.data);
```

---

## 📊 What's Available

### Public Endpoints (No Token):
- `GET /` - Health check
- `GET /api/health` - Detailed status
- `POST /api/contact` - Contact form

### User Endpoints (JWT Required):
- `GET /api/users/me` - Current user profile
- `PUT /api/users/me` - Update profile
- `GET /api/users/stats` - User statistics
- `GET /api/documents/` - List documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/{id}/download-url` - Get download URL
- `DELETE /api/documents/{id}` - Delete document

### Admin Endpoints (Admin + JWT):
- `GET /api/admin/users` - All users
- `PUT /api/admin/users/{uid}/role` - Update role
- `DELETE /api/admin/users/{uid}` - Delete user
- `GET /api/admin/stats` - Platform stats
- `GET /api/admin/documents` - All documents

---

## 🛠️ Development Commands

### Backend:
```powershell
cd entrysafe-backend
python -m uvicorn app.main:app --reload
```

### Frontend (New Terminal):
```powershell
cd entrysafe-frontend
npm run dev
```

### MongoDB (If Local):
```powershell
mongod
```

---

## 🔐 Getting JWT Token for Testing

### From Frontend:
1. Log in to http://localhost:5173
2. Open DevTools → Console
3. Run:
```javascript
const user = firebase.auth().currentUser;
const token = await user.getIdToken();
console.log(token);
```
4. Copy token
5. Use in API requests: `Authorization: Bearer <token>`

---

## 🎯 Status

| Component | Status | URL |
|-----------|--------|-----|
| Backend API | ✅ Running | http://localhost:8000 |
| API Docs | ✅ Available | http://localhost:8000/docs |
| MongoDB | ✅ Connected | localhost:27017 |
| Firebase SDK | ✅ Initialized | - |
| Frontend | ⚠️ Not Started | Run `npm run dev` |

---

## 📁 What Was Built

**Total Backend Files:** 13  
**Total Endpoints:** 15+  
**Database Collections:** 5  
**Lines of Code:** ~1,500+

---

## 🎉 You Now Have:

✅ Phase 1: Firebase Authentication  
✅ Phase 2: Role-Based Access Control  
✅ Phase 3: Professional Navbar  
✅ Phase 4: Tailwind CSS Styling  
✅ Phase 5: FastAPI Backend **← COMPLETE!**

---

## 🚀 Next Steps:

1. ✅ Test API with Swagger UI (http://localhost:8000/docs)
2. ⏭️ Create frontend API service layer
3. ⏭️ Connect frontend components to backend
4. ⏭️ Implement document upload UI
5. ⏭️ Build admin user management
6. ⏭️ Deploy to production

---

**Built with ❤️ for EntrySafe**

**Your backend is LIVE! Time to connect it to the beautiful frontend!** 🔥
