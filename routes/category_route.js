const express = require('express');
const router = express.Router();
const productcontroller = require("../controller/product_controller")
const verifyadmin = require("../middleware/verify_admin_token")

router.use(express.json());

router.post('/create_category',productcontroller.createcategory)
router.get('/get_all_category',productcontroller.getallcategory)
router.get('/category_filter',productcontroller.categoryfilter)
router.delete('/delete_category',verifyadmin,productcontroller.deletecategory)

module.exports = router;
    