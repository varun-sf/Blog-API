const mongoose = require('mongoose');

//create schema

const postSchema = new mongoose.Schema({
    title:{
        type: String,
        require:[true,'Post Title is required'],
        trim: true,
    },
     description:{
        type: String,
        require:[true,'Post descriptiom is required'],
     },
     category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:[true,'Post category is required']
     },
     numViews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
     ],
     likes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
     ],
     disLikes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
     ],
     comments:[
      {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
      },
   ],

     user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,"Please Author is required"]
     },
     photo:{
        type: String,
       required:[true,"Post image is required"],
     },
   


},{
    timestamps: true,
    toJSON:{virtuals:true},
});


// Hook
postSchema.pre(/^find/,function(next){
   // adding view count;
   postSchema.virtual('viewsCount').get(function(){
      const post = this
      return post.numViews.length;
   });
//add likes count
postSchema.virtual('likesCount').get(function(){
   const post = this
   return post.likes.length;
});
//add dislikes count
postSchema.virtual('disCount').get(function(){
   const post = this
   return post.disLikes.length;
});

postSchema.virtual('likesPercentage').get(function(){
   const post = this
   const total = +post.likes.length+ +post.disLikes.length
   const percentage = (post.likes.length/total)*100;
   return `${percentage}%`;
}) 

postSchema.virtual('dislikesPercentage').get(function(){
   const post = this
   const total = +post.likes.length+ +post.disLikes.length
   const percentage = (post.dislikes.length/total)*100;
   return `${percentage}%`;
});

postSchema.virtual('daysAgo').get(function(){
   const post = this
   const date = new Date(post.createdAt);
   const daysAgo = Math.floor((Date.now()-date)/86400000);
   return daysAgo===0?'Today': daysAgo===1?'Yesterday': `${daysAgo} days ago`;
}) ;


   next();
})

// Compile the post model
const Post = mongoose.model('Post',postSchema);
module.exports = Post;