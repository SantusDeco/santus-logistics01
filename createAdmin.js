require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Admin = require("./AdminModel");

mongoose.connect(process.env.MONGO_URI)
.then(async () => {

    const hashedPassword =
    await bcrypt.hash(
        "Santus123",
        10
    );

    await Admin.create({
        username: "admin",
        password: hashedPassword
    });

    console.log("Admin Created");

    process.exit();

})
.catch(err => {
    console.log(err);
});