// ======================================
// Santus Logistics API Service
// ======================================

const API = "https://santus-logistics01.onrender.com";

const api = {

    async get(endpoint) {

        const res = await fetch(`${API}${endpoint}`, {
            headers: authHeaders(false)
        });

        return res;

    },

    async post(endpoint, body) {

        const res = await fetch(`${API}${endpoint}`, {

            method: "POST",

            headers: authHeaders(),

            body: JSON.stringify(body)

        });

        return res;

    },

    async put(endpoint, body) {

        const res = await fetch(`${API}${endpoint}`, {

            method: "PUT",

            headers: authHeaders(),

            body: JSON.stringify(body)

        });

        return res;

    },

    async delete(endpoint) {

        const res = await fetch(`${API}${endpoint}`, {

            method: "DELETE",

            headers: authHeaders(false)

        });

        return res;

    }

};