# WhisperWire Backend

The backend service for WhisperWire, a pseudonymous micro-thought-sharing app where every post is anonymous and connected through "vibes."

## Features

- Anonymous whisper posting
- Vibe-based content organization
- One-time reply system
- Vibe following and filtering
- Real-time updates

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with:
   ```
   MONGODB_URI=mongodb://localhost:27017/whisperwire
   PORT=5000
   ```
4. Start MongoDB service
5. Run the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Whispers

- `GET /api/v1/whispers` - Get all whispers (optional vibe filter)
- `POST /api/v1/whispers` - Create a new whisper
- `POST /api/v1/whispers/:id/reply` - Reply to a whisper

### Vibes

- `GET /api/v1/vibes` - Get all vibes
- `POST /api/v1/vibes` - Create a new vibe

## Development

- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server

## License

ISC 