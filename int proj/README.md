# Excel Analytics Platform

A powerful platform for uploading Excel files, analyzing data, and generating interactive 2D and 3D charts.

## Features

- Excel file upload and parsing (.xls, .xlsx)
- Interactive 2D and 3D chart generation
- Dynamic axis selection
- User authentication and authorization
- Dashboard with upload history
- Downloadable charts (PNG/PDF)
- Admin panel for user management
- Optional AI-powered insights

## Tech Stack

### Frontend
- React.js
- Redux Toolkit
- Chart.js
- Three.js
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Multer (file upload)
- SheetJS/xlsx

## Project Structure

```
excel-analytics-platform/
├── client/                 # Frontend React application
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── redux/
│       ├── utils/
│       └── App.js
└── server/                 # Backend Node.js application
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    └── server.js
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```
4. Start the development server:
   ```bash
   npm start
   ```

## Development Timeline

### Week 1
- Project setup
- User/admin authentication
- Dashboard layout

### Week 2
- File upload setup
- Excel parsing logic
- MongoDB data storage

### Week 3
- Chart rendering with Chart.js & Three.js
- Dynamic axis selection

### Week 4
- Analysis history
- Download feature
- AI API integration

### Week 5
- Admin panel
- Testing & bug fixes
- Deployment

## License

MIT 