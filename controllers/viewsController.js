const Dictionary = require('./../models/dictionaryModel');
const User = require('./../models/userModel');
const Word = require('./../models/wordModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// exports.getOverview = catchAsync(async (req, res) => {
//   // 1) Get tour data from collection
//   const tours = await Tour.find();

//   // 2) Build template

//   // 3) Render that template using data from 1)
//   res.status(200).render('overview', {
//     title: 'All Tours',
//     tours
//   });
// });

// exports.getTour = catchAsync(async (req, res, next) => {
//   // 1) ge the data, for the requested tour (including reviews and guides)
//   const tour = await Tour.findOne({ slug: req.params.slug }).populate({
//     path: 'reviews',
//     fields: 'review rating user'
//   });

//   if (!tour) {
//     return next(new AppError('There is no tour with that name.', 404));
//   }

//   // 3) Render template using the data from 1)
//   res.status(200).render('tour', {
//     title: `${tour.name} tour`,
//     tour
//   });
// });

exports.getSignUpForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign Up Now'
  });
};

exports.getRoot = (req, res) => {
  if (res.locals.user) {
    return res.redirect('/me');
  }

  res.status(200).render('root', {
    title: 'Welcome Too Dictioner'
  });
};

exports.getDictionaries = catchAsync(async (req, res) => {
  // 1) Get dictionaries data from collection
  const dictionaries = await Dictionary.find({ user: req.user._id });
  res.status(200).render('dictionaries', {
    title: 'Your Dictionaries',
    dictionaries
  });
});

exports.getDictionary = catchAsync(async (req, res, next) => {
  // 1) Get dictionaries data from collection
  const slug = req.params.dicSlug;
  const dictionary = await Dictionary.findOne({
    slug
  }).populate({
    path: 'words',
    fields: 'wordEng wordTrans slug'
  });

  if (!dictionary) {
    return next(new AppError('The Dictionary Not Found', 404));
  }

  res.status(200).render('dictionary', {
    title: 'Your Dictionary',
    dictionary,
    slug
  });
});

exports.newDictionary = (req, res) => {
  res.status(200).render('newDic', {
    title: 'New Dictionary'
  });
};

exports.newWord = (req, res) => {
  const slug = req.params.dicSlug;
  res.status(200).render('newWord', {
    title: 'New Word',
    slug
  });
};

exports.getWord = async (req, res, next) => {
  const list = req.params.wordSlug.split('&');

  const slug = req.params.dicSlug;

  const userId = await (await User.findOne({ slug: list[1] }))._id;

  const dictionaries = await Dictionary.find({ user: userId });
  const dictionary = dictionaries.find(dic => {
    if (dic.slug === slug) {
      return dic;
    }
  });

  if (list.length === 2) {
    const word = await Word.findOne({
      slug: list[0],
      dictionary: {
        _id: dictionary._id
      }
    });

    res.status(200).render('editWord', {
      title: 'Edit Word',
      word
    });
  } else if (list.length === 3) {
    if (list[2] === 'eng') {
      const word = await Word.findOne({
        wordEng: list[0].toLocaleUpperCase(),
        dictionary: {
          _id: dictionary._id
        }
      });

      if (!word) return next(new AppError('Word Not Found', 404));

      res.status(200).render('wordView', {
        title: 'Found Word',
        word,
        dictionary
      });
    } else if (list[2] === 'fa') {
      const word = await Word.findOne({
        wordTrans: list[0],
        dictionary: {
          _id: dictionary._id
        }
      });

      if (!word) return next(new AppError('Word Not Found', 404));

      res.status(200).render('wordView', {
        title: 'Found Word',
        word,
        dictionary
      });
    } else {
      next(new AppError(`Can't find this word!`, 404));
    }
  }
};

exports.getloginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};

exports.updateUserData = catchAsync(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    { new: true, runValidators: true }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  });
});
