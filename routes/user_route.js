const express = require('express');
const router = express.Router();
const usercontroller = require("../controller/user_controller")
// const verifyadmin = require('../middleware/verify_admin_token')
// const usercontroller = require("../controller/user_controller")
router.use(express.json());

router.post('/create_user',usercontroller.reguser)
router.get("/me", usercontroller.usersMe);

// router.get('/viewbyid/:id',verifyadmin,admincontroller.viewbyidadmin)
// router.get('/view_users',verifyadmin,usercontroller.viewusers)
// router.get('/view_admin',verifyadmin,admincontroller.viewadmin)
// router.put('/update_admin/:id',verifyadmin,admincontroller.updateadmin)
// router.delete('/delete_admin/:id',verifyadmin,admincontroller.deleteadmin)
router.post('/login_user',usercontroller.loginuser)

module.exports = router;
    