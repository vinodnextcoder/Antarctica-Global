var mongoose = require('mongoose');  
var adminUser = new mongoose.Schema({  
  name: {type:String,index:true},
  user_id: {type:String,index:true},
  email: {type:String,index:true},
  password: {type:String,index:true},
  userRoles: {type:[],index:true},
  firstname: {type:String,index:true},
  lastname: {type:String,index:true},
  companyId: {type:String,index:true},
  employeeID: {type:String,index:true},
  status:{type :String},
});
mongoose.model('adminUser', adminUser);

module.exports = mongoose.model('adminUser');