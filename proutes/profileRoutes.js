const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/Users'); // Adjust path to your user model


// Get profile (protected route)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('-password'); // Exclude password

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({
      name: user.name,
      bio: user.bio,
      links: user.links,
      template: user.template,

    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Update profile (protected route)
router.put('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, bio, links, template } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.name = typeof name === 'string' ? name : user.name;
    user.bio = typeof bio === 'string' ? bio : user.bio;
    if (Array.isArray(links)) user.links = links;
    if (typeof template === 'string') user.template = template        ;

    await user.save();
    res.json({
      message: 'Profile updated successfully.',
      user: {
        name: user.name,
        bio: user.bio,
        links: user.links,
        template: user.template,

      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.get('/username/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      name: user.name,
      bio: user.bio,
      links: user.links,
      template: user.template,  

    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;