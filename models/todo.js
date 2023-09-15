const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    selected_date: {
        type: Date,
    },
    desc: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});


const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;