const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
  }));
  // use for store public acces file 
  app.use(express.static("public"));

//connect mongoDB
mongoose.connect('mongodb://localhost/wikiDB', {useNewUrlParser: true,useUnifiedTopology: true});

//defining a Schema 
const articleSchema = new mongoose.Schema({
    title:String,
    content:String
});

//create a model
const Article = new mongoose.model("Article",articleSchema);

/////////////////////////////////////Request targeting all articles//////////////////////////////

// get request /articles
//returns all of the articles 
app.route("/articles")

.get(function(req,res){

    Article.find({},function(err,foundArticles){
       if (!err) {
        res.send(foundArticles);
       } else {
           res.send(err);
       }
    });

})

.post(function(req,res){

    const newArticle = new Article({
        title : req.body.title,
        content:req.body.content
    });

    newArticle.save(function(err){
        if (!err) {
            res.send("Succesfully add a new article");
        } else {
            res.send(err);
        }
    });
})

.delete(function(req,res){
    Article.deleteMany({},function(err){
        if (!err) {
            res.send("Succesfully deleted all articles.");
        } else {
            res.send(err);
        }
    });
})

//////////////////////////////////////Request target a specific articles///////////////////////
app.route("/articles/:articleTitle")

.get(function(req,res){
    Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
        if (!err) {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("Not found!")
            }
        } else {
            res.send(err);
        }
    });
})

.put(function(req,res){
    Article.update(
        {title:req.params.articleTitle},
        {title:req.body.title,content:req.body.content},
        {overwritee:true},
        function(err){
            if (!err) {
                res.send("Succesfully updated.");
            } else {
                res.send(err);
            }
        });
});


//open 3000 port for client access
app.listen(3000, function() {
  console.log("Server started on port 3000");
});