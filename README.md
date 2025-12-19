# Personal Portfolio Website

Website portfolio cá nhân được xây dựng với React (frontend) và NestJS (backend).

## 🏗️ Kiến trúc dự án

Dự án được chia thành 2 phần chính:

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: NestJS (Node.js framework)

## 📁 Cấu trúc thư mục

```
personal_portfolio_website/
├── frontend/          # React application
├── backend/           # NestJS API server
├── _docs/             # Tài liệu dự án
└── docker-compose.yml # Docker configuration
```

## 🚀 Cài đặt và chạy

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend sẽ chạy tại `http://localhost:5173` (hoặc port khác nếu 5173 đã được sử dụng).

### Backend

```bash
cd backend
npm install
npm run start:dev
```

Backend sẽ chạy tại `http://localhost:3000` (mặc định).

### Docker

```bash
docker-compose up
```

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool và dev server
- **Tailwind CSS** - Styling

### Backend
- **NestJS** - Node.js framework
- **TypeScript** - Type safety
- **Express** - HTTP server

## 📝 Tính năng

- Hero section với giới thiệu cá nhân
- About section
- Portfolio/Projects showcase
- Services section
- Testimonials
- Contact form
- Responsive design

## 📚 Tài liệu

Tài liệu chi tiết về các tính năng và cập nhật được lưu trong thư mục `_docs/`.

## 🔧 Scripts

### Frontend
- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm run preview` - Preview production build
- `npm run lint` - Chạy ESLint

### Backend
- `npm run start:dev` - Chạy development mode với watch
- `npm run start:prod` - Chạy production mode
- `npm run build` - Build project
- `npm run test` - Chạy unit tests
- `npm run test:e2e` - Chạy e2e tests

## 📄 License

ISC

