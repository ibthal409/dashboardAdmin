const user = require("../models/userModel");
const sharp = require('sharp');
const { uploadOneImage } = require("../middleware/uploadImageMiddleware");

class Features {
  constructor(query, queryString) {
    this.query = query;
    // console.log(query);
    this.queryString = queryString;
    // console.log(queryString);
  }


  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      // console.log(this.queryString);
      // console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('name');
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    // console.log(this.queryString);
    const limit = 8 * 1 || 0;
    const skip = (page - 1) * limit;
    // console.log(page);
    // console.log(this.query);
    // console.log(limit)
    // console.log(skip);
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
  search() {
    if (this.queryString.search) {
      const searchQuery = this.queryString.search.split(',').join(' ');
      console.log(searchQuery);
      this.query = this.query.find({
        "$or": [
          { name: { $regex: searchQuery } },
          { email: { $regex: searchQuery } },
        ]
      })
      // console.log(this.queryString);
      // console.log("line44 " + searchBy);
      // this.query = this.query.search({ "name": searchBy });
      // console.log(this.query);
    }
    else {
      // this.query = this.query.search({ "name": '' });
    }
    return this;





    // console.log(search);



  }
}


const uploadUserImage = uploadOneImage()
const resizeUserPhoto = async (req, res, next) => {
  if (!req.file) return next();

  const filename = `user-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`uploads/user/${filename}`);
  //saveImage as string
  req.body.image = filename
  //saveImage as url
  // req.body.image = req.hostname+filename

  next();
};

async function Adduser(req, res, next) {
  const { name, email, phone,age, password, passwordConfirm, active, image } = req.body;

  try {

    const newUser = new user({ name, email, phone,age, password, passwordConfirm, active, image });
    const savednewUser = await newUser.save();
    res.status(201).json("user added successfully");
  } catch (error) {
    res.status(400).json({ error: error.message });

  }


}

// async function getusers(req, res, next) {
//   try {
//     const users = await user.find();
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
async function getusers(req, res, next) {
  try {
    const feature = new Features(user.find(), req.query).search().sort();                ///.paginate()
    const users = await feature.query;
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

async function updateUser(req, res) {
  const userId = req.params.id;
  const updates = req.body;
  try {
    const updatedUser = await user.findByIdAndUpdate(userId, updates, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'No user found with that ID' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

async function getUserByID(req, res) {
  const userId = req.params.id;
  try {
    const SpasificUSer = await user.findById(userId);
    if (!SpasificUSer) {
      return res.status(404).json({ message: 'No user found with that ID' });
    }
    res.status(200).json(SpasificUSer);
    return userId
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


async function deleteUser(req, res) {

  try {
    const userId = req.params.id;
    console.log(userId);
    const deletedUser = await user.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'No user found with that ID' });
    }
    res.status(200).json({ message: 'user deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }

};


async function deactive(req, res, next) {
  try {
    const deactiveUser = await user.findByIdAndUpdate(req.params.id, { active: false });
    res.status(204).json(deactiveUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  getusers, Adduser, updateUser, getUserByID, deleteUser, deactive, uploadUserImage, resizeUserPhoto

}
