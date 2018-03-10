var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'New Title' });
});
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('customers');
    collection.find({}, {}, function(e, docs) {
        var data = {
            "list": [{
                    "name": "abc",
                    "address": "abc@example.com"

                },
                {
                    "name": "xyz",
                    "address": "xyz@example.com"

                }
            ]
        };
        var name;
        var address;
        var objKey = Object.keys(docs);
        objKey.forEach(function(objectid) {
            var items = Object.keys(docs[objectid]);
            items.forEach(function(itemkey) {
                var itemvalue = docs[objectid][itemkey];
                console.log(objectid + ': ' + itemkey + ' = ' + itemvalue);
                if (itemkey == "name") {
                    name = itemvalue;
                }
                if (itemkey == "address") {
                    address = itemvalue;
                    data.list.push({ "name": name, "address": address })
                }
            })

        })
        console.log(data);
        res.render('userlist', {
            "data": data.list
        });
    });
});
router.get('/adduser', function(req, res) {
    res.render('adduser', { title: 'Add New User' });
});
router.post('/adduser', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var Name = req.body.name;
    var Address = req.body.address;

    // Set our collection
    var collection = db.get('customers');

    // Submit to the DB

    collection.insert({
        "name": Name,
        "address": Address
    }, function(err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        } else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("userlist");
            // And forward to success page
            res.redirect("userlist");
        }
    });
});
router.get('/love', function(req, res) {
    res.render('love', { title: 'LOVE' });
});
router.post('/picture', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var Name = req.body.name;
    var Address = req.body.address;


    // Set our collection
    var collection = db.get('customers');
    collection.findOne({ "name": Name }, function(err, doc) {

        if (err) res.send("Hello find");

        if (doc == null) {
            console.log("1");
            collection.insert({
                "name": Name,
                "address": Address
            }, function(err, doc) {
                if (err) {
                    // If it failed, return error
                    res.send("There was a problem adding the information to the database.");
                } else {
                    // If it worked, set the header so the address bar doesn't still say /adduser
                    res.location("userlist");
                    // And forward to success page
                    res.redirect("userlist");
                }
            });
        } else {
            console.log("2");
            res.send(doc);
        }
    });
    /*
    console.log("3");
    
        
    */

    // Submit to the DB



});
var formidable = require('formidable');
var fs = require('fs');
router.get('/contest/vacation-photo', function(req, res) {
    var now = new Date();
    res.render('cpntest/vacation-photo', {
        year: now.getFullYear(),
        month: now.getmonth()
    });
});
router.post('/contest/vacation-photo/:year/:month', function(req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {

        if (err) {
            return res.redirect(303, '/error');
        }
        var oldpath = files.photo.path;
        var newpath = '/Users/dingjie/Documents/NodeJs/testproject/public/images/' + files.photo.name;
        fs.rename(oldpath, newpath, function(err) {
            if (err) throw err;
            return res.redirect(303, '/love');
        });
        console.log('received fields: ');
        console.log(fields);
        console.log('received files: ');
        console.log(files);

    });
});
module.exports = router;