//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/blogDB", {
  useNewUrlParser: true
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

const postsSchema = {
  title: String,
  date: Date,
  content: String,
};

const Posts = mongoose.model("Posts", postsSchema);

const homePageContent = "Thanks for visiting! Scroll through to see my latest projects and find out what I'm learning next."
const aboutPageContent = "Welcome to my journal website! I built this site to work on my programming skills and have a place to upload each of my projects. Each projects is made from scratch and used to help me build my skills. If you're ready to give me a job then send me a message!"



app.get("/", (req, res) => {
  Posts.find({}, (err, posts) => {
  res.render("home", {homePageContent: homePageContent, posts: posts});
});
});

app.get("/posts/:postID", (req, res) => {
  const reqPostId = req.params.postID;

  Posts.findOne({_id: reqPostId}, (err, post) => {
    res.render("post", {
      title: post.title,
      date: post.date,
      content: post.content
    });
  });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const post = new Posts ({
    title: req.body.postTitle,
    date: req.body.postDate,
    content: req.body.postBody
  });

  post.save((err) => {
    if(!err){
      res.redirect("/");
    }
  });
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/about", (req, res) => {
  res.render("about", {aboutPageContent: aboutPageContent});
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started successfully");
});
