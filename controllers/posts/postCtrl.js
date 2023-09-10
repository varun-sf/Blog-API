const Post = require("../../model/Post/Post");
const User = require("../../model/User/User");
const appErr = require("../../utils/appErr");


const createpostCtrl = async(req,res,next) => {
    const{title,description,category} = req.body
    try{
        // Find the user
       const author = await User.findById(req.userAuth)
       //check if user is blocked
       if(author.isBlocked){
        return next(appErr("Access denied, Account is blocked",403))
       }
       
       // Create the Post
       const postCreated = await Post.create({
        title,
        description,
        user: author._id,
        category,
        photo: req && req.file && req.file.path,
    });
    // Push the post into the user post array
    author.posts.push(postCreated);
    // save
    await author.save();
    res.json({
          status:"success",
          data: postCreated,
    });

    }
    catch(error){
        next(appErr(error.message)); 
    }
}

const fetchPostsCtrl = async (req,res,next)=>{
    try{
        //find all posts
        const posts = await Post.find({}).populate('user').populate('category','title');
        // check if user is blocked by post owner
        const filteredPosts = posts.filter(post=>{
            //get all blocked users'
            const blockedUsers = post.user.blocked;
            const isBlocked = blockedUsers.includes(req.userAuth);

            return isBlocked?null:post;
        });


          res.json({
             status:'success',
              data: filteredPosts,
          });
    }
    catch(error){
        next(appErr(error.message));
    }
}

//toggle likes
const toggleLikesPostCtrl = async (req,res,next)=>{
    try{
        //get post
        const post = await Post.findById(req.params.id);
        // check if user already liked the post
        const isliked = post.likes.includes(req.userAuth);
        if(isliked){
            post.likes = post.likes.filter(like => like != req.userAuth)
            
        }
        else{
            post.likes.push(req.userAuth)
        }
        await post.save();

          res.json({
             status:'success',
              data: post
          });
    }
    catch(error){
        next(appErr(error.message));
    }
}

//toggle dislikes
const toggleDisLikesPostCtrl = async (req,res,next)=>{
    try{
        //get post
        const post = await Post.findById(req.params.id);
        // check if user already unliked the post
        const isUnliked = post.disLike.includes(req.userAuth);
        if(isUnliked){
            post.disLike = post.disLikeslikes.filter(disLike => disLike != req.userAuth)
            
        }
        else{
            post.disLike.push(req.userAuth)
        }
        await post.save();

          res.json({
             status:'success',
              data: post
          });
    }
    catch(error){
        next(appErr(error.message));
    }
}

const postDetailsCtrl = async (req,res,next)=>{
    try{
    const post = await Post.findById(req.params.id);
    //Number of views
    //check if user has viewed this post
    const isViewed = post.numViews.includes(req.userAuth);
    if(isViewed){
        res.json({
            status:'success',
             data: post
         });
    }
    else{
        post.numViews.push(req.userAuth);
        await post.save();
              res.json({
                 status:'success',
                  data: post
              });
    }

    }
    catch(error){
         res.json(error.message); 
    }
}

const deletepostCtrl = async (req,res)=>{
    try{
       
        const post = await Post.findById(req.params.id);
       // check if the post belong to the user

        if(post.user.toString()!==req.userAuth.toString()){
            return next(appErr("You are not allowed to delete this post",403))
        }

        await Post.findByIdAndDelete(req.params.id);
          res.json({
             status:'success',
              data:'delete post route'
          });
    }
    catch(error){
        next(appErr(error.message));
    }
}


const updatepostCtrl = async (req,res,next)=>{
    const {title,description,category} = req.body;
    try{

        const post = await Post.findById(req.params.id);
        // check if the post belong to the user
        if(post.user.toString()!==req.userAuth.toString()){
            return next(appErr("You are not allowed to delete this post",403))
        }

        await Post.findByIdAndUpdate(req.params.id,{
            title,
            description,
            category,
            photo: req?.file?.path,
        },{
            new: true,
        });
          res.json({
             status:'success',
              data: post
          });
    }
    catch(error){
        next(appErr(error.message));
    }
}

module.exports ={createpostCtrl,toggleDisLikesPostCtrl,toggleLikesPostCtrl,fetchPostsCtrl,postDetailsCtrl,deletepostCtrl,updatepostCtrl}