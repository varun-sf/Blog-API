const Comment = require("../../model/Comment/Comment");
const Post = require("../../model/Post/Post");
const User = require("../../model/User/User");
const appErr = require("../../utils/appErr");



const createCommentCtrl = async (req,res,next)=>{
    const {description}= req.body;
    try{
        // Find the post
        const post = await Post.findById(req.params.id);
        // Find the user
        const user = await User.findById(req.userAuth);
        //create comment
        const comment = await Comment.create({
            post: post._id,
            description,
            user: req.userAuth
        })
        // push the comment to post
        post.comments.push(comment._id);

        //push comment to the user
        user.comments.push(comment._id);
  // Disable validation else give post image error
        await post.save({validateBeforeSave: false});
        await user.save({validateBeforeSave:false});
          res.json({
             status:'success',
              data: comment
          });
    }
    catch(error){
         next(appErr(error.message)); 
    }
}



const deleteCommentCtrl = async (req,res,next)=>{
    try{
        const comment = await Comment.findById(req.params.id);
        // check if the post belong to the user
 
         if(comment.user.toString()!==req.userAuth.toString()){
             return next(appErr("You are not allowed to update this comment",403))
         }
         await Comment.findByIdAndDelete(req.params.id)
          res.json({
             status:'success',
              data: 'comment has been deleted successfully'
          });
    }
    catch(error){
         next(appErr(error.message)); 
    }
}

const updateCommentCtrl =  async(req,res,next) =>{
    const {descriptiom} = req.body;
    try{
        const comm = await Comment.findById(req.params.id);
        // check if the post belong to the user
 
         if(comm.user.toString()!==req.userAuth.toString()){
             return next(appErr("You are not allowed to update this comment",403))
         }
         
 

      const comment = await Comment.findByIdAndUpdate(description,{title,new :true,runValidators: true})
      res.json({
        status:"success",
        data: comment
      })
    }
    catch (error){
        next(appErr(error.message))
    }
}
module.exports ={createCommentCtrl,deleteCommentCtrl,updateCommentCtrl};