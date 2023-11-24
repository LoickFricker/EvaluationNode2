const crypto = require('crypto');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  salt: { type: String }, 
});

// Ajouter une méthode pour comparer les mots de passe
userSchema.methods.comparePassword = function(candidatePassword) {
  const secret = process.env.SECRET_KEY || 'default_secret';
  const hash = crypto.createHmac('sha256', secret)
                     .update(candidatePassword)
                     .digest('hex');
  return this.password === hash;
};

// Middleware pour générer un sel et hasher le mot de passe avant la sauvegarde
userSchema.pre('save', function(next) {
  if (!this.salt) {
    this.salt = crypto.randomBytes(16).toString('hex');
  }

  if (this.isModified('password')) {
    const hash = crypto.createHmac('sha256', this.salt)
                       .update(this.password)
                       .digest('hex');
    this.password = hash;
  }

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
