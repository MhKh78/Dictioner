const express = require('express');

const {
  getloginForm,
  getAccount,
  getSignUpForm,
  getDictionaries,
  getDictionary,
  newDictionary,
  getRoot,
  newWord,
  getWord
  // updateUserData
} = require('./../controllers/viewsController');

const { isLoggedIn, protect } = require('./../controllers/authController');

const router = express.Router();

router.get('/', isLoggedIn, getRoot);
router.get('/signup', isLoggedIn, getSignUpForm);
// router.get('/tour/:slug', isLoggedIn, getTour);
router.get('/login', isLoggedIn, getloginForm);
router.get('/me', protect, getAccount);
router.get('/dictionaries', protect, getDictionaries);
router.get('/dictionaries/new', protect, newDictionary);
router.get('/dictionaries/:dicSlug', protect, getDictionary);
router.get('/dictionaries/:dicSlug/newword', protect, newWord);

router.get('/dictionaries/:dicSlug/:wordSlug', protect, getWord);

// router.post('/submit-user-data', protect, updateUserData);

module.exports = router;
