if(process.env.NODE_ENV!="production")
{
    require('dotenv').config();
}

// console.log(process.env);
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require(path.join(__dirname, 'utils', 'ExpressError'));
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const flash = require("connect-flash");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const db_url = process.env.ATLASDB_URL;
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(db_url);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
};

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.get("/demouser", async (req, res) => {
  // user create kia
  let fakeUser = new User({
    email: "student@gmail.com",
    username: "my-student"
  });
  // model main ek predefined method hota h jo user ko db main store kar dega
  // first arg is user second is password aur yeh khudse check kar lega entered 
  // username is unique or not u need not search db to take care of it
  let registeredUser = await User.register(fakeUser, "helloworld");
  res.send(registeredUser);
});

// use listing router jaha listing pe req ayi router pe chalje
app.use("/listings", listingRouter);
// yeh id reviews main pass ho uske liye use mergeParams
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// For invalid requests
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});


