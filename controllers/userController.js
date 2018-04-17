const mongoose = require('mongoose');

const User = mongoose.model('User');
const promisify = require('es6-promisify');


//login
exports.loginForm = (req, res) => {
  res.render('login', { title: 'Login' });
};

//register
exports.registerForm = (req, res) => {
  res.render('register', { title: 'Register' });
};


// The register post setup
// 1.Validate --> 2.Register --> 3.login

// 1. Validate the registration data →
exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'You must supply a name!').notEmpty();
  req.checkBody('email', 'That Email is not valid!').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    gmail_remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('password', 'Password Cannot be Blank!').notEmpty();
  req.checkBody('password-confirm', 'Confirmed Password cannot be blank!').notEmpty();
  req.checkBody('password-confirm', 'Oops! Your passwords do not match').equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map(err => err.msg));
    res.render('register', { title: 'Register', body: req.body, flashes: req.flash() });
    return; // stop the fn from running
  }
  next(); // there were no errors!
};

// 2. register the user →

exports.register = async (req, res, next) => {
  const user = new User({ email: req.body.email, name: req.body.name });
  const register = promisify(User.register, User);
  await register(user, req.body.password);
  next(); // pass to authController.login
};

 // 3. log them in you need to authenticate
//   ------------>>>>>   authController + handlers/passport.js

// TODO:
// /// -- USER ACCOUNT --- USER ACCOUNT --- USER ACCOUNT --- USER ACCOUNT ---
// //show user account
//  exports.account = (req, res) => {
//   res.render('account', { title: 'Edit Your Account' });
// };
//
// //update user account
// exports.updateAccount = async (req, res) => {
//   const updates = {
//     name: req.body.name,
//     email: req.body.email
//   };
//
//   const user = await User.findOneAndUpdate(
//     { _id: req.user._id },
//     { $set: updates },
//     { new: true, runValidators: true, context: 'query' }
//   );
//   req.flash('success', 'Updated the profile!');
//   res.redirect('back');
// };
