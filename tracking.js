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

<div>
<label>Tracking ID</label>
<p>${data.id}</p>
</div>

<div>
<label>Shipment Date</label>
<p>${data.shipmentDate || "N/A"}</p>
</div>

<div>
<label>Customer</label>
<p>${data.customerName || "N/A"}</p>
</div>

<div>
<label>Customer Phone</label>
<p>${data.customerPhone || "N/A"}</p>
</div>

<div>
<label>Receiver</label>
<p>${data.receiverName || "N/A"}</p>
</div>

<div>
<label>Receiver Phone</label>
<p>${data.receiverPhone || "N/A"}</p>
</div>

<div>
<label>Origin</label>
<p>${data.origin || "N/A"}</p>
</div>

<div>
<label>Destination</label>
<p>${data.destination || "N/A"}</p>
</div>

<div>
<label>Current Location</label>
<p>${data.location || "N/A"}</p>
</div>

<div>
<label>ETA</label>
<p>${data.eta || "N/A"}</p>
</div>

<div>
<label>Weight</label>
<p>${data.weight || "N/A"} KG</p>
</div>

<div>
<label>Shipping Method</label>
<p>${data.shippingMethod || "N/A"}</p>
</div>

<div>
<label>Package Type</label>
<p>${data.packageType || "N/A"}</p>
</div>

<div>
<label>Payment Status</label>
<p>${data.paymentStatus || "N/A"}</p>
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