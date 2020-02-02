const Dictionary = require('./../models/dictionaryModel');
const catchAsync = require('./../utils/catchAsync');

const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll
} = require('./handlerFactory');

exports.setDicUserId = (req, res, next) => {
  // Allow nested routes
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

exports.getAllDics = getAll(Dictionary);
exports.getDic = getOne(Dictionary, { path: 'words' });
exports.createDic = createOne(Dictionary);
exports.updateDic = updateOne(Dictionary);
exports.deleteDic = deleteOne(Dictionary);

exports.ifSlugDelete = catchAsync(async (req, res, next) => {
  //TODO: Find A Better Way
  const dictionary = await Dictionary.findOne({ slug: req.params.id });

  req.params.id = dictionary._id;
  next();
});
