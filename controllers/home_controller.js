const Post = require('../models/post');
const User = require('../models/user');
const Friendship = require('../models/friendship');


//async keyword declares this fn have some async statements
module.exports.home = async function(req, res){
    try{
        // populate the user of each post
       let posts = await Post.find({})
       .sort('-createdAt')
       .populate('user')
       .populate({
           path: 'comments',
           populate: {
               path: 'user'
           },
           populate: {
               path: 'likes'
           }
       })
       .populate('likes');
   
       let users = await User.find({});
       let friendship =[];
       if(req.user){
            friendship = await Friendship.find({from_user:req.user._id}).populate({
                path: 'to_user',
                populate: {
                    path: 'user'
                }
            });
        }
       //console.log(friendship);
       return res.render('home', {
           title: "Codeial | Home",
           posts:  posts,
           all_users: users,
           friendship:  friendship,
       });

   }catch(err){
       console.log('Error', err);
       return;
   }
}

module.exports.home_old_before_async = function(req, res){
    // console.log(req.cookies);
    // res.cookie('user_id', 25);
    // return res.render('home', {
    //     title: "Home"
    // });
    // Post.find({}).populate('user').exec(function(err, posts){
    //     return res.render('home', {
    //         title: "Codeial | Home",
    //         posts:  posts
    //     });
    // })
    Post.find({})
    .populate('user')
    .populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    })
    .exec(function(err, posts){
        return res.render('home', {
            title: "Codeial | Home",
            posts:  posts
        });
    })
}

// module.exports.actionName = function(req, res){}