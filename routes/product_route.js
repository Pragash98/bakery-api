const express = require('express');
const router = express.Router();
const productcontroller = require("../controller/product_controller")
const storage = require("../helpers/storage")
const verifyuser = require('../middleware/verify_user_token')
const verifyadmin = require("../middleware/verify_admin_token")
router.use(express.json());

router.post('/create_product',storage,verifyadmin,productcontroller.createproduct)
router.get('/view_product',productcontroller.viewproduct)
router.post('/place_order/:id',verifyuser,productcontroller.placeorder)
router.get('/view_all_order',verifyadmin,productcontroller.viewallorders)
router.get('/view_user_order',verifyuser,productcontroller.viewusersorders)
router.put('/update_product/:id',storage,verifyadmin,productcontroller.updateproduct)



module.exports = router;