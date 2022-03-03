/*
Blog Web application project
need to install all the dependcies (EJS, Express, Body-Parser) given package.json file --> npm install

++New additions to learn include "Route Params" & "Lodash"
-->Install Lodash (an external package allowing to deal with route params made easier) --> npm install lodash
https://lodash.com

-Install Mongoose --> npm install mongoose 

*/
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const mongoose = require("mongoose"); 

//connect to MongoDB server, and create or look for and link to the 'blogDB' 
//mongoose.connect('mongodb://localhost:27017/blogDB');  //uncomment this for local DB use 
//connect to MongoDB Atlas cloud DB need to include a link to the cloud storage 
mongoose.connect(""); 

//create schema
const postSchema = new mongoose.Schema({
  title: String,
  content: String
}); 

//model, creating a new collection and follow the postSchema requirment 
//"Post" will automatically change name into "posts" when collection stored
//EXAMPLE if it is --> const Person = mongoose.model("Person", personSchema) 
//then it will automatically be stored as "people" collection 
const Post = mongoose.model("Post", postSchema); 

//lodash
const _ = require('lodash');

const homeStartingContent = "This is my blog web application project built using JavaScript, CSS, html, EJS templating and along with various npm packages such as Express, Lodash, and Body-Parser. This web application stores daily blog data in MongoDB Atlas cloud storage. To add daily blog go to localhost:3000/compose to add more posts. Make sure to connect to your own MongoDB Atlas link to store your daily blog posts.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

app.get("/", function(request, response){

  //search for all post in DB
  Post.find({}, function(err, posts){
    if(err){
      console.log(err); 
    } else{
      response.render("home", {homeContent: homeStartingContent, postArray: posts}); 
    }
  });

}); 


/*
-Route Parameters --> naming parameters and accessing it through ".params" object 
EXAMPLE: app.get("/flight/:flightNo", ....) 

localhost:3000/flight/KR53 --> "KR53" will be saved in ".params" and is accessable 

Reference 
http://expressjs.com/en/guide/routing.html#route-parameters


-Lodash --> we use lodash to deal with different parameters 
EXAMPLE: localhost:3000/flight/-KR-53-  
Using methods from lodash we can process the parameter easier into "KR 53" by ignoring the "-" 
or even lowercase or uppercase issues or other symbols. 
SO we don't need conditions if, for to remove thoses symbols 

EXAMPLE of using lodash method:
_.lowerCase('--Foo-Bar--');   --> 'foo bar'

Reference
https://lodash.com

*/
app.get("/posts/:postId", function(request, response){
  //When you finish adding compose --> localhost:3000/posts/"postId"
  //Example: localhost:3000/posts/ID12345

  //console.log(request.params.postId);  //this will be the "id12345"

  //using lodash method .lowerCase()
  //const requestPostName = _.lowerCase(request.params.postName);  //better use postId incase repeated postName
  const requestedPostId = request.params.postId; 

  //search for the Post in DB
  Post.findOne({_id: requestedPostId}, function(err, post){
    if(err){
      console.log(err);
    } else {
      response.render("post", {postTitle: post.title, postContent: post.content}); 
    }
  });

}); 

app.get("/about", function(request, response){
  response.render("about", {aboutContent: aboutContent}); 
});

app.get("/contact", function(request, response){
  response.render("contact", {contactContent: contactContent}); 
});

app.get("/compose", function(request, response){
  response.render("compose"); 
});


app.post("/compose", function(request, response){
  //console.log(request.body.titleInput);
  //console.log(request.body.postInput);
  const postObject = new Post({
    title: request.body.titleInput,
    content: request.body.postInput
  });

  //insert post into DB
  postObject.save(function(err){
    if(!err){
      response.redirect("/"); 
    } else {
      console.log(err);
    }
  });

});