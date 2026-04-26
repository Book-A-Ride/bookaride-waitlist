# Book A Ride Waitlist System

A high-converting waitlist landing page and backend system for **Book A Ride**, targeting university students and local drivers in Ikere-Ekiti (BOUESTI).

## 🚀 Built With
- **Next.js 15 (App Router)**
- **Tailwind CSS v4**
- **MongoDB Atlas + Mongoose**
- **Framer Motion** (Animations)
- **ConvertKit** (Email Integration)
- **Cloudflare Turnstile** (Security)

## 🛠️ Setup Instructions

### 1. Clone the repository
```bash
git clone <repository-url>
cd bookaride-waitlist
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add the following:
```env
# Database
MONGODB_URI=your_mongodb_uri

# ConvertKit
CONVERTKIT_API_KEY=your_api_key
CONVERTKIT_FORM_ID=your_form_id

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Security
RATE_LIMIT_MAX=10
RATE_LIMIT_WINDOW_MS=60000

# Analytics
NEXT_PUBLIC_GA_ID=your_ga_id

# CAPTCHA
TURNSTILE_SECRET_KEY=your_secret_key
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key
```

### 4. Run the development server
```bash
npm run dev
```

### 5. Deployment
The project is ready to be deployed on **Vercel**. Connect your GitHub repository and add the environment variables in the Vercel dashboard.

## 📈 Admin Dashboard
Access the admin portal at `/admin` to view real-time stats and export user data.
- Default password for demo: `admin123`

## 🔗 Referral System
Users can invite friends using their unique referral link: `/?ref=BAR-XXXXXX`. 
Referrals are tracked and shown in the success state after signup.
