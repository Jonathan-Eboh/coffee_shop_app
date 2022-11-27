const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comments = require("../models/Comments"); //need to import the comments model here


module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      const comments = await Comments.find({ commentFor: req.params.id }); //this is one of the most important lines of code
      //we query the comment collection here and specifically grab the one with the matching objectID

      res.render("post.ejs", { post: post, user: req.user, comments: comments });

    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      await Post.create({
        Name: req.body.name, //the name on the order from the front end
        CoffeeTemp: req.body.coffeeTemp, //iced or hot
        Drink: req.body.customerDrink, // Black, Latte, Cappuccino
      });
      console.log("Post has been added!");
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => { //this is what were using to compete the order for now
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: { completed: true } //order has been completed
        }
      );
      // const barista = await db.users.find({ user: req.user.id });
      // console.log("This is the barista that completed the order", barista);

      console.log("Task Completed!");
      res.redirect(`/feed`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      //let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      //await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/feed");
    } catch (err) {
      res.redirect("/feed");
    }
  },
};
