const soap = require('soap');
const Word = require('./../models/wordModel');
const User = require('./../models/userModel');
const Dictionary = require('./../models/dictionaryModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const url = 'http://localhost:3030/upperizer?wsdl';

const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll
} = require('./handlerFactory');

exports.getAllWords = getAll(Word);
exports.getWord = getOne(Word);
exports.createWord = createOne(Word);
exports.updateWord = updateOne(Word);
exports.deleteWord = deleteOne(Word);

exports.findWord = async (req, res, next) => {
  // Allow nested routes
  const list = req.params.id.split('&');

  if (list[1] !== 'id') {
    const user = await User.findOne({ slug: list[2] });

    const userId = user._id;

    const dictionaries = await Dictionary.find({ user: userId });
    const dictionary = dictionaries.find(dic => {
      if (dic.slug === list[1]) {
        return dic;
      }
    });

    const word = await Word.findOne({
      slug: list[0],
      dictionary: {
        _id: dictionary._id
      }
    });

    req.params.id = word._id;
  } else {
    req.params.id = list[0];
  }
  next();
};

exports.setDicUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.dictionary) req.body.dictionary = req.params.dicId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

exports.ifSlug = catchAsync(async (req, res, next) => {
  // Allow nested routes
  const dictionary = await Dictionary.findOne({ slug: req.body.slug });
  req.body.dictionary = dictionary._id;
  next();
});

exports.serviceResult = catchAsync(async (req, res, next) => {
  soap.createClient(url, (err, client) => {
    if (err) console.log(err);
    try {
      console.log(req.body.wordEng);

      client.upperize({ wordLower: req.body.wordEng }, (error, response) => {
        if (error) console.log(error);

        req.body.wordEng = response.word;
        next();
      });
    } catch (err) {
      console.log(err);
      next(new AppError(`Service Is Down, Try Again Later`, 500));
    }
  });
});
