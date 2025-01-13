// models/Task.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FamilyMember = new Schema({
  familyId:{
    type:String
  },
  name: {
    type: String,
  },
  dob: {
    type: String,
  },
  gender: {
    type: String,
  },
  maritalStatus: {
    type: String,
  },
  education: {
    type: String,
  },
  contactEmail: {
    type: String,
  },
  contactPhone: {
    type: String,
  },
  occupation: {
    type: String,
  },
  image:{
    type: String
  },
  relations:{
    type:String
  }

});


const FamilyMemPerson = mongoose.model("FamilyMem", FamilyMember);
module.exports = FamilyMemPerson;
