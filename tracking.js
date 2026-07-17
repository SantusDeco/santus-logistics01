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

    truck.style.left = "0%";

    resultBox.innerHTML = "";

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

        resultBox.innerHTML = `

<div class="result-card premium-result">

<div class="shipment-header">

<h2>Shipment Located</h2>

<span class="status-badge">
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
<div class="route-map">

<h3>🌍 Shipment Route</h3>

<div class="route-row">

<div class="route-point">

<div class="route-icon">📍</div>

<h4>Origin</h4>

<p>${data.origin || "N/A"}</p>

</div>

<div class="route-middle">

<div class="route-line">

<div class="route-truck">🚚</div>

</div>

</div>

<div class="route-point">

<div class="route-icon">🏁</div>

<h4>Destination</h4>

<p>${data.destination || "N/A"}</p>

</div>

</div>

<p class="current-location">

Current Location:
<strong>${data.location || "N/A"}</strong>

</p>

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

        switch (data.status) {

            case "Warehouse Processing":

                steps[0].classList.add("active");

                progress = 0;

                break;


            case "Custom Clearance":

                steps[0].classList.add("active");
                steps[1].classList.add("active");
                steps[2].classList.add("active");
                steps[3].classList.add("active");

                progress = 75;

                break;


            case "In Transit":

                steps[0].classList.add("active");
                steps[1].classList.add("active");
                steps[2].classList.add("active");

                progress = 50;

                break;


            case "Delivered":

                steps.forEach(step => {

                    step.classList.add("active");

                });

                progress = 100;

                break;
        }


        truck.style.left = progress + "%";

    }

    catch (error) {

        loading.classList.add("hidden");

        resultBox.innerHTML = `

<div class="error-card">

<h3>Tracking Error</h3>

<p>${error.message}</p>

</div>

`;

    }

}