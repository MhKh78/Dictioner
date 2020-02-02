const mongoose = require('mongoose');
const slugify = require('slugify');
const Dictionary = require('./dictionaryModel');
const AppError = require('./../utils/appError');

const wordSchema = new mongoose.Schema(
  {
    wordEng: {
      type: String,
      required: [true, 'word must be declared!']
    },
    wordTrans: {
      type: String,
      required: [true, 'word must have a translation!']
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    dictionary: {
      type: mongoose.Schema.ObjectId,
      ref: 'Dictionary',
      required: [true, 'word must belong to a dictionary.']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'word must belong to a User.']
    },
    slug: String
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

wordSchema.index({ dictionary: 1 }, { background: true });

const checkUnique = (words, thisWord) => {
  for (let i = 0; i < words.length; i++) {
    if (words[i].wordEng === thisWord) {
      return false;
    }
  }
  return true;
};

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
wordSchema.pre('save', function(next) {
  this.slug = slugify(this.wordEng, { lower: true });
  next();
});

wordSchema.pre('save', async function(next) {
  const dicId = this.dictionary;

  const DictionaryWords = await Dictionary.findById(dicId).populate({
    path: 'words',
    fields: 'wordEng wordTrans slug'
  });

  const { words } = DictionaryWords;

  const unique = checkUnique(words, this.wordEng);

  if (!unique) {
    return next(
      new AppError('Repeated Word In This Dictionary, Add A New Word', 400)
    );
  }

  next();
});

wordSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'dictionary',
    select: 'dicName slug'
  });

  next();
});

wordSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  next();
});

const Word = mongoose.model('Word', wordSchema);

module.exports = Word;
