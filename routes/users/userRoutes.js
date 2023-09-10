const express = require('express');
const { userRegisterCtrl,updatePasswordCtrl, userLoginCtrl,usersCtrl,userProfileCtrl,updateUserCtrl, profilePhotoUploadCtrl,whoViewedMyProfileCtrl,followingCtrl,unFollowCtrl,blockUsersCtrl,unblockusersCtrl,adminBlocUserCtrl, adminUnBlocUserCtrl,deleteUserAccountCtrl } = require('../../controllers/users/userCtrl');
const isLogin = require('../../middlewares/isLogin');
const storage = require('../../config/cloudinary');
const userRouter = express.Router();
const multer = require('multer');
const isAdmin = require('../../middlewares/isAdmin');
// instance of multer


const upload = multer({storage});

//POST/api/v1/users/register
userRouter.post('/register',userRegisterCtrl);

//POST/api/v1/users/login
userRouter.post('/login',userLoginCtrl);

//GET/api/v1/users
userRouter.get('/', usersCtrl);

//GET/api/v1/users/profile/:id
userRouter.get('/profile',isLogin, userProfileCtrl );


//PUT/api/v1/users/:id
userRouter.put('/',isLogin,updateUserCtrl);



//GET/api/v1/users/profile-viewers/:id
userRouter.get('/profile-viewers/:id',isLogin,whoViewedMyProfileCtrl);

//GET/api/v1/users/following/:id
userRouter.get('/following/:id',isLogin,followingCtrl);

//GET/api/v1/users/unfollow/:id
userRouter.get('/unfollowing/:id',isLogin,unFollowCtrl);

//GET/api/v1/users/block/:id
userRouter.get('/block/:id',isLogin,blockUsersCtrl);

//GET/api/v1/users/unblock/:id
userRouter.get('/unblock/:id',isLogin,unblockusersCtrl);

//GET/api/v1/users/admin-block/:id
userRouter.put('/admin-block/:id',isLogin,isAdmin, adminBlocUserCtrl);

//PUT/api/v1/users/admin-block/:id
userRouter.put('/admin-block/:id',isLogin,isAdmin, adminUnBlocUserCtrl);

//PUT/api/v1/users/admin-block/:id
userRouter.delete('/delete-account',isLogin,deleteUserAccountCtrl);

//Delete/api/v1/users/admin-block/:id
userRouter.put('/update-password',isLogin,updatePasswordCtrl);

//POST/api/v1/users/
userRouter.post('/profile-photo-upload',isLogin, upload.single('profile'), profilePhotoUploadCtrl);


    module.exports = userRouter;