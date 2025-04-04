# WhisperWire

WhisperWire is a pseudonymous micro-thought-sharing app where every post is anonymous and connected through "vibes." Share your thoughts without the pressure of likes, follows, or profiles - just pure, vibe-driven expression.

## Features

- **Anonymity**: No user profiles or identifiable information
- **Vibe-based Clustering**: Whispers are organized by sentiment or vibe tags
- **Limited Replies**: Users can reply once per thread
- **Vibe Following**: Subscribe to specific vibes to curate your feed
- **Modern UI**: Clean, responsive design for all devices

## Tech Stack

- **Backend**: Node.js with Express.js, MongoDB
- **Frontend**: React.js with custom CSS
- **API Communication**: Axios

## Project Structure

```
whisperwire/
├── whisperwire-backend/     # Backend server
│   ├── src/
│   │   ├── models/          # Database models
│   │   ├── index.js         # Server entry point
│   │   └── seedData.js      # Initial data
│   ├── .env                 # Environment variables
│   └── package.json         # Backend dependencies
└── whisperwire-frontend/    # Frontend React app
    ├── public/              # Static files
    ├── src/
    │   ├── api/             # API service
    │   ├── components/      # React components
    │   ├── pages/           # Page components
    │   ├── styles/          # Global styles
    │   └── App.js           # Main React component
    └── package.json         # Frontend dependencies
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rishit-singh/whisperwire.git
   cd whisperwire
   ```

2. Setup Backend:
   ```bash
   cd whisperwire-backend
   npm install
   ```

3. Setup Frontend:
   ```bash
   cd ../whisperwire-frontend
   npm install
   ```

4. Create a `.env` file in the backend directory:
   ```
   MONGODB_URI=mongodb://localhost:27017/whisperwire
   PORT=5001
   
   ```

### Running the Application

1. Start MongoDB service

2. Start the backend server:
   ```bash
   cd whisperwire-backend
   npm run dev
   ```

3. Start the frontend development server:
   ```bash
   cd ../whisperwire-frontend
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Development

### Backend

- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server

### Frontend

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Customization

- Edit `whisperwire-backend/src/seedData.js` to customize the default vibes
- Modify `whisperwire-frontend/src/styles/variables.css` to change the theme colors and styling

## Deployment

### Backend Deployment

1. Create a MongoDB Atlas account for cloud database
2. Update the `.env` file with your MongoDB connection string
3. Deploy to Heroku or your preferred hosting provider

### Frontend Deployment

1. Build the production version: `npm run build`
2. Deploy the `build` directory to Netlify, Vercel, or your preferred static hosting provider
3. Update the API URL in `whisperwire-frontend/src/api/index.js` to point to your deployed backend

## License

This project is licensed under the MIT License - see the LICENSE file for details.