var mongoose = require('mongoose');
// mongoose.connect('mongodb://127.0.0.1:27017/thunderpondTest',{ useNewUrlParser: true  ,useUnifiedTopology: true} );

mongoose
    .connect('mongodb://127.0.0.1:27017/thunderpondTest', {
        useCreateIndex: true,
        keepAlive: 1,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then((db) => console.log("Successfully connected to MongoDB!"))
    .catch((err) => console.log(err));