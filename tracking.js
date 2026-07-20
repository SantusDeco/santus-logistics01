/* =========================
   MOBILE MENU
========================= */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});


/* =========================
   TRACK SHIPMENT
========================= */

async function trackShipment() {

    const trackingId = document
        .getElementById("trackingInput")
        .value
        .trim();

    const resultBox =
        document.getElementById("trackingResult");

    const loading =
        document.getElementById("loading");

    const truck =
        document.getElementById("truck");

    const steps = [
        document.getElementById("step1"),
        document.getElementById("step2"),
        document.getElementById("step3"),
        document.getElementById("step4"),
        document.getElementById("step5")
    ];

    steps.forEach(step => {
        step.classList.remove("active");
    });

if (truck) {

    truck.style.left = "0%";

}

    loading.classList.remove("hidden");

    try {

        const response = await fetch(
            `https://santus-logistics01.onrender.com/track/${trackingId}`
        );

        const data = await response.json();

        loading.classList.add("hidden");

        if (!response.ok) {

            resultBox.innerHTML = `

            <div class="error-card">

                <h3>Tracking Error</h3>

                <p>${data.message}</p>

            </div>

            `;

            return;
        }


        /* =========================
           PREMIUM RESULT CARD
        ========================== */
console.log("shipmentSummary =", document.getElementById("shipmentSummary"));
document.getElementById("shipmentSummary").innerHTML = `
<div class="result-card premium-result">

<div class="shipment-header">

<h2>Shipment Located</h2>

<span class="status-badge ${
data.status === "Warehouse Processing" ? "status-processing" :
data.status === "Custom Clearance" ? "status-customs" :
data.status === "In Transit" ? "status-transit" :
data.status === "Out For Delivery" ? "status-delivery" :
data.status === "Delivered" ? "status-delivered" : ""
}">
${data.status}
</span>
</div>

<div class="shipment-grid">

<div class="info-card">
<h4>👤 Customer</h4>
<p>${data.customerName || "N/A"}</p>
<small>${data.customerPhone || "N/A"}</small>
</div>

<div class="info-card">
<h4>📦 Receiver</h4>
<p>${data.receiverName || "N/A"}</p>
<small>${data.receiverPhone || "N/A"}</small>
</div>

<div class="info-card">
<h4>📍 Route</h4>
<p>${data.origin || "N/A"}</p>
<div class="route-arrow">⬇</div>
<p>${data.destination || "N/A"}</p>
</div>

<div class="info-card">
<h4>🚚 Current Location</h4>
<p>${data.location || "N/A"}</p>
</div>

<div class="info-card">
<h4>📅 Shipment Date</h4>
<p>${data.shipmentDate || "N/A"}</p>
</div>

<div class="info-card">
<h4>⏰ ETA</h4>
<p>${data.eta || "N/A"}</p>
</div>

<div class="info-card">
<h4>⚖ Weight</h4>
<p>${data.weight || "N/A"} KG</p>
</div>

<div class="info-card">
<h4>✈ Shipping</h4>
<p>${data.shippingMethod || "N/A"}</p>
</div>

<div class="info-card">
<h4>📦 Package Type</h4>
<p>${data.packageType || "N/A"}</p>
</div>

<div class="info-card">
<h4>💳 Payment</h4>
<p>${data.paymentStatus || "N/A"}</p>
</div>

</div>
<div class="route-point">

<div class="route-icon">🚚</div>

<h4>Current</h4>

<p>${data.location || "N/A"}</p>

</div>

<div class="route-middle">

<div class="route-line">

<div class="route-plane">✈️</div>

</div>

</div>

<div class="route-point">

<div class="route-icon">🏁</div>

<h4>Destination</h4>

<p>${data.destination || "N/A"}</p>

</div>

</div>
</div>
<div class="description-box">

<h4>Package Description</h4>

<p>${data.description || "No Description"}</p>

</div>

</div>

`;


        /* =========================
           TIMELINE
        ========================== */
let progress = 0;

let stageText = "";

switch(data.status){

case "Warehouse Processing":

progress = 20;

stageText = "Warehouse Processing";

steps[0].classList.add("active");

break;

case "Custom Clearance":

progress = 40;

stageText = "Custom Clearance";

steps[0].classList.add("active");
steps[1].classList.add("active");
steps[2].classList.add("active");

break;

case "In Transit":

progress = 70;

stageText = "In Transit";

steps[0].classList.add("active");
steps[1].classList.add("active");
steps[2].classList.add("active");

break;

case "Out For Delivery":

progress = 90;

stageText = "Out For Delivery";

steps.forEach(step=>step.classList.add("active"));

break;

case "Delivered":

progress = 100;

stageText = "Delivered";

steps.forEach(step=>step.classList.add("active"));

break;

}
console.log("progressFill =", document.getElementById("progressFill"));
console.log("progressText =", document.getElementById("progressText"));
console.log("progressStage =", document.getElementById("progressStage"));
console.log("progressContainer =", document.getElementById("progressContainer"));
document.getElementById("progressFill").style.width = progress + "%";

document
.getElementById("progressText")
.textContent = progress + "%";

document
.getElementById("progressStage")
.textContent = stageText;

document
.getElementById("progressContainer")
.classList.remove("hidden");


// =========================
// SHOW LIVE SHIPMENT STATS
// =========================

document.getElementById("shipmentStats")
.classList.remove("hidden");

document.getElementById("statWeight")
.textContent = (data.weight || "N/A") + " KG";

document.getElementById("statMethod")
.textContent = data.shippingMethod || "N/A";

document.getElementById("statEta")
.textContent = data.eta || "N/A";

document.getElementById("statPayment")
.textContent = data.paymentStatus || "N/A";

/* =========================
   SHIPMENT ACTIVITY
========================= */

const activityList = document.getElementById("activityList");

document.getElementById("shipmentActivity")
.classList.remove("hidden");

activityList.innerHTML = `
<div class="activity-item">
    <div class="activity-icon">✓</div>
    <div class="activity-content">
        <h4>Shipment Created</h4>
        <p>Your shipment has been registered in the Santus Logistics system.</p>
        <small>${data.shipmentDate || "N/A"}</small>
    </div>
</div>

<div class="activity-item">
    <div class="activity-icon">📦</div>
    <div class="activity-content">
        <h4>Current Status</h4>
        <p>${data.status}</p>
        <small>${data.location || "Unknown Location"}</small>
    </div>
</div>

<div class="activity-item">
    <div class="activity-icon">🚚</div>
    <div class="activity-content">
        <h4>Estimated Delivery</h4>
        <p>Your shipment is expected to arrive within ${data.eta || "N/A"}.</p>
        <small>${data.destination || "Destination"}</small>
    </div>
</div>
`;
       if (truck) {

    truck.style.left = progress + "%";

}

} catch(error){
console.error(error);

        loading.classList.add("hidden");

        resultBox.innerHTML = `

<div class="error-card">

<h3>Tracking Error</h3>

<p>${error.message}</p>

</div>

`;

    }

}