const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {          // you have username, keep it
    type: String,
    unique: true,
    required: true,
  },
  name: {              // Added: user's full name
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },  
  links: {             // Added: array of links
    type: [linkSchema],
    default: [],
  },
  template: {          // Added: chosen template name
    type: String,
    default:'',
  },
}, { timestamps: true });

module.exports = mongoose.model('Users', userSchema);
