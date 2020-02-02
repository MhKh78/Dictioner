const mongoose = require('mongoose');
const slugify = require('slugify');

const dictionarySchema = new mongoose.Schema(
  {
    dicName: {
      type: String,
      unique: true,
      required: [true, 'dictionary name can not be empty!']
    },

    createdAt: {
      type: Date,
      default: Date.now()
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Dictionary must belong to a user.']
    },
    slug: String
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// TODO: make it work
dictionarySchema.index({ user: 1 }, { background: true });
dictionarySchema.index({ slug: 1 });

// Virtual populate
dictionarySchema.virtual('words', {
  ref: 'Word',
  foreignField: 'dictionary',
  localField: '_id'
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
dictionarySchema.pre('save', function(next) {
  this.slug = slugify(this.dicName, { lower: true });
  next();
});

dictionarySchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name photo slug'
  });

  next();
});

dictionarySchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  next();
});

const Dictionary = mongoose.model('Dictionary', dictionarySchema);

module.exports = Dictionary;
