const Like = require("../models/like");
const Post =  require("../models/post");
const User = require('../models/user');
const Friendship = require('../models/friendship');



module.exports.togglefriendship = async function(req, res){
    try{
        //const url = new URL('http://localhost:8000/friendship/toggle/?id=64f1ca1357978c2cdc64a956&type=Comment');
        //const search = url.searchParams;
        //console.log(search.get('id'));
        console.log(req.query.id);
        console.log(req.user._id);
        //check both users for friendship is valid or not
        let friendship_requested_from_user = await User.findById(req.user._id);
        let friendship_requested_to_user = await User.findById(req.query.id);
        if (friendship_requested_from_user && friendship_requested_to_user){
            let users_combination = await Friendship.findOne({ 
                from_user: friendship_requested_from_user, to_user: friendship_requested_to_user })
                .exec();
            if(!users_combination){
                let reverse_users_combination = await Friendship.findOne({ 
                    to_user: friendship_requested_from_user, from_user: friendship_requested_to_user })
                    .exec();
                    if(!reverse_users_combination){
                        //if no users combo exist then create friendship
                        let friendship = await Friendship.create({
                            from_user: friendship_requested_from_user,
                            to_user: friendship_requested_to_user
                        });
                        return res.json(200, {
                            message: "Friendship added successful!",
                            data: {
                                friendship: friendship,
                                deleted: false
                            }
                        })
                        
                    }
                    else{
                        //remove friendship
                        reverse_users_combination.remove();
                        return res.json(200, {
                            message: "Friendship deleted successful!",
                            data: {
                                deleted: true
                            }
                        });
                    }
            }
            else{
                //remove friendship
                users_combination.remove();
                return res.json(200, {
                    message: "Friendship deleted successful!",
                    data: {
                        deleted: 119
                    }
                });
            }
            

            
        }
        else{
            return res.json(500, {
                message: 'Users not exist'
            });

        }


        



    }catch(err){
        console.log(err);
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}