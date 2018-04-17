const express = require('express');
const router = express.Router();
const docController = require('../controllers/docController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

//home
router.get('/', docController.homePage);

// **-ADD-** **-ADD-** **-ADD-** **-ADD-** **-ADD-** **-ADD-**
router.get('/add',
  authController.isLoggedIn,
  docController.addDoc);
router.post('/add',
  docController.upload,
  catchErrors(docController.resize),
  catchErrors(docController.createDoc),
);

// **-EDIT-** **-EDIT-** **-EDIT-** **-EDIT-** **-EDIT-**
// edit (GET)
router.get('/doc/:slug/edit',
  authController.isLoggedIn,
  catchErrors(docController.editDoc)
);
// edit/update (POST)
router.post('/add/:slug',
  docController.upload,
  catchErrors(docController.resize),
  catchErrors(docController.updateDoc)
);


/// USER -- USER -- USER -- USER -- USER -- USER -- USER -- USER --

//register GET
router.get('/register', userController.registerForm)
//register POST
router.post('/register',
  userController.validateRegister,
  catchErrors(userController.register),
  authController.login
);

// login GET
router.get('/login', userController.loginForm );
//login POST
router.post('/login', authController.login)

//log-out
router.get('/logout', authController.logout);



// TODO: 
// //user-edit GET
// router.get('/account', authController.isLoggedIn, userController.account);
// // user-edit POST
// router.post('/account', catchErrors(userController.updateAccount));



// TODO:
// //password-forgot GET
// router.post('/account/forgot', catchErrors(authController.forgot));
// //password reset page GET
// router.get('/account/reset/:token', catchErrors(authController.reset));
//
// // password update/save post
// router.post('/account/reset/:token',
//   authController.confirmedPasswords,
//   catchErrors(authController.update)
// );








module.exports = router;
