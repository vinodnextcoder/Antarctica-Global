var mongoose = require('mongoose');  
var RolesSchema = new mongoose.Schema({  
  display_name:{type :String},
  RolesType:{type:String, enum : ['admin','editor','viewer'],index:true},
  role_id:{type:String,index:true},
  status:{type :String}
});
mongoose.model('Roles', RolesSchema);
module.exports = mongoose.model('Roles');


