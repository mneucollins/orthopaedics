
var mongoose     = require('mongoose');
var roleModel = require('./models/roleModel');
var userModel = require('./models/userModel');
var userController = require('./controllers/userController');
var config = require("./config.json");


//JOB CREATION
// --------------------------------------------------------------------------

function testUsers () {

	mongoose.connect(config.databaseURL);

	userModel
	.findOne({'username':'admin'})
	.populate('role')
	.exec(function (err,user){
		if(err){
			console.log(err)
		} else {
			console.log(JSON.stringify(user));
		}
	});

	// roleModel
	// .findOne({'isImaging':true})
	// // .populate('role')
	// .exec(function (err,user){
	// 	if(err){
	// 		console.log(err)
	// 	} else {
	// 		console.log(JSON.stringify(user));
	// 	}
	// });

	// var role = null;

	// roleModel
	// .find()
	// .exec(function (err,roles){
	// 	if(err){
	// 		console.log(err)
	// 	} else {
	// 		for (var i in roles){
	// 			console.log(JSON.stringify(roles[i]));
	// 			role = roles[i];
	// 		}
	// 	}
	// });

	// setTimeout(function(){

	// 	userModel
	// 	.findOne({'username':'admin'})
	// 	.exec(function(err,user){
	// 		if(err){
	// 			console.log(err);
	// 		} else {
	// 			user.role = role;
	// 			console.log(JSON.stringify(user));
	// 			user.save(function(err,user){
	// 				if(err){
	// 					console.log(err);
	// 				} else{
	// 					console.log("no error");
	// 				}
	// 			});
	// 		}
	// 	});

	// },3000);

    
}

testUsers();