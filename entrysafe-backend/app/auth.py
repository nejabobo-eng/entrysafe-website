from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth, credentials, initialize_app
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Firebase Admin SDK
FIREBASE_CREDENTIALS_PATH = os.getenv("FIREBASE_CREDENTIALS_PATH", "./firebase-admin.json")

try:
    if os.path.exists(FIREBASE_CREDENTIALS_PATH):
        cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
        initialize_app(cred)
        print("✅ Firebase Admin SDK initialized")
    else:
        print("⚠️  Firebase Admin SDK not initialized (credentials file not found)")
        print("   Authentication will work in development mode only")
except Exception as e:
    print(f"⚠️  Firebase Admin SDK initialization error: {e}")
    print("   Running in development mode without token verification")

security = HTTPBearer()

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify Firebase JWT token"""
    token = credentials.credentials
    
    try:
        # Verify the token with Firebase Admin SDK
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        print(f"Token verification error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_user(token_data: dict = Depends(verify_token)):
    """Get current user from token"""
    uid = token_data.get("uid")
    email = token_data.get("email")
    
    if not uid or not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    
    return {
        "uid": uid,
        "email": email,
        "email_verified": token_data.get("email_verified", False)
    }

async def require_admin(current_user: dict = Depends(get_current_user)):
    """Require admin role"""
    from app.database import get_database
    
    db = get_database()
    user_doc = await db.users.find_one({"uid": current_user["uid"]})
    
    if not user_doc or user_doc.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    return current_user
