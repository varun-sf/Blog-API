const express = require('express');
const { createCategoryCtrl,deleteCategoryCtrl,fetchCategoriesCtrl,categoriesDetailsCtrl,updateCategoryCtrl } = require('../../controllers/categories/categoriesCtrl');
const isLogin = require('../../middlewares/isLogin');

const categoryRouter = express.Router();

//POST/api/v1/categories
categoryRouter.post('/',isLogin,createCategoryCtrl)

//Get/api/v1/categories
categoryRouter.get('/',isLogin,fetchCategoriesCtrl)


//GET/api/v1/categoriess/:id
categoryRouter.get('/:id',categoriesDetailsCtrl)



//DELETE/api/v1/categories/:id
categoryRouter.delete('/:id',isLogin,deleteCategoryCtrl)


//PUT/api/v1/categories/:id
categoryRouter.put('/:id',isLogin,updateCategoryCtrl)

module.exports = categoryRouter;