document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const loginContainer = document.getElementById("login-container");
    const registerContainer = document.getElementById("register-container");
    const authenticationContainer = document.getElementById(
        "authentication-container"
    );
    const dashboardContainer = document.getElementById("dashboard-container");
    const sensorForm = document.getElementById("sensor-form");
    const sensorsList = document.getElementById("sensors");
    const showRegisterBtn = document.getElementById("show-register-form-btn");
    const showLoginBtn = document.getElementById("show-login-form-btn");

    // Mostra il form di registrazione e nasconde il form di login
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener("click", () => {
            loginContainer.style.display = "none";
            registerContainer.style.display = "block";
        });
    }

    // Mostra il form di login e nasconde il form di registrazione
    if (showLoginBtn) {
        showLoginBtn.addEventListener("click", () => {
            registerContainer.style.display = "none";
            loginContainer.style.display = "block";
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            try {
                await axios.post("/login", { email, password });
                authenticationContainer.style.display = "none";
                dashboardContainer.style.display = "block";
            } catch (error) {
                alert(error.response.data);
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("register-email").value;
            const password = document.getElementById("register-password").value;
            try {
                await axios.post("/register", { email, password });
                alert("Registration successful");
                // Dopo la registrazione, passa automaticamente al login
                registerContainer.style.display = "none";
                loginContainer.style.display = "block";
            } catch (error) {
                alert(error.response.data);
            }
        });
    }

    let socket;

    if (sensorForm) {
        socket = io();

        sensorForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const sensor = {
                id: Date.now(),
                name: document.getElementById("sensor-name").value,
                type: document.getElementById("sensor-type").value,
                interval: document.getElementById("sensor-interval").value,
                value: (Math.random() * 100).toFixed(2),
            };
            socket.emit("addSensor", sensor);
        });

        socket.on("sensors", (sensors) => {
            sensorsList.innerHTML = "";
            sensors.forEach((sensor) => {
                const li = document.createElement("li");
                li.textContent = `${sensor.name} (${sensor.type}): ${sensor.value}`;
                li.dataset.id = sensor.id;

                // Aggiungi il pulsante "Rimuovi" all'elemento <li>
                const removeButton = createRemoveButton(sensor.id);
                li.appendChild(removeButton);

                sensorsList.appendChild(li);
            });
        });
    }

    function createRemoveButton(sensorId) {
        const button = document.createElement("button");
        button.id = "removeButton";
        button.textContent = "Rimuovi";
        button.addEventListener("click", () => {
            if (socket) {
                socket.emit("removeSensor", sensorId);
            } else {
                console.error("Socket non è definito");
            }
        });
        return button;
    }
});
