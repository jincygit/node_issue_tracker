const mongoose = require('mongoose');


const issuesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    labels: {
        type: Object,
        required: true
    },
    project: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }
},{
    timestamps: true
});

const Issues = mongoose.model('Issues', issuesSchema);
module.exports = Issues;