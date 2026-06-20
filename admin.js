let selectedShipment = null;

loadShipments();

async function loadShipments(){

    const res = await fetch("/shipments");
    const data = await res.json();

    let transit = 0;
    let delivered = 0;
    let processing = 0;

    data.forEach(item=>{

        if(item.status.includes("Transit"))
            transit++;

        if(item.status.includes("Delivered"))
            delivered++;

        if(item.status.includes("Warehouse"))
            processing++;

    });

    document.getElementById("totalShipments").innerText =
    data.length;

    document.getElementById("inTransit").innerText =
    transit;

    document.getElementById("delivered").innerText =
    delivered;

    document.getElementById("processing").innerText =
    processing;

    renderShipments(data);
}

function generateTrackingId(){

    return "ST" +
    Math.floor(
        1000 + Math.random() * 9000
    );

}

function renderShipments(data){

    const list =
    document.getElementById("shipmentList");

    list.innerHTML = "";

    data.forEach(item=>{

        list.innerHTML += `
<div class="card">

<h3>${item.id}</h3>

<p><strong>Customer:</strong> ${item.customerName || "N/A"}</p>

<p><strong>Customer Phone:</strong> ${item.customerPhone || "N/A"}</p>

<p><strong>Receiver:</strong> ${item.receiverName || "N/A"}</p>

<p><strong>Receiver Phone:</strong> ${item.receiverPhone || "N/A"}</p>

<p><strong>Origin:</strong> ${item.origin || "N/A"}</p>

<p><strong>Destination:</strong> ${item.destination || "N/A"}</p>

<p><strong>Status:</strong> ${item.status}</p>

<p><strong>Location:</strong> ${item.location}</p>

<p><strong>ETA:</strong> ${item.eta}</p>

<div class="actions">

<button
class="edit-btn"
onclick="editShipment('${item.id}')">
Edit
</button>

<button
onclick="generateReceipt('${item.id}')">
Receipt
</button>

<button
onclick="viewTimeline('${item.id}')">
Timeline
</button>

<button
class="delete-btn"
onclick="deleteShipment('${item.id}')">
Delete
</button>

</div>

</div>
`;
   
    });

}

async function createShipment(){

   const shipment = {

    id: generateTrackingId(),

    customerName:
    document.getElementById("customerName").value,

    customerPhone:
    document.getElementById("customerPhone").value,

    receiverName:
    document.getElementById("receiverName").value,

    receiverPhone:
    document.getElementById("receiverPhone").value,

    origin:
    document.getElementById("origin").value,

    destination:
    document.getElementById("destination").value,

    status:
    document.getElementById("status").value,

    location:
    document.getElementById("location").value,

    eta:
    document.getElementById("eta").value,

    history:[
        "Order Confirmed"
    ]

};

    await fetch("/create-shipment",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(shipment)

    });

    loadShipments();
    document.getElementById("location").value = "";
document.getElementById("eta").value = "";
}

async function editShipment(id){

    const res =
    await fetch("/shipments");

    const data =
    await res.json();

    const shipment =
    data.find(x=>x.id===id);

    selectedShipment = id;

    document.getElementById("id").value =
    shipment.id;

    document.getElementById("status").value =
    shipment.status;

    document.getElementById("location").value =
    shipment.location;

    document.getElementById("eta").value =
    shipment.eta;
}

async function updateShipment(){

    if(!selectedShipment) return;

    const shipment = {

        id: document.getElementById("id").value,
        status: document.getElementById("status").value,
        location: document.getElementById("location").value,
        eta: document.getElementById("eta").value

    };

    const history = [];

if(shipment.status === "Warehouse Processing"){
    history.push("Warehouse Processing");
}

if(shipment.status === "In Transit"){
    history.push(
        "Warehouse Processing",
        "In Transit"
    );
}

if(shipment.status === "Custom Clearance"){
    history.push(
        "Warehouse Processing",
        "In Transit",
        "Custom Clearance"
    );
}

if(shipment.status === "Delivered"){
    history.push(
        "Warehouse Processing",
        "In Transit",
        "Custom Clearance",
        "Delivered"
    );
}

shipment.history = history;

    await fetch(
    `/update-shipment/${selectedShipment}`,
    {
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(shipment)
    });

    loadShipments();
}

