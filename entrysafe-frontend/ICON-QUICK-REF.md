# 🎯 Quick Icon Generator Reference

## 🚀 Fastest Method

### For Website (Entry Safe Website)
1. Go to: https://www.icoconverter.com
2. Upload your square logo icon
3. Download `favicon.ico`
4. Save to `entrysafe-frontend/public/favicon.ico`

### For Flutter Apps (All 4 Apps)
1. Go to: https://www.appicon.co
2. Upload your square logo (1024x1024)
3. Select "Android"
4. Download ZIP
5. Extract to Flutter project

---

## 📁 What You Need

**From Your Logo:**
- Square icon version (the rounded one you showed)
- Should be at least 1024x1024px
- PNG format with transparent background

**Export As:**
- `logo-icon.png` (1024x1024) for Flutter
- `favicon.ico` (32x32) for website

---

## 🎨 Online Tools (All Free)

| Tool | URL | Best For |
|------|-----|----------|
| AppIcon.co | https://www.appicon.co | Flutter/Android icons |
| ICO Converter | https://www.icoconverter.com | Website favicon |
| Icon Kitchen | https://icon.kitchen | Android adaptive icons |
| MakeAppIcon | https://makeappicon.com | All platforms |

---

## ⚡ 2-Minute Setup

```bash
# 1. Generate favicon.ico
Visit: https://www.icoconverter.com
Upload square logo → Download ICO

# 2. Save to website
Save to: entrysafe-frontend/public/favicon.ico

# 3. Start dev server
cd entrysafe-frontend
npm run dev

# 4. Test
Visit: http://localhost:5173
Check browser tab for favicon
```

---

## 📦 What Goes Where

```
Website:
  public/
    logo-full.png     ← Horizontal logo (navbar)
    logo-icon.png     ← Square icon (general)
    favicon.ico       ← Browser tab icon

Flutter Apps:
  android/app/src/main/res/
    mipmap-*/ic_launcher.png  ← Generated from AppIcon.co
```

---

**🎨 That's it! Simple and fast.** 🚀
