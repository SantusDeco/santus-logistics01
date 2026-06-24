if(
localStorage.getItem("adminLoggedIn")
!== "true"
){
window.location.href = "login.html";
}

const API =
"https://santus-logistics01.onrender.com";

let selectedShipment = null;

loadShipments();

/* =========================
LOAD SHIPMENTS
========================= */
async function loadShipments() {

    const res =
    await fetch(`${API}/shipments`);

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

        history: [
            "Order Confirmed"
        ]
    };

    await fetch(`${API}/create-shipment`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(shipment)

    });

    alert("Shipment Created Successfully");

    loadShipments();
}

/* =========================
EDIT SHIPMENT
========================= */
async function editShipment(id) {

    const res =
    await fetch(`${API}/shipments`);

    const data =
    await res.json();

    const shipment =
    data.find(item => item.id === id);

    selectedShipment = shipment;

    document.getElementById("id").value =
    shipment.id;

    document.getElementById("customerName").value =
    shipment.customerName || "";

    document.getElementById("customerPhone").value =
    shipment.customerPhone || "";

    document.getElementById("receiverName").value =
    shipment.receiverName || "";

    document.getElementById("receiverPhone").value =
    shipment.receiverPhone || "";

    document.getElementById("origin").value =
    shipment.origin || "";

    document.getElementById("destination").value =
    shipment.destination || "";

    document.getElementById("status").value =
    shipment.status;

    document.getElementById("location").value =
    shipment.location;

    document.getElementById("eta").value =
    shipment.eta;
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
        document.getElementById("eta").value
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

    await fetch(
        `${API}/update-shipment/${selectedShipment.id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(shipment)
        }
    );

    alert("Shipment Updated");

    loadShipments();
}

/* =========================
DELETE SHIPMENT
========================= */
async function deleteShipment(id) {

    if(!confirm("Delete shipment?")) return;

    await fetch(
        `${API}/delete-shipment/${id}`,
        {
            method: "DELETE"
        }
    );

    loadShipments();
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

function logout(){

localStorage.removeItem(
"adminLoggedIn"
);

window.location.href =
"login.html";

}