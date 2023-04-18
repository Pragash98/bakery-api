const Admins = require("../models/admin")
const bcrypt = require("bcrypt")
const webtoken = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config();

exports.regadmin = async(req,res) => {
	const saltRounds = await bcrypt.genSalt(5);
	const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
	const adminreg = new Admins({
		username : req.body.username,
		password : hashedPassword
	});
	try{
		const savedadmin = await adminreg.save();
		res.status(200).json(savedadmin);
	} catch (err) {
		res.status(500).json(err);
	} 
}

exports.loginadmin = async (req,res) =>{
	const user = await Admins.findOne({
		username:req.body.username
	});
	try{
		if(!user) {
			return res.status(400).send("Username you have given is wrong");
		}   
		const passvalidate = await bcrypt.compare(req.body.password, user.password);
		if (!passvalidate){
			return res.status(200).send("password you have given is wrong");
		}
		else{
			const token = webtoken.sign({ _id: user._id }, process.env.SECRETTOKEN_FOR_ADMIN);
			res.header("auth-token", token).json({"toeken":token, "role": "admin"});
		}
	}
	catch(error){
		res.status(400).send("Invalid details");
	}
	}

// exports.viewbyidadmin = async(req,res) => {
//     try{
//         const admin = await Admins.findById(req.params.id);
//         res.status(200).json(admin);
	 
//     } catch (err) {
//         res.status(500).json(err);
//     }
// }

// exports.viewadmin = async(req,res) => {
//     try{
//         const admin = await Admins.find();
//        res.status(200).json(admin);
	 
//     } catch (err) {
//         res.status(500).json(err);
//     }
// }





// exports.updateadmin = async(req,res) => {
//     try{    
//         const updateadmin = await Admins.findByIdAndUpdate(
//         req.params.id,
//        { $set : req.body },
//        { new : true })
//        res.status(200).json(updateadmin);
	 
//     } catch (err) {
//         res.status(500).json(err);
//     }
// }

// exports.deleteadmin = async(req,res) => {
//     try{
//         await Admins.findByIdAndDelete(
//         req.params.id
//         );
//        res.status(200).json("admin has been deleted");
	 
//     } catch (err) {
//         res.status(500).json(err);
//     }
// }
