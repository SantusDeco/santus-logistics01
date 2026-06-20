require("dotenv").config();
const mongoose = require("mongoose");

console.log("URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("✅ CONNECTED");
    process.exit(0);
})
.catch(err => {
    console.log("❌ FAILED");
    console.log("Name:", err.name);
    console.log("Message:", err.message);
    process.exit(1);
});