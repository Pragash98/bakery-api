const Users = require("../mongodb/models/user")
const bcrypt = require("bcrypt")
const webtoken = require("jsonwebtoken")
const dotenv = require("dotenv")
const axios = require("axios");

dotenv.config();

exports.reguser = async (req, res) => {
	try {
		const saltRounds = await bcrypt.genSalt(5);
		const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
		
		const username = req.body.password;
		const email = req.body.email
		const phone = req.body.phone
		const userreg = new Users({
			username: username,
			password: hashedPassword,
			email: email,
			phone: phone
		});
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
			const token = webtoken.sign({ _id: user._id,name:user.username }, process.env.SECRETTOKEN_FOR_USER);
			res.header("auth-token", token).json({"toeken":token, "role": "user"});
		}
	}
	catch(error){
		res.status(400).send("Invalid details");
	}
}

exports.usersMe = async (req, res) => {
	try {
		const token = req.headers.authorization
		const decoded = webtoken.decode(token);
		// const response = await axios({
		// 	url: "http://localhost:4200/api/users/me",
		// 	method: "get",
		// 	headers: {
		// 		"content-type": "application/json",
		// 		"Authorization": `${req.headers.authorization}`
		// 	}
		// });
		res.status(200).json(decoded);
	} catch (error) {
		res.status(400).send("Invalid details");
	}
}