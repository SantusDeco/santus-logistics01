
requireLogin();

let selectedShipment = null;

loadShipments();
/* =========================
LOAD SHIPMENTS
========================= */
async function loadShipments() {

    const res =
     await api.get("/shipments");

    const data =
    await res.json();

    let transit = 0;
    let delivered = 0;
    let processing = 0;

    data.forEach(item => {

        if(item.status === "In Transit")
            transit++;

        if(item.status === "Delivered")
            delivered++;

        if(item.status === "Warehouse Processing")
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

/* =========================
GENERATE TRACKING ID
========================= */
function generateTrackingId() {

    return "ST" +
    Math.floor(
        1000 + Math.random() * 9000
    );

}

/* =========================
RENDER SHIPMENTS
========================= */
function renderShipments(data) {

    const list = document.getElementById("shipmentList");

    list.innerHTML = "";

    data.forEach(item => {

        let badgeClass = "";

        switch(item.status){

            case "Delivered":
                badgeClass = "badge-delivered";
                break;

            case "In Transit":
                badgeClass = "badge-transit";
                break;

            case "Warehouse Processing":
                badgeClass = "badge-processing";
                break;

            default:
                badgeClass = "badge-custom";
        }

        list.innerHTML += `

        <div class="card">

            <div class="card-top">

                <h2>🚚 ${item.id}</h2>

                <span class="status-badge ${badgeClass}">
                    ${item.status}
                </span>

            </div>

            <hr>

            <p>👤 <strong>Customer</strong><br>
            ${item.customerName || "N/A"}</p>

            <p>📞 <strong>Customer Phone</strong><br>
            ${item.customerPhone || "N/A"}</p>

            <p>📦 <strong>Receiver</strong><br>
            ${item.receiverName || "N/A"}</p>

            <p>☎ <strong>Receiver Phone</strong><br>
            ${item.receiverPhone || "N/A"}</p>

            <p>📍 <strong>Route</strong><br>

            ${item.origin || "N/A"}

            <br>

            ⬇

            <br>

            ${item.destination || "N/A"}

            </p>

            <p>📌 <strong>Current Location</strong><br>

            ${item.location || "N/A"}

            </p>

            <p>⏰ <strong>ETA</strong><br>

            ${item.eta || "N/A"}

            </p>
            <p>📅 <strong>Shipment Date</strong><br>
${item.shipmentDate || "N/A"}
</p>

<p>⚖️ <strong>Weight</strong><br>
${item.weight || "N/A"} KG
</p>

<p>🚚 <strong>Shipping Method</strong><br>
${item.shippingMethod || "N/A"}
</p>

<p>📦 <strong>Package Type</strong><br>
${item.packageType || "N/A"}
</p>

<p>💳 <strong>Payment Status</strong><br>
${item.paymentStatus || "N/A"}
</p>

<p>📝 <strong>Description</strong><br>
${item.description || "N/A"}
</p>

            <div class="actions">

            <button
class="details-btn"
onclick="viewShipmentDetails('${item.id}')">

👁 Details

</button>

                <button
                class="edit-btn"
                onclick="editShipment('${item.id}')">

                ✏ Edit

                </button>

                <button
                onclick="generateReceipt('${item.id}')">

                🧾 Receipt

                </button>

                <button
                onclick="showTimeline('${item.id}')">

                🕒 Timeline

                </button>

                <button
                class="delete-btn"
                onclick="deleteShipment('${item.id}')">

                🗑 Delete

                </button>

            </div>

        </div>

        `;

    });

}

async function viewShipmentDetails(id){

    const res = await api.get("/shipments");

    const shipments = await res.json();

    const shipment = shipments.find(item => item.id === id);

    if(!shipment){

        showToast("Shipment Not Found","error");

        return;

    }

    document.getElementById("detailsBody").innerHTML = `

    <p><strong>🚚 Tracking ID:</strong> ${shipment.id}</p>

    <hr>

    <p><strong>👤 Customer:</strong> ${shipment.customerName || "N/A"}</p>

    <p><strong>📞 Customer Phone:</strong> ${shipment.customerPhone || "N/A"}</p>

    <hr>

    <p><strong>📦 Receiver:</strong> ${shipment.receiverName || "N/A"}</p>

    <p><strong>☎ Receiver Phone:</strong> ${shipment.receiverPhone || "N/A"}</p>

    <hr>

    <p><strong>📍 Origin:</strong> ${shipment.origin || "N/A"}</p>

    <p><strong>🎯 Destination:</strong> ${shipment.destination || "N/A"}</p>

    <p><strong>📌 Current Location:</strong> ${shipment.location || "N/A"}</p>

    <hr>

    <p><strong>📅 Shipment Date:</strong> ${shipment.shipmentDate || "N/A"}</p>

    <p><strong>⚖ Weight:</strong> ${shipment.weight || "N/A"} KG</p>

    <p><strong>🚚 Shipping Method:</strong> ${shipment.shippingMethod || "N/A"}</p>

    <p><strong>📦 Package Type:</strong> ${shipment.packageType || "N/A"}</p>

    <p><strong>💳 Payment Status:</strong> ${shipment.paymentStatus || "N/A"}</p>

    <hr>

    <p><strong>📝 Description:</strong></p>

    <p>${shipment.description || "N/A"}</p>

    <hr>

    <p><strong>⏰ ETA:</strong> ${shipment.eta || "N/A"}</p>

    <p><strong>📊 Status:</strong> ${shipment.status}</p>

    `;

    document.getElementById("detailsModal").style.display = "block";

}

function closeShipmentDetails(){

    document.getElementById("detailsModal").style.display = "none";

}

window.onclick = function(event){

    const modal = document.getElementById("detailsModal");

    if(event.target === modal){

        modal.style.display = "none";

    }

}
/* =========================
CREATE SHIPMENT
========================= */
async function createShipment() {

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

    shipmentDate:
    document.getElementById("shipmentDate").value,

    weight:
    document.getElementById("weight").value,

    shippingMethod:
    document.getElementById("shippingMethod").value,

    paymentStatus:
    document.getElementById("paymentStatus").value,

    packageType:
    document.getElementById("packageType").value,

    description:
    document.getElementById("description").value,

    receiptNumber:
    "RCPT-" + Date.now(),

    history: [
        "Order Confirmed"
    ]
};

    await api.post("/create-shipment", shipment);

showToast("✅ Shipment Created Successfully");
    loadShipments();
}

/* =========================
EDIT SHIPMENT
========================= */
async function loadShipments() {

    const res = await fetch(`${API}/shipments`, {
        headers: authHeaders(false)
    });

    if (!res.ok) {
        console.log(await res.text());
        alert("Failed to load shipments.");
        return;
    }

    const data = await res.json();

    let transit = 0;
    let delivered = 0;
    let processing = 0;

    data.forEach(item => {

        if(item.status === "In Transit")
            transit++;

        if(item.status === "Delivered")
            delivered++;

        if(item.status === "Warehouse Processing")
            processing++;

    });

    document.getElementById("totalShipments").innerText = data.length;
    document.getElementById("inTransit").innerText = transit;
    document.getElementById("delivered").innerText = delivered;
    document.getElementById("processing").innerText = processing;

    renderShipments(data);
}
/* =========================
UPDATE SHIPMENT
========================= */
async function updateShipment() {

    if(!selectedShipment) {
        alert("Select a shipment first");
        return;
    }

    const shipment = {

    id:
    document.getElementById("id").value,

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

    shipmentDate:
    document.getElementById("shipmentDate").value,

    weight:
    document.getElementById("weight").value,

    shippingMethod:
    document.getElementById("shippingMethod").value,

    paymentStatus:
    document.getElementById("paymentStatus").value,

    packageType:
    document.getElementById("packageType").value,

    description:
    document.getElementById("description").value,

    receiptNumber:
    selectedShipment.receiptNumber ||
    ("RCPT-" + Date.now())
};
    const history = [];

    if(shipment.status === "Warehouse Processing") {
        history.push(
            "Order Confirmed",
            "Warehouse Processing"
        );
    }

    if(shipment.status === "In Transit") {
        history.push(
            "Order Confirmed",
            "Warehouse Processing",
            "In Transit"
        );
    }

    if(shipment.status === "Custom Clearance") {
        history.push(
            "Order Confirmed",
            "Warehouse Processing",
            "In Transit",
            "Custom Clearance"
        );
    }

    if(shipment.status === "Delivered") {
        history.push(
            "Order Confirmed",
            "Warehouse Processing",
            "In Transit",
            "Custom Clearance",
            "Delivered"
        );
    }

    shipment.history = history;

    await api.put(
    `/update-shipment/${selectedShipment.id}`,
    shipment
);

showToast("✏️ Shipment Updated");
    loadShipments();
}

/* =========================
DELETE SHIPMENT
========================= */
async function deleteShipment(id) {

    const ok = await confirmDelete(
        "This shipment will be permanently deleted."
    );

    if (!ok) return;

    try {

        const res = await api.delete(`/delete-shipment/${id}`);

const data = await res.json();

if (!res.ok) {

    showToast(data.message, "error");

    return;

}

showToast("🗑 Shipment Deleted Successfully");

loadShipments();
    } catch (err) {

        showToast(
            "❌ Failed To Delete Shipment",
            "error"
        );

        console.error(err);

    }

}
/* =========================
SEARCH SHIPMENT
========================= */
async function searchShipment() {

    const keyword =
    document.getElementById("searchInput")
    .value
    .toLowerCase();

    const res =
    await fetch(`${API}/shipments`);

    const data =
    await res.json();

    const filtered =
    data.filter(item =>
        item.id.toLowerCase()
        .includes(keyword)
    );

    renderShipments(filtered);
}

showToast("Welcome back Santus!");

async function generateReceipt(id) {

    const res = await api.get("/shipments");
    const shipments = await res.json();

    const shipment = shipments.find(
        item => item.id === id
    );

    if (!shipment) {
        showToast("Shipment Not Found", "error");
        return;
    }

    const receiptWindow = window.open("", "_blank");

    receiptWindow.document.write(`
        <html>
        <head>
            <title>Shipment Receipt</title>
            <style>
                body{
                    font-family:Arial;
                    padding:20px;
                }
                h1{
                    color:#00f5d4;
                }
                p{
                    font-size:16px;
                }
            </style>
        </head>
        <body>

<h1 style="text-align:center;color:#00d4aa;">
Santus Logistics Receipt
</h1>

<hr>

<p><strong>Tracking ID:</strong> ${shipment.id}</p>

<p><strong>Customer Name:</strong> ${shipment.customerName}</p>

<p><strong>Customer Phone:</strong> ${shipment.customerPhone}</p>

<p><strong>Receiver Name:</strong> ${shipment.receiverName}</p>

<p><strong>Receiver Phone:</strong> ${shipment.receiverPhone}</p>

<p><strong>Origin:</strong> ${shipment.origin}</p>

<p><strong>Destination:</strong> ${shipment.destination}</p>

<p><strong>Current Location:</strong> ${shipment.location}</p>

<p><strong>Status:</strong> ${shipment.status}</p>

<p><strong>Estimated Delivery:</strong> ${shipment.eta}</p>

<p><strong>Shipment Date:</strong> ${shipment.shipmentDate || "N/A"}</p>

<p><strong>Weight:</strong> ${shipment.weight || "N/A"} KG</p>

<p><strong>Shipping Method:</strong> ${shipment.shippingMethod || "N/A"}</p>

<p><strong>Package Type:</strong> ${shipment.packageType || "N/A"}</p>

<p><strong>Payment Status:</strong> ${shipment.paymentStatus || "N/A"}</p>

<p><strong>Description:</strong> ${shipment.description || "N/A"}</p>

<hr>

<h3>Shipment Details</h3>

<p><strong>Weight:</strong> ${shipment.weight || "N/A"} KG</p>

<p><strong>Service:</strong> ${shipment.service || "N/A"}</p>

<p><strong>Package Type:</strong> ${shipment.packageType || "N/A"}</p>

<p><strong>Payment Status:</strong> ${shipment.paymentStatus || "N/A"}</p>

<p><strong>Description:</strong> ${shipment.description || "N/A"}</p>

<hr>

<p style="text-align:center">
Thank you for choosing
<b>Santus Logistics</b><br>
Fast • Secure • Reliable
</p>

</body>
        </html>
    `);

    receiptWindow.document.close();

    receiptWindow.print();
}

async function showTimeline(id) {

    const res = await api.get("/shipments");

    const shipments = await res.json();

    const shipment = shipments.find(s => s.id === id);

    if (!shipment) {

        showToast("Shipment not found", "error");

        return;

    }

    const stages = [

        "Warehouse Processing",

        "Custom Clearance",

        "In Transit",

        "Out For Delivery",

        "Delivered"

    ];

    const currentIndex = stages.indexOf(shipment.status);

    const stageLocations = {

        "Warehouse Processing": shipment.origin || "Warehouse",

        "Custom Clearance": shipment.origin || "Customs",

        "In Transit": shipment.location || "In Transit",

        "Out For Delivery": shipment.destination || "Destination City",

        "Delivered": shipment.destination || "Delivered"

    };

    let html = "";

    stages.forEach((stage, index) => {

        let cls = "";

        if (index < currentIndex) {

            cls = "completed";

        } else if (index === currentIndex) {

            cls = "active";

        }

        html += `

        <div class="timeline-item">

            <div class="timeline-left">

                <div class="timeline-dot ${cls}"></div>

                ${index !== stages.length - 1 ? '<div class="timeline-line"></div>' : ''}

            </div>

            <div class="timeline-content">

                <h4>${stage}</h4>

                <p><strong>📍 Location:</strong> ${stageLocations[stage]}</p>

                <p><strong>📅 Date:</strong> ${shipment.shipmentDate || "N/A"}</p>

                <p><strong>Status:</strong>
                ${
                    index < currentIndex
                        ? "✅ Completed"
                        : index === currentIndex
                        ? "🚚 Current Stage"
                        : "⏳ Pending"
                }
                </p>

            </div>

        </div>

        `;

    });

    document.getElementById("timelineBody").innerHTML = `

        <h3>${shipment.id}</h3>

        ${html}

    `;

    document.getElementById("timelineModal").style.display = "block";

}

function closeTimeline() {

    document.getElementById("timelineModal").style.display = "none";

}