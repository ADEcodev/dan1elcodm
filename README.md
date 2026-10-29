# TikTok Bio Links (LittleLink)

A lightweight, high-performance link-in-bio page designed to load instantly inside TikTok's mobile in-app browser.

---

## 📁 File Structure

- [index.html](file:///C:/Users/pc/OneDrive/Desktop/tiktoklink/index.html) — Your main landing page. Edit links, text, and your bio here.
- [index.full-example.html](file:///C:/Users/pc/OneDrive/Desktop/tiktoklink/index.full-example.html) — Full reference list of all 120+ supported social platforms and buttons.
- `images/avatar.png` — Your profile picture (replace with your photo/logo).
- `images/icons/` — 120+ official brand icons (WhatsApp, TikTok, YouTube, Instagram, etc.).
- `css/` — Styling and brand colors.

---

## ⚙️ Quick Customization

### 1. Change Your Details & Links
Open [index.html](file:///C:/Users/pc/OneDrive/Desktop/tiktoklink/index.html):
- Update `<h1>` with your name or TikTok brand name.
- Update `<p>` with your short tagline/bio.
- Replace link URLs:
  - **WhatsApp:** `https://chat.whatsapp.com/YOUR_GROUP_CODE`
  - **TikTok:** `https://www.tiktok.com/@yourusername`
  - **YouTube:** `https://www.youtube.com/@yourchannel`
  - **Instagram:** `https://www.instagram.com/yourusername`

### 2. Add Your Profile Photo
Replace `images/avatar.png` with your own profile image (a square 256x256 or 512x512 PNG/JPG).

---

## 🚀 How to Host It for Free (Choose One)

### Option A: GitHub Pages (Easiest & Free)
1. Create a free repository on [GitHub.com](https://github.com).
2. Open terminal in `C:\Users\pc\OneDrive\Desktop\tiktoklink` and push:
   ```bash
   git add .
   git commit -m "My custom links"
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git branch -M main
   git push -u origin main
   ```
3. In GitHub, go to **Settings** -> **Pages**.
4. Set source to **Deploy from a branch** -> `main` / `root`.
5. Your live TikTok bio link will be: `https://<your-username>.github.io/<repo-name>`!

### Option B: Vercel / Netlify
1. Drag and drop the `tiktoklink` folder into [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
2. It goes live instantly with free SSL and support for custom domains.
