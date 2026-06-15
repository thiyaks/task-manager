function login() {

    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();

    const error = document.getElementById("error");

    const btn = document.getElementById("loginBtn");
    const spinner = document.getElementById("spinner");
    const btnText = document.getElementById("btnText");

    error.innerText = "";

    if (!user || !pass) {
        error.innerText = "Enter both fields ⚠️";
        return;
    }

    // 🔥 START LOADING ANIMATION
    btn.classList.add("loading");
    spinner.style.display = "inline-block";
    btnText.innerText = "Logging in...";

    setTimeout(() => {

        if (user.toLowerCase() === "admin" && pass === "1234") {

            localStorage.setItem("user", user);

            btnText.innerText = "Success ✔️";

            setTimeout(() => {
                window.location.href = "index.html";
            }, 800);

        } else {

            error.innerText = "Invalid login ❌ (try admin / 1234)";

            btn.classList.remove("loading");
            spinner.style.display = "none";
            btnText.innerText = "Login";
        }

    }, 1200);
}