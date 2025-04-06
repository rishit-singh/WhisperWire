# WhisperWire

WhisperWire is a social media application that allows users to post "whispers" - short messages that can be tagged with "vibes" (categories/moods). Users can reply to whispers, creating threaded conversations.

## Live Application

[Click here to view the live application](#) <!-- Replace with your actual URL when deployed -->

## Building and Running Locally

### Prerequisites
- Node.js (v14 or higher)
- MongoDB

### Backend Setup
1. Clone the repository
2. Navigate to the backend directory: `cd whisperwire-backend`
3. Install dependencies: `npm install`
4. Create a `.env` file with the following content:
   ```
   MONGODB_URI=mongodb://localhost:27017/whisperwire
   PORT=5002
   ```
5. Start the server: `npm run dev`

### Frontend Setup
1. Navigate to the frontend directory: `cd whisperwire-frontend`
2. Install dependencies: `npm install`
3. Start the application: `npm start`
4. The application will open in your browser at http://localhost:1234

### Quick Start (using the provided script)
You can also use the provided script to start both the frontend and backend:
```
chmod +x run.sh
./run.sh
```
This will start both servers and open the application in your browser.

## Deployment

### Deploying to Render

1. Fork this repository to your own GitHub account.

2. Create a new MongoDB database (You can use MongoDB Atlas free tier).

3. Sign up for [Render](https://render.com) and connect your GitHub account.

4. Create a new "Blueprint" in Render and select your forked repository.

5. Render will automatically detect the `render.yaml` configuration and create the necessary services.

6. Configure the environment variables in the Render dashboard:
   - For the backend service: Set `MONGODB_URI` to your MongoDB connection string

7. Deploy the services.

8. After deployment, your application will be available at the URLs provided by Render.

## Notable Features

- **Threaded Conversations**: Replies are displayed under their parent whispers with visual indicators
- **Vibe-based Filtering**: Filter whispers by their associated vibes/categories
- **Real-time Updates**: The interface updates dynamically when new whispers are posted
- **Responsive Design**: Works on mobile and desktop browsers

## How to Use

1. Browse whispers on the home page
2. Click on a vibe tag to filter whispers by that vibe
3. Use the "Reply" button to respond to a whisper
4. Click on a whisper to view all its replies
5. Use the compose form at the top to create a new whisper
6. Add vibes to your whisper using the dropdown menu

## API Documentation

### Endpoints

#### Whispers

- `GET /api/v1/whispers`
  - Description: Retrieve all whispers
  - Response: Array of whisper objects
  - Query Parameters:
    - `vibe`: Filter whispers by vibe (optional)

- `GET /api/v1/whispers/:id`
  - Description: Retrieve a single whisper with its replies
  - Response: Whisper object with populated replies

- `POST /api/v1/whispers`
  - Description: Create a new whisper
  - Request Body:
    ```json
    {
      "text": "This is a whisper",
      "vibes": ["excited", "technology"],
      "parentId": "parentWhisperId" // Optional, for replies
    }
    ```
  - Response: Created whisper object

- `DELETE /api/v1/whispers/:id`
  - Description: Delete a whisper
  - Response: Success message

#### Vibes

- `GET /api/v1/vibes`
  - Description: Retrieve all available vibes
  - Response: Array of vibe objects

- `POST /api/v1/vibes`
  - Description: Create a new vibe
  - Request Body:
    ```json
    {
      "name": "excited"
    }
    ```
  - Response: Created vibe object

### Examples

#### Fetch all whispers
```javascript
fetch('http://localhost:5002/api/v1/whispers')
  .then(response => response.json())
  .then(data => console.log(data));
```

#### Create a new whisper
```javascript
fetch('http://localhost:5002/api/v1/whispers', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: 'Hello WhisperWire!',
    vibes: ['happy', 'greeting']
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

## References

- MongoDB Documentation: https://docs.mongodb.com/
- React Documentation: https://reactjs.org/docs/getting-started.html
- Express.js Documentation: https://expressjs.com/
- Render Deployment: https://render.com/docs

### Project References
- Backend API implementation: `whisperwire-backend/src/index.js` (lines 10-100)
- Whisper model: `whisperwire-backend/src/models/Whisper.js` (lines 1-20)
- Frontend API calls: `whisperwire-frontend/src/api/index.js` (lines 1-50)
- Whisper component: `whisperwire-frontend/src/components/Whisper/WhisperCard.js` (lines 1-109)

## What makes WhisperWire cool

- No user accounts - just drop your thoughts and go
- "Vibes" tag system helps group similar content (try #chill or #unhinged)
- Reply to others, but only once per thread to keep convos focused
- Follow specific vibes that match your mood
- Clean UI that doesn't get in your way

## Tech stuff I used

Backend runs on Node/Express with MongoDB for storage. Frontend is React with custom CSS (no frameworks). Axios handles the API calls between them.

## Project folders

```
whisperwire/
├── whisperwire-backend/     # Server stuff
│   └── src/                 # All the code
└── whisperwire-frontend/    # React app
    └── src/                 # React components & logic
```

## Want to run it locally?

### You'll need:

- Node.js
- MongoDB (local instance or Docker)

### Quick setup:

1. Clone it:
   ```bash
   git clone https://github.com/rishit-singh/whisperwire.git
   cd whisperwire
   ```

2. Install backend:
   ```bash
   cd whisperwire-backend
   npm install
   ```

3. Install frontend:
   ```bash
   cd ../whisperwire-frontend
   npm install
   ```

4. Make a `.env` file in the backend directory with:
   ```
   MONGODB_URI=mongodb://localhost:27017/whisperwire
   PORT=5001
   ```

### Run it:

1. Get MongoDB running (if using Docker):
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

2. Start the backend:
   ```bash
   cd whisperwire-backend
   npm run dev
   ```

3. Start the frontend:
   ```bash
   cd ../whisperwire-frontend
   npm start
   ```

4. Go to `http://localhost:3000` and start whispering!

## Making changes

The default vibe tags are in `seedData.js` - feel free to add your own.

Colors and styles are defined in CSS variables in the frontend styles. I went with a purple theme, but change it if you want!

## Known Issues

- The vibe filter sometimes gets stuck if you click too fast
- Mobile view works but could use some polish
- No dark mode yet (sorry night owls)

## Deployment

I've tested this on Heroku for the backend and Netlify for the frontend. Super easy to set up!

For the backend, just push to Heroku and set the MONGODB_URI env variable.
For the frontend, run `npm build` and upload the build folder to any static host.

---

Made with ☕ and 🎵 by Rishit Singh.
No license restrictions - do whatever you want with it!