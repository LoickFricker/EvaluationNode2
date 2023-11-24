const express = require('express');
const flash = require('express-flash');
const mongoose = require('mongoose');
const crypto = require('crypto');
const userRoutes = require('./routes/userRoutes');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const path = require('path');
const User = require('./models/userModel'); // Assurez-vous que le chemin est correct
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connexion à la base de données avec Mongoose
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('connected to DB')
});

passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
  
        if (!user || !user.comparePassword(password)) {
          return done(null, false, { message: 'Identifiants incorrects.' });
        }
  
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

// Sérialisation et désérialisation des utilisateurs
passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).exec();
        done(null, user);
    } catch (err) {
        done(err, null);
    }
    });
  
  // express-session pour gérer les sessions
  app.use(session({
    secret: process.env.SESSION_SECRET || 'secret-key',
    resave: true,
    saveUninitialized: true,
  }));  

app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());


app.use('/', userRoutes);

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
