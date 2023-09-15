const express = require('express');
const env = require('./config/environment');

const app = express();
require('./config/view-helpers')(app);
const path = require('path');
const port = 8000;


const expressLayouts = require('express-ejs-layouts');
//connect mongo db config file
const db = require('./config/mongoose');

// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

const MongoStore = require('connect-mongo')(session);
// var MongoStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const customMware = require('./config/middleware');

// setup the chat server to be used with socket.io
//const chatServer = require('http').Server(app);
const chatServer = require('http').Server(app,{
    cors: {
      origin: true,
      credentials: true,
    },
    allowEIO3: true,
  });
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');

// const mongoose = require("mongoose");
const Contact = require('./models/contact');

const cookieParser = require('cookie-parser');
app.use(express.urlencoded());
//app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded());
app.use(express.static('assets'));

//app.use(express.static('./assets'));
app.use(express.static(env.asset_path));

//make uploads path avaliable
app.use('/uploads',express.static(__dirname +'/uploads'));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// mongo store is used to store the session cookie in the db
// app.use(session({
//     name: 'codeial',
//     // TODO change the secret before deployment in production mode
//     secret: 'blahsomething',
//     saveUninitialized: false,
//     resave: false,
//     cookie: {
//         maxAge: (1000 * 60 * 100)
//     },
//     //store: MongoStore.create({ client: require("./config/mongoose") })
//     //store: MongoStore.create({ client: db })
//     // store: MongoStore.create({
//     //     mongoUrl: 'mongodb://localhost:27017/contact_list_db'
//     //   })
//     store: new MongoStore(
//         {
//             mongooseConnection: db,
//             autoRemove: 'disabled'
        
//         },
//         function(err){
//             console.log(err ||  'connect-mongodb setup ok');
//         }
//     )
// }));

// app.use(session({
//     name: 'codeial',
//     secret: 'blahsomething',
//     httpOnly: true,
//     secure: true,
//     maxAge: 1000 * 60 * 60 * 7,
//     resave: false,
//     saveUninitialized: true,
//     store: MongoStore.create({
//         mongoUrl: 'mongodb://0.0.0.0:27017/contact_list_db'
//     })
// }));


//mongodb://127.0.0.1/contact_list_db


app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore({
        mongooseConnection: db,
        autoRemove: 'disabled'
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);

// use express router
app.use('/', require('./routes'));

var contactList = [
    {
        name: "Arpan",
        phone: "1111111111"
    },
    {
        name: "Tony Stark",
        phone: "1234567890"
    },
    {
        name: "Coding Ninjas",
        phone: "12131321321"
    }
]

app.get('/practice', function(req, res){
    return res.render('practice', {
        title: "Let us play with ejs"
    });
});


app.get('/', function(req, res){

    // return res.render('home',{
    //     title: "Contact List",
    //     contact_list: contactList
    // });
    Contact.find({}, function(err, contacts){
        if(err){
            console.log("error in fetching contacts from db");
            return;
        }
        return res.render('home',{
            title: "Contact List",
            contact_list: contacts
        });

    })
})
app.post('/create-contact', function(req, res){
    
    // contactList.push(req.body);
    // return res.redirect('/');
    Contact.create({
        name: req.body.name,
        phone: req.body.phone
    }, function(err, newContact){
        if(err){console.log('Error in creating a contact!')
            return;}
            console.log('******', newContact);
            return res.redirect('back');
    })

});

app.get('/delete-contact/', function(req, res){
    // console.log(req.query);
    // let phone = req.query.phone

    // let contactindex = contactList.findIndex(contact => contact.phone == phone);

    // if(contactindex != -1){
    //     contactList.splice(contactindex, 1);
    // }

    // return res.redirect('back');

    console.log(req.query);
    let id = req.query.id

    Contact.findOneAndDelete(id, function(err){
        if(err){
            console.log('error in deleting the object');
            return;
        }
        return res.redirect('back');
    })
});

//app.use(express.json());

app.listen(port, function(err){
    if (err) {
        console.log("Error in running the server", err);
    }
    console.log('Yup!My Server is running on Port', port);
})


