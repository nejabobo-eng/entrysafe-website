# 📞 Contact API - Testing Guide

## ✅ What Was Improved

### Before:
- ❌ Contact endpoint defined inline in `main.py`
- ❌ Using generic `dict` for request (no validation)
- ❌ Manual field extraction with `.get()`
- ❌ No proper Swagger tags
- ❌ Duplicate code

### After:
- ✅ Dedicated `contact.py` router with proper organization
- ✅ Pydantic `ContactForm` model with validation
- ✅ `EmailStr` validation for email fields
- ✅ Properly tagged for Swagger UI (shows under "Contact")
- ✅ Clean separation of concerns
- ✅ Better error handling

---

## 📡 New Contact Endpoints

### 1. Submit Contact Form (Public)
```http
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+27123456789",  // Optional
  "message": "I need help with my business setup"
}
```

**Response:**
```json
{
  "message": "Contact form submitted successfully",
  "id": "65a1b2c3d4e5f6789"
}
```

---

### 2. Get All Contacts (Admin)
```http
GET /api/contacts?skip=0&limit=50&status=new
```

**Query Parameters:**
- `skip` - Pagination offset (default: 0)
- `limit` - Max results (default: 50)
- `status` - Filter by status: new, contacted, resolved

**Response:**
```json
{
  "total": 150,
  "contacts": [
    {
      "_id": "65a1b2c3d4e5f6789",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+27123456789",
      "message": "I need help...",
      "submittedAt": "2025-01-15T10:30:00Z",
      "status": "new"
    }
  ],
  "skip": 0,
  "limit": 50
}
```

---

### 3. Get Single Contact by ID
```http
GET /api/contacts/{contact_id}
```

**Response:**
```json
{
  "_id": "65a1b2c3d4e5f6789",
  "name": "John Doe",
  "email": "john@example.com",
  "message": "...",
  "status": "new"
}
```

---

### 4. Update Contact Status (Admin)
```http
PUT /api/contacts/{contact_id}/status
Content-Type: application/json

{
  "status": "contacted"
}
```

**Valid Statuses:**
- `new` - Just submitted
- `contacted` - Admin reached out
- `resolved` - Issue resolved

**Response:**
```json
{
  "message": "Contact status updated successfully"
}
```

---

## 🧪 Test the Contact API

### Using Swagger UI:

1. **Open:** http://localhost:8000/docs
2. **Look for "Contact" tag** (should be clearly visible now!)
3. **Expand POST /api/contact**
4. **Click "Try it out"**
5. **Fill in the form:**
   ```json
   {
     "name": "Test User",
     "email": "test@example.com",
     "message": "Testing the contact form!"
   }
   ```
6. **Click "Execute"**
7. **See the response!** ✅

---

### Using cURL:

```powershell
# Submit contact form
curl -X POST http://localhost:8000/api/contact `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"John Doe\",\"email\":\"john@test.com\",\"phone\":\"+27123456789\",\"message\":\"I need help with business registration\"}'

# Get all contacts
curl http://localhost:8000/api/contacts

# Get specific contact
curl http://localhost:8000/api/contacts/65a1b2c3d4e5f6789

# Update status
curl -X PUT http://localhost:8000/api/contacts/65a1b2c3d4e5f6789/status `
  -H "Content-Type: application/json" `
  -d '"contacted"'
```

---

### Using Python:

```python
import requests

# Submit contact form
response = requests.post(
    'http://localhost:8000/api/contact',
    json={
        'name': 'Jane Smith',
        'email': 'jane@example.com',
        'message': 'Need help with accounting'
    }
)
print(response.json())
# Output: {'message': 'Contact form submitted successfully', 'id': '...'}

# Get all contacts
contacts = requests.get('http://localhost:8000/api/contacts').json()
print(f"Total contacts: {contacts['total']}")
```

---

## 🎨 Swagger UI Improvements

The contact endpoints now appear under the **"Contact"** tag in Swagger UI with:

- ✅ Clean organization
- ✅ Proper request/response models
- ✅ Email validation highlighted
- ✅ Optional fields marked
- ✅ Descriptive documentation

---

## 🔒 Security Notes

### Current Setup (Development):
- ⚠️ Contact endpoints are **PUBLIC** (no authentication required)
- ⚠️ Anyone can submit contacts
- ⚠️ Anyone can view all contacts (GET /api/contacts)

### Recommended for Production:
```python
# Add authentication to admin endpoints
from app.auth import get_current_user, require_admin

@router.get("/contacts")
async def get_contact_submissions(
    user: dict = Depends(require_admin),  # ← Add this
    skip: int = 0,
    limit: int = 50
):
    # ... rest of code
```

---

## 📊 Database Schema

### Contact Document:
```javascript
{
  _id: ObjectId("65a1b2c3d4e5f6789"),
  name: "John Doe",
  email: "john@example.com",
  phone: "+27123456789",        // Optional
  message: "I need help with...",
  submittedAt: ISODate("2025-01-15T10:30:00Z"),
  status: "new",                 // new | contacted | resolved
  updatedAt: ISODate("2025-01-15T11:00:00Z")  // Added on status update
}
```

---

## 🎯 What's Next?

### Frontend Integration:

Create `entrysafe-frontend/src/pages/Contact.jsx`:

```javascript
import { useState } from 'react';
import axios from 'axios';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(
        'http://localhost:8000/api/contact',
        formData
      );
      
      setStatus('success');
      console.log('Contact submitted:', response.data);
      
      // Reset form
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      setStatus('error');
      console.error('Error:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-navy mb-6">Contact Us</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
          className="w-full p-3 border rounded-lg"
        />
        
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
          className="w-full p-3 border rounded-lg"
        />
        
        <input
          type="tel"
          placeholder="Phone (optional)"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className="w-full p-3 border rounded-lg"
        />
        
        <textarea
          placeholder="Message"
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          required
          rows={5}
          className="w-full p-3 border rounded-lg"
        />
        
        <button
          type="submit"
          className="w-full bg-navy text-white py-3 rounded-lg hover:bg-navy-dark"
        >
          Send Message
        </button>
        
        {status === 'success' && (
          <div className="bg-green-100 text-green-800 p-3 rounded">
            Message sent successfully!
          </div>
        )}
        
        {status === 'error' && (
          <div className="bg-red-100 text-red-800 p-3 rounded">
            Failed to send message. Please try again.
          </div>
        )}
      </form>
    </div>
  );
}

export default Contact;
```

---

## ✅ Files Modified

- ✅ `app/routers/contact.py` - **NEW** dedicated contact router
- ✅ `app/main.py` - Cleaned up, removed inline endpoints
- ✅ Auto-reload detected changes (server restarted automatically)

---

## 🎉 Success!

Your contact API is now:
- ✅ Properly organized in its own router
- ✅ Validated with Pydantic models
- ✅ Clearly visible in Swagger UI under "Contact" tag
- ✅ Ready for frontend integration

**Open http://localhost:8000/docs and check the Contact section!** 🚀
