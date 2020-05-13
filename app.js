//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "This is my blog page. It is for my girlfriend Zoe. I think we are going steady but I will keep you updated."
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://darren:mazah4@blogcluster-7oywj.mongodb.net/blogDB',
 {useNewUrlParser: true, useUnifiedTopology: true});

const postSchema = new mongoose.Schema ({
  postTitle: String,
  postContent: String
});

const Post = mongoose.model ("Post", postSchema);

app.get("/", function(req, res){

  Post.find({},function(err, foundPosts){
    if (err){

      console.log(err);
    };

  res.render("home", {
    startingContent: homeStartingContent,
    posts: foundPosts
    });
    });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){

  const post = new Post ({
    postTitle: req.body.postTitle,
    postContent: req.body.postBody
  });
  post.save();
if (!err) {
  res.redirect("/");
}
});

app.get("/posts/:postName", function(req, res){
  const requestedTitle = req.params.postName;

    Post.findOne({postTitle: requestedTitle},function(err,foundPost){

      if (!foundPost) {
        console.log("No such entry");
      } else
      {
          res.render("post", {
            title: foundPost.postTitle,
            content: foundPost.postContent
          });
        };
    });

  });

  let port = process.env.PORT;
  if (port == null || port == "") {
    port = 3000;
  }
app.listen(port, function() {
  console.log("Server started on port 3000");
});
