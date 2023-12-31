const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    unique : true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  imageUrl : {
    type : String,
    required : false,
  },
  status: {
    type: String,
    default: 'I am new!',
    required : false,
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post'
    }
  ]
},{timestamps:true});

module.exports = mongoose.model('User', userSchema);
