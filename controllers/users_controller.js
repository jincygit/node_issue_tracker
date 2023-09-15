const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const Friendship = require('../models/friendship');
const ChangePasswordUser = require('../models/changePasswordUser');
const crypto = require('crypto');


// module.exports.profile = function(req, res){
//     if (req.cookies.user_id){
//         User.findById(req.cookies.user_id, function(err, user){
//             if (user){
//                 return res.render('user_profile', {
//                     title: "User Profile",
//                     user: user
//                 })
//             }else{
//                 return res.redirect('/users/sign-in');

//             }
//         });
//     }else{
//         return res.redirect('/users/sign-in');

//     }


    
// }


module.exports.profile = async function(req, res){
        let user = await User.findById(req.params.id);
        let friendship_exist_flag = false;
        let friendship = await Friendship.findOne({ 
            from_user: req.user._id, to_user: req.params.id })
            .exec();
        if(!friendship){
            let reverse_users_combination = await Friendship.findOne({ 
                to_user: req.user._id, from_user: req.params.id })
                .exec();
                if(friendship){friendship_exist_flag = true;}
        }
        else{ friendship_exist_flag = true;}
        

        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user,
            friendship:  friendship,
            friendship_exist_flag:  friendship_exist_flag,
        });
    

}

module.exports.profile1 = function(req, res){
    User.findById(req.params.id, function(err, user){
        let friendship = Friendship.findOne({ 
            from_user: req.user._id, to_user: req.params.id })
            .exec();
        let reverse_users_combination = Friendship.findOne({ 
            to_user: req.user._id, from_user: req.params.id })
            .exec();
        const merged = Object.assign({}, friendship, reverse_users_combination)  
  
            console.log(friendship);
            console.log(reverse_users_combination);
            console.log("merged");
            console.log(merged);
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user,
            friendship:  friendship,
        });
    });

}


module.exports.update = async function(req, res){
    if(req.user.id == req.params.id){
        try{
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){console.log('****Multererror*****', err)}
                console.log(req.file);
                user.name = req.body.name;
                user.email = req.body.email;
                // if(req.file){
                //     user.avatar = User.avatarPath + '/'+ req.file.filename;
                // }
                if (req.file){

                    if (user.avatar){
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }


                    // this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });
            
        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }
        // User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
        //     return res.redirect('back');
        // });
    }else{
        req.flash('error', 'Unauthorized');
        return res.status(401).send('Unauthorized');
    }
}

// render the sign up page
module.exports.signUp = function(req, res){
    //console.log(req.cookies);//get cookie
    //res.cookie("user_id",100);//alter or create cookie
    //console.log(req.cookies);
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}

// render the forgot password page
module.exports.forgot_password = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_forgot_password', {
        title: "Codeial | Forgot Password"
    })
}


module.exports.verifyForgotPasswordUser = async function(req, res){
    try{
        //check user exist or not
        let user = await User.findOne({email: req.body.email});
        let action = "";
        let access_token = "";

        if (user){
            //check user have entry or not
            let userExist = await ChangePasswordUser.findOne({user: user._id});
            if (userExist){
                await ChangePasswordUser.updateOne({ user: user._id}, {
                    isVallid:10
                  });
                action = "updated";
                access_token = userExist.access_token;
            
            }else{
                access_token = await crypto.randomBytes(20).toString('hex');
                await ChangePasswordUser.create({
                    user: user._id,
                    access_token: access_token,
                    isVallid: 1
                });
                action = "created";
                
            }
            console.log(action);
            return res.render('user_change_password', {
                title: "Codeial | Change Password",
                access_token: access_token
            })
        }else{
            req.flash('error', err);
            return res.redirect('back');
        }

    
    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
}


// render the forgot password page
module.exports.updatePassword = async function(req, res){
    try{
        //check password and confirm_password is equal or not
        if (req.body.password != req.body.confirm_password){
            return res.redirect('back');
        }
        //check user have entry or not
        let userExist = await ChangePasswordUser.findOne({access_token: req.body.user_acess_token});
        if (userExist){
            //then update password
            await User.updateOne({_id: userExist.user}, {
                password:req.body.password
            });
            req.flash('success', "password updated");
        
        }
        else{
            req.flash('error', "Invalid token");
        }
        
        return res.redirect('/users/sign-in');
    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
}

// render the sign in page//7709691784
module.exports.signIn = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
}

// get the sign up data
module.exports.create = function(req, res){
    //check password and confirm_password is equal or not
    if (req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){console.log('error in finding user in signing up'); return}

        if (!user){
            User.create(req.body, function(err, user){
                if(err){console.log('error in creating user while signing up'); return}

                return res.redirect('/users/sign-in');
            })
        }else{
            return res.redirect('back');
        }

    });
}


// sign in and create a session for the user
module.exports.createSession_old = function(req, res){

    // steps to authenticate
    // find the user
    User.findOne({email: req.body.email}, function(err, user){
        if(err){console.log('error in finding user in signing in'); return}
        // handle user found
        if (user){

            // handle password which doesn't match
            if (user.password != req.body.password){
                return res.redirect('back');
            }

            // handle session creation
            res.cookie('user_id', user.id);
            console.log(user.id);
            //64f18eb8b04f7617e83f92d1
            //return res.redirect('/users/profile/${user.id}');
            return res.redirect(`/users/profile/${user.id}`);//backtick

        }else{
            // handle user not found

            return res.redirect('back');
        }


    });

 

    

    
}


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res,next){
    req.logout();
    req.flash('success', 'You have logged out!');
    return res.redirect('/');
    // req.logout(function(err) {
    //     console.log("logout2");console.log(err);
    //     if (err) { return next(); }
    //     res.redirect('back');
    // });
}