var mongoose = require('mongoose');  
var RolesSchema = new mongoose.Schema({  
  display_name:{type :String},
  status:{type :String},
  company_id:{type:String,index:true}
});
mongoose.model('Roles', RolesSchema);
module.exports = mongoose.model('Roles');