async function deleteShipment(id){

    await fetch(
    `/delete-shipment/${id}`,
    {
        method:"DELETE"
    });

    loadShipments();
}

async function searchShipment(){

    const keyword =
    document.getElementById("searchInput")
    .value
    .toLowerCase();

    const res =
    await fetch("/shipments");

    const data =
    await res.json();

    const filtered =
    data.filter(item=>
        item.id.toLowerCase()
        .includes(keyword)
    );

    renderShipments(filtered);
}

async function generateReceipt(id){

    const res = await fetch("/shipments");
    const data = await res.json();

    const shipment =
    data.find(item => item.id === id);

    const receiptWindow =
    window.open("", "_blank");

    receiptWindow.document.write(`

    <html>

    <head>

    <title>Santus Logistics Receipt</title>

    <style>

    body{
        font-family:Arial, sans-serif;
        padding:40px;
        background:#f5f5f5;
    }

    .receipt{
        background:white;
        padding:30px;
        border-radius:10px;
        max-width:800px;
        margin:auto;
        box-shadow:0 0 15px rgba(0,0,0,0.15);
    }

    h1{
        text-align:center;
        color:#00b894;
    }

    h2{
        text-align:center;
        margin-bottom:20px;
    }

    table{
        width:100%;
        border-collapse:collapse;
    }

    td{
        border:1px solid #ddd;
        padding:12px;
    }

    td:first-child{
        font-weight:bold;
        width:35%;
    }

    .print-btn{
        margin-top:20px;
        padding:12px 20px;
        background:#00b894;
        color:white;
        border:none;
        border-radius:5px;
        cursor:pointer;
    }

    </style>

    </head>

    <body>

    <div class="receipt">

    <h1>SANTUS LOGISTICS</h1>

    <h2>Shipment Receipt</h2>

    <table>

    <tr>
    <td>Tracking ID</td>
    <td>${shipment.id}</td>
    </tr>

    <tr>
    <td>Customer Name</td>
    <td>${shipment.customerName || "N/A"}</td>
    </tr>

    <tr>
    <td>Customer Phone</td>
    <td>${shipment.customerPhone || "N/A"}</td>
    </tr>

    <tr>
    <td>Receiver Name</td>
    <td>${shipment.receiverName || "N/A"}</td>
    </tr>

    <tr>
    <td>Receiver Phone</td>
    <td>${shipment.receiverPhone || "N/A"}</td>
    </tr>

    <tr>
    <td>Origin</td>
    <td>${shipment.origin || "N/A"}</td>
    </tr>

    <tr>
    <td>Destination</td>
    <td>${shipment.destination || "N/A"}</td>
    </tr>

    <tr>
    <td>Status</td>
    <td>${shipment.status}</td>
    </tr>

    <tr>
    <td>Current Location</td>
    <td>${shipment.location}</td>
    </tr>

    <tr>
    <td>ETA</td>
    <td>${shipment.eta}</td>
    </tr>

    <tr>
    <td>Generated Date</td>
    <td>${new Date().toLocaleString()}</td>
    </tr>

    </table>

    <button
    class="print-btn"
    onclick="window.print()">

    Print Receipt

    </button>

    </div>

    </body>

    </html>

    `);

}
async function viewTimeline(id){

    const res =
    await fetch("/shipments");

    const data =
    await res.json();

    const shipment =
    data.find(item=>item.id===id);

    let timelineHTML = "";

    shipment.history.forEach(step=>{

        timelineHTML += `

        <div style="
        margin:15px 0;
        padding:15px;
        background:#172742;
        color:white;
        border-left:5px solid #00ffd0;
        ">

        ${step}

        </div>

        `;

    });

    const timelineWindow =
    window.open("","_blank");

    timelineWindow.document.write(`

    <html>

    <head>

    <title>Timeline</title>

    </head>

    <body style="
    font-family:Arial;
    padding:30px;
    ">

    <h1>
    Shipment Timeline
    </h1>

    <h2>
    ${shipment.id}
    </h2>

    ${timelineHTML}

    </body>

    </html>

    `);

}