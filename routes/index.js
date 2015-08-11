var tweetBank = require('../tweetBank');
var sql = require('../models/index');


// sql.User.findOne().then(function (user) {
//     console.log(user.name); // produces correct result. wat.
// });

// sql.Tweet.findById(1)
// 	.then(function(tweets){
// 		console.log(tweet.dataValues.tweet);
// 	});

// sql.Tweet.findAll()
// 	.then(function(tweet){
// 		var data = [];
// 		tweet.forEach(function(row){
// 			data.push(row.dataValues);
// 			//console.log(row.dataValues.tweet);
// 		});
// 		console.log(data);
// 	});

// sql.Tweet.findAll({ include: [ sql.User ] }).then(function(tasks) {
//   //console.log(JSON.stringify(tasks));
//   var custom = [];

//   tasks.forEach(function(row){
//   	var newObj = {};
//   	newObj.id = row.dataValues.id;
//   	newObj.tweet = row.dataValues.tweet;
//   	newObj.userid = row.dataValues.UserId;
//   	newObj.name = row.dataValues.User.dataValues.name;
//   	custom.push(newObj);
//   	//console.log(row);
//   });
//   console.log(custom);
// });

// sql.User.findAll().then(function(users) {
//     //console.log(JSON.stringify(tasks));
//     var custom = [];
//     //var name = 'Tessa';
//     var name = req.body.name;
//     var text = req.body.text;
//     var userId;
//     var picture;
//     if (users.some(function(row) { /// IF USER EXISTS DO THIS
//             if (row.dataValues.name === name) {
//                 userId = row.dataValues.id;
//                 picture = row.dataValues.pictureUrl;
//                 return true;
//             };
//         })) {
//         //console.log(userId)
//         sql.Tweet.create({
//                 UserId: userId,
//                 tweet: text
//             })
//             .then(function() {
//                 io.sockets.emit('new_tweet', {
//                         name: name,
//                         tweet: text,
//                         picture: picture
//                     }
//                 };
//                 res.redirect('/');
//             })

//     } else { // IF USER DOESNT EXIST DO THIS


//     }

// });

module.exports = function(io) {
    var router = require('express').Router();

    router.get('/', function(req, res) {
        // will trigger res.send of the index.html file
        // after rendering with swig.renderFile
        sql.Tweet.findAll({
                include: [sql.User]
            })
            .then(function(tweet) {
                var data = [];
                tweet.forEach(function(row) {
                    var newObj = {};
                    newObj.tweetid = row.dataValues.id;
                    newObj.tweet = row.dataValues.tweet;
                    newObj.userid = row.dataValues.UserId;
                    newObj.name = row.dataValues.User.dataValues.name;
                    newObj.picture = row.dataValues.User.dataValues.pictureUrl;
                    //console.log(newObj.picture);
                    data.push(newObj);
                });
                return data;
            }).then(function(data) {
                //console.log(data)
                res.render('index', {
                    showForm: true,
                    title: 'Home',
                    tweets: data
                })
            });
    });

    router.get('/users/:name', function(req, res) {
        // var userTweets = tweetBank.find({
        // 	name: req.params.name
        // });
        // res.render('index', {
        // 	showForm: true,
        // 	title: req.params.name,
        // 	tweets: userTweets,
        // 	theName: req.params.name
        // });
        var userName = req.params.name;
        sql.Tweet.findAll({
                include: [sql.User]
            })
            .then(function(tweet) {
                var data = [];
                tweet.forEach(function(row) {
                    if (row.dataValues.User.dataValues.name === userName) {
                        var newObj = {};
                        newObj.tweetid = row.dataValues.id;
                        newObj.tweet = row.dataValues.tweet;
                        newObj.userid = row.dataValues.UserId;
                        newObj.name = row.dataValues.User.dataValues.name;
                        newObj.picture = row.dataValues.User.dataValues.pictureUrl;
                        data.push(newObj);
                    }
                });
                return data;
            }).then(function(data) {
                //console.log(data)
                res.render('index', {
                    showForm: true,
                    title: req.params.name,
                    tweets: data,
                    theName: req.params.name
                })
            });



    });

    router.get('/users/:name/tweets/:id', function(req, res) {
        // var id = parseInt(req.params.id);
        // var theTweet = tweetBank.find({
        // 	id: id
        //	});
        // res.render('index', {title: req.params.name, tweets: theTweet})
        var userName = req.params.name;
        var tweetId = parseInt(req.params.id);
        //console.log("tweetid: ", typeof tweetId)
        sql.Tweet.findAll({
                include: [sql.User]
            })
            .then(function(tweet) {
                var data = [];
                tweet.forEach(function(row) {
                    if (row.dataValues.id === tweetId) {
                        var newObj = {};
                        newObj.tweetid = row.dataValues.id;
                        newObj.tweet = row.dataValues.tweet;
                        newObj.userid = row.dataValues.UserId;
                        newObj.name = row.dataValues.User.dataValues.name;
                        newObj.picture = row.dataValues.User.dataValues.pictureUrl;
                        data.push(newObj);
                    }
                });
                return data;
            }).then(function(data) {
                //console.log(data)
                res.render('index', {
                    showForm: true,
                    title: req.params.name,
                    tweets: data
                })
            });


    });

    router.post('/submit', function(req, res) {
        // tweetBank.add(req.body.name, req.body.text);
        // var theNewTweet = tweetBank.list().pop();
        // io.sockets.emit('new_tweet', theNewTweet);
        // res.redirect('/');
        sql.User.findAll().then(function(users) {
            //console.log(JSON.stringify(tasks));
            var custom = [];
            //var name = 'Tessa';
            var name = req.body.name;
            var text = req.body.text;
            var userId;
            var picture;
            if (users.some(function(row) { /// IF USER EXISTS DO THIS
                    if (row.dataValues.name === name) {
                        userId = row.dataValues.id;
                        picture = row.dataValues.pictureUrl;
                        return true;
                    }
                })) {
                //console.log(userId)
                sql.Tweet.create({
                        UserId: userId,
                        tweet: text
                    })
                    .then(function() {
                        io.sockets.emit('new_tweet', {
                            name: name,
                            tweet: text,
                            picture: picture
                        })

                        res.redirect('/');
                    })

            } else { // IF USER DOESNT EXIST DO THIS
                sql.User.create({
                        name: name,
                        pictureUrl: 'http://lorempixel.com/48/48'
                    })
                    .then(function(user) {
                    	return user.get({plain: true});
                    }).then(function(results) {
                        sql.Tweet.create({
                            UserId: results.id,
                            tweet: text
                        })
                        return results;
                    }).then(function(results) {
                        io.sockets.emit('new_tweet', {
                            name: name,
                            tweet: text,
                            picture: results.pictureUrl
                        })

                        res.redirect('/');
                    })

            }

        });


    });
    return router;
};