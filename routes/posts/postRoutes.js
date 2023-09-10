const express = require('express');
const isLogin = require('../../middlewares/isLogin');
const multer = require('multer');
const { createpostCtrl,toggleDisLikesPostCtrl,toggleLikesPostCtrl,fetchPostsCtrl,postDetailsCtrl,deletepostCtrl,updatepostCtrl } = require('../../controllers/posts/postCtrl');

 
const postRouter = express.Router();

//file upload middleware(Multer)
const upload = multer({storage})
//POST/api/v1/posts
postRouter.post('/',isLogin,upload.single('image'),createpostCtrl)


//GET/api/v1/posts/:id
postRouter.get('/:id',isLogin,postDetailsCtrl)


//GET/api/v1/posts/:id
postRouter.get('/likes/:id',isLogin,toggleLikesPostCtrl)

//GET/api/v1/posts/:id
postRouter.get('/dislikes/:id',isLogin,toggleLikesPostCtrl)

//GET/api/v1/posts
postRouter.get('/',isLogin,fetchPostsCtrl)


//DELETE/api/v1/posts/:id
postRouter.delete('/:id',isLogin, deletepostCtrl)


//PUT/api/v1/posts/:id
postRouter.put('/:id',isLogin,upload.single('image'),updatepostCtrl)


module.exports = postRouter;