


// pull in the Sequelize library
var Sequelize = require('sequelize');
// create an instance of a database connection
// which abstractly represents our app's mysql database
var twitterjsDB = new Sequelize('twitterjs', 'root', null, {
    dialect: "mysql",
    port:    3306,
});

// open the connection to our database
twitterjsDB
  .authenticate()
  .catch(function(err) {
    console.log('Unable to connect to the database:', err);
  })
  .then(function() {
    console.log('Connection has been established successfully.');
  });


var Tweet = require('./tweet')(twitterjsDB);
var User = require('./user')(twitterjsDB);

// adds a UserId foreign key to the `Tweet` table
User.hasMany(Tweet);
Tweet.belongsTo(User);

  module.exports = {
    User: User,
    Tweet: Tweet
};

// User.findOne().then(function (user) {
//     console.log(user); // big old crazy object, but no name or id anywhere in there
// });

// User.findOne().then(function (user) {
//     console.log(user.name); // produces correct result. wat.
// });

// User.findOne().then(function (user) {
//     console.log(user.datavalues);
// });


// User.findOne().then(function (user) {
//     console.log(user.get({plain: true}));
// });

// User.findOne().then(function (user) {
//     return user.getTweets();
// })
// .then(function (tweets) {
//     JSON.stringify(tweets); // another way of just logging the plain old values
// });



