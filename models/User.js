import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isAdmin: { type: Boolean, default: false, required: true },
})

const User = mongoose.model(
  'user',
  UserSchema
);
export default User;

//module.exports = User = mongoose.model('user', UserSchema)
