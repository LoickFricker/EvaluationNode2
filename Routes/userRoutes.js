const express = require('express');
const path = require('path');
const router = express.Router();
const userController = require('../controllers/userController');
const passport = require('passport');


// Les routes get pour afficher les pages
router.get('/', (req, res) => {
    res.redirect('/register');
  });

router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../views', 'register.html'));
});

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../views', 'login.html'));
});

router.get('/dashboard', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../views', 'dashboard.html'));
});

// Les routes POST :
router.post('/register', userController.validateRegistration, userController.registerUser);

router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true,
  }));

// Middleware d'authentification
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;