const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const catSchema = new Schema({
    cat_id : {
        type: String,
        required: true
    },
    name : {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,      
    },
    tags: {
        type: Array
    },
    totalEnrollment: {
        type: Number
    },
    experts: {
        type: Object
    }
});

module.exports = mongoose.model("Categories", catSchema);