var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Car = require("./models/car"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    // seedDB = require("./seeds"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    flash = require('connect-flash');

// require routes
var carRoutes = require("./routes/cars"),
    commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/instarent", {
	useMongoClient: true
});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// passport configuration
app.use(require("express-session")({
    secret: "Ronja is the best!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// configure flash messages
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// setup to use routes
app.use(carRoutes);
app.use(indexRoutes);
app.use(commentRoutes);

app.listen(8080, '127.0.0.1', function() {
    console.log("Instarent server started.");
});