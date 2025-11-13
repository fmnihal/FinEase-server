require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('./config/firebaseAdmin');

const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

app.use('/api', transactionRoutes);

app.get('/', (req, res) => {
  res.send('FinEase Server is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});