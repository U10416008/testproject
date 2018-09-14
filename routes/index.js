var express = require('express');
var router = express.Router();
var path = require('path');
var photosJson = require('./photodb.json');
var Gallery = require('express-photo-gallery');
var valid = "";
var username = "";
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
router.get('/vocabulary', function(req, res) {
    var db = req.db;
    var collection = db.get('vocabulary');
    collection.find({}, {}, function(e, docs) {
        var data = {
            list: [{
                    user_name: "",
                    vocabulary: "",
                    time: ""
                }

            ]
        };
        var user_name = "";
        var vocabulary;
        var time;
        var objKey = Object.keys(docs);
        objKey.forEach(function(objectid) {
            var items = Object.keys(docs[objectid]);
            items.forEach(function(itemkey) {
                var itemvalue = docs[objectid][itemkey];
                //console.log(objectid + ': ' + itemkey + ' = ' + itemvalue);
                if (itemkey == "user_name") {
                    user_name = itemvalue;
                }
                if (user_name == req.session.user_name) {
                    if (itemkey == "vocabulary") {
                        vocabulary = itemvalue;
                    }
                    if (itemkey == "time") {
                        time = itemvalue;
                        data.list.push({ "vocabulary": vocabulary, "time": time })
                    }
                }
            })

        })
        data.list.sort(function(a, b) { return a.vocabulary.toLowerCase() > b.vocabulary.toLowerCase() });
        console.log(data.list);
        res.render('my_vocabulary.pug', {
            "title": "My Daily English",
            "valid": valid,
            "data": data.list,
            "user": req.session.user_name
        });
        valid = "";
    });
});
router.post('/vocabulary', function(req, res) {

    // Set our internal DB variable
    var db = req.db;
    console.log(res.locals);
    // Get our form values. These rely on the "name" attributes
    var user_name = req.session.user_name;
    var vocabulary = req.body.vocabulary;
    var time = getDateTime();

    // Set our collection
    var collection = db.get('vocabulary');

    // Submit to the DB
    if (user_name == null || vocabulary == "" || !/[\s|a-zA-Z]+$/.test(vocabulary)) {
        valid = "please enter the valid word"
        res.location("vocabulary");
        res.redirect("/vocabulary");
    } else {
        collection.insert({
            "user_name": user_name,
            "vocabulary": vocabulary,
            "time": time
        }, function(err, doc) {
            if (err) {
                // If it failed, return error
                res.send("There was a problem adding the information to the database.");
            } else {
                // If it worked, set the header so the address bar doesn't still say /adduser
                res.location("vocabulary");
                // And forward to success page
                res.redirect("/vocabulary");
            }
        });
    }
});
router.get('/login', function(req, res) {
    res.render('login.pug', { user_name: "", title: 'Add New User' });
});
router.post('/login', function(req, res) {
    var db = req.db;
    var collection = db.get('user_info');

    console.log(res.locals.user_name);
    res.locals.user_name = req.body.user_name;
    console.log(res.locals.user_name);

    req.session.user_name = res.locals.user_name;
    var password = req.body.user_secret;
    var time = getDateTime();
    collection.findOne({ "username": username }, function(err, doc) {
        if (err) res.send("Hello find");
        if (doc == null) {
            console.log(doc);
            collection.insert({
                "username": username,
                "password": password,
                "create_time": time
            }, function(err, doc) {
                if (err) {
                    // If it failed, return error
                    res.send("There was a problem adding the information to the database.");
                } else {
                    // If it worked, set the header so the address bar doesn't still say /adduser
                    //res.location("/vocabulary");
                    // And forward to success page
                    res.redirect("/vocabulary");
                }
            });
        } else {
            console.log(doc);
            // If it worked, set the header so the address bar doesn't still say /adduser

            // And forward to success page
            res.redirect("/vocabulary");
        }
    });



});

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

}
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