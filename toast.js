// =====================================
// Santus Logistics Enterprise Toast
// =====================================

function showToast(message, type = "success") {

    let toast = document.getElementById("toast");

    if (!toast) {

        toast = document.createElement("div");
        toast.id = "toast";

        document.body.appendChild(toast);

    }

    toast.className = `toast ${type}`;

    toast.innerHTML = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}