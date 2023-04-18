const Users = require("../models/user")
const bcrypt = require("bcrypt")
const webtoken = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config();

exports.reguser = async(req,res) => {
	const saltRounds = await bcrypt.genSalt(5);
	const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
	const userreg = new Users({
		username : req.body.username,
		password : hashedPassword
	});
	try{
		const saveduser = await userreg.save();
		res.status(200).json(saveduser);
	} catch (err) {
		res.status(500).json(err);
	} 
}

exports.loginuser = async (req,res) =>{
	const user = await Users.findOne({
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
			const token = webtoken.sign({ _id: user._id }, process.env.SECRETTOKEN_FOR_USER);
			res.header("auth-token", token).json({"toeken":token, "role": "user"});
		}
	}
	catch(error){
		res.status(400).send("Invalid details");
	}
	}