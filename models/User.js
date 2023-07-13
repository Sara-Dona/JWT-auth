const mongoose =require ('mongoose');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: null,
  },
  lastName: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type:String,
    required: true,
  },
  token: {
    type:String,
  }
});

module.exports = mongoose.model('User', userSchema);