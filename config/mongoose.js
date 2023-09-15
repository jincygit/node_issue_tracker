const mongoose = require('mongoose');

//mongoose.connect('mongodb://127.0.0.1:27017/contact_list_db');
const env = require('./environment');
mongoose.connect(`mongodb://127.0.0.1:27017/${env.db}`);
const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to MongoDB"));

db.once('open',function(){
    console.log('Connected to Database :: MongoDB');
});

module.exports = db;
// //require the library
// const mongoose = require('mongoose');

// //connect to the database
// //mongoose.connect("mongodb://127.0.0.1/contact_list_db");
// mongoose.connect("mongodb://127.0.0.1:27017/contact_list_db", { useNewUrlParser: true, useUnifiedTopology: true})
// //mongoose.connect("mongodb://127.0.0.1/contact_list_db", { useNewUrlParser: true, useUnifiedTopology: true})

// //"mongodb://127.0.0.1/next-js-registration-login-example"
// //"mongodb://127.0.0.1/contact_list_db"

// //acquire the connection(to check if it's successful)
// const db = mongoose.connection;

// //error
// db.on('error', function(err) { console.log("lllll");console.log(err.message); });

// //up and running then print the message
// db.once('open', function() {
  
//     console.log("Successfully connected to the database");

// });