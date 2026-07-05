require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Shipment = require("./Shipment");
const Admin = require("./AdminModel");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
})
.catch(err => {
    console.log(err);
});

/* =========================
   JWT VERIFY MIDDLEWARE
========================= */

function verifyToken(req, res, next){

    const authHeader =
    req.headers.authorization;

    if(!authHeader){

        return res.status(401).json({
            message:"Access Denied"
        });

    }

    const token =
    authHeader.split(" ")[1];

    try{

        const verified =
        jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.admin = verified;

        next();

    }catch(err){

        return res.status(403).json({
            message:"Invalid Token"
        });

    }

}
/* =========================
GET ALL SHIPMENTS
========================= */

app.get("/shipments", async(req,res)=>{

    const shipments =
    await Shipment.find();

    res.json(shipments);

});

/* =========================
TRACK SHIPMENT
========================= */

app.get("/track/:id", async(req,res)=>{

    const shipment =
    await Shipment.findOne({
        id:req.params.id
    });

    if(!shipment){

        return res.status(404).json({
            message:"Tracking ID Not Found"
        });

    }

    res.json(shipment);

});

/* =========================
CREATE SHIPMENT
========================= */

app.post(
"/create-shipment",
verifyToken,
async(req,res)=>{

    const shipment =
    new Shipment(req.body);

    await shipment.save();

    res.json({
        message:"Shipment Created"
    });

});

/* =========================
UPDATE SHIPMENT
========================= */

app.put(
"/update-shipment/:id",
verifyToken,
async(req,res)=>{

    const shipment =
    await Shipment.findOneAndUpdate(

        {
            id:req.params.id
        },

        req.body,

        {
            new:true
        }

    );

    if(!shipment){

        return res.status(404).json({
            message:"Shipment Not Found"
        });

    }

    res.json({
        message:"Shipment Updated"
    });

});

/* =========================
DELETE SHIPMENT
========================= */

app.delete(
"/delete-shipment/:id",
verifyToken,
async (req, res) => {

    try {

        const result = await Shipment.deleteOne({
            id: req.params.id
        });

        if (result.deletedCount === 0) {

            return res.status(404).json({
                success: false,
                message: "Shipment not found"
            });

        }

        res.json({
            success: true,
            message: "Shipment Deleted"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

});
/* =========================
ADMIN LOGIN
========================= */

app.post("/admin-login", async (req, res) => {

    try {

        const { username, password } = req.body;

        console.log("Username entered:", username);
        console.log("Password entered:", password);

        const admin = await Admin.findOne({ username });

        console.log("Admin found:", admin);

        if (!admin) {

            return res.status(401).json({
                success: false,
                message: "Admin not found"
            });

        }

        const match = await bcrypt.compare(
            password,
            admin.password
        );

        console.log("Password Match:", match);

        if (!match) {

            return res.status(401).json({
                success:false,
                message:"Wrong Password"
            });

        }

        const token = jwt.sign(
            {
                username: admin.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"24h"
            }
        );

        res.json({
            success:true,
            token
        });

    } catch(err){

        console.log(err);

        res.status(500).json({
            success:false,
            message:"Server Error"
        });

    }

});

/* =========================
SHOW ADMINS
========================= */

app.get("/admins", async (req, res) => {

    const admins = await Admin.find();

    res.json(admins);

});

/* =========================
HOME PAGE
========================= */

app.get("/", (req, res) => {

    res.sendFile(
        __dirname + "/index.html"
    );

});

/* =========================
SERVER START
========================= */

const PORT =
process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `🚚 Santus Logistics Server Running On Port ${PORT}`
    );

});