import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import VideoNotes from "./VideoNotes";

// Create a div to render the <App /> component to.
const viewport = document.getElementById("viewport");
const app = document.createElement("div");
app.id = "root";

let noteData = {};

function setNoteData(src, data) {
	noteData[src] = data;
	console.log(data);
	// do something here to insert data to backend
}
function getNoteData(src) {
	return noteData[src];
}

window.addEventListener("load", function () {
	if (viewport) viewport.prepend(app);

	const videos = document.querySelectorAll("video");

	const container = document.createElement("div");
	app.appendChild(container);
	videos.forEach((v) => {
		const src = v.src;
		if (!(src in noteData)) noteData[src] = {};

		//render notes for every video
		ReactDOM.render(
			<VideoNotes videoEl={v} setData={(data) => setNoteData(src, data)} />,
			container
		);
	});
	console.log("added videos ", videos);
});

document.body.appendChild(app);
