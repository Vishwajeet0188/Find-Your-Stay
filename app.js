// MUST BE FIRST!
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const WrapAsync = require("./utils/WrapAsync.js");
const { listingSchema, reviewSchema } = require("./Schema.js");
const ExpressError = require("./utils/ExpressError.js");
// const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const adminRoutes = require("./routes/admin");
const session = require("express-session");
const MongoStore = require("connect-mongo");

// 🔥 CORRECT MONGO CONNECTION
const MONGO_URL = process.env.MONGO_URL;

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("✔ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

/* ---- APP CONFIG ---- */
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

/* ---- SESSION ---- */
const store = MongoStore.create({
  mongoUrl: process.env.MONGO_URL,     // Atlas database URL
  secret: process.env.SESSION_SECRET,
  touchAfter: 24 * 3600,  // Reduce DB writes – Good for performance
});

store.on("error", (err) => {
  console.log("SESSION STORE ERROR:", err);  // ADD THIS TO SEE EXACT ERROR
});

const sessionOptions = {
  store: store,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
};

app.use(session(sessionOptions));

app.use(flash());

/* ---- PASSPORT ---- */
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* ---- GLOBAL MIDDLEWARE ---- */
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user || null;
  next();
});

/* ---- HOME ROUTE ---- */
app.get("/", (req, res) => {
  res.redirect("/listings");   // best and easy fix
});


/* ---- ROUTES ---- */
const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.use("/admin", adminRoutes); // MUST be before /listings
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

/* ---- HANDLE FAVICON ---- */
app.get("/favicon.ico", (req, res) => res.status(204).end());

/* ---- 404 CATCH ---- */
app.use((req, res, next) => {
  next(new ExpressError("Oops! The page you’re looking for doesn’t exist. Recheck and Try Again", 404));
});

/* ---- GLOBAL ERROR HANDLER ---- */
app.use((err, req, res, next) => {
  console.error("🔥 INTERNAL ERROR:", err.stack);
  res.status(err.statusCode || 500).render("error.ejs", { err });
});

/* ---- START SERVER ---- */
app.listen(8080, () => console.log("🚀 Server running on port 8080"));
