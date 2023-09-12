const Post = require("../../model/Post/Post");
const User = require("../../model/User/User");
const { appErr } = require("../../utils/appErr");

//create
const createpostCtrl = async (req, res, next) => {
  const { title, description, category } = req.body;
  try {
    //Find the user
    const author = await User.findById(req.userAuth);
    //check if the user is blocked
    if (author.isBlocked) {
      return next(appErr("Access denied, account blocked", 403));
    }
   
    const postCreated = await Post.create({
      title,
      description,
      user: author._id,
      category,
      photo: req?.file?.path,
    });
   
    author.posts.push(postCreated);
    
    await author.save();
    res.json({
      status: "success",
      data: postCreated,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

//all
const fetchPostsCtrl = async (req, res, next) => {
  try {
   
    const posts = await Post.find({})
      .populate("user")
      .populate("category", "title");

    //Check if the user is blocked by the post owner
    const filteredPosts = posts.filter(post => {
      //get all blocked users
      const blockedUsers = post.user.blocked;
      const isBlocked = blockedUsers.includes(req.userAuth);
      return isBlocked ? null : post;
    });

    res.json({
      status: "success",
      data: filteredPosts,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

//togg DisLike
const toggleDisLikesPostCtrl = async (req, res, next) => {
  try {
   
    const post = await Post.findById(req.params.id);
    //Check if the user has already unliked the post
    const isUnliked = post.disLikes.includes(req.userAuth);
    if (isUnliked) {
      post.disLikes = post.disLikes.filter(
        dislike => dislike.toString() !== req.userAuth.toString()
      );
      await post.save();
    } else {
      post.disLikes.push(req.userAuth);
      await post.save();
    }
    res.json({
      status: "success",
      data: post,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

//toggleLike
const toggleLikesPostCtrl = async (req, res, next) => {
  try {
    //Get the post
    const post = await Post.findById(req.params.id);
    //Check if the user has already liked the post
    const isLiked = post.likes.includes(req.userAuth);
 
    if (isLiked) {
      post.likes = post.likes.filter(
        like => like.toString() !== req.userAuth.toString()
      );
      await post.save();
    } else {
    
      post.likes.push(req.userAuth);
      await post.save();
    }
    res.json({
      status: "success",
      data: post,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};


const postDetailsCtrl = async (req, res, next) => {
  try {
    
    const post = await Post.findById(req.params.id);
    //Number of view
    //check if user viewed this post
    const isViewed = post.numViews.includes(req.userAuth);
    if (isViewed) {
      res.json({
        status: "success",
        data: post,
      });
    } else {
      post.numViews.push(req.userAuth);
      await post.save();
      res.json({
        status: "success",
        data: post,
      });
    }
  } catch (error) {
    next(appErr(error.message));
  }
};

//Delete
const deletepostCtrl = async (req, res, next) => {
  try {
  
    const post = await Post.findById(req.params.id);
    if (post.user.toString() !== req.userAuth.toString()) {
      return next(appErr("You are not allowed to delete this post", 403));
    }
    await Post.findByIdAndDelete(req.params.id);
    res.json({
      status: "success",
      data: "Post deleted successfully",
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

//update
const updatepostCtrl = async (req, res, next) => {
  const { title, description, category } = req.body;
  try {
    //find the post
    const post = await Post.findById(req.params.id);
    //check if the post belongs to the user

    if (post.user.toString() !== req.userAuth.toString()) {
      return next(appErr("You are not allowed to delete this post", 403));
    }
    await Post.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        category,
        photo: req?.file?.path,
      },
      {
        new: true,
      }
    );
    res.json({
      status: "success",
      data: post,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

module.exports = {
  postDetailsCtrl,
  createpostCtrl,
  deletepostCtrl,
  updatepostCtrl,
  fetchPostsCtrl,
  toggleLikesPostCtrl,
  toggleDisLikesPostCtrl,
};
