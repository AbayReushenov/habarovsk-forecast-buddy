# 🏔️ Khabarovsk Forecast Buddy - Frontend

[![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg?style=flat&logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178c6.svg?style=flat&logo=typescript)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.4.10-646cff.svg?style=flat&logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.11-06b6d4.svg?style=flat&logo=tailwindcss)](https://tailwindcss.com)

**AI-powered sales forecasting system frontend for down jackets in Khabarovsk**

🔗 **Related Repositories:**
- **Frontend (React)**: [habarovsk-forecast-buddy](../habarovsk-forecast-buddy) - *This repository*
- **Backend (FastAPI)**: [khabarovsk-server-dbase](../khabarovsk-server-dbase) - FastAPI REST API server

## 🎯 Overview

Modern, responsive React TypeScript frontend for the Khabarovsk Forecast Buddy system. Provides intuitive UI for:

- 📊 **Data Upload**: CSV sales data import with validation
- 📈 **Forecast Visualization**: Interactive charts and predictions
- 🤖 **AI Integration**: Real-time connection to FastAPI backend
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- ⚡ **Real-time Updates**: Live API status and data synchronization

## 🏗️ Architecture

```
┌─────────────────┐    HTTP/REST    ┌──────────────────┐
│   React App     │ ◄──────────────► │   FastAPI Server │
│  (This repo)    │                 │   (Backend)      │
└─────────────────┘                 └──────────────────┘
        │                                   │
        ▼                                   ▼
┌─────────────────┐                 ┌──────────────────┐
│   Supabase      │                 │  GigaChat AI     │
│   Database      │                 │  Service         │
└─────────────────┘                 └──────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Running backend server (see [backend repository](../khabarovsk-server-dbase))

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd habarovsk-forecast-buddy

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Backend API (if different from default)
VITE_API_BASE_URL=http://localhost:8000
```

## 🛠️ Development

### Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **UI Library**: shadcn/ui components
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── ApiStatus.tsx   # API connection status
│   └── DataUpload.tsx  # CSV upload functionality
├── hooks/              # Custom React hooks
│   └── useApi.ts       # API integration hooks
├── lib/                # Utilities and services
│   └── api.ts          # Backend API client
├── pages/              # Page components
│   └── Index.tsx       # Main dashboard
└── integrations/       # External service integrations
    └── supabase/       # Supabase configuration
```

### API Integration

The frontend communicates with the FastAPI backend through:

- **Health Check**: `GET /api/v1/health`
- **CSV Upload**: `POST /api/v1/upload-csv`
- **Forecast Generation**: `POST /api/v1/forecast`
- **Sample Download**: `GET /api/v1/sample-csv`

See `src/lib/api.ts` for complete API client implementation.

## 📱 Features

### ✅ Implemented
- 🔄 Real-time API status monitoring
- 📁 CSV file upload with validation
- 📊 Interactive sales charts
- 🤖 AI forecast generation UI
- 📱 Responsive design
- ⚠️ Error handling and notifications

### 🚧 In Development
- 📈 Advanced analytics dashboard
- 🔍 Forecast comparison tools
- 📋 Report generation
- 🎨 Theme customization

## 🌐 Deployment

### Development
```bash
npm run dev          # Development server (localhost:8080)
```

### Production
```bash
npm run build        # Build for production
npm run preview      # Preview production build
```

### Docker Support
```bash
# Build and run with Docker
docker build -t forecast-buddy-frontend .
docker run -p 8080:8080 forecast-buddy-frontend
```

## 🔗 Integration with Backend

This frontend is designed to work with the [FastAPI backend](../khabarovsk-server-dbase).

**Required Backend Endpoints:**
- Health monitoring
- CSV data processing
- AI forecast generation
- Sample data download

**Development Setup:**
1. Start backend server on port 8000
2. Start frontend server on port 8080
3. API calls automatically route to localhost:8000

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

For issues and support:
- 🐛 **Bug Reports**: Create GitHub issue
- 💡 **Feature Requests**: Open discussion
- 📧 **Contact**: [Your contact information]
