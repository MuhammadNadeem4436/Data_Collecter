const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { default: mongoose } = require("mongoose");
const { error } = require("console");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const adminStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."

// CONNECTING WITH DATA BASE 

mongoose.connect("mongodb://localhost:27017/DataDB", { useNewUrlParser: true })


// CREATING DATA SCHEMA 

const DataSchema = {
    name: String,
    email: String,
    pnumber: Number
}

// CREATING MODEL 

const User = mongoose.model("User", DataSchema)
// CREATING DOCUMENT 

const UserOne = new User({
    name: "Muhammad Nadeem",
    email: "nadeem@gmail.com",
    pnumber: "+92347248924"
})

const DataArray = [UserOne]

// INSERTING DATA TO DATA BASE 



// CREATING ROUTE FOR HOME PAGE 

app.get("/", function (req, res) {
    res.render("home", { HomeString: homeStartingContent })
})

// CREATING ROUTE FOR LOGIN 

app.get("/login", function (req, res) {
    res.render("login", {})
    // res.redirect("/admin")
})

app.post("/login", function (req, res) {
    const OTP = req.body.otp;
    if (OTP === "1234") {
        res.redirect("/admin")
    } else {
        res.redirect("/login")
        // res.write("User Not Found!! Please Try Again")
        // res.send()
    }
})

// CREATING ROUTE FOR ADMIN PAGE

app.get("/admin", function (req, res) {
    async function ReadData() {
        try {
            const Users = await User.find();
            if (Users.length === 0) {
                async function InsertData() {
                    console.log(DataArray);
                    try {
                        await User.insertMany(DataArray, console.log("Succesfuly Added"))
                    } catch (error) {
                        console.log(error)
                    }
                }
                InsertData();
                res.redirect("/admin")
            } else {
                res.render("admin", { AdminString: adminStartingContent, data: Users })
            }
        } catch (error) {
            console.log(error)
        }
    }
    ReadData();
})

// CREATING ROUTE FOR DATA FORM 

app.get("/data", function (req, res) {
    res.render("data", {})
})

app.post("/data", function (req, res) {
    const UserName = req.body.Name;
    const UserEmail = req.body.Email;
    const UserPnumber = req.body.pnumber;

    const User1 = new User({
        name: UserName,
        email: UserEmail,
        pnumber: UserPnumber
    })

    User1.save();
    res.redirect("/data")
})

// CREATING ROUTE FOR DELETE 

app.post("/delete", function (req, res) {
    const UserId = req.body.delete;
    console.log(UserId)
    async function DeleteItem() {
        try {
            const FoundUser = await User.findById(UserId)
            if (FoundUser) {
                await User.findByIdAndDelete(UserId)
                console.log("Succesfuly Deleted!")
                res.redirect("/admin")
            } else {
                console.log(error)
            }
        } catch (error) {
            console.log(error)
        }
    }

    DeleteItem();
})

app.listen(3000, function () {
    console.log("Server running on port 3000")
})