// import dotenv from "dotenv";
// import { MongoClient } from "mongodb";

// dotenv.config();

// const uri = process.env.MONGO_URI || "";

// console.log(uri);

// const client = new MongoClient(uri);

// export default async function connectDB() {
// 	try {
// 		await client.connect();
// 		console.log("Connected to MongoDB");

// 		return client;
// 	} catch (error) {
// 		console.error("Failed to connect to MongoDB", error);
// 		throw error;
// 	}
// }

import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import * as path from "path";

const STOCKFISH_PATH: string = path.join(__dirname, "bin", "stockfish.exe"); // For Windows

let stockfishProcess: ChildProcessWithoutNullStreams | null = null;
let messageBuffer: string = "";
const messageListeners: ((message: string) => void)[] = [];

// Store results for multiple PVs
interface PVInfo {
	move: string;
	scoreCp: number;
	depth: number;
	pv: string; // Principal Variation
}
const currentPVs: { [pvNumber: number]: PVInfo } = {}; // To store the top moves

function startStockfish(multiPVCount: number = 1): void {
	if (stockfishProcess) {
		console.log("Stockfish process already running.");
		return;
	}

	try {
		stockfishProcess = spawn(STOCKFISH_PATH);

		stockfishProcess.stdout.on("data", (data: Buffer) => {
			const messages = data.toString();
			messageBuffer += messages;

			let lastNewlineIndex: number;
			while ((lastNewlineIndex = messageBuffer.indexOf("\n")) !== -1) {
				const line = messageBuffer.substring(0, lastNewlineIndex).trim();
				messageBuffer = messageBuffer.substring(lastNewlineIndex + 1);

				if (line) {
					// console.log(`Received: ${line}`); // Uncomment for debugging all raw output
					processStockfishOutput(line);
					messageListeners.forEach((listener) => listener(line)); // Pass to generic listeners
				}
			}
		});

		stockfishProcess.stderr.on("data", (data: Buffer) => {
			console.error(`Stockfish stderr: ${data.toString()}`);
		});

		stockfishProcess.on("close", (code: number | null) => {
			console.log(`Stockfish process exited with code ${code}`);
			stockfishProcess = null;
		});

		stockfishProcess.on("error", (err: Error) => {
			console.error(`Failed to start Stockfish process: ${err.message}`);
			stockfishProcess = null;
		});

		sendCommand("uci");
		sendCommand("isready");
		// Set MultiPV option here!
		sendCommand(`setoption name MultiPV value ${multiPVCount}`);
		sendCommand("setoption name Hash value 256");
		sendCommand("setoption name Threads value 4");
		sendCommand("ucinewgame");
	} catch (error: any) {
		console.error("Error spawning Stockfish:", error.message || error);
	}
}

function sendCommand(command: string): void {
	if (stockfishProcess && stockfishProcess.stdin.writable) {
		stockfishProcess.stdin.write(`${command}\n`);
	} else {
		console.warn(`Stockfish process not running or not writable. Command not sent: ${command}`);
	}
}

// Function to parse and store info lines
function processStockfishOutput(line: string): void {
	if (line.startsWith("info")) {
		const parts = line.split(" ");
		let pvNum: number | undefined;
		let depth: number | undefined;
		let scoreCp: number | undefined;
		let currentPvString: string | undefined;

		for (let i = 0; i < parts.length; i++) {
			if (parts[i] === "multipv" && i + 1 < parts.length) {
				pvNum = parseInt(parts[i + 1]);
			} else if (parts[i] === "depth" && i + 1 < parts.length) {
				depth = parseInt(parts[i + 1]);
			} else if (parts[i] === "score" && i + 2 < parts.length && parts[i + 1] === "cp") {
				scoreCp = parseInt(parts[i + 2]);
			} else if (parts[i] === "pv" && i + 1 < parts.length) {
				currentPvString = parts.slice(i + 1).join(" ");
				break; // PV is usually the last part
			}
		}

		if (pvNum !== undefined && depth !== undefined && scoreCp !== undefined && currentPvString !== undefined) {
			const firstMove = currentPvString.split(" ")[0];
			currentPVs[pvNum] = {
				move: firstMove,
				scoreCp: scoreCp,
				depth: depth,
				pv: currentPvString,
			};
		}
	} else if (line.startsWith("bestmove")) {
		// Output all collected PVs when bestmove is reported
		console.log("\n--- Top Moves Analysis ---");
		Object.keys(currentPVs)
			.sort((a, b) => parseInt(a) - parseInt(b)) // Sort by PV number
			.forEach((key) => {
				const pv = currentPVs[parseInt(key)];
				console.log(`PV ${key}: Move: ${pv.move}, Score: ${pv.scoreCp / 100} CP, Depth: ${pv.depth}, Line: ${pv.pv}`);
			});
		console.log("--------------------------");
		// Clear PVs for next analysis
		Object.keys(currentPVs).forEach((key) => delete currentPVs[parseInt(key)]);
	}
}

function addStockfishListener(callback: (message: string) => void): void {
	messageListeners.push(callback);
}

// --- Example Usage ---

// Start Stockfish to show top 3 moves
startStockfish(3);

addStockfishListener((message: string) => {
	if (message === "readyok") {
		console.log("Stockfish is ready to analyze!");
		sendCommand("position startpos moves e2e4 e7e5 g1f3 b8c6 f1c4 g8f6");
		sendCommand("go depth 15"); // Analyze to a depth of 15
	}
});

process.on("exit", () => {
	if (stockfishProcess) {
		console.log("Killing Stockfish process on Node.js exit...");
		stockfishProcess.kill();
	}
});
