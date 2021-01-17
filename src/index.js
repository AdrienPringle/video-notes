/*global chrome*/
// ^ im so done this line took like 4 hours to find

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
	//Save the data to local storage
	var dataObj = {};
	dataObj[src] = data;
	chrome.storage.local.set(dataObj, function () {
		if (!chrome.runtime.lastError) {
			console.log("Saved", src, data);
		}
	});
}
async function getNoteData(src) {
	// return noteData[src];
	return new Promise((resolve, reject) => {
		chrome.storage.local.get(src, function (result) {
			console.log("returned data for " + src);
			resolve(result[src]);
		});
	});
}

window.addEventListener("load", function () {
	if (viewport) viewport.prepend(app);

	// const videos = document.querySelectorAll("video");
	const videos = [document.querySelector("video")]; // hack to only get first, would be nice to have many but src problems r rough

	const container = document.createElement("div");
	app.appendChild(container);
	videos.forEach(async (v) => {
		// const src = v.src;
		const src = window.location.href;

		const noteData = await getNoteData(src);
		console.log(src, noteData);

		//render notes for every video
		ReactDOM.render(
			<VideoNotes
				videoEl={v}
				data={noteData}
				setData={(data) => setNoteData(src, data)}
			/>,
			container
		);
	});
	console.log("added videos ", videos);
});

document.body.appendChild(app);
