@echo off
REM Entry Safe Backend - AI Integration Setup Script for Windows

echo ============================================
echo 🚀 Setting up Entry Safe AI Integration...
echo ============================================
echo.

REM Check if virtual environment exists
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔄 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install/Update dependencies
echo 📥 Installing dependencies...
python -m pip install --upgrade pip
pip install -r requirements.txt

REM Check if .env exists
if not exist ".env" (
    echo ⚙️ Creating .env from .env.example...
    copy .env.example .env
    echo.
    echo ⚠️  IMPORTANT: Please update .env with your OpenAI API keys:
    echo    - OPENAI_KEY_ACCOUNTING
    echo    - OPENAI_KEY_DOCS
    echo    - OPENAI_KEY_PRICING
    echo.
) else (
    echo ✅ .env file already exists
)

REM Test import
echo 🧪 Testing OpenAI installation...
python -c "import openai; print('✅ OpenAI package installed successfully')" 2>nul || echo ❌ OpenAI import failed

echo.
echo ============================================
echo ✅ Setup complete!
echo ============================================
echo.
echo 📚 Next steps:
echo    1. Update .env with your OpenAI API keys
echo    2. Run: python -m uvicorn app.main:app --reload
echo    3. Test: curl http://localhost:8000/api/ai/health
echo.
echo 📖 For full documentation, see: AI-INTEGRATION-GUIDE.md
echo.
pause
