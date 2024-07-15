const sensors = [];

const addSensor = (sensor) => {
    sensors.push(sensor);
};

const removeSensor = (sensorId) => {
    const index = sensors.findIndex((sensor) => sensor.id === sensorId);
    if (index !== -1) {
        sensors.splice(index, 1);
    }
};

const updateSensor = (updatedSensor) => {
    const index = sensors.findIndex((sensor) => sensor.id === updatedSensor.id);
    if (index !== -1) {
        sensors[index] = updatedSensor;
    }
};

module.exports = { sensors, addSensor, removeSensor, updateSensor };
