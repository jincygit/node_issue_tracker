const Project = require('../models/project');
const Issues = require('../models/issues');
const Label = require('../models/label');
const merge = require('deepmerge')


// render the list projects home page
module.exports.listProjects = async function(req, res){
    try{
        //fetching project data
        Project.find({})
            .populate('issues')
            .exec(function(err, projects){
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


// render the create project
module.exports.create = async function(req, res){
    try{
        //project creation
        let project = await Project.create({
            name: req.body.name,
            author: req.body.author,
            description: req.body.description,
        });
        if (req.xhr){
            return res.status(200).json({
                data: {
                    project: project
                },
                message: "Project created!"
            });
        }
        req.flash('success', 'Project created!');
        return res.redirect('back');
    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
}


// render the create project page
module.exports.projectDetail = async function(req, res){
    try{
        // checking whether id exist or not
        if(req.params.id){
            // get project data 
            let projectData = await Project.findById(req.params.id);
            // get all labels from db
            let labels = await Label.find();
            // get issues of particular project
            let issues = await Issues.find({ project: req.params.id}).exec();
            // get all authors
            let issuesAuthors = await Issues.find().select('author')


            if(req.params.id){
                return res.render('project_detail', {
                    title: "Issue Tracker | Project details",
                    projectData: projectData,
                    labels: labels,
                    issues: issues,
                    issuesAuthors: issuesAuthors
                })
            }else{
                req.flash('error', 'No project data avaliable');
                return res.redirect('back');
            }

        }else{
            req.flash('error', err);
            return res.redirect('back');
        }
        
    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
}