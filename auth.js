// =======================================
// Santus Logistics Enterprise Auth System
// =======================================

const API = "https://santus-logistics01.onrender.com";

/**
 * Save JWT Token
 */
function saveToken(token) {
    localStorage.setItem("adminToken", token);
}

/**
 * Get JWT Token
 */
function getToken() {
    return localStorage.getItem("adminToken");
}

/**
 * Check if Admin is Logged In
 */
function isLoggedIn() {
    return !!getToken();
}

/**
 * Redirect if NOT Logged In
 */
function requireLogin() {

    if (!isLoggedIn()) {
        window.location.href = "login.html";
    }

}

/**
 * Logout
 */
function logout() {

    localStorage.removeItem("adminToken");

    window.location.href = "login.html";

}

/**
 * Authorization Header
 */
function authHeaders(includeJson = true) {

    const headers = {
        Authorization: "Bearer " + getToken()
    };

    if (includeJson) {
        headers["Content-Type"] = "application/json";
    }

    return headers;

}