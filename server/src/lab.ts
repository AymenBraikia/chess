import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import * as path from "path";

const STOCKFISH_PATH: string = path.join(__dirname, "bin", "stockfish-windows-x86-64-avx2.exe");

let stockfishProcess: ChildProcessWithoutNullStreams | null = null;
let messageBuffer: string = "";
const messageListeners: ((message: string) => void)[] = [];

function startStockfish(): void {
	if (stockfishProcess) {
		console.log("Stockfish process already running.");
		return;
	}

	try {
		stockfishProcess = spawn(STOCKFISH_PATH);

		stockfishProcess.stdout.on("data", (data: Buffer) => {
			const messages = data.toString();
			messageBuffer += messages;

			// Process complete lines
			let lastNewlineIndex: number;

			while ((lastNewlineIndex = messageBuffer.indexOf("\n")) !== -1) {
				const line = messageBuffer.substring(0, lastNewlineIndex).trim();

				messageBuffer = messageBuffer.substring(lastNewlineIndex + 1);

				if (line) {
					messageListeners.forEach((listener) => listener(line));
				}
			}
		});
        stockfishProcess.on("spawn",(data:Buffer)=>{
            console.log("stockfish spawned")
        })

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

		// Initialize Stockfish with UCI protocol
		sendCommand("uci");
		sendCommand("isready"); // Wait for 'readyok'
		sendCommand("setoption name Hash value 256"); // Example option
		sendCommand("setoption name Threads value 4"); // Example option
		sendCommand("ucinewgame");
	} catch (error: any) {
		// Catch any errors during spawn itself
		console.error("Error spawning Stockfish:", error.message || error);
	}
}

function sendCommand(command: string): void {
	if (stockfishProcess && stockfishProcess.stdin.writable) {
		stockfishProcess.stdin.write(`${command}\n`);
		// console.log(`Sent: ${command}`);
	} else {
		console.warn(`Stockfish process not running or not writable. Command not sent: ${command}`);
	}
}

function addStockfishListener(callback: (message: string) => void): void {
	messageListeners.push(callback);
}

function removeStockfishListener(callback: (message: string) => void): void {
	const index = messageListeners.indexOf(callback);
	if (index > -1) {
		messageListeners.splice(index, 1);
	}
}

// Don't forget to handle process exit for your Node.js app
process.on("exit", () => {
	if (stockfishProcess) {
		console.log("Killing Stockfish process on Node.js exit...");
		stockfishProcess.kill();
	}
});

startStockfish();

export default { sendCommand, addStockfishListener, removeStockfishListener, startStockfish };
