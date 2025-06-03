const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./proutes/profileRoutes');
const Users = require('./models/Users');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

app.get('/', (req, res) => {
  res.send('Server is working');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
