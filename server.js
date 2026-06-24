require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const Shipment = require("./Shipment.js");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
})
.catch(err => {
    console.log(err);
});

const Admin =
require("./AdminModel");

const bcrypt = require("bcryptjs");

/* GET ALL SHIPMENTS */
app.get("/shipments", async (req, res) => {
  const shipments = await Shipment.find();
  res.json(shipments);
});

/* TRACK SHIPMENT */
app.get("/track/:id", async (req, res) => {

  const shipment = await Shipment.findOne({
    id: req.params.id
  });

  if (!shipment) {
    return res.status(404).json({
      message: "Tracking ID Not Found"
    });
  }

  res.json(shipment);
});
/* CREATE SHIPMENT */
app.post("/create-shipment", async (req, res) => {

  const shipment =
  new Shipment(req.body);

  await shipment.save();

  res.json({
    message: "Shipment Created"
  });

});
/* DELETE SHIPMENT */
app.delete("/delete-shipment/:id", async (req, res) => {

  await Shipment.deleteOne({
    id: req.params.id
  });

  res.json({
    message: "Shipment Deleted"
  });

});
/* UPDATE SHIPMENT */
app.put("/update-shipment/:id", async (req, res) => {

  const shipment =
  await Shipment.findOneAndUpdate(
    { id: req.params.id },
    req.body,
    { new: true }
  );

  if (!shipment) {

    return res.status(404).json({
      message: "Shipment Not Found"
    });

  }

  res.json({
    message: "Shipment Updated"
  });

});

const Admin = require("./AdminModel");

/* ADMIN LOGIN */
app.post("/admin-login", async (req, res) => {

    const { username, password } = req.body;

    const admin = await Admin.findOne({
        username
    });

    if (!admin) {
        return res.json({
            success: false
        });
    }

    const match =
    await bcrypt.compare(
        password,
        admin.password
    );

    if (!match) {
        return res.json({
            success: false
        });
    }

    res.json({
        success: true
    });

});
const PORT =
process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});

app.get("/admins", async (req, res) => {
  const admins = await Admin.find();
  res.json(admins);
});