const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");
const { users, addUser, findUser } = require("./data/users");
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
    const { username } = req.body;
    if (findUser(username)) {
        return res.status(400).send("User already exists");
    }
    addUser(username);
    res.status(201).send("User registered");
});

// Endpoint di login
app.post("/login", (req, res) => {
    const { username } = req.body;
    if (!findUser(username)) {
        return res.status(404).send("User not found");
    }
    res.status(200).send("Login successful");
});

// Quando un client si connette
io.on("connection", (socket) => {
    console.log("A user connected");

    // Invia i sensori al client
    socket.emit("sensors", sensors);

    // Aggiungi un nuovo sensore
    socket.on("addSensor", (sensor) => {
        addSensor(sensor);
        io.emit("sensors", sensors);
    });

    // Rimuovi un sensore
    socket.on("removeSensor", (sensorId) => {
        removeSensor(sensorId);
        io.emit("sensors", sensors);
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
        console.log("A user disconnected");
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
