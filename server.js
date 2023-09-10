const express = require("express");
const userRouter = require("./routes/users/userRoutes");
const postRouter = require("./routes/posts/postRoutes");
const categoryRouter = require("./routes/categories/categoryRoutes");
const commentRouter = require("./routes/comments/commentRoutes");
const globalErrHandler = require("./middlewares/globalErrHandler");
require("dotenv").config();


const app = express();
require("./config/dbConnect");

//middlewares
app.use(express.json())
//---------------
//routes
//----------

//users route

app.use('/api/v1/users/', userRouter);

//----------
//posts route
//----------
app.use('/api/v1/posts',postRouter);


//---------
//comments route
//---------
app.use('/api/v1/comments',commentRouter);




//--------
//category route
//--------

app.use('/api/v1/categories', categoryRouter);





//Error handles middleware
app.use(globalErrHandler);

//404 error

app.use('*',(req,res)=>{
    res.status(404).json({
        message: `${req.originalUrl}- Route not found`,
    });
})
const PORT = process.env.PORT || 9000;

app.listen(PORT, console.log('Server is up and running ${PORT}'));