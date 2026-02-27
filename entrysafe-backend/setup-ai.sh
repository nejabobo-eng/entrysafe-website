#!/bin/bash

# Entry Safe Backend - AI Integration Setup Script

echo "🚀 Setting up Entry Safe AI Integration..."
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate || venv\Scripts\activate

# Install/Update dependencies
echo "📥 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚙️ Creating .env from .env.example..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Please update .env with your OpenAI API keys:"
    echo "   - OPENAI_KEY_ACCOUNTING"
    echo "   - OPENAI_KEY_DOCS"
    echo "   - OPENAI_KEY_PRICING"
    echo ""
else
    echo "✅ .env file already exists"
fi

# Test import
echo "🧪 Testing OpenAI installation..."
python -c "import openai; print('✅ OpenAI package installed successfully')" || echo "❌ OpenAI import failed"

echo ""
echo "✅ Setup complete!"
echo ""
echo "📚 Next steps:"
echo "   1. Update .env with your OpenAI API keys"
echo "   2. Run: python -m uvicorn app.main:app --reload"
echo "   3. Test: curl http://localhost:8000/api/ai/health"
echo ""
echo "📖 For full documentation, see: AI-INTEGRATION-GUIDE.md"
