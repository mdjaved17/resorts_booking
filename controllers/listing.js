const listing = require("../models/listing");
const { listingSchema } = require("../schema.js");
module.exports.index = async (req, res) => {
  const allListings = await listing.find({});
  res.render("index.ejs", { allListings });
};

module.exports.newForm = (req, res) => {
  res.render("new.ejs");
};

module.exports.show = async (req, res) => {
  let { id } = req.params;
  const selectedListing = await listing
    .findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  console.log(selectedListing);
  res.render("show.ejs", { selectedListing });
};

module.exports.new = async (req, res, next) => {
  const result = listingSchema.validate(req.body);
  if (result.error) throw new ExpressError(400, result.error);
  console.log(req.file)
  if (!req.file) throw new ExpressError(400, "Image is required");

  const { title, description, price, country, location } = req.body;
  const { path: url, filename } = req.file;

  const newList = new listing({
    title,
    description,
    price,
    country,
    location,
    image: { url, filename },
    owner: req.user._id,
  });

  await newList.save();
  newList.owner = req.user._id,
  req.flash("success", "Listing added successfully!");
  res.redirect("/listings");
};


module.exports.editForm = async (req, res) => {
  let { id } = req.params;
  const selectedListing = await listing.findById(id);
  console.log(selectedListing);
  res.render("edit.ejs", { selectedListing });
};

module.exports.update=(async (req, res) => {
    let { id } = req.params;
    let updatedlisting= await listing.findByIdAndUpdate(id, req.body);

    if(typeof req.file !== "undefined"){
    const { path: url, filename } = req.file;
    updatedlisting.image= {url, filename};
    await updatedlisting.save();
    }
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
  }
);

module.exports.destroy=async (req, res) => {
  let { id } = req.params;
  await listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};