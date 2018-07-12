var express = require('express');
var router = express.Router();
var path = require('path');
var photosJson = require('./photodb.json');
var Gallery = require('express-photo-gallery');
/* GET home page. */
router.get('/', function(req, res, next) {
    console.log('index')
    res.render('index.pug', { title: 'Ding Ding Blog' });
});
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('customers');
    collection.find({}, {}, function(e, docs) {
        var data = {
            list: [{
                    name: "",
                    address: ""
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
        res.render('userlist.pug', {
            "data": data.list
        });
    });
});
router.get('/adduser', function(req, res) {
    res.render('adduser.pug', { title: 'Add New User' });
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
            res.redirect("userlist.pug");
        }
    });
});
router.get('/love', function(req, res) {
    var filelist = {
        list: [{
            name: ""
        }]
    };
    //res.render('love.pug', { title: 'LOVE' });
    fs.readdir(path.dirname(__dirname) + '/public/LoadImage', (err, files) => {
        files.forEach(file => {
            filelist.list.push({ "name": file });
            console.log(file);
        });
        filelist.list.reverse().pop();
        res.render('love.pug', {
            title: 'LOVE',
            "files": filelist.list,
            "path": path.dirname(__dirname) + '/public/LoadImage/'
        });
    })
});
var options = {
    title: 'My Awesome Photo Gallery'
};

router.use('/photos', Gallery(path.dirname(__dirname) + '/public/LoadImage', options));
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
                    res.redirect("userlist.pug");
                }
            });
        } else {
            console.log("2");
            res.send(doc);
        }
    });
});
router.get('/mlearning', function(req, res, next) {
    console.log('machine learning')
    res.render('mlearning.pug', { title: 'Ding Ding Love ML ' });
});
router.get('/datastructure', function(req, res, next) {
    console.log('data structure')
    res.render('datastructure.pug', { title: 'Ding Ding Learn Data Structure ' });
});
router.get('/discrete', function(req, res, next) {
    console.log('Discrete Mathematics')
    res.render('discrete.pug', { title: 'Ding Ding Learn Discrete Mathematics ' });
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
    var db = req.db;
    var collection = db.get('photos');
    form.parse(req, function(err, fields, files) {
        if (files.photo.name !== '') {
            if (err) {
                return res.redirect(303, '/error');
            }
            photosJson.name = files.photo.name;
            collection.insert(
                photosJson,
                function(err, doc) {
                    if (err) {
                        // If it failed, return error
                        console.log(err);
                        res.send("There was a problem adding the information to the database.");
                    } else {
                        var oldpath = files.photo.path;
                        var newpath = path.dirname(__dirname) + '/public/LoadImage/' + files.photo.name;
                        console.log(newpath);
                        fs.rename(oldpath, newpath, function(err) {
                            if (err) throw err;
                            return res.redirect(303, '/love');
                        });

                    }
                })

        } else {
            return res.redirect(303, '/love');
        }

    });
    db.close();

});


module.exports = router;