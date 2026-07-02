require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./AdminModel");

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected DB:", mongoose.connection.name);

        const hashedPassword = await bcrypt.hash("Santus123", 10);

        await Admin.deleteOne({ username: "admin" });

        await Admin.create({
            username: "admin",
            password: hashedPassword
        });
        const admin = await Admin.findOne({ username: "admin" });
        console.log(admin);

        console.log("✅ Admin account created successfully.");

        process.exit();

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

createAdmin();