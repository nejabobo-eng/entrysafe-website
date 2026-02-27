# 🪟 Entry Safe - Windows App Icon (ICO) Guide

## 📋 What You Need

For Windows desktop apps (C#/.NET/WPF), you need an **ICO file** containing multiple icon sizes.

---

## 🎯 ICO File Requirements

### Standard Windows ICO
An ICO file should contain these sizes:
- 16x16 (small icons, list view)
- 32x32 (default icon size)
- 48x48 (large icons)
- 64x64 (extra large)
- 128x128 (jumbo icons)
- 256x256 (Windows 10/11 high DPI)

**Single file contains all sizes!**

---

## 🚀 Quick Method: Online Converter

### Best Tool: IcoConverter (FREE)

1. **Go to:** https://www.icoconverter.com

2. **Upload** your square logo icon (the rounded shield version)
   - Minimum size: 256x256px
   - Recommended: 512x512px or 1024x1024px

3. **Select sizes** (check all):
   - ✅ 16x16
   - ✅ 32x32
   - ✅ 48x48
   - ✅ 64x64
   - ✅ 128x128
   - ✅ 256x256

4. **Download** `favicon.ico` (rename to `app-icon.ico`)

5. **Done!** One file with all sizes embedded.

---

## 🛠️ Alternative Online Tools

### Option 2: ConvertICO
**URL:** https://convertico.com
- Upload PNG
- Select all sizes
- Download ICO

### Option 3: ICO Convert
**URL:** https://icoconvert.com
- Drag & drop PNG
- Auto-generates all sizes
- Download multi-size ICO

### Option 4: Favicon.io
**URL:** https://favicon.io/favicon-converter/
- Upload image
- Downloads complete package
- Includes ICO + PNGs

---

## 💻 Desktop Software (If You Prefer)

### GIMP (Free)
1. Download: https://www.gimp.org
2. Open your logo icon
3. Image → Scale Image → 256x256px
4. File → Export As → `app-icon.ico`
5. Check "Compressed (RLE)"
6. Select sizes: 16, 32, 48, 64, 128, 256
7. Export

### IrfanView (Free - Windows only)
1. Download: https://www.irfanview.com
2. Open logo icon
3. Image → Resize/Resample → 256x256
4. File → Save As → ICO format
5. Select "Save as multi-resolution icon"
6. Choose sizes: 16, 32, 48, 64, 128, 256
7. Save

---

## 📁 Where to Place ICO in Windows Projects

### For WPF App (.NET)

```
Entry-Safe-Accounting-Windows/
  Properties/
    app-icon.ico      ← Place here
  App.xaml
  MainWindow.xaml
```

### For WinForms App

```
Entry-Safe-Accounting-Windows/
  Resources/
    app-icon.ico      ← Place here
  Program.cs
  Form1.cs
```

---

## ⚙️ Configure Windows App to Use Icon

### WPF Application

#### 1. Add to Project
Right-click project → Add → Existing Item → Select `app-icon.ico`

#### 2. Update Project Properties
Double-click `.csproj` file and add:

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net8.0-windows</TargetFramework>
    <UseWPF>true</UseWPF>
    <ApplicationIcon>Properties\app-icon.ico</ApplicationIcon>
  </PropertyGroup>
</Project>
```

#### 3. Update App.xaml (for window icon)
```xml
<Application x:Class="EntrySafe.App"
             xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
             xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
             StartupUri="MainWindow.xaml">
</Application>
```

#### 4. Update MainWindow.xaml
```xml
<Window x:Class="EntrySafe.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="Entry Safe Accounting"
        Height="600" Width="900"
        Icon="Properties/app-icon.ico">
    <!-- Your content -->
</Window>
```

---

### WinForms Application

#### 1. Add to Project
Right-click project → Add → Existing Item → Select `app-icon.ico`

#### 2. Set Application Icon
- Right-click project → Properties
- Application → Resources → Icon
- Browse and select `app-icon.ico`
- Save

#### 3. Set Form Icon (in Form1.cs)
```csharp
public partial class Form1 : Form
{
    public Form1()
    {
        InitializeComponent();
        this.Icon = new Icon("Resources/app-icon.ico");
    }
}
```

---

## 📦 ICO Files for All Your Apps

You'll need one ICO file for each Windows app:

| App | Filename | Location |
|-----|----------|----------|
| Entry Safe Accounting | `app-icon-accounting.ico` | Windows project |
| Entry Safe Docs | `app-icon-docs.ico` | Windows project |
| Entry Safe Pricing | `app-icon-pricing.ico` | Windows project |
| SD Storage Helper | `app-icon-sdstorage.ico` | Windows project |

**Tip:** You can use the same logo for all 4 apps, or create variations if needed.

---

## 🎨 Create ICO from Your Logo

### From Your Shield Logo Image

1. **Prepare the square icon version**
   - Use the rounded square shield icon you showed
   - Should be at least 256x256px
   - PNG format with transparent background

2. **Go to IcoConverter**
   - https://www.icoconverter.com

3. **Upload the icon**

4. **Select all sizes:**
   - 16x16 ✅
   - 32x32 ✅
   - 48x48 ✅
   - 64x64 ✅
   - 128x128 ✅
   - 256x256 ✅

5. **Download**
   - Filename: `app-icon.ico`

6. **Copy to Windows project**
   - Place in `Properties/` or `Resources/` folder

---

## 🧪 Test Your ICO

### Method 1: View in Windows Explorer
1. Navigate to ICO file location
2. Switch to "Large Icons" or "Extra Large Icons" view
3. You should see your icon displayed

### Method 2: Test in App
1. Build your Windows app (F5 in Visual Studio)
2. Check taskbar - should show your icon
3. Check window title bar - should show your icon
4. Check exe file in Explorer - should show your icon

---

## ✅ Checklist for Each Windows App

### Entry Safe Accounting
- [ ] Create `app-icon-accounting.ico`
- [ ] Place in `Properties/` folder
- [ ] Update `.csproj` with `<ApplicationIcon>`
- [ ] Update `MainWindow.xaml` with `Icon` property
- [ ] Build and test

### Entry Safe Docs
- [ ] Create `app-icon-docs.ico`
- [ ] Configure in project
- [ ] Build and test

### Entry Safe Pricing
- [ ] Create `app-icon-pricing.ico`
- [ ] Configure in project
- [ ] Build and test

### SD Storage Helper
- [ ] Create `app-icon-sdstorage.ico`
- [ ] Configure in project
- [ ] Build and test

---

## 🎯 Quick Start (2 Minutes)

```bash
# 1. Convert logo to ICO
Visit: https://www.icoconverter.com
Upload: Your square shield logo (256x256 or larger)
Select: All sizes (16, 32, 48, 64, 128, 256)
Download: app-icon.ico

# 2. Add to Visual Studio
Right-click project → Add → Existing Item
Select: app-icon.ico

# 3. Update .csproj
Add: <ApplicationIcon>Properties\app-icon.ico</ApplicationIcon>

# 4. Update MainWindow.xaml
Add: Icon="Properties/app-icon.ico"

# 5. Build and test
Press F5
```

---

## 🐛 Troubleshooting

### Icon not showing in taskbar?
- Make sure ICO has 32x32 size (default Windows taskbar size)
- Rebuild project (Clean → Build)
- Restart Visual Studio

### Icon not showing in Explorer?
- Make sure ICO has 256x256 size
- Clear icon cache: Delete `%localappdata%\IconCache.db`
- Restart Explorer

### Icon looks pixelated?
- Make sure ICO contains multiple sizes
- Use PNG source at least 512x512px
- Ensure ICO has 256x256 size for high DPI

### Build error with ICO path?
- Check path uses backslash: `Properties\app-icon.ico`
- Ensure ICO is included in project (Build Action: Resource)

---

## 📊 ICO File Sizes

| Sizes Included | File Size | Quality |
|----------------|-----------|---------|
| 16, 32 | ~5 KB | Basic |
| 16, 32, 48 | ~10 KB | Good |
| 16, 32, 48, 64, 128 | ~30 KB | Better |
| 16, 32, 48, 64, 128, 256 | ~60-100 KB | Best ✅ |

**Recommended:** Include all sizes for best compatibility

---

## 🎨 Advanced: Multiple Icon Variations

If you want different icons for different contexts:

```xml
<!-- Different icon for main window -->
<Window Icon="Properties/app-icon.ico">

<!-- Different icon for about dialog -->
<Window Icon="Properties/about-icon.ico">

<!-- Different icon for settings -->
<Window Icon="Properties/settings-icon.ico">
```

---

## 📞 Quick Links

**Tools:**
- IcoConverter: https://www.icoconverter.com
- ConvertICO: https://convertico.com
- Favicon.io: https://favicon.io/favicon-converter/

**Software:**
- GIMP: https://www.gimp.org
- IrfanView: https://www.irfanview.com

---

## 📧 Need Help?

**Can't create ICO?**
- Send me your square logo (PNG, at least 256x256)
- I'll guide you through the exact steps

**Icon not working in Visual Studio?**
- Check the `.csproj` path
- Ensure Build Action is set to "Resource"
- Clean and rebuild solution

---

**🪟 Your Windows apps will have professional icons!** 🚀
