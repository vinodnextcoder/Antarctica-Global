var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

var VerifyToken = require(__root + 'auth/VerifyToken');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
var config = require('../../config'); // get config file

var Roles = require('../../lib/schema/Roles');
var adminUser = require('../../lib/schema/adminUser');
var User = require('../../lib/schema/adminUser');

// CREATES A NEW USER
router.post('/createRoles', function (req, res) {
    Roles.create({
        display_name: req.body.display_name,
        RolesType: req.body.RolesType,
        role_id: uuidv4(),
    },
        function (err, user) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(user);
        });
});
// RETURNS ALL THE USERS IN THE DATABASE
router.get('/readRoles', function (req, res) {
    Roles.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});


router.post('/createUser', VerifyToken, function (req, res) {
    async.waterfall([
        function (callback) {
            callback(null, true);
        },
        function (value, callback) {
            var hashedPassword = bcrypt.hashSync(req.body.password, 8);
            let fullname = req.body.firstname + " " + req.body.lastname
            let eId = Math.floor(100000 + Math.random() * 900000)
            adminUser.create({
                name: fullname,
                user_id: uuidv4(),
                email: req.body.email,
                password: hashedPassword,
                userRoles: req.body.userRoles,
                companyId: 1,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                employeeID: "E000" + eId,
                status: "ACTIVE"
            },
                function (err, user) {
                    if (err) {
                        logger.error('There was a problem adding the information to the database. ', err)
                        return res.status(500).send("There was a problem adding the information to the database.");
                    }
                    else {
                        res.status(201).send({ status: 201, msg: "Sucess created user", data: user })
                    }
                });
        }
    ], function (err, result) {
        res.status(200).send(result);
    });
});

router.post('/read', VerifyToken, function (req, res) {
    async.waterfall([
        function (callback) {
            callback(null, true)
        },
        function (value, callback) {
            if (req.body.name && req.body.skip) {
                // pagination added
                let pattern = req.body.name
                let pageNo = parseInt(req.body.skip)
                if (pageNo > 0) {
                    let limit = 10
                    let skip = limit * (pageNo - 1);
                    let myMatch = { $or: [{ firstname: { $regex: pattern, $options: 'si' } }, 
                    { lastname: { $regex: pattern, $options: 'si' } }, 
                    { employeeID: { $regex: pattern, $options: 'si' } }] }
                    let pipeline = [
                        {
                            '$match': myMatch
                        }, {
                            '$lookup': {
                                'from': 'roles',
                                'localField': 'userRoles',
                                'foreignField': 'role_id',
                                'as': 'Role'
                            }
                        }, {
                            '$project': {
                                'name': 1,
                                'firstname': 1,
                                'lastname': 1,
                                'email': 1,
                                "user_id": 1,
                                "employeeID": 1
                            }
                        },
                        {
                            '$sort': {
                                'firstname': 1,
                                'lastname': 1
                            }
                        },
                        { "$limit": limit },
                        { "$skip": skip }
                    ]
                    adminUser.aggregate(pipeline, function (err, users) {
                        if (err) {
                            logger.error('There was a problem adding the information to the database. ', err)
                            return res.status(500).send("There was a problem finding the users.");
                        }
                        else {
                            callback(null, { status: 200, msg: "read user data", data: users })
                        }
                    });
                }
                else {
                    res.status(400).send({ status: 400, msg: "Invalid Page no", data: null });
                }
            }
            else {
                res.status(400).send({ status: 400, msg: "Missing Param", data: null });
            }
        }
    ], function (err, result) {
        res.status(200).send(result);
    });
});




router.post('/updateuser', VerifyToken, function (req, res) {
    async.waterfall([
        function (callback) {
            callback(null, true);
        },
        function (value, callback) {
            console.log(req.body)
            let find = {
                user_id: req.body.user_id
            }
            let updateObj = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email
            }
            adminUser.updateOne(find, updateObj, function (err, user) {
                console.log(err)
                if (err) return res.status(500).send("There was a problem updating the user.");
                if (user && user.nModified > 0) {
                    res.status(200).send({ status: 200, msg: "Record updated.", data: null });
                }
                else {
                    res.status(400).send({ status: 400, msg: "Record not updated.", data: null });
                }
            });
        }
    ], function (err, result) {
        res.status(200).send(result);
    });

});

router.post('/login', function (req, res) {
  console.log(req.body.email)
    adminUser.findOne({ email: req.body.email }, function (err, user) {
        if (err) 
        {
            logger.error('There was a problem adding the information to the database. ', err)
            return res.status(500).send('Error on the server.');
        }
        if (!user) return res.status(404).send('No user found.');
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

        // if user is found and password is valid
        // create a token
        var token = jwt.sign({ id: user._id, userRoles: user.userRoles }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });

        // return the information including token as JSON
        res.status(200).send({ auth: true, token: token });
    }).lean();
});

module.exports = router;