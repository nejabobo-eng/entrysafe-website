# 🎨 Entry Safe Logo Integration Guide

## 📋 Logo Files Needed

You'll need to save your logo in these formats:

### 1. Full Logo (with text)
**File:** `logo-full.png`
- **Size:** 800x200px (recommended)
- **Format:** PNG with transparent background
- **Usage:** Navbar, headers, main branding

### 2. Icon Logo (shield only)
**File:** `logo-icon.png`
- **Size:** 512x512px (square)
- **Format:** PNG with transparent background
- **Usage:** Favicon, app icons, small spaces

### 3. Favicon (browser tab icon)
**File:** `favicon.ico`
- **Size:** 32x32px
- **Format:** ICO or PNG
- **Usage:** Browser tab icon

---

## 📁 Where to Save Logo Files

### Option 1: Public Folder (Recommended)
```
entrysafe-frontend/
  public/
    logo-full.png      ← Full logo with text
    logo-icon.png      ← Shield icon only
    favicon.ico        ← Browser favicon
```

**Why public folder?**
- Direct access via `/logo-full.png`
- No import needed
- Easier to update

### Option 2: Assets Folder
```
entrysafe-frontend/
  src/
    assets/
      logo-full.png
      logo-icon.png
```

Then import in components:
```jsx
import logoFull from '../assets/logo-full.png'
```

---

## 🎨 How to Export Logo from Your Design

### From the image you showed:

**Full Logo (horizontal):**
1. Select the full logo with text (shield + "EntrySafe")
2. Export as PNG, 800x200px
3. Ensure transparent background
4. Save as `logo-full.png`

**Icon Logo (shield only):**
1. Select just the shield with keyhole
2. Export as PNG, 512x512px (square)
3. Ensure transparent background
4. Save as `logo-icon.png`

**App Icon (rounded square):**
1. Use the rounded square version you showed
2. Export as PNG, 512x512px
3. Save as `logo-app-icon.png`

---

## 🛠️ Quick Setup Steps

### 1. Create Public Folder (if not exists)
```bash
cd entrysafe-frontend
mkdir public  # if doesn't exist
```

### 2. Save Your Logo Files
Save these 3 files to `entrysafe-frontend/public/`:
- `logo-full.png` (horizontal logo with text)
- `logo-icon.png` (shield icon only)
- `favicon.ico` (browser tab icon)

### 3. Update index.html (optional)
Update `entrysafe-frontend/index.html` to use your favicon:

```html
<head>
  <link rel="icon" type="image/png" href="/logo-icon.png" />
  <title>Entry Safe - Secure Business Management</title>
</head>
```

### 4. Verify Logo Loads
Start your dev server:
```bash
cd entrysafe-frontend
npm run dev
```

Visit http://localhost:5173 and you should see your logo in the navbar!

---

## 🎨 Logo Component Usage

The Logo component is already created and supports 2 variants:

### Full Logo (with text)
```jsx
import Logo from './components/Logo'

<Logo className="h-10 w-auto" variant="full" />
```

### Icon Only (shield)
```jsx
<Logo className="h-8 w-8" variant="icon" />
```

---

## 📐 Recommended Sizes

| Location | Size | Variant |
|----------|------|---------|
| Navbar | h-10 (40px) | full |
| Footer | h-8 (32px) | full |
| Mobile Menu | h-8 (32px) | full |
| Favicon | 32x32px | icon |
| Login Page | h-16 (64px) | full |
| Hero Section | h-20 (80px) | full |

---

## 🎨 Logo Color Variants

Your logo has:
- **Blue** (#0066CC) for "Entry"
- **Green** (#4CAF50) for "Safe"
- **Shield gradient** (Blue to Green)

**Usage:**
- **Default:** Full color (navbar, hero)
- **White version:** For dark backgrounds (if needed)
- **Icon only:** Small spaces, favicons

---

## 🖼️ Creating Logo Files (Quick Guide)

### Using Canva (Free)
1. Upload your logo image
2. Resize canvas to 800x200px (full logo)
3. Download as PNG (transparent background)
4. Repeat for 512x512px (icon)

### Using Figma (Free)
1. Import your logo
2. Create frame 800x200px
3. Export as PNG 2x
4. Enable transparent background

### Using GIMP (Free)
1. Open logo image
2. Image → Scale Image → 800x200px
3. File → Export As → PNG
4. Save with transparency

### Using Online Tool
1. Go to https://www.remove.bg (remove background if needed)
2. Use https://www.resizeimage.net for sizing
3. Download PNG with transparency

---

## ✅ Checklist

- [ ] Export full logo (800x200px)
- [ ] Export icon logo (512x512px)
- [ ] Save to `entrysafe-frontend/public/`
- [ ] Update favicon in index.html
- [ ] Test in dev mode (`npm run dev`)
- [ ] Check navbar logo displays
- [ ] Check mobile responsive
- [ ] Check favicon in browser tab

---

## 🚀 Quick Test

After saving your logo files:

```bash
# Start frontend
cd entrysafe-frontend
npm run dev

# Open browser
http://localhost:5173

# You should see:
# ✅ Your logo in the navbar
# ✅ Favicon in browser tab
# ✅ Logo clickable to home page
```

---

## 🎨 Advanced: Multiple Logo Variants

If you want different logos for different themes:

```jsx
// Logo.jsx - Advanced version
export default function Logo({ className, variant = "full", theme = "default" }) {
  const logoMap = {
    full: {
      default: "/logo-full.png",
      white: "/logo-full-white.png",
      dark: "/logo-full-dark.png"
    },
    icon: {
      default: "/logo-icon.png",
      white: "/logo-icon-white.png"
    }
  }

  const logoSrc = logoMap[variant]?.[theme] || logoMap[variant]?.default

  return <img src={logoSrc} alt="Entry Safe" className={className} />
}
```

---

## 📞 Need Help?

**Can't export the logo?**
- Send me the full-resolution image
- I can provide exact export settings

**Logo not showing?**
- Check file path: `entrysafe-frontend/public/logo-full.png`
- Restart dev server
- Check browser console for errors

---

**🎨 Your professional logo is ready to shine on Entry Safe!** 🚀
