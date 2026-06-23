const mongoose = require("mongoose");

const ShipmentSchema = new mongoose.Schema({
  id: String,
  customerName: String,
  customerPhone: String,
  receiverName: String,
  receiverPhone: String,
  origin: String,
  destination: String,
  status: String,
  location: String,
  eta: String,
  history: [String]
});

module.exports = mongoose.model(
  "Shipment",
  ShipmentSchema
);