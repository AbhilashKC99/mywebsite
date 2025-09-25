# Backend Setup for Resume Generator

## Quick Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set your OpenAI API key:**
   ```bash
   export OPENAI_API_KEY="sk-your-actual-api-key-here"
   ```

3. **Start the backend server:**
   ```bash
   npm start
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000/resume/
   - API Health: http://localhost:3000/api/health

## Environment Variables

Create a `.env` file in the project root:
```
OPENAI_API_KEY=sk-your-api-key-here
PORT=3000
NODE_ENV=development
```

## API Endpoints

- `GET /api/get-api-key` - Returns the configured OpenAI API key
- `GET /api/health` - Health check endpoint

## Security Notes

- The API key is stored server-side and not exposed to the frontend
- The frontend fetches the API key from the backend when needed
- No user input is required for API key configuration

## Development

For development with auto-restart:
```bash
npm run dev
```

## Production Deployment

1. Set environment variables in your production environment
2. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start backend-server.js --name "resume-generator"
   ```
