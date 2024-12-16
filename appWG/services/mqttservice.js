// services/mqttService.js

const mqtt = require('mqtt');

let collectedData // Armazena dado coletado


const MQTT_BROKER_URL = 'mqtt://127.0.0.1';  // Coloque o URL do seu broker MQTT aqui

const options = {
  clientId: 'mqtt_client_' + Math.random().toString(16).substr(2, 8),  // ID do cliente MQTT
  clean: true,  // Limpar sessões anteriores
  reconnectPeriod: 1000,  // Período de reconexão em ms
  connectTimeout: 30 * 1000  // Tempo limite de conexão em ms
};


const mqttClient = mqtt.connect(MQTT_BROKER_URL, options);

mqttClient.on('error', () => {
    console.log("Erro de conexao - Verifique seu broker")
})


mqttClient.on('connect', () => {
    console.log('Conectado ao broker MQTT');
    mqttClient.subscribe('estados', (err) => {
        console.log('Aguardando msgs');
        if (err) {
            console.error('Erro ao se inscrever no tópico:', err);
        }
    });
});

mqttClient.on('message', (topic, message) => {
    const data = message.toString();
    console.log(`Mensagem recebida no tópico ${topic}: ${data}`);
    collectedData = data; // Adiciona a mensagem ao array de dados
});

const connectMqtt = () => mqttClient;

const getCollectedData = () => collectedData;

module.exports = {
    connectMqtt,
    getCollectedData,
};