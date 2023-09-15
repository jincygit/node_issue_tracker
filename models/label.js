const mongoose = require('mongoose');


const labelSchema = new mongoose.Schema({
    labelname: {
        type: String,
        required: true
    }
});

const Label = mongoose.model('Label', labelSchema);
module.exports = Label;