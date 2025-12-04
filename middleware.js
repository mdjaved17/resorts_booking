const listing= require("./models/listing")
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Please login first");
    console.log(req.flash("error"));
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let list = await listing.findById(id);
  if (!list.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this resort");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
