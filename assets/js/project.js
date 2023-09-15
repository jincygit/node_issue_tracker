{
    console.log("project js loaded");
    // for create new project
    let createProject = function(){
        let newPostForm = $('#new-project-form');

        newPostForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/project/create',
                data: newPostForm.serialize(),//convert formdata into json
                success: function(data){
                    // add new elemnts as per responsedata
                    let newPost = newProjectDom(data.data.project);
                    $('#projects-list-container').prepend(newPost);


                    //remove old values from input
                    document.getElementById('projectName').value="";
                    document.getElementById('projectAuthor').value="";
                    document.getElementById('projectDesc').value="";


                    new Noty({
                        theme: 'relax',
                        text: "Project published!",
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
    let newProjectDom = function(project){
        return $(`<div class="col-lg-4 border-start custom-border" id="post-${project._id}">
        <div class="post-entry-1">
            <a href="details/${project._id}"><img src="/images/post-landscape-5.jpg" alt="" class="img-fluid" style="height: 83px;width: 100%;"></a>
            <div class="post-meta"><span>${project.author}</span></div>
            <h2><a href="details/${project._id}">${project.name}</a></h2>
            <div class="form-group" style="margin: 0px 0px 14px 0px;">
                <a href="details/${project._id}">
                    <input type="submit" name="btnSubmit" class="btnContact" value="View Details" />
                </a>
            </div>
        </div>
    </div>`)
    }


    // method to create a post in DOM
    let newIssueDom1 = function(issue){
        return $(`<div class="row p-2 bg-white border rounded" style="width: 1118px;" id="issue-${issue._id}">
        <div class="col-md-3 mt-1"><img class="img-fluid img-responsive rounded product-image" src="/images/bug1.jpg"></div>
        <div class="col-md-6 mt-1">
            <h5>${issue.title}</h5>
            <p class="text-justify text-truncate para mb-0">${issue.author}<br><br></p>
            <div class="mt-1 mb-1 spec-1" id="label-${issue._id}">
              
              
            </div>
            <p class="text-justify text-truncate para mb-0">${issue.description} <br><br></p>
        </div>
        
      </div>
      `)
    }


    // method to create  each labels in DOM
    let newIssueDom2 = function(label){
        return $(`<span class="dot"></span><span>${label}</span>`)
    }
    

    // for create new issues
    let createIssues = function(){
        let createIssuesForm = $('#new-issues-form');

        createIssuesForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/issues/create',
                data: createIssuesForm.serialize(),//convert formdata into json
                success: function(data){
                    // add new elemmnt by js
                    let dom1 = newIssueDom1(data.data.issues);
                    $('#issues-list-container').prepend(dom1);
                    for (let i = 0; i < data.data.issues.labels.length; i++) {
                        var dom2 = newIssueDom2(data.data.issues.labels[i]);
                        $('#label-'+data.data.issues._id).append(dom2);
                    }


                    //remove old values from input
                    document.getElementById('issueTitle').value="";
                    document.getElementById('issueAuthor').value="";
                    document.getElementById('issueDesc').value="";
                    
                    
                    // success notification setting
                    new Noty({
                        theme: 'relax',
                        text: "Issue created!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();

                }, error: function(error){
                    //error case
                    console.log(error.responseText);
                }
            });
        });
    }


    // for filtering in issues page
    function filtering(type){
        // get input  for filtering
        let project_id = document.getElementById("projectId").value;
        let search_by_title = document.getElementById("search_by_title").value;
        if(document.getElementById("search_by_desc")){
            let search_by_desc = document.getElementById("search_by_desc").value;
        }
        var search_by_author = document.getElementById("search_by_author");
        if(search_by_author){
            var search_by_author_value = search_by_author.value;
        }
        

        // get checkbox data
        var checkboxes = document.querySelectorAll('input[name="search_by_labels"]:checked');
        var search_by_labels = [];
        // looping through all checkboxes
        for (var i = 0; i < checkboxes.length; i++) {
            search_by_labels.push(checkboxes[i].value);
        }


        // setting input data
        var inputdata = '';
        if(type == 'labels'){
            inputdata = 'labels='+search_by_labels+'&project='+project_id;
        }
        else if(type == 'title'){
            inputdata = 'inputdata='+search_by_title+'&project='+project_id;
        }
        else if(type == 'description'){
            inputdata = 'inputdata='+search_by_desc+'&project='+project_id;
        }
        else{
            inputdata = 'author='+search_by_author_value+'&project='+project_id;
        }


        $.ajax({
            type: 'post',
            url: '/issues/filter',
            data: inputdata,//convert formdata into json
            success: function(data){
                // Get a reference to the div element
                const divElement = document.getElementById('issues-list-container');
                // Remove all existing child elements from the div
                while (divElement.firstChild) {
                    divElement.removeChild(divElement.firstChild);
                }

                
                var noty_msg ="";
                // add new elemnts as per responsedata
                if(data.data.issues.length>0){
                    noty_msg = "Data founded!";
                    for (let i = 0; i < data.data.issues.length; i++) {
                        var labels_count = data.data.issues[i].labels.length;
                        // add new elemmnt by js
                        let dom1 = newIssueDom1(data.data.issues[i]);
                        $('#issues-list-container').prepend(dom1);
                        for (let l = 0; l < labels_count; l++) {
                            var dom2 = newIssueDom2(data.data.issues[i].labels[l]);
                            $('#label-'+data.data.issues[i]._id).append(dom2);
                        }
                            
                    }
                }
                else{
                    noty_msg = "Data not founded!";
                }
                
                
                // success notification setting
                new Noty({
                    theme: 'relax',
                    text: noty_msg,
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500
                    
                }).show();

            }, error: function(error){
                //error case
                console.log(error.responseText);
            }
        });
    }


    createProject();
    createIssues();
}
