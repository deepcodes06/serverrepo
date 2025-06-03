const User = require('../models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username)
    return res.status(400).json({ message: 'Email, password and username are required.' });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists.' });

    const existingUsername = await User.findOne({ username });
    if (existingUsername)
      return res.status(400).json({ message: 'Username already taken.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('Creating user:', { email, username, password: '[HIDDEN]' });

    const newUser = new User({ email, password: hashedPassword, username });
    await newUser.save();

    console.log('Saved user:', newUser);

    res.status(201).json({ message: 'User created successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

const login = async (req, res) => {
  const { email, password} = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password and are required.' });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials.' });

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, email: user.email, username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};


module.exports = { signup, login };
