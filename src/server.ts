import http from 'http';
import express, { Express } from 'express';
import routes from './routes/routes';
import mongoose from 'mongoose';

require("dotenv").config();

const app: Express = express();

//Connect to MongoDB
mongoose.connect(process.env.MONGO_URI!, {
  autoIndex: true,
  ignoreUndefined: true,
}, () => {
  console.log('Connected to MongoDB');
});

//Parse the request
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//CORS rules for the API
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, PUT, PATCH, DELETE, POST');
    return res.status(200).json({});
  }
  next();
});

//Routes
app.use('/', routes);

//Error handling
app.use((req, res, next) => {
  const error = new Error('not found');
  return res.status(404).json({ message: error.message });
});

//Server
const httpServer = http.createServer(app);
const PORT: any = process.env.PORT ?? 6060;
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
