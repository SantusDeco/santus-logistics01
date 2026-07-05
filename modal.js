// ======================================
// Santus Logistics Enterprise Modal
// ======================================

function confirmDelete(message = "Delete this shipment?") {

    return new Promise((resolve) => {

        let modal = document.getElementById("confirmModal");

        if (!modal) {

            modal = document.createElement("div");

            modal.id = "confirmModal";

            modal.innerHTML = `
            <div class="modal-overlay">

                <div class="modal-box">

                    <h2>🗑 Delete Shipment</h2>

                    <p>${message}</p>

                    <div class="modal-buttons">

                        <button id="cancelDelete">
                            Cancel
                        </button>

                        <button id="confirmDeleteBtn">
                            Delete
                        </button>

                    </div>

                </div>

            </div>
            `;

            document.body.appendChild(modal);

        }

        modal.style.display = "flex";

        document.getElementById("cancelDelete").onclick = () => {

            modal.style.display = "none";

            resolve(false);

        };

        document.getElementById("confirmDeleteBtn").onclick = () => {

            modal.style.display = "none";

            resolve(true);

        };

    });

}