const express = require('express');
const router = express.Router();
const cartcontroller = require("../controller/cart_controller")
const storage = require("../helpers/storage")
const verifyuser = require('../middleware/verify_user_token')
const verifyadmin = require("../middleware/verify_admin_token")
router.use(express.json());

router.post('/add_to_cart',verifyuser,cartcontroller.addTocart)
router.get('/usercart/:id',verifyuser,cartcontroller.viewuserscart)
router.put('/removefromcart',verifyuser,cartcontroller.removeFromCart)
// router.get('/viewbyid/:id',verifyadmin,admincontroller.viewbyidadmin)
// router.get('/view_admin',verifyadmin,admincontroller.viewadmin)
// router.put('/update_admin/:id',verifyadmin,admincontroller.updateadmin)
// router.delete('/delete_admin/:id',verifyadmin,admincontroller.deleteadmin)
// router.post('/login_admin',admincontroller.loginadmin)

module.exports = router;