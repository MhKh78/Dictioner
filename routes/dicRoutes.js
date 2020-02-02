const express = require('express');
const { protect } = require('./../controllers/authController');

const {
  getAllDics,
  createDic,
  getDic,
  updateDic,
  deleteDic,
  setDicUserId,
  ifSlugDelete
} = require('../controllers/dictionaryController');

const wordRouter = require('./../routes/wordRoutes');

const router = express.Router();

// router.param('id', checkID);

router.use('/:dicId/words', wordRouter);

router
  .route('/')
  .get(getAllDics)
  .post(protect, setDicUserId, createDic);

router
  .route('/:id')
  .get(protect, getDic)
  .patch(protect, updateDic)
  .delete(protect, ifSlugDelete, deleteDic);

router.route('/:slug').delete(protect, ifSlugDelete, deleteDic);

module.exports = router;
