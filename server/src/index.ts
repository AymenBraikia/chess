import express from "express";
// import connectDB from "./db";
import cors from "cors";
import { WebSocket, MessageEvent } from "ws";

import crypto from "crypto";

class game {
	time: number;
	increament: number;
	id: string;

	constructor(time: number, increament: number, id: string) {
		this.time = time;
		this.increament = increament;
		this.id = id;
	}

	start() {}
	end() {}
	validateMove() {}
}
const games = new Set<game>();

// const db = (async () => {
//     return (await connectDB()).db("chess");
// })();

const app = express();

app.use(
	cors({
		origin: (origin, callback) => callback(null, true),
		credentials: true,
	})
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = 8000,
	wsPort = 8080;

app.get("/", (req, res) => {
	res.send("Hello TypeScript with Express!");
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));

app.get("/api/play", (req, res) => {
	const { time, increament } = req.query;

	const gameID = getRandomID(16);

	games.add(new game(Number(time), Number(increament), gameID));
});

const wss = new WebSocket.Server({ port: wsPort, path: "/ws/play" });

wss.on("connection", (ws: WebSocket) => {
	ws.onmessage = (msg: MessageEvent) => {
		const data = msg.data.toString();

		if (data.length == 16 && !isNaN(Number(data))) {
            
		}
	};
});

function getRandomID(length: number): string {
	const array = new Uint8Array(length);
	crypto.getRandomValues(array);
	return Array.from(array, (byte) => (byte % 10).toString()).join("");
}
