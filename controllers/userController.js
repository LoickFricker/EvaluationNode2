const User = require('../models/userModel');
const passport = require('passport');


// Middleware de vérification des champs du formulaire
function validateRegistration(req, res, next) {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Veuillez remplir tous les champs.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).send('<script>alert("Les mots de passe ne correspondent pas."); window.location="/register";</script>');
}

  next();
}

async function registerUser(req, res) {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).send('<script>alert("L\'utilisateur existe déjà."); window.location="/register";</script>');
    }

    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
    });

    await newUser.save();

    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'utilisateur.' });
  }
}

// Middleware pour l'authentification
function authenticateUser(req, res, next) {
    passport.authenticate('local', {
      successRedirect: '/dashboard',  // Redirection en cas de succès
      failureRedirect: '/login',      // Redirection en cas d'échec
      failureFlash: true,             // Activer les messages flash pour les erreurs
    })(req, res, next);
  }

module.exports = { validateRegistration, registerUser, authenticateUser, logoutUser };
