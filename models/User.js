const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  profile: { type: String, default: "" },
  fullname: { type: String},
  mobile: { type: String},
  gender: { type: String},
  Payment:{type:String,default:""},
  status :{type:String,default:'active'}
});

module.exports = mongoose.model("User", UserSchema);
