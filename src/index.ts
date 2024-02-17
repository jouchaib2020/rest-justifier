import bodyParser from "body-parser";
import { Request, Response } from "express";

// Dependencies
const express = require('express');
const crypto = require('crypto');

// Initialize app and middleware
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.text());

// Data storage (in-memory for simplicity)
let tokens = new Map<string, { email: string, usedWords: number, resetTime: Date }>();

// Token generation endpoint
app.post('/api/token', (req: Request, res: Response) => {
    console.log(req.body);
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
  
    const text = req.body;
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
  
    const justifiedText = justifiedLines.join('\n');
    res.send(justifiedText);
});

// Start server
app.listen(3000, () => console.log('Server listening on port 3000'));
