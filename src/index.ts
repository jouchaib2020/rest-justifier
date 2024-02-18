import bodyParser from "body-parser";
import crypto from 'crypto';
import express, { Request, Response } from "express";
import { user } from "./utlis";

// Initialize app and middleware
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.text());

// Data storage (in-memory for simplicity)
let tokens = new Map<string, user>();

// Token generation endpoint
app.post('/api/token', (req: Request, res: Response) => {
  const {email} = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }
  const token = crypto.randomBytes(16).toString('hex');
  tokens.set(token, { email, usedWords: 0, resetTime: new Date() });
  res.json({ token });
});

// text justification endpoint
app.post('/api/justify', (req: Request, res: Response) => {

    //check authentication  (using Bearer token)
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const user = tokens.get(token);
    if (!user) {
        return res.status(401).json({ error: 'Invalid token' });
    }

    // check if token is still valid (1-day experation for simplicity)
    const now = new Date();
    const dateDiff = now.getMilliseconds()  - user.resetTime.getMilliseconds();
    if ( dateDiff/(1000*60*60*24) > 1) {
    user.usedWords = 0;
    user.resetTime = now;
    }

    if (user.usedWords >= 80000) {
        return res.status(402).json({ error: 'Payment Required' });
    }
  
    // justification logic 
    const text = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text required' });
    }
    const words = text.split(/\s+/);
    const length = 80;
  
    const justifiedLines = [];
    for (let i = 0; i < words.length; i++) {
      let line = words[i];
      for (let j = i + 1; j < words.length; j++) {
        if (line.length + words[j].length + 1 <= length) {
          line += ' ' + words[j];
          i = j;
        } else {
          break;
        }
      }
      justifiedLines.push(line);
    }

    // update user used words
    user.usedWords += words.length;
    tokens.set(token, user);
  
    const justifiedText = justifiedLines.join('\n');
    res.send(justifiedText);
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));

export { app };

