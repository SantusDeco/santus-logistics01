const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const FILE = "./shipments.json";

/* GET ALL SHIPMENTS */
app.get("/shipments", (req, res) => {
  const data = JSON.parse(fs.readFileSync(FILE));
  res.json(data);
});

/* TRACK SHIPMENT */
app.get("/track/:id", (req, res) => {
  const data = JSON.parse(fs.readFileSync(FILE));

  const shipment = data.find(
    item => item.id === req.params.id
  );

  if (!shipment) {
    return res.status(404).json({
      message: "Tracking ID Not Found"
    });
  }

  res.json(shipment);
});

/* CREATE SHIPMENT */
app.post("/create-shipment", (req, res) => {
  const data = JSON.parse(fs.readFileSync(FILE));

  data.push(req.body);

  fs.writeFileSync(
    FILE,
    JSON.stringify(data, null, 2)
  );

  res.json({
    message: "Shipment Created"
  });
});

/* DELETE SHIPMENT */
app.delete("/delete-shipment/:id", (req, res) => {

  let data = JSON.parse(
    fs.readFileSync(FILE)
  );

  data = data.filter(
    item => item.id !== req.params.id
  );

  fs.writeFileSync(
    FILE,
    JSON.stringify(data, null, 2)
  );

  res.json({
    message: "Shipment Deleted"
  });
});

/* UPDATE SHIPMENT */
app.put("/update-shipment/:id", (req, res) => {

    let data = JSON.parse(
        fs.readFileSync(FILE)
    );

    const index = data.findIndex(
        item => item.id === req.params.id
    );

    if(index === -1){

        return res.status(404).json({
            message:"Shipment Not Found"
        });

    }

    data[index] = req.body;

    fs.writeFileSync(
        FILE,
        JSON.stringify(data,null,2)
    );

    res.json({
        message:"Shipment Updated"
    });

});

app.listen(3000, () => {
  console.log(
    "Server running on http://localhost:3000"
  );
});