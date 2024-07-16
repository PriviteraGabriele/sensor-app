const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");
const { users, addUser, findUserByEmail } = require("./data/users");
const {
    sensors,
    addSensor,
    removeSensor,
    updateSensor,
} = require("./data/sensors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());
app.use(express.static("public"));

// Endpoint di registrazione
app.post("/register", (req, res) => {
    const { email, password } = req.body;
    if (findUserByEmail(email)) {
        return res.status(400).send("Email already in use");
    }
    addUser(email, password);
    res.status(201).send("User registered");
    console.log("🆕👤 Registered new user: " + email);
});

// Endpoint di login
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const user = findUserByEmail(email);
    if (!user) {
        return res.status(401).send("Email not found");
    }
    if (user.password !== password) {
        return res.status(401).send("Incorrect password");
    }
    res.status(200).send("Login successful");
    console.log("🟢 A user connected");
});

// Quando un client si connette
io.on("connection", (socket) => {
    // Invia i sensori al client
    socket.emit("sensors", sensors);

    // Aggiungi un nuovo sensore
    socket.on("addSensor", (sensor) => {
        addSensor(sensor);
        io.emit("sensors", sensors);
        console.log("🆕 Added new sensor");
    });

    // Rimuovi un sensore
    socket.on("removeSensor", (sensorId) => {
        removeSensor(sensorId);
        io.emit("sensors", sensors);
        console.log("❌ Removed sensor");
    });

    // Simulazione degli aggiornamenti dei sensori
    setInterval(() => {
        sensors.forEach((sensor) => {
            sensor.value = (Math.random() * 100).toFixed(2);
            updateSensor(sensor);
        });
        io.emit("sensors", sensors);
    }, 5000);

    socket.on("disconnect", () => {
        console.log("🔴 A user disconnected");
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`🌐 Server is running on port ${PORT}...`);
});
