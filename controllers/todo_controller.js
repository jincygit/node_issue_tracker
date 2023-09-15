const Todo = require('../models/todo');

module.exports.home = function(req, res){
    //console.log(req.cookies);
    //res.cookie('user_id', 25);
    // return res.render('home', {
    //     title: "Home"
    // });
    console.log("home");
    Todo.find({}, function(err, list){
        if (list){
            console.log(list);
            return res.render('todo_app', {
                title: "HOME",
                todoList: list
            })
        }else{
            return res.redirect('/todo/home');

        }
    });
}

// get the sign up data
module.exports.create = async function(req, res){
    
    try{
        let itemTask = await Todo.create(req.body);
        //console.log(created_todo_task);
        if (req.xhr){
            //post = await post.populate('user', 'name').execPopulate();

            return res.status(200).json({
                data: {
                    itemTask: itemTask
                },
                message: "Post created!"
            });
        }
        req.flash('success', 'Post published!');
        return res.redirect('back');
    }catch(err){
        req.flash('error', err);
        console.log('Error', err);
        return res.redirect('back');
    }
}

module.exports.delete = function(req, res){
    console.log(req.body.arr);
    if(req.body.arr){
        for (let i = 0; i < req.body.arr.length; i++) {
            console.log(req.body.arr[i]);
            Todo.deleteOne({"_id" : req.body.arr[i] }, function(err){
                if(err){
                    console.log('error in deleting the object');
                    return;
                }  
            })
        }
        //return res.redirect('/todo/home');
    }
    //return res.redirect('/todo/home');
    return res.redirect('back');
}

// module.exports.actionName = function(req, res){}