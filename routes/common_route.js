const express = require('express');
const router = express.Router();
const storage = require("../helpers/storage")
const verifyuser = require('../middleware/verify_user_token')
const verifyadmin = require("../middleware/verify_admin_token")
router.use(express.json());
const entityController = require("../controller/entity.controller");
const usercontroller = require("../controller/user_controller")
const admincontroller = require("../controller/admin_controller.js")
const cartcontroller = require("../controller/cart_controller")

// router.get('/',productcontroller.viewproduct)
router.post('/user/create_user',storage,usercontroller.reguser)
router.get("/user/me", usercontroller.usersMe);
router.post('/user/login_user',usercontroller.loginuser)
router.post('/admin/create_admin',admincontroller.regadmin)
router.post('/admin/login_admin',admincontroller.loginadmin)

router.post('/cart/add_to_cart',verifyuser,cartcontroller.addTocart)
router.get('/cart/usercart/:id',verifyuser,cartcontroller.viewuserscart)
router.put('/cart/removefromcart',verifyuser,cartcontroller.removeFromCart)

router.get("/:entitypath/all", entityController.findAll);
router.get('/:entitypath/admin/all',verifyadmin,entityController.findAllAdmin);
router.get('/:entitypath/admin/all/:id',verifyuser,entityController.viewUserOrderById)
router.post('/admin/:entitypath/create',storage,verifyadmin,entityController.createRow)
router.post('/user/:entitypath/create',verifyuser,entityController.createRowByUser)
router.put('/admin/:entitypath/update/:id',storage,verifyadmin,entityController.updaterow)
router.delete('/admin/:entitypath/delete/:id',verifyadmin,entityController.deleteById);
router.delete('/admin/:entitypath/delete',verifyadmin,entityController.bulkDelete);

router.get('/:entitypath/category_filter',entityController.categoryfilter)

module.exports = router;