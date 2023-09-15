{
                                                               // method to submit the form data for new post using AJAX
    let createPost = function(){
        let newPostForm = $('#new-todo-item');

        newPostForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/todo/create',
                data: newPostForm.serialize(),//convert formdata into json
                success: function(data){
                    //console.log(data);
                    let newPost = newItemDom(data.data.itemTask);
                    $('#todo-list-container>ul').prepend(newPost);
                    //deletePost($(' .delete-post-button', newPost));

                    // call the create comment class
                    //new PostComments(data.data.post._id);

                    // CHANGE :: enable the functionality of the toggle like button on the new post
                    //new ToggleLike($(' .toggle-like-button', newPost));

                    new Noty({
                        theme: 'relax',
                        text: "Todo item published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();

                }, error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }


    // method to create a post in DOM
    let newItemDom = function(item){
        return $(`<li id="item-${item._id}">
                    <div class="form-group">
                        <input type="checkbox" name="delechack" class="delechack"  uid = ${item._id}>
                                    <p style="margin: -21px 42px 8px 83px; font-size: 15px;">${ item.desc }</p>
                                    <p style="    margin: -9px 0px 9px 81px;" >${ item.selected_date }</p>
                                
                                <div class="catesec" style="margin: -21px 31px 20px 284px;
                                font-size: 12px;
                                text-transform: uppercase;
                                background-color: red;
                                width: 100px;
                                height: 27px;
                                padding: 6px 0px 0px 17px;
                                color: #fff;">
                                ${ item.category }
                                </div>
                    </div>    
                </li>`)
    }

    // method to delete a post from DOM
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();
                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                },error: function(error){
                    console.log(error.responseText);
                }
            });

        });
    }

    // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
    let convertPostsToAjax = function(){
        $('#posts-list-container>ul>li').each(function(){  // for loop for posts
             //console.log(this);
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);

            // get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1]
            new PostComments(postId);
        });
    }

    function checkedOrNot(){
        let checkedvalue = document.querySelectorAll('.delechack:checked');
        let arrcheck = []  // creating the lsit of checked array
        for(let i of checkedvalue){
            arrcheck.push(i.getAttribute('uid') );
        }
        console.log("arrcheck values  ",arrcheck);
        $.ajax({
            type: 'post',
            url: '/todo/delete',
            data: {
                arr: arrcheck        
            },
            success: function(){ // on ajax sunnces i.e when data is delete
                for (let i = 0; i < arrcheck.length; i++) {

                    $(`#item-${arrcheck[i]}`).remove();
                  }
                //
                    new Noty({
                        theme: 'relax',
                        text: "Todo Task Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                
            },
            error: function(err){ 
                console.log(err);
            }
    
        });
    }

    createPost();
    convertPostsToAjax();
}