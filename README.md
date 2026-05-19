# Realtime Coaching Feed Frontend

A modern realtime coaching feed dashboard built using Next.js, Tailwind CSS, Socket.IO Client, and Cloudinary.

Users receive coaching updates instantly without refreshing the page.

---

# Features

- Modern responsive UI
- Realtime updates with Socket.IO
- Image-based feed cards
- Cloudinary image rendering
- Optimized Next.js Image component
- Loading states
- Error handling
- Toast notifications
- Admin dashboard
- Responsive layout
- Duplicate realtime event prevention
- Production-ready frontend architecture

---

# Tech Stack

- Next.js 15
- React
- Tailwind CSS
- Socket.IO Client
- Axios
- React Hot Toast
- Date-fns

---

# Pages

## Home Page

Displays:
- Realtime coaching updates
- Feed cards
- Uploaded images
- Relative timestamps

---

## Admin Page

Allows:
- Feed creation
- Image upload
- Realtime broadcasting

---

# Project Structure

```bash
src/
│
├── app/
│   ├── admin/
│   ├── globals.css
│   ├── layout.js
│   └── page.js
│
├── components/
│   ├── FeedCard.jsx
│   ├── FeedList.jsx
│   ├── Loader.jsx
│   └── Navbar.jsx
│
├── services/
│   └── api.js
│
├── socket/
│   └── socket.js
│
└── hooks/
```

---

# Architecture

```bash
Next.js Frontend
        ↓
Socket.IO + REST APIs
        ↓
Express Backend
        ↓
MongoDB + Redis + Cloudinary
```

---

# Environment Variables

Create `.env.local`

```env
NEXT_PUBLIC_API_URL=
```

Example:

```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

---

# Installation

```bash
npm install
```

---

# Run Development Server

```bash
npm run dev
```

---

# Production Build

```bash
npm run build
```

---

# Realtime Socket Flow

```bash
User opens application
        ↓
Socket.IO connects to backend
        ↓
Admin posts new feed
        ↓
Backend emits socket event
        ↓
Frontend updates instantly
```

---

# UI Features

- Responsive design
- Mobile-friendly layout
- Optimized image loading
- Realtime toast notifications
- Modern dashboard UI
- Animated hover effects

---

# Image Optimization

Uses:
- Next.js Image component
- Cloudinary CDN
- Lazy loading
- Responsive image sizing

---

# Realtime Features

- Automatic socket reconnect
- Duplicate event prevention
- Instant UI updates
- Live notifications

---

# Deployment

## Frontend Deployment
- Vercel

## Backend
- Render

---

# Production Improvements

- Environment-based API config
- Optimized image rendering
- Responsive layout
- Error handling
- Loading indicators
- Modern component architecture

---

# Future Improvements

- Authentication
- Dark mode
- Infinite scrolling
- Feed filters
- Search functionality
- Push notifications

---

# Author

Samanvith
