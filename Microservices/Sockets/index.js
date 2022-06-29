const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "https://baptistemiq-ceseat-p57444qrh9474-3000.githubpreview.dev",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

io.on("connection", (socket) => {
    console.log("New socket client connected");
    socket.on("orderStatus", (message) => {
        console.log("Received message", message);
        console.log("Received message: ", message);
        io.emit("orderStatus", message);
    });
});

server.listen(4700, () => {
    console.log("listening on http://localhost:4700");
});
