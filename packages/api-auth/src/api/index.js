const express = require('express');
const authRoutes = require('./auth.routes');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Bleep bloop! Welcome to the Studio 37 API v1.' });
});

router.use('/auth', authRoutes);

module.exports = router;