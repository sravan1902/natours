const express = require('express');
const userController = require('./../controllers/userController');

const authController = require('./../controllers/authController');

const reviewController = require('./../controllers/reviewController');

// Routes
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);

router.patch(
  '/updateMyPassword',

  authController.updatePassword,
);

router.get(
  '/me',

  userController.getMe,
  userController.getUser,
);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

// Only admin can access
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
