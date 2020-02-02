const express = require('express');

const {
  getAllWords,
  createWord,
  deleteWord,
  updateWord,
  setDicUserIds,
  getWord,
  ifSlug,
  serviceResult,
  findWord
} = require('./../controllers/wordController');

const { protect } = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .route('/')
  .get(getAllWords)
  .post(setDicUserIds, ifSlug, serviceResult, createWord);

router
  .route('/:id')
  .get(getWord)
  .patch(findWord, serviceResult, updateWord)
  .delete(findWord, deleteWord);

module.exports = router;
