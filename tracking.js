/* =========================
   MOBILE MENU
========================= */
const menuToggle =
document.getElementById("menuToggle");

const navLinks =
document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
navLinks.classList.toggle("active");
});

/* =========================
   TRACKING SYSTEM
========================= */
async function trackShipment() {

    const trackingId =
    document.getElementById("trackingInput").value.trim();

    const resultBox =
    document.getElementById("trackingResult");

    const loading =
    document.getElementById("loading");

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

    resultBox.innerHTML = "";

    loading.classList.remove("hidden");

    try {

        const response =
        await fetch(
        `http://localhost:3000/track/${trackingId}`
        );

        if (!response.ok) {

            const errorData =
            await response.json();

            throw new Error(
                errorData.message
            );
        }

        const data =
        await response.json();

        loading.classList.add("hidden");

        resultBox.innerHTML = `

        <div class="result-card">

        <h2>Shipment Located</h2>

        <p><strong>Tracking ID:</strong> ${data.id}</p>

        <p><strong>Customer:</strong>
        ${data.customerName || "N/A"}</p>

        <p><strong>Customer Phone:</strong>
        ${data.customerPhone || "N/A"}</p>

        <p><strong>Receiver:</strong>
        ${data.receiverName || "N/A"}</p>

        <p><strong>Receiver Phone:</strong>
        ${data.receiverPhone || "N/A"}</p>

        <p><strong>Origin:</strong>
        ${data.origin || "N/A"}</p>

        <p><strong>Destination:</strong>
        ${data.destination || "N/A"}</p>

        <p><strong>Status:</strong>
        ${data.status}</p>

        <p><strong>Current Location:</strong>
        ${data.location}</p>

        <p><strong>ETA:</strong>
${data.eta}</p>

</div>
`;

        if(data.status === "Warehouse Processing"){
            steps[0].classList.add("active");
        }

        if(data.status === "In Transit"){
            steps[0].classList.add("active");
            steps[1].classList.add("active");
        }

        if(data.status === "Custom Clearance"){
            steps[0].classList.add("active");
            steps[1].classList.add("active");
            steps[2].classList.add("active");
        }

        if(data.status === "Delivered"){
            steps.forEach(step=>{
                step.classList.add("active");
            });
        }

    } catch(error){

        loading.classList.add("hidden");

        resultBox.innerHTML = `

        <div class="error-card">

        <h3>Tracking Error</h3>

        <p>${error.message}</p>

        </div>

        `;

    }

}