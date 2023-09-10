const bcrypt = require('bcryptjs');
const User = require("../../model/User/User");
const generateToken = require('../../utils/generateToken');
const getTokenFromHeader = require('../../utils/getTokenFromHeader');
const appErr = require('../../utils/appErr');
const Post = require('../../model/Post/Post');
const Comment = require('../../model/Comment/Comment');
const Category = require('../../model/Category/Category');


//Register

   const userRegisterCtrl = async (req,res,next)=>{
    const{firstname,lastname,email,password} = req.body;
    try{
        const userFound = await User.findOne({email})
        if(userFound){
            return next(appErr("User already exist",500))
        }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt); 
   const user = await User.create({
    firstname,
    lastname,
    email,
    password: hashedPassword,
   });
   console.log(user);

          res.json({
             status:'success',
              data: user,
          });
    }
    catch(error){
       return next(appErr (error.message));// add return 
         
    }
};

//login
    const userLoginCtrl = async (req,res,next)=>{
        const{email,password} = req.body;
        try{
            const userFound = await User.findOne({email });
            if(!userFound  ){
                return next(appErr("Invalid login credebtials"))
             } 

            const isPasswordMatched = await bcrypt.compare(password,userFound.password); 
        if(!isPasswordMatched){
           return next(appErr("Invalid credentials"))
        }
              res.json({
                 status:'success',
                  data: {
                     firstname: userFound.firstname,
                     lastname: userFound.lastname,
                     email: userFound.email,
                    isAdmin: userFound.isAdmin,
                    token: generateToken(userFound._id), 
                  },
              });
        }
        catch(error){
             next(appErr(error.message)); 
        }
    };

// Who view my profile
const whoViewedMyProfileCtrl = async (req,res,next)=>{
    try{
    //1 find the original user
    const user = await User.findById(req.params.id);
//2 find the user who viewed the original user
const userWhoViewed = await User.findById(req.userAuth);

//3 Check if original user and who viewed are found
if(user && userWhoViewed){
    // 4 Check if user who viewed is already in user viewers array
const isUserAlreadyViewed = user.viewers.find(viewer => viewer.toString() === userWhoViewed._id.toJSON());

   if(isUserAlreadyViewed){
       return next(appErr("You already viewed this profile"));
   }
   else{
    user.viewers.push(userWhoViewed._id);
    await user.save()
    res.json({
        status:'success',
         data:'Who view my profile'
     });

   }
}

    }
    catch(error){
        next(appErr(error.message));  
    }
};

//following
const followingCtrl = async (req,res,next)=>{
    try{
    //1. Find the user to follow
    const userToFollow = await User.findById(req.params.id);
  
    //2. Find the user who is following
    const userWhoFollowed = await User.findById(req.userAuth);
    
  
   
    //3. check if both are found
    if(userToFollow && userWhoFollowed){
        //4. check if userWhofollowed is already in user's followers array // not working error getting undefined
        const isUserAlreadyFollowed = userToFollow.following.find(follower => follower.toString() === userWhoFollowed._id.toString());
       
     if(isUserAlreadyFollowed){
        return next(appErr("You already followed this user"))
     }
     else{
        // 5. Push userwhofollowed to the user followers array
        userToFollow.followers.push(userWhoFollowed._id);
        userWhoFollowed.following.push(userToFollow._id);
        // save
        await userWhoFollowed.save();
        await userToFollow.save();
        res.json({
            status:'success',
             data:'You have successfully followed this user'
         });
     }
    }

       
    }
    catch(error){
        next(appErr(error.message));  
    }
};


//unfollowCtrl
const unFollowCtrl = async (req,res,next)=>{
    try{
        // 1. Find the user to unfollow
        const userToBeUnfollowed = await User.findById(req.params.id);
        // 2. Find the user to unfollowing
        const userWhoUnFollowed = await User.findById(req.userAuth);
    

    //3. check if both are found
    if(userToBeUnfollowed && userWhoUnFollowed){
   //4. check if userWhoUnfollowed is already in user's followers array // not working error getting undefined
   const isUserAlreadyFollowed = userToBeUnfollowed.following.find(follower => follower.toString() === userWhoUnFollowed._id.toString());
    if(!isUserAlreadyFollowed){
        return next(appErr("You have not followed this user"))
    }
    else{
        // 5. Remove userWhoUnFollowed from the user's followers array
        userToBeUnfollowed.followers = userToBeUnfollowed.followers.filter(follower => follower.toString() !== userWhoUnFollowed._id.toString());
        await userToBeUnfollowed.save();
        userWhoUnFollowed.following = userWhoUnFollowed.following.filter(following => following.toString()!==userToBeUnfollowed()._id.toString())
        await userWhoUnFollowed.save();
        res.json({
            status:'success',
             data:'You have successfully unfollowed the user'
         });
         }
    }

    }
    catch(error){
        next(appErr(error.message));  
    }
};


//all
const usersCtrl = async (req,res,next)=>{
    try{
         
          res.json({
             status:'success',
              data:'users route'
          });
    }
    catch(error){
        next(appErr(error.message)); 
    }
};


//block
const blockUsersCtrl = async (req,res,next)=>{
    try{
        // 1. Find the user to be blocked
       
         const userToBeBlocked= await User.findById(req.params.id);
         // 2. Find the user who is blocking
         const userWhoBlocking = await User.findById(req.userAuth);
         //3. check if both are found
    if(userToBeBlocked && userWhoBlocking){
        //4. check if userToBeBlocked is already in userWhoBlocking's followers array
       const isUserAlreadyBlocked = userWhoBlocking.blocked.find(blocked=> blocked.toString()=== userToBeBlocked._id.toString());
        if(isUserAlreadyBlocked){
            return next(appErr('You already blocked this user'));
        }
        userWhoBlocking.blocked.push(userToBeBlocked._id);
        await userWhoBlocking.save();
        res.json({
            status:'success',
             data:'You have successfully blocked this user'
         });

    }


    }
    catch(error){
        next(appErr(error.message)); 
    }
};

//all
const unblockusersCtrl = async (req,res,next)=>{
    try{
         // 1. Find the user to be unblocked       
         const userToBeUnBlocked= await User.findById(req.params.id);
         // 2. Find the user who is Unblocking
         const userWhoUnBlocking = await User.findById(req.userAuth);
         //3. check if both are found
         if(userToBeUnBlocked && userWhoUnBlocking){
          //4. check if userToBeUnBlocked is already in userWhoUnBlocking's followers array
       const isUserAlreadyBlocked = userWhoUnBlocking.blocked.find(blocked=> blocked.toString()=== userToBeUnBlocked._id.toString());
     if(!isUserAlreadyBlocked){
        return next(appErr("You have not blocked this user"));
     }
     //Remove user from the array
     userWhoUnBlocking.blocked = userWhoUnBlocking.blocked.filter(blocked => blocked.toString()!== userToBeUnBlocked._id.toString());
     await userWhoUnBlocking.save();
            res.json({
                status:'success',
                 data:'You have successfully unblocked this user'
             });
         }
  
    }
    catch(error){
        next(appErr(error.message)); 
    }
};


//admin-block
const adminBlocUserCtrl = async (req,res,next)=>{
    try{
         // 1. Find the user to be blocked
       
         const userToBeBlocked= await User.findById(req.params.id);
         // 2. Check if user found
         if(!userToBeBlocked){
            return next(appErr("User not found"))
         }
         userToBeBlocked.isBlocked = true;
         await userToBeBlocked.save();
          res.json({
             status:'success',
              data:'User is blocked'
          });
    }
    catch(error){
        next(appErr(error.message)); 
    }
};

//admin-unblock
const adminUnBlocUserCtrl = async (req,res,next)=>{
    try{
         // 1. Find the user to be unblocked
       
         const userToBeunBlocked= await User.findById(req.params.id);
         // 2. Check if user found
         if(!userToBeunBlocked){
            return next(appErr("User not found"))
         }
         userToBeunBlocked.isBlocked = false;
         await userToBeunBlocked.save();
          res.json({
             status:'success',
              data:'User is unblocked'
          });
    }
    catch(error){
        next(appErr(error.message)); 
    }
};

//profile
const userProfileCtrl = async (req,res)=>{
    try{

        const user = await User.findById(req.userAuth);
          res.json({
             status:'success',  
              data: user,
          });
    }
    catch(error){
        next(appErr(error.message)); 
    }
};



//update
const updateUserCtrl = async (req,res)=>{
    const {email,lastname,firstname} = req.body;
    try{
        // check if email is not taken
           if(email){
            const emailTaken = await User.findOne({email});
            if(emailTaken){
                return next(appErr("Email is taken",400));
            }
           }
           //update the user
           const user = await User.findByIdAndUpdate(req.userAuth,{
            lastname,
            firstname,
            email
           },{
            new:true,
            runValidators: true,
           })
          res.json({
             status:'success',
              data: user
          });
    }
    catch(error){
        next(appErr(error.message)); 
    }
}


//update password
const updatePasswordCtrl = async (req,res,next)=>{
    const {password} = req.body;
    try{
        if(password){
         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(password,salt);
          await User.findByIdAndUpdate(req.userAuth,{password: hashedPassword},{new: true, runValidators:true})
         res.json({
            status:'success',
             data:'Password changed successfully'
         });
        }
        else{
            return next(appErr("Please enter password"))
        }

    }
    catch(error){
        next(appErr(error.message)); 
    }
}

//delete account
const deleteUserAccountCtrl = async (req,res,next)=>{
    try{
        const userTodelete = await User.findById(req.userAuth);
        // find all posts to be deleted
        await Post.deleteMany({user: req.userAuth})
        //Delete all comments
        await Comment.deleteMany({user: req.userAuth})
        // Delete category
        await Category.deleteMany({user: req.userAuth})

        await userTodelete.delete();
    
        return  res.json({
             status:'success',
              data:'Your account has been deleted successfully'
          });
    }
    catch(error){
        next(appErr(error.message)); 
    }
};


//Profile photo upload

const profilePhotoUploadCtrl = async (req,res,next)=>{
  
    try{
        // find user to be updated
         const userToUpdate = await User.findById(req.userAuth);
        // check if user is found
        if(!userToUpdate){
             return next(appErr("Usernotfound",403));
        }
        // check if user is blocked
        if(userToUpdate.isBlocked){
            return next(appErr("Action not allowed",403));
        }
        // check if user is updating a photo
        if(req.file){
             // update profile photo
          await User.findByIdAndUpdate(req.userAuth,{
           $set:{ profilePhoto: req.file.path,
        },

          },{
            new: true
          });

          res.json({
            status:'success',
             data:'You have successfully updated your profile photo'
         });
        }
       

    }
    catch(error){
        next(appErr(error.message,500));
    }
};
    module.exports={ 
        userRegisterCtrl,
        userLoginCtrl,
        usersCtrl,
        userProfileCtrl,
        updateUserCtrl,
        profilePhotoUploadCtrl,
        whoViewedMyProfileCtrl,
        followingCtrl,
        unFollowCtrl,
        blockUsersCtrl,
        unblockusersCtrl,
        adminBlocUserCtrl,
        adminUnBlocUserCtrl,
        updatePasswordCtrl,
        deleteUserAccountCtrl 

    };