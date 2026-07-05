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

    const list =
    document.getElementById("shipmentList");

    list.innerHTML = "";

    data.forEach(item => {

        list.innerHTML += `

        <div class="card">

            <h3>${item.id}</h3>

            <p><strong>Customer:</strong>
            ${item.customerName || "N/A"}</p>

            <p><strong>Customer Phone:</strong>
            ${item.customerPhone || "N/A"}</p>

            <p><strong>Receiver:</strong>
            ${item.receiverName || "N/A"}</p>

            <p><strong>Receiver Phone:</strong>
            ${item.receiverPhone || "N/A"}</p>

            <p><strong>Origin:</strong>
            ${item.origin || "N/A"}</p>

            <p><strong>Destination:</strong>
            ${item.destination || "N/A"}</p>

            <p><strong>Status:</strong>
            ${item.status}</p>

            <p><strong>Location:</strong>
            ${item.location || "N/A"}</p>

            <p><strong>ETA:</strong>
            ${item.eta || "N/A"}</p>

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