/*'use strict';

/* Import All Models */

const Product = require("../mongodb/models/product");
const Order = require("../mongodb/models/placeorder");
const Cart = require("../mongodb/models/cart");
const category = require("../mongodb/models/category");

let resourceModel = {
	"product" : Product,
	"order" : Order,
	"cart" : Cart,
	"category" : category
}


module.exports = resourceModel;