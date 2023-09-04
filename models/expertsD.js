const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');


const expertsDSchema = new Schema({
    email: { 
        type: String,
        required: true 
    },

    username: {
        type: String,
        required: true

    },

    name: {
        type: String,
        required: true

    },
    userImageUrl: {
        type: String,
        
    },
    skills: {
        type: Array

    },

    req: {
        type: String
    },

    verified: {
        type: Boolean,

    },
    country: {
        type: String,
    },



    lastActive: {
        type: String,

    },
    desc: {
        type: String,

    },
    phoneNumber: {
        type: String,

    },

    userType: {
        type: String,
        required: true
    },

    versionCode: {
        type: Number
    },

    versionName: {
        type: String
    },

    date_created : {
        type: String,
        required: true,
        default: Date.now

    }

});

expertsDSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10)); };
  
expertsDSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

module.exports = mongoose.model("ExpertDet", expertsDSchema);