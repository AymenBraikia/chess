import stockfish from "./lab";

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
	const moves: string[] = [];

	ws.onmessage = (msg: MessageEvent) => {
		const data = msg.data.toString();

		if (isMove(data)) {
			moves.push(data);

			let cmd = "position startpos moves";

			// adding moves
			moves.forEach((move: string) => {
				cmd += " " + move;
			});

			stockfish.sendCommand(cmd);
			stockfish.sendCommand("go depth 20");

			const bestMoveListener = (message: string) => {
				console.log(message);
				if (message.startsWith("bestmove")) {
					const bestMove = message.split(" ")[1];
					console.log(`Stockfish suggested best move: ${message}`);

					ws.send(bestMove);

					stockfish.sendCommand("stop");
					stockfish.removeStockfishListener(bestMoveListener);
				}
			};

			stockfish.addStockfishListener(bestMoveListener);
		}

		// if (data.length == 16 && !isNaN(Number(data))) {
		// }
	};
});

function getRandomID(length: number): string {
	const array = new Uint8Array(length);
	crypto.getRandomValues(array);
	return Array.from(array, (byte) => (byte % 10).toString()).join("");
}

function isMove(move: string) {
	if (move.length == 4 && ["a", "b", "c", "d", "e", "f", "g", "h"].includes(move[0]) && [0, 1, 2, 3, 4, 5, 6, 7, 8].includes(Number(move[1]))) return true;

	return false;
}
