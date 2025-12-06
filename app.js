require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const passport= require("passport");
const localStrategy= require("passport-local");
const User= require("./models/user.js");
const session= require("express-session");
const MongoStore= require('connect-mongo')
const flash= require("connect-flash"); 

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter= require("./routes/user.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const dbURL= process.env.ATLASDB_URL;

const mongoose = require("mongoose");
main()
  .then(() => {
    console.log("Connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

const ExpressError = require("./utils/ExpressError.js");

async function main() {
  await mongoose.connect(dbURL);
}

const store = MongoStore.create({
  mongoUrl: dbURL,
  touchAfter: 24 * 3600
});




store.on("error", ()=>{
  console.log("Error in Mongo session store", err);
  
})

const sessionOptions={
  store,
  secret: process.env.secret,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
    maxAge: 1000 * 60 * 60 * 24 * 3,
    httpOnly: true
  }
};


// app.get("/", (req, res) => {
//   res.send("Port is working");
// });

app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));


app.use(flash());

app.use((req, res, next)=>{
  res.locals.success= req.flash("success");
  res.locals.error= req.flash("error");
  res.locals.currUser= req.user;
  next();
});

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/demoUser", async(req, res)=>{
  let fakeuser= new User({
    email:"javed1731@gmail.com",
    username:"javed17",
  });
  let registerUser= await User.register(fakeuser, "alamhello");
  res.send(registerUser);
})
      
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews",  reviewsRouter);
app.use("/", userRouter);

app.get(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).send(message);
});

let port = 1517;
app.listen(port, () => {
  console.log(`Listening to port: ${port}`);
});
