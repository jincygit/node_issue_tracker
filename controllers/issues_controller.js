const Project = require('../models/project');
const Issues = require('../models/issues');


// render the list projects page
module.exports.listProjects = async function(req, res){
    try{
        //fetching project data
        Project.find({})
            .populate('issues')
            .exec(function(err, projects){
                // console.log(projects);
                return res.render('list_project.ejs', {
                    title: "Issue Tracker | Home",
                    projects:  projects
                });
            })
        
    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
    
}

// create issues for particular project
module.exports.create = async function(req, res){
    try{

        // issues creation
        let issues = await Issues.create({
            title: req.body.title,
            author: req.body.author,
            description: req.body.description,
            labels: req.body.labels,
            project: req.body.project
        });
        if (req.xhr){
            return res.status(200).json({
                data: {
                    issues: issues
                },
                message: "Issues created!"
            });
        }
        req.flash('success', 'Project created!');
        return res.redirect('back');


    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
}

// filter issues data
module.exports.issues_filtering = async function(req, res){
    try{            
        var filteredData =[];
        // filter with title and description
        if(req.body.inputdata){
            let titleIssues = await Issues.find({title: {$regex: req.body.inputdata, $options: "i"},project: req.body.project}); 
            let descriptionIssues = await Issues.find({description: {$regex: req.body.inputdata, $options: "i"},project: req.body.project}); 
            //filteredData = [...titleIssues, ...descriptionIssues];
            // console.log(titleIssues);
            // console.log(descriptionIssues);
            // console.log(filteredData);
            // Combine the filtered data into one object array and remove duplicates
            filteredData = [...new Set([...titleIssues, ...descriptionIssues])];
           // const combinedData = [...new Set([...titleIssues, ...descriptionIssues])];
            const combinedData = deduplicate([...titleIssues, ...descriptionIssues], '_id');
            var v = [...titleIssues, ...descriptionIssues];

            const uniqueData = [];
  
            // for (const item of v) {
            //     // Check if an equivalent item is already in uniqueData
            //     const duplicate = uniqueData.some((uniqueItem) => areEquivalent(item, uniqueItem));
                
            //     // If not a duplicate, add it to the uniqueData array
            //     if (!duplicate) {
            //     uniqueData.push(item);
            //     }
            // }
            // console.log(uniqueData);
        }


        // filter with author
        if(req.body.author){
            filteredData = await Issues.find({author: req.body.author,project: req.body.project}); 
        }


        // filter with labels
        if(req.body.labels){
            // Converting string to array
            const labels_array = req.body.labels.split(",");
            filteredData = await Issues.find({ labels: { $in: labels_array },project: req.body.project }); 


            // var filteredData = [];
            // // Loop through each value in the filterArray
            // for (const value of labels_array) {
            //     // Fetch data that matches the current value
            //     const data = await Issues.find({ labels: value,project: req.body.project });
            //     // Add the filtered data to the results array
            //     filteredData.push(...data);
            // }
        }


        if (req.xhr){
            if(filteredData){
                message = "Issues founded!";
            }
            else{
                message = "Issues not founded!";
            }
            return res.status(200).json({
                data: {
                    issues: filteredData
                },
                message: message
            });
        }
        return res.redirect('back');

        
    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
}

// Function to remove duplicates based on a unique key
function deduplicate(array, key) {
    const uniqueKeys = new Set();
    const result = [];
  
    for (const item of array) {
      const itemKey = item[key];
  
      if (!uniqueKeys.has(itemKey)) {
        uniqueKeys.add(itemKey);
        result.push(item);
      }
    }
  
    return result;
  }