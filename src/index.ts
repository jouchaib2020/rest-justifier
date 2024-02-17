import bodyParser from "body-parser";
import { Request, Response } from "express";

// Dependencies
const express = require('express');
const crypto = require('crypto');

// Initialize app and middleware
const app = express();
app.use(bodyParser.json());

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

// Start server
app.listen(3000, () => console.log('Server listening on port 3000'));
