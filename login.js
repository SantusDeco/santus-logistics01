const API =
"https://santus-logistics01.onrender.com";

async function login() {

    const username =
    document.getElementById("username").value;

    const password =
    document.getElementById("password").value;

    const res = await fetch(`${API}/admin-login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            password
        })
    });

    const data = await res.json();

    console.log(data);

   if (data.success) {

    saveToken(data.token);

    showToast("✅ Login Successful");

    setTimeout(() => {
        window.location.href = "santus-admin.html";
    }, 800);

} else {

    showToast(
        "❌ Invalid Username or Password",
        "error"
    );

}
}