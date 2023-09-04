const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const requestsSchema = new Schema({
    requestId: {
        type: String,
        required: true
    },
    accepted: {
        type: Boolean,
        required: true
    },

    expertId: {
        type: String,
    },

    clientId: {
        type: String,
        required: true
    },
    
    problemSolved: {
        type: Boolean,
    },

    problemStatement: {
        type: String,
    },

    requestTime: {
        type: String,
        default: Date.now
    },

    requiredTech: {
        type: Array,

    }

});



module.exports = mongoose.model("Requests", requestsSchema);