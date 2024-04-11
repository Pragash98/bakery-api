const _ = require('lodash');
const entityList = require("../config/entities");
const entityRoute = require("../config/resource");
const fs = require('fs');
const mongoDB = require("../mongodb");

exports.findAll = async (req, res) => {
	try {
		let result;
		const queryObj = {};
		let limit = req.query.limit ? parseInt(req.query.limit) : 10;
		let offset = req.query.offset ? parseInt(req.query.offset) : 0;
		
		let sort = {
			"created_at": "desc"
		};

		if ((req.query.order_by && req.query.order) &&
			(req.query.order == 'asc' || req.query.order == 'desc')) {
				sort = {};
				sort[req.query.order_by] = req.query.order;
		}

		if (req.query.product_name) {
			queryObj.product_name = {
				$regex: new RegExp("^" + req.query.product_name, "i")
			}
		}

		if (req.query.price) {
			queryObj.price = {
				$regex: new RegExp("^" + req.query.price, "i")
			}
		}

		if (req.query.category_name) {
			queryObj.category_name = {
				$regex: new RegExp("^" + req.query.category_name, "i")
			}
		}
		
		const entity = entityList[req.params.entitypath];
		if (!entity) {
			return res.status(500).json({ error: "Entity not found" });
		}


		if (entity === 'product') {
			result = await mongoDB.findAllRows(entity, "categories", queryObj, limit, offset, sort);
		} else {
			result = await mongoDB.findAllRows(entity, [], queryObj, limit, offset, sort);
		}

		res.status(200).json(result);
	} catch (err) {
		console.error("Error:", err);
		res.status(500).json({ error: "Internal server error" });
	}
};

exports.findAllAdmin = async(req,res) =>{
	try {
		const entity = entityList[req.params.entitypath];
		const result = await entityRoute[entity].find();
		res.status(200).json(result);
	} catch (err) {
		res.status(500).json(err);
	} 
}

exports.viewUserOrderById = async(req,res) => {
	try {
		const entity = entityList[req.params.entitypath];
		let id = req.user;
		console.log("id",id);
		const orders = await entityRoute[entity].find({ user_id: id }).populate("user_id").populate("product_id").exec();
		res.status(200).json(orders);
		
	} catch (err) {
		res.status(500).json(err);
	}
}

exports.createRow = async (req, res) => {
	try {
		const entity = entityList[req.params.entitypath];
		if (!entity) {
			return res.status(500).json({ error: "Entity not found" });
		}

		model = entityRoute[entity];
		let savedItem;

		if (entity === 'product') {
			let base64File;
			if(req.file) {
				const fileBuffer = fs.readFileSync(req.file.path);
				base64File = fileBuffer.toString('base64');
			}
			const productData = {
				product_name: req.body.product_name,
				price: req.body.price,
				itemImage: base64File,
				categories: req.body.category
			};
			const product = new model(productData);
			savedItem = await product.save();
		} else if (entity === 'category') {
			const categoryData = {
				category_name: req.body.category_name,
				slug_name: req.body.slug_name
			};
			const category = new model(categoryData);
			savedItem = await category.save();
		} else {
			return res.status(500).json({ error: "Invalid entity" });
		}

		res.status(200).json(savedItem);
	} catch (err) {
		console.error("Error:", err);
		res.status(500).json({ error: "Internal server error" });
	}
};

exports.updaterow = async(req,res) =>{
	try{
		const entity = entityList[req.params.entitypath];
		if (!entity) return res.status(500).json(err);
		if (entity == 'product') {
			const ProductModel = entityRoute[entity];
			if(req.body.deletecategory) {
				await Product.findByIdAndUpdate(req.params.id,
					{"$pullAll":{"categories":req.body.deletecategory}})
			}
			let query = {};
			if(req.body.product_name)
				query.product_name = req.body.product_name
			if(req.body.price)
				query.price = req.body.price
			if(req.file){
				const fileBuffer = fs.readFileSync(req.file.path);
				const base64File = fileBuffer.toString('base64');
				query.itemImage = base64File;

			}
			const update_product = await ProductModel.findByIdAndUpdate(req.params.id,
				{ 
					"$set":query,
					"$addToSet": {"categories": req.body.categories},
				},
				{ new:true} )    
			update_product.save();
			res.status(200).json(update_product);
		}
	}
	catch(err) {
		res.status(400).json({ message: err.message });
	}
}

exports.categoryfilter = async(req,res) =>{
	try {
		var query = { "categories": req.body.categories, }; 
		const categoryfilter = await entityRoute['product'].find(query);
		res.status(200).json(categoryfilter);
	} catch (err) {
		res.status(500).json(err);
	} 
}

exports.createRowByUser = async (req, res) => {
	try {
		const entity = entityList[req.params.entitypath];
		const model = entityRoute[entity];
		let savedItem;
		if (entity === 'order') {
			const orderData = {
				cart_id: req.body.cart_id // Assuming cart_id is sent in the request body
			};
			const order = new model(orderData);
			savedItem = await order.save();
		} else {
			return res.status(400).json({ error: "Invalid entity" });
		}
		res.status(200).json(savedItem);
	} catch (err) {
		console.error("Error:", err);
		res.status(500).json({ error: "Internal server error" });
	}
};

exports.deleteById = async(req,res) => {
	try{
		const entity = entityList[req.params.entitypath];
		const id = entityList[req.params.id];
		const model = entityRoute[entity];
		await model.deleteOne(id)
		res.status(200).json({ message: `${entity} has been deleted` });
	}
	catch(err) {
		res.status(400).json({ message: err.message });
	}
}

exports.bulkDelete = async(req,res) => {
	try {
		const entity = entityList[req.params.entitypath];
		const idsToDelete = req.body.ids;
		if (!idsToDelete || !Array.isArray(idsToDelete) || idsToDelete.length === 0) {
			return res.status(400).json({ message: "Invalid or empty IDs provided for deletion" });
		}
		const deleteResult = await entityRoute[entity].deleteMany({ _id: { $in: idsToDelete } });
		res.status(200).json({ message: `${deleteResult.deletedCount} ${entity} deleted successfully` });

	} catch(err) {
		res.status(400).json({ message: err.message })
	}
}
