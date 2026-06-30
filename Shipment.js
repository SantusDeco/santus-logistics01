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

    shipmentDate: String,

    weight: String,

    shippingMethod: String,

    paymentStatus: String,

    packageType: String,

    description: String,

    receiptNumber: String,

    history: [String]

});

module.exports = mongoose.model(
    "Shipment",
    ShipmentSchema
);