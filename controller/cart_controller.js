const Product = require("../mongodb/models/product")
const Cart = require("../mongodb/models/cart");
const { update } = require("../mongodb/models/product");

exports.addTocart = async(req,res) => {
	try {
		const findExitUser = await Cart.findOne({ 'user_id': req.user });
		if (findExitUser) {
			const findExitproduct = await Cart.findOne({'cart.product':req.body.product});
			const productPrice = await Product.findById({'_id':req.body.product});
			if(findExitproduct){
				const item = findExitproduct.cart.find((val) => val.product == req.body.product);
				const product_quantity = item.quantity + 1;
				const total_price = findExitUser.total + productPrice.price;
				const updateproduct = await Cart.findOneAndUpdate(
					{"cart.product": req.body.product},
					{"$set": {"cart.$.quantity": product_quantity, "total":total_price}},
					{ new:true} ) 
				updateproduct.save();
				res.status(200).json(updateproduct);
			}
			else {
				const total_price = findExitUser.total + productPrice.price
				const updateproduct = await Cart.findOneAndUpdate(
					{"user_id": req.user},
					{
						"$set": {"total":total_price}, 
						"$push": {"cart": {"product": req.body.product, "quantity": 1}}
					},
					{ new:true} )
					updateproduct.save();
				res.status(201).json(updateproduct);
			}
		} 
		else {
			const productPrice = await Product.findById({'_id':req.body.product});
			const createcart = new Cart({
				user_id: req.user,
				cart: [
					{
						product: req.body.product,
						quantity: 1
					}
				],
				total: productPrice.price
			})
			const savedcart = await createcart.save();
			res.status(201).json(savedcart);	
		}
	} 
	catch (err) {
		res.status(400).json({ message: err.message });
	}		                                                                                                                                                                    
}

exports.removeFromCart = async(req,res) => {
	try {
		const findExitUser = await Cart.findOne({ 'user_id': req.user });
		if(findExitUser){
			const total = findExitUser.total;
			const product = await Product.findById({'_id':req.body.product});
			const productPrice = product.price;
			const item = findExitUser.cart.find((val) => val.product == req.body.product);
			product_quantity = item.quantity-1;
			const total_price = total-productPrice
			if(product_quantity == 0){
				const updatetotal = await Cart.findOneAndUpdate({ 'user_id': req.user },{"total":total_price},{ new:true}) 
				const deleteproduct = updatetotal.cart.findIndex((val) => val.product == req.body.product);
				updatetotal.cart.splice(deleteproduct, 1);
				updatetotal.save()
				res.status(200).json(updatetotal);
			}
			else{
				const updatequantity = await Cart.findOneAndUpdate(
					{"cart.product": req.body.product},
					{"$set": {"cart.$.quantity": product_quantity, "total":total_price}},
					{ new:true} ) 
				updatequantity.save();
				res.status(200).json(updatequantity);
			}
			
		}
	} 
	catch (err) {
		res.status(400).json({ message: err.message });
	}		                                                                                                                                                                    
}

exports.viewuserscart = async(req,res) =>{
	try {
		const viewcart = await Cart.findOne({"user_id": req.user });
		res.status(200).json(viewcart);
	} catch (err) {
		res.status(500).json(err);
	}
}
