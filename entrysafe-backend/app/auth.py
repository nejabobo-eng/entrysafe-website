from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth, credentials, initialize_app
import os
import json
from dotenv import load_dotenv

load_dotenv()

# Initialize Firebase Admin SDK with multiple fallback options
FIREBASE_CREDENTIALS_PATH = os.getenv("FIREBASE_CREDENTIALS_PATH", "./firebase-admin.json")
firebase_initialized = False

try:
    # Try loading from environment variable (for Render.com deployment)
    # Check both FIREBASE_ADMIN_CREDENTIALS and FIREBASE_ADMIN_JSON for flexibility
    firebase_creds_json = os.getenv("FIREBASE_ADMIN_CREDENTIALS") or os.getenv("FIREBASE_ADMIN_JSON")

    if firebase_creds_json:
        # Parse JSON from environment variable
        cred_dict = json.loads(firebase_creds_json)
        cred = credentials.Certificate(cred_dict)
        initialize_app(cred)
        firebase_initialized = True
        print("✅ Firebase Admin SDK initialized (from environment variable)")
        print(f"   Project ID: {cred_dict.get('project_id', 'unknown')}")
    elif os.path.exists(FIREBASE_CREDENTIALS_PATH):
        # Load from file (for local development)
        cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
        initialize_app(cred)
        firebase_initialized = True
        print(f"✅ Firebase Admin SDK initialized (from file: {FIREBASE_CREDENTIALS_PATH})")
    else:
        print(f"⚠️  Firebase credentials not found!")
        print(f"   Looking for:")
        print(f"   - Environment variable: FIREBASE_ADMIN_CREDENTIALS or FIREBASE_ADMIN_JSON")
        print(f"   - File at: {FIREBASE_CREDENTIALS_PATH}")
        print("   Authentication will fail!")
except ValueError as e:
    print(f"❌ Firebase Admin SDK initialization error - Invalid credentials format: {e}")
    print("   Check that the JSON is valid and properly escaped")
    print("   Ensure \\n characters in private_key are preserved")
except Exception as e:
    print(f"❌ Firebase Admin SDK initialization error: {e}")
    print("   Running without authentication - ALL REQUESTS WILL FAIL")

security = HTTPBearer()

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify Firebase JWT token with detailed error messages"""

    if not firebase_initialized:
        print("❌ Firebase not initialized - cannot verify tokens")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication service not configured",
        )

    token = credentials.credentials

    # Log token info for debugging (first 20 chars only)
    print(f"🔍 Verifying token: {token[:20]}...")

    try:
        # Verify the token with Firebase Admin SDK
        # check_revoked=True ensures the token hasn't been revoked
        decoded_token = auth.verify_id_token(token, check_revoked=True)

        uid = decoded_token.get('uid')
        email = decoded_token.get('email', 'unknown')

        print(f"✅ Token verified for user: {uid} ({email})")

        return decoded_token

    except auth.ExpiredIdTokenError:
        print(f"❌ Token expired for token: {token[:20]}...")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired. Please sign in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except auth.RevokedIdTokenError:
        print(f"❌ Token revoked for token: {token[:20]}...")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has been revoked. Please sign in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except auth.InvalidIdTokenError as e:
        print(f"❌ Invalid token format: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token format. Please sign in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except auth.UserDisabledError:
        print(f"❌ User account disabled")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account has been disabled",
        )
    except ValueError as e:
        print(f"❌ Token verification error - Invalid value: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        print(f"❌ Unexpected token verification error: {type(e).__name__}: {e}")
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
