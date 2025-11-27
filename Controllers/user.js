// same for user.js : 
const User = require("../models/user");


//Render signup form : 

module.exports.RenderSignUpForm =(req, res) => {
  res.render("users/signup.ejs");
};

// signup

// signup
module.exports.SignUp = async (req, res) => {
  try {
    const { username, email, password, adminCode } = req.body;  // <-- include adminCode

    // Create new user
    const newUser = new User({ email, username });

    // 👉 CHECK ADMIN CODE BEFORE REGISTERING USER
    if (adminCode === process.env.ADMIN_SECRET) {
      newUser.role = "admin";  // promote to admin
    }

    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Find Your Stay! 🚀");
      res.redirect("/listings");
    });

  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};


// render login form : 

module.exports.RenderLogInForm = (req,res) => {
    res.render("users/login.ejs");
};

// login : 

module.exports.LogIn = async(req,res) => {
    req.flash("success","Welcome back to Find Your Stay!");
    const redirectUrl = res.locals.redirectUrl || "/listings";
      delete req.session.redirectUrl;

    res.redirect(redirectUrl);
};


// logout : 

module.exports.LogOut = (req,res,next) => {
  req.logout((err) => {
    if(err){
      return next(err);
    }
    req.flash("success","you are looged out!");
    res.redirect("/listings");
  });
};