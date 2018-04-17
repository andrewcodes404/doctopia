const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const docSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  slug: String,
  email: {
    type: String,
    trim: true
  },

  image: String,
  created: {
    type: Date,
    default: Date.now
  }
});


docSchema.pre('save', async function(next) {
  if (!this.isModified('name')) {
    next(); // skip it
    return; // stop this function from running
  }
  this.slug = slug(this.name);
  // find other stores that have a slug of wes, wes-1, wes-2
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const docsWithSlug = await this.constructor.find({ slug: slugRegEx });
  if (docsWithSlug.length) {
    this.slug = `${this.slug}-${docsWithSlug.length + 1}`;
  }
  next();
});



module.exports = mongoose.model('Doc', docSchema);
