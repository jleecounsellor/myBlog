const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
require("dotenv").config();


const backgroundInformation = "This is a blog about my progress breaking into the tech world as a developer. I first went to school to be a graphic designer, so I know all of the Adobe products, but I worked with really talented graphic designers, and I couldn't see myself getting to their level. I decided to then use my AA degree in multi-media design and production, on the production side of things and became a Print Production Manager. From there, I was promoted into the Communications Project Manager role, which still allowed me to do print production, but I started working more with the designers on all the projects they were producing, as well as our web team. This renewed my passion for design but now I wanted to go at it in a different way, as a web developer. I went back to school to get my BS in Computer Science. I not only wanted to learn everything I could about web development, but all I could about computers so I thought that would be a good starting point. Once I received my degree, I was a little lost on how to maneuver. I was already established in one field, but I wanted to switch without any real experience (other than what I had learned in school) and not take a massive pay cut. So now, I'm doing everything I can to learn the field, while I still have a great job, to one day break into the tech world, where I will start the career of my dreams. Wish me luck…and I’ll keep you apprised of my success or lack thereof!"



const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.connect("mongodb+srv://mongodb+srv://cluster0.waagn.mongodb.net/blogDB?retryWrites=true&w=majority", { user: process.env.MONGO_USER, pass: process.env.MONGO_PASSWORD, useNewUrlParser: true, useUnifiedTopology: true })


//Schema for database
const postSchema = {
  title: String,
  content: String
};

//This created a posts collection
const Post = mongoose.model("Post", postSchema);

//Home route
app.get("/", function(req, res) {

  //Render the content above on home page, and the posts
  Post.find({}, function(err, posts) {
    res.render("home", {
      startingContent: backgroundInformation,
      posts: posts
    });
  });
});

//Submission route
app.get("/submission", function(req, res) {
  res.render("submission");
});

app.post("/submission", function(req, res) {

  //Create new post from submissions
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  //After post is saved into database, go back to home page
  post.save(function(err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res) {
  const requestedPostId = req.params.postId;

  //Find one ID in post that matches requestedPostId, then render
  Post.findOne({
    _id: requestedPostId
  }, function(err, post) {
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log("Server started on port " + PORT);
});
