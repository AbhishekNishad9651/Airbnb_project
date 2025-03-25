// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
// const path = require("path");
// const methodOverride = require("method-override");
// const ejsMate = require("ejs-mate");


// const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

// main().then(()=> {
//     console.log("connected to DB");
// }).catch(err => {
//     console.log(err);
// });
// async function main() {
//     await mongoose.connect(MONGO_URL);
// }

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(express.urlencoded({extended: true}));
// app.use(methodOverride("_method"));
// app.engine("ejs",ejsMate);
// app.use(express.static(path.join(__dirname, "/public")));


// app.get("/", (req,res) =>{
//     res.send("Hii to kaise hai app log")
// });

// ///Index Route
// app.get("/listings", async (req, res) =>{
//     const alllistings = await Listing.find({});
//     res.render("./listings/index.ejs", {alllistings});
// });

// //New  Route
// app.get("/listings/new", (req, res)=>{
//     res.render("./listings/new.ejs")
// })

// //Show Route
// app.get("/listings/:id", async(req, res)=>{
//     let {id} = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/show.ejs", {listing});
// });

// //Create Route

// app.post("/listings", async(req,res)=>{
//     const  newListing  = new Listing(req.body.listing);
//     // console.log(newListing);
//     await newListing.save();
    
//     res.redirect("/listings");
// });

// //Edit Route
// app.get("/listings/:id/edit", async(req,res)=>{
//     let {id} = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/edit.ejs", {listing});
// });

// //Update Route
// app.put("/listings/:id", async(req, res)=> {
//     let {id} = req.params;
//     await Listing.findByIdAndUpdate(id, {...req.body.listing});
//     res.redirect(`/listings/${id}`);
// });

// //Delete Route
// app.delete("/listings/:id", async(req, res)=>{
//     let {id} = req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     res.redirect("/listings");
// });


// // app.get("/testListing", async (req,res)=>{
// //     let sampleListing = new Listing({
// //         title : "My new Villa",
// //         description : "This is a beautiful villa",
// //         price : 1200,
// //         location : "Mumbai",
// //         country : "India",
// //     });
// //     await sampleListing.save();
// //     console.log("sample was saved");
// //     res.send("Successful testing!");
// // });

// app.listen(8080, ()=>{
//     console.log("server is listening to port 8080:");
// });








const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Reviews = require("./models/reviews.js");





const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main().then(() => console.log("Connected to DB")).catch(console.error);

async function main() {
  await mongoose.connect(MONGO_URL);
}

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Hii to kaise hai app log");
});

app.get("/listings", async (req, res) => {
  try {
    const alllistings = await Listing.find({});
    res.render("./listings/index.ejs", { alllistings });
  } catch (error) {
    res.status(500).send("Error fetching listings");
  }
});

app.get("/listings/new", (req, res) => {
  res.render("./listings/new.ejs");
});

app.get("/listings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send("Invalid ID format");
    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).send("Listing not found");
    res.render("listings/show.ejs", { listing });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.post("/listings", async (req, res) => {
  try {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  } catch (error) {
    res.status(500).send("Error creating listing");
  }
});

app.get("/listings/:id/edit", async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).send("Listing not found");
    res.render("listings/edit.ejs", { listing });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.put("/listings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  } catch (error) {
    res.status(500).send("Error updating listing");
  }
});

app.delete("/listings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  } catch (error) {
    res.status(500).send("Error deleting listing");
  }
});


//Reviews
//Post Route
app.post("/listings/:id/reviews", async(req, res)=>{
let listing = await Listing.findById(req.params.id);
let newReview = new Reviews(req.body.review);

listing.reviews.push(newReview);
await newReview.save();
await listing.save();

console.log("new review saved");
res.send("new review saved");

})

app.listen(8080, () => console.log("Server is listening on port 8080"));

