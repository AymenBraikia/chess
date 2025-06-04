
// "use client";


import { JSX, MouseEvent } from "react";
import styles from "./play.module.css";

// import Image from "next/image";
// import wRook from "../../../public/wrook.png";

// const whitePieces = { rook: ["a1", "h1"], knight: ["b1", "g1"], king: ["e1"], queen: ["d1"], bishop: ["c1", "f1"], pawn: ["a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2"] };
// const blackPieces = { rook: ["a8", "h8"], knight: ["b8", "g8"], king: ["e8"], queen: ["d8"], bishop: ["c8", "f8"], pawn: ["a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7"] };

function tile(type: boolean, position: string): JSX.Element {
	// let piece = null;

	// for (const pieceType in whitePieces) {
	// 	whitePieces[pieceType as keyof typeof whitePieces].forEach((piecePos) => {
	// 		if (piecePos == position) piece = <Image src={wRook} width={85} height={85} alt={pieceType} />;
	// 	});
	// }

	return (
		<div
			onContextMenu={(ev: MouseEvent) => {
				ev.preventDefault();
				ev.currentTarget.classList.toggle("active");
			}}
			key={Math.random()}
			data-position={position}
			style={{ backgroundColor: type ? "#c9ae7f" : "#805936" }}
			className={styles.tile}
			id="tile"
		>
			{position}
			{/* {piece ? piece : position} */}
		</div>
	);
}

function Board() {
	const tiles: JSX.Element[][] = [];

	let index = 0;
	const rows = ["a", "b", "c", "d", "e", "f", "g", "h"];
	const columns = ["1", "2", "3", "4", "5", "6", "7", "8"].reverse();

	for (let y = 0; y < 8; y++) {
		const arr: JSX.Element[] = [];

		for (let i = 0; i < 8; i++) arr.push(tile(index++ % 2 == 0, `${rows[i]}${columns[y]}`));
		index++;

		tiles.push(arr);
	}

	return <div className={styles.board}>{...tiles}</div>;
}

export default Board;
