# JK Poultries — Premium Egg Farm Website

A complete, animated, production-ready website for **JK Poultries** — a premium free-range egg farm brand. Built with HTML5, CSS3, vanilla JavaScript, GSAP animations, and a Python Flask backend.

---

## 📁 Folder Structure

```
jkpoultries/
├── index.html          ← Main HTML (all 7 sections)
├── style.css           ← Full CSS (variables, layout, animations, responsive)
├── script.js           ← All GSAP animations + interactions + form handler
├── server.py           ← Flask API (order + contact forms, SQLite storage)
├── requirements.txt    ← Python dependencies
├── jkpoultries.db      ← SQLite DB (auto-created on first run)
└── README.md           ← This file
```

---

## 🚀 Run Locally

### Prerequisites
- Python 3.9+
- pip

### Steps

```bash
# 1. Navigate into the project
cd jkpoultries

# 2. Create a virtual environment (recommended)
python -m venv venv
source venv/bin/activate        # macOS/Linux
venv\Scripts\activate           # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start the Flask server
python server.py

# 5. Open in browser
# → http://localhost:5000
```

> **Without Flask (frontend only):**
> Open `index.html` directly in any browser using VS Code Live Server or similar.
> The order form will show a success message automatically (demo mode fallback).

---

## 🌐 API Endpoints

| Method | Endpoint                       | Description                  |
|--------|-------------------------------|------------------------------|
| GET    | `/`                            | Serves index.html            |
| POST   | `/api/order`                   | Place a new egg order        |
| POST   | `/api/contact`                 | Submit a contact message     |
| GET    | `/api/orders`                  | List all orders (admin)      |
| PATCH  | `/api/orders/<id>/status`      | Update order status          |
| GET    | `/api/health`                  | Health check                 |

### POST /api/order — Request Body
```json
{
  "name":      "Priya Sharma",
  "phone":     "+91 98765 43210",
  "email":     "priya@example.com",
  "address":   "123 Main Street, Vijayawada 520001",
  "egg_type":  "brown",
  "quantity":  3,
  "frequency": "weekly",
  "notes":     "Leave at gate if not home"
}
```

---

## ☁️ Deploy to Production

### Option A — Render.com (Free Tier)
1. Push this folder to a GitHub repo
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo
4. Build command: `pip install -r requirements.txt`
5. Start command: `gunicorn server:app`
6. Add `gunicorn` to requirements.txt

### Option B — Railway.app
1. Push to GitHub
2. New project → Deploy from GitHub
3. Railway auto-detects Flask; set start command: `python server.py`

### Option C — VPS (DigitalOcean / AWS EC2)
```bash
# Install dependencies
sudo apt update && sudo apt install python3-pip nginx -y
pip install -r requirements.txt gunicorn

# Run with gunicorn
gunicorn --bind 0.0.0.0:5000 --workers 3 server:app

# Configure nginx reverse proxy to forward port 80 → 5000
```

### Option D — Frontend only on Netlify/Vercel
- Remove form submit `fetch()` call or point it to your API URL
- Deploy `index.html`, `style.css`, `script.js` directly

---

## 🎨 Design System

| Token       | Value        | Use                    |
|-------------|--------------|------------------------|
| `--cream`   | `#FFFBEB`    | Page background        |
| `--gold`    | `#F59E0B`    | Accents, highlights    |
| `--gold-dark`| `#B45309`   | CTAs, headings         |
| `--brown`   | `#78350F`    | Dark accents           |
| `--green`   | `#16A34A`    | Tags, badges           |
| `--ink`     | `#1C1408`    | Body text              |
| Playfair Display | Display font | Headings          |
| DM Sans     | Body font    | Body text              |
| Cormorant Garamond | Italic font | Pull quotes     |

---

## 🛠 Customisation

- **Brand name / contact**: Search & replace `JK Poultries` / phone / email in `index.html`
- **Prices**: Update `EGG_PRICES` dict in `server.py` and `pc-price` values in `index.html`
- **Colors**: Edit CSS variables at top of `style.css`
- **Add real images**: Replace SVG farm/egg illustrations with `<img>` tags
- **WhatsApp notifications**: Add `requests` library + Twilio/WA Business API call inside `/api/order` route

---

## 📱 Browser Support

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+, iOS Safari 14+, Chrome Android

---

## 📄 License

MIT — free to use and modify for commercial projects.
