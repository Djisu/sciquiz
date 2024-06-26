import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();
import auth from '../../middleware/auth.js';
import { check, validationResult } from 'express-validator';
//import normalize from 'normalize-url');
import checkObjectId from '../../middleware/checkObjectId.js';

import Profile from '../../models/Profile.js';
import User from '../../models/User.js';

// // @route  POST api/profile
// // @desc   Test route
// // @access Public
// router.get('/', (req, res) => res.send('profile route'))

// @route  GET api/profile/me
// @desc   Get current user profile
// @access Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route  POST api/profile
// @desc   Create or update a user profile
// @access Private
router.post(
  '/',
  [
    auth,
    [
      check('school', 'School is required').not().isEmpty(),
      check('status', 'Status is required').not().isEmpty(),
      check('name', 'Name is required').not().isEmpty(),
      check('bio', 'Bio is required').not().isEmpty(),
      check('email', 'Email address is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log('in POST api/profile post/put');

    const { user, school, status, name, email } = req.body;

    // Build profile object
    const profileFields = {};

    profileFields.user = req.user.id;
    if (school) profileFields.school = school;
    if (status) profileFields.status = status;
    if (bio) profileFields.bio = bio;
    if (name) profileFields.name = name;
    if (email) profileFields.email = email;

    try {
      //      let profile = await Profile.findOne({ user: req.user.id });
      //
      //      if (profile) {
      //        // Update
      //        profile = await Profile.findOneAndUpdate(
      //          { user: req.user.id },
      //          { $set: profileFields },
      //          { new: true }
      //        );
      //        return res.json(profile);
      //      }

      // Create new profile
      let profile = new Profile(profileFields);

      await profile.save();

      //experiment
      Profile.updateMany({}, [
        {
          $lookup: {
            from: 'User', // The name of the User collection
            localField: profileFields.user, // The field in the Profile collection
            foreignField: user, // The field in the User collection
            as: 'user_data'
          }
        },
        {
          $unwind: '$user_data'
        },
        {
          $set: {
            email: '$user_data.email'
          }
        }
      ]);

      //end of experiment

      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route  PUT api/profile
// @desc   Update a user profile
// @access Private
router.put(
  '/',
  [
    auth,
    [
      check('school', 'School is required').not().isEmpty(),
      check('status', 'Status is required').not().isEmpty(),
      check('name', 'Name is required').not().isEmpty(),
      check('bio', 'Bio is required').not().isEmpty(),
      check('email', 'Email address is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log('in POST api/profile post/put');

    const { user, school, status, name, bio, email } = req.body;

    // Build profile object
    const profileFields = {};

    profileFields.user = req.user.id;
    if (school) profileFields.school = school;
    if (status) profileFields.status = status;
    if (name) profileFields.name = name;
    if (bio) profileFields.bio = bio;
    if (email) profileFields.email = email;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      } else {
        console.log('Profile not found');
        res.status(404).send('Profile not found');
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route  GET api/profile
// @desc   GET all profiles
// @access Public
router.get('/', async (req, res) => {
  console.log('in profile router.get(/');

  try {
    //const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    const profiles = await Profile.aggregate([
      {
        $lookup: {
          from: "users", // Name of the user collection
          localField: "user", // Field in the profiles collection
          foreignField: "_id", // Field in the users collection
          as: "userDetails" // Alias for the joined user details
        }
      },
      {
        $unwind: "$userDetails" // Deconstruct the array field created by $lookup
      },
      {
        $project: {
          _id: 1, // Include the profile _id field
          name: 1, // Include other profile fields you want
          status: 1,
          school: 1,
          bio: 1,
          user: 1, // Include user fields as profile fields
          avatar: "$userDetails.avatar",
          email: "$userDetails.email",
        }
      }
    ]);
    

    console.log('backend FETCHED profiles', profiles);

    return res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route  GET api/profile/user/:user_id
// @desc   GET profile by user ID
// @access Public
router.get('/user/:userId', async (req, res) => {
   console.log('router.get(/user/:userId', req.params.userId)

   const newUserId = new mongoose.Types.ObjectId(req.params.userId);

  if (!mongoose.Types.ObjectId.isValid(newUserId)) {
    return res.status(400).json({ message: 'Invalid userId' });
  }

  console.log('newUserId:: ', newUserId)

  try {
    const profile = await Profile.aggregate([
      {
        $match: {
          user: newUserId // Use the newUserId variable
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      {
        $unwind: "$userDetails"
      },
      {
        $project: {
          _id: 1,
          name: 1,
          status: 1,
          school: 1,
          bio: 1,
          user: 1,
          avatar: "$userDetails.avatar",
          email: "$userDetails.email",
          userName: "$userDetails.name",
        }
      }
    ]);

    console.log('fetched profileXXXXX=', profile);
    console.log('=================================================');

    return res.json(profile);
  } catch (err) {
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route  GET api/profile/:status
// @desc   GET profile by status
// @access Public
router.get('/:status', async (req, res) => {
  //  console.log('in profile by status', req.params.status);

  //  console.log('req==', req);

  try {
    // const user = await User.findById(req.user.id).select('-password')

    const profile = await Profile.find({
      status: { $eq: req.params.status }
    });

    if (!profile) return res.status(400).json({ msg: 'Profile not found' });

    // console.log('profile===', profile)

    res.json(profile);
  } catch (err) {
    console.error(err.message);

    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route  DELETE api/profile/:id
// @desc   Delete profile, user & posts
// @access Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });

    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
