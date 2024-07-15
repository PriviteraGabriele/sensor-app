document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const sensorForm = document.getElementById("sensor-form");
    const sensorsList = document.getElementById("sensors");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const username = document.getElementById("username").value;
            try {
                await axios.post("/login", { username });
                window.location.href = "/dashboard.html";
            } catch (error) {
                alert(error.response.data);
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const username = document.getElementById("register-username").value;
            try {
                await axios.post("/register", { username });
                alert("Registration successful");
            } catch (error) {
                alert(error.response.data);
            }
        });
    }

    if (sensorForm) {
        const socket = io();

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
                li.appendChild(createRemoveButton(sensor.id));
                sensorsList.appendChild(li);
            });
        });
    }

    function createRemoveButton(sensorId) {
        const button = document.createElement("button");
        button.textContent = "Remove";
        button.addEventListener("click", () => {
            socket.emit("removeSensor", sensorId);
        });
        return button;
    }
});
