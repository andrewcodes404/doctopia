const mongoose = require('mongoose');
const Doc = mongoose.model('Doc');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

// **-For image upload-** **-For image upload-** **-For image upload-**
const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isImage = file.mimetype.startsWith('image/');
    if(isImage) {
      next(null, true);
    } else {
      next({ message: 'That filetype isn\'t allowed!' }, false);
    }
  }
};
exports.upload = multer(multerOptions).single('image');

exports.resize = async (req, res, next) => {
  // check if there is no new file to resize
  if (!req.file) {
    next(); // skip to the next middleware
    return;
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.image = `${uuid.v4()}.${extension}`;
  // now we resize
  const image = await jimp.read(req.file.buffer);
  await image.cover(800,800);
  await image.write(`./public/uploads/${req.body.image}`);
  // once we have written the image to our filesystem, keep going!
  next();
};


// **- Routes -**  **- Routes -** **- Routes -** **- Routes -**
exports.homePage = async (req, res) => {
  const docs = await Doc.find()
  // res.send(docs)
  res.render('homePage', {title: 'homePage.pug', docs})
}

//ADD
//Create a doc GET
exports.addDoc = (req, res) => {
  res.render('editDoc', { title: 'editDoc.pug' });
};

//Create a doc - POST
//just to check your getting the req.body
// exports.createDoc = (req, res) => {res.json(req.body);};

exports.createDoc= async (req, res) => {
  const doc = new Doc(req.body);
  await doc.save();
  //or a short version
  //const store = await (new Store(req.body)).save();
  res.redirect('/');
};


// EDIT
// edit GET
exports.editDoc = async (req, res) => {
  const doc = await Doc.findOne({slug : req.params.slug});
  res.render('editDoc', { title: `Edit ${doc.name}`, doc});
};

// edit/update POST
exports.updateDoc = async (req, res) => {
  const doc = await Doc.findOneAndUpdate({ slug: req.params.slug }, req.body, {
    new: true, // return the new doc instead of the old one
    runValidators: true
  }).exec();
  req.flash('success', `Success ${doc.name} updated`);

  res.redirect(`/`);
};

exports.login = (req, res) => {
    res.render('login', {title: 'login.pug'})
}















//lols
