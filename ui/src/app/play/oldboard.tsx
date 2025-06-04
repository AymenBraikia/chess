// "use client";

// import React, { JSX } from "react";
// import styles from "./play.module.css";

// import { Chess } from "chess.js";

// console.log(Chess);

// // import dynamic from "next/dynamic";

// // const MyComponent = dynamic(() => import("chess.js"), {
// // 	ssr: false,
// // });

// const whitePieces = { rook: ["a1", "h1"], knight: ["b1", "g1"], king: ["e1"], queen: ["d1"], bishop: ["c1", "f1"], pawn: ["a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2"] };
// const blackPieces = { rook: ["a8", "h8"], knight: ["b8", "g8"], king: ["e8"], queen: ["d8"], bishop: ["c8", "f8"], pawn: ["a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7"] };

// function validateMove(piece: HTMLElement, dropPosition: string): boolean {
// 	const originalPosition = piece.getAttribute("data-current_position");

// 	switch (piece.getAttribute("data-type")) {
// 		case "king":
// 			dropPosition.slice(-1);
// 			break;
// 		case "queen":
// 			break;
// 		case "rook":
// 			break;
// 		case "bishop":
// 			break;
// 		case "knight":
// 			break;
// 		case "pawn":
// 			break;

// 		default:
// 			break;
// 	}

// 	return true;
// }

// function pieceMouseDown(e: React.MouseEvent<HTMLDivElement>) {
// 	const piece = e.currentTarget;
// 	const board = document.querySelector("#board") as HTMLElement;

// 	if (!board) return;

// 	const shiftX = e.clientX - piece.getBoundingClientRect().left;
// 	const shiftY = e.clientY - piece.getBoundingClientRect().top;

// 	// absolute positioning for free movement
// 	piece.style.position = "absolute";
// 	piece.style.zIndex = "1000";
// 	piece.style.pointerEvents = "none"; // prevents issues

// 	function moveAt(pageX: number, pageY: number) {
// 		piece.style.left = `${pageX - shiftX}px`;
// 		piece.style.top = `${pageY - shiftY}px`;
// 	}

// 	moveAt(e.pageX, e.pageY);

// 	function onMouseMove(e: MouseEvent) {
// 		moveAt(e.pageX, e.pageY);
// 	}

// 	document.onmousemove = (e: MouseEvent) => {
// 		onMouseMove(e);
// 	};

// 	document.onmouseup = function (ev: MouseEvent) {
// 		let dropTile = ev.target as HTMLElement;

// 		document.onmousemove = null;

// 		document.onmouseup = null;

// 		piece.style.position = "unset";
// 		piece.style.pointerEvents = "auto";

// 		let dropPos = dropTile.getAttribute("data-position");

// 		if (!dropPos) dropTile = dropTile.parentElement || dropTile;
// 		dropPos = dropTile.getAttribute("data-position");

// 		if (!dropPos) return;

// 		if (!validateMove(piece, dropPos)) return;
// 		// if(!validateMove(piece,dropTile)) return

// 		piece.setAttribute("data-current_position", dropTile.getAttribute("data-position") || "");

// 		dropTile.innerHTML = "";
// 		dropTile.appendChild(piece);
// 	};
// }

// function tile(type: boolean, position: string): JSX.Element {
// 	let piece = null;

// 	for (const pieceType in whitePieces) {
// 		whitePieces[pieceType as keyof typeof whitePieces].forEach((piecePos) => {
// 			if (piecePos == position) {
// 				switch (pieceType) {
// 					case "king":
// 						piece = <div onMouseDown={pieceMouseDown} data-type={pieceType} data-current_position={position} className={styles.piece} style={{ backgroundImage: `url(${"/wKing.png"})` }}></div>;
// 						break;
// 					case "queen":
// 						piece = <div onMouseDown={pieceMouseDown} data-type={pieceType} data-current_position={position} className={styles.piece} style={{ backgroundImage: `url(${"/wQueen.png"})` }}></div>;
// 						break;
// 					case "rook":
// 						piece = <div onMouseDown={pieceMouseDown} data-type={pieceType} data-current_position={position} className={styles.piece} style={{ backgroundImage: `url(${"/wRook.png"})` }}></div>;
// 						break;
// 					case "knight":
// 						piece = <div onMouseDown={pieceMouseDown} data-type={pieceType} data-current_position={position} className={styles.piece} style={{ backgroundImage: `url(${"/wKnight.png"})` }}></div>;
// 						break;
// 					case "bishop":
// 						piece = <div onMouseDown={pieceMouseDown} data-type={pieceType} data-current_position={position} className={styles.piece} style={{ backgroundImage: `url(${"/wBishop.png"})` }}></div>;
// 						break;
// 					case "pawn":
// 						piece = <div onMouseDown={pieceMouseDown} data-type={pieceType} data-current_position={position} className={styles.piece} style={{ backgroundImage: `url(${"/wPawn.png"})` }}></div>;
// 						break;

// 					default:
// 						break;
// 				}
// 			}
// 		});
// 	}
// 	for (const pieceType in blackPieces) {
// 		blackPieces[pieceType as keyof typeof blackPieces].forEach((piecePos) => {
// 			if (piecePos == position) {
// 				switch (pieceType) {
// 					case "king":
// 						piece = <div onMouseDown={pieceMouseDown} data-type={pieceType} data-current_position={position} className={styles.piece} style={{ backgroundImage: `url(${"/bKing.png"})` }}></div>;
// 						break;
// 					case "queen":
// 						piece = <div onMouseDown={pieceMouseDown} data-type={pieceType} data-current_position={position} className={styles.piece} style={{ backgroundImage: `url(${"/bQueen.png"})` }}></div>;
// 						break;
// 					case "rook":
// 						piece = <div onMouseDown={pieceMouseDown} data-type={pieceType} data-current_position={position} className={styles.piece} style={{ backgroundImage: `url(${"/bRook.png"})` }}></div>;
// 						break;
// 					case "knight":
// 						piece = <div onMouseDown={pieceMouseDown} data-type={pieceType} data-current_position={position} className={styles.piece} style={{ backgroundImage: `url(${"/bKnight.png"})` }}></div>;
// 						break;
// 					case "bishop":
// 						piece = <div onMouseDown={pieceMouseDown} data-type={pieceType} data-current_position={position} className={styles.piece} style={{ backgroundImage: `url(${"/bBishop.png"})` }}></div>;
// 						break;
// 					case "pawn":
// 						piece = <div onMouseDown={pieceMouseDown} data-type={pieceType} data-current_position={position} className={styles.piece} style={{ backgroundImage: `url(${"/bPawn.png"})` }}></div>;
// 						break;

// 					default:
// 						break;
// 				}
// 			}
// 		});
// 	}

// 	return (
// 		<div
// 			onContextMenu={(ev: React.MouseEvent) => {
// 				ev.preventDefault();
// 				ev.currentTarget.classList.toggle("active");
// 			}}
// 			key={Math.random()}
// 			data-position={position}
// 			style={{ backgroundColor: type ? "#c9ae7f" : "#805936" }}
// 			className={styles.tile}
// 			id="tile"
// 		>
// 			{piece ? piece : ""}
// 		</div>
// 	);
// }

// function Board() {
// 	const tiles: JSX.Element[][] = [];

// 	let index = 0;
// 	const rows = ["a", "b", "c", "d", "e", "f", "g", "h"];
// 	const columns = ["1", "2", "3", "4", "5", "6", "7", "8"].reverse();

// 	for (let y = 0; y < 8; y++) {
// 		const arr: JSX.Element[] = [];

// 		for (let i = 0; i < 8; i++) arr.push(tile(index++ % 2 == 0, `${rows[i]}${columns[y]}`));
// 		index++;

// 		tiles.push(arr);
// 	}

// 	return (
// 		<div id="board" className={styles.board}>
// 			{...tiles}
// 		</div>
// 	);
// }

// export default Board;
