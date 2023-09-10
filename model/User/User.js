const mongoose = require('mongoose');
const Post = require('../Post/Post');

//create schema

const userSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required:[true,'First Name is required']
    },lastname:{
        type: String,
        required:[true,'Last Name is required']
    },
    profilePhoto:{
        type: String,
    },
    email:{
        type: String,
        required:[true,'email is required']
    },
    password:{
        type: String,
        required:[true,'password is required']
    },

    isBlocked:{
       type: Boolean,
       default: false,

    },
     isAdmin:{
        type: Boolean,
        default:false,
    },
    role:{
        type:String,
        enum:["Admin","Guest","Editor"],
    },
    viewers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },], 
    followers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },],
    following:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },],

    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Post",
    },],
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Comment",
    },],


    blocked:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
   ],
    // plan:
    // {
    //     type: String,
    //     enum:['Free','Premium','Pro'],
    //     default: 'Free'
    // } ,

    userAward:{
        type: String,
        enum:['Bronze','Silver','Gold'],
        default: 'Bronze'
    },


 
},{
    timestamps: true,
    toJSON:{virtuals:true},
}); 


//Hooks
//Pre-before record is saved //find//findOne
//post -after saving // create (mongoose properties)

userSchema.pre('findOne', async function(next){
    this.populate({
        path: "posts",
    });

    //get the user id
    const userId = this._conditions._id;
    // find the post created
    const posts = await Post.find({user: userId});
//get last post created by the user
const lastPost = posts(posts.length-1);
// get last post date
const lastpostdate = new Date(lastPost?.createdAt);
// lastpostdate to string
const lastPostDateStr = lastpostdate.toDateString();
   // add virtual to schema
   userSchema.virtual('lastPostDate').get(function(){
    return lastPostDateStr;
   })
 
   // Check if user is active or not
   const currentDate = new Date();
   const diff = currentDate - lastpostdate;
   // get difference in days
   const diffInDays = diff/(1000*3600*24);

   if(diffInDays >30){

    // Adding virtual to show user is active or not
    userSchema.virtual("isInactive").get(function(){
        return true;
    });
    //Find the user by id
    await User.findByIdAndUpdate(userId,{
        isBlocked: true,
    },{
        new: true,
    });

   }
   else{
    userSchema.virtual("isInactive").get(function(){
        return false;
    })
        //Find the user by id
        await User.findByIdAndUpdate(userId,{
            isBlocked: false,
        },{
            new: true,
        });
   }

    //------------last active date
    const daysAgo = Math.floor(diffInDays);
    userSchema.virtual('lastActive').get(function(){
        if(daysAgo<=0){
            return 'Today';
        }
        if(daysAgo===1){
           return "Yesterday";
        }
        if(daysAgo>1){
           return `${daysAgo} days ago`;
        }
    });
     

    // Update user award based on the number of posts
    const numberOfPosts= posts.length;
    if(numberOfPosts<10){
        await User.findById(userId,{
            userAward:"Bronze",
        },{
            new: true,
        });
     
    }
    
    if(numberOfPosts>10){
        await User.findById(userId,{
            userAward:"Silver",
        },{
            new: true,
        });
    }
    if(numberOfPosts>10){
        await User.findById(userId,{
            userAward:"Gold",
        },{
            new: true,
        });
    }
   


  next();
});



// mongoose virtuals
userSchema.virtual("fullname").get(function(){
    return `${this.firstname} ${this.lastname}`   
});

userSchema.virtual("initials").get(function(){
    return `${this.firstnam[0]} ${this.lastname[0]}`   
});

userSchema.virtual("Post Count").get(function(){
    return this.posts.length;   
});

userSchema.virtual("followers Count").get(function(){
    return this.followers.length;   
});

userSchema.virtual("following Count").get(function(){
    return this.following.length;   
});

userSchema.virtual("viewers Count").get(function(){
    return this.viewers.length;   
});

userSchema.virtual("blocked Count").get(function(){
    return this.blocked.length;   
});

// Compile the user model

const User = mongoose.model('User',userSchema);
module.exports = User;