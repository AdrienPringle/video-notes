import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./VideoNotes.css";

import Note from "./Note.js";

class VideoNotes extends Component {
	// const [notes, setNotes] = useState([]);

	constructor(props) {
		super(props);
		let { videoEl } = props;
		this.state = { notes: [], iterator: 0, videoBox: {}, videoTime: 0 };
		this.refs = {};

		this.props.videoEl.ontimeupdate = () => {
			this.setState({ videoTime: videoEl.currentTime });
		};

		this.isNoteVisible = this.isNoteVisible.bind(this);
	}

	getFormattedData = () => {
		const { iterator, notes } = this.state;
		return {
			iterator: iterator,
			notes: notes.map((n) => {
				const { id, content, startTime, endTime, position } = n;
				return { id, content, startTime, endTime, position };
			}),
		};
	};

	addNote = () => {
		const { notes, iterator } = this.state;
		const { videoEl, setData } = this.props;
		let newNotes = [
			...notes,
			{ id: iterator, startTime: videoEl.currentTime, isEdit: true },
		];
		this.setState({ notes: newNotes, iterator: iterator + 1 }, () =>
			setData(this.getFormattedData())
		);
	};

	removeNote = (id) => {
		const { setData } = this.props;
		this.setState({ notes: this.state.notes.filter((n) => n.id != id) }, () =>
			setData(this.getFormattedData())
		);
	};

	setSelfNote = (id, content) => {
		let { notes } = this.state;
		const { setData } = this.props;

		const i = notes.findIndex((e) => e.id == id);
		let newNotes = [...notes];

		const parentBox = this.props.videoEl.getBoundingClientRect();
		const childBox = ReactDOM.findDOMNode(
			this.refs[id]
		).getBoundingClientRect();
		newNotes[i] = {
			...newNotes[i],
			...content,
			id,
			position: this.getRelativeBox(parentBox, childBox),
		};
		this.setState({ notes: newNotes }, () => setData(this.getFormattedData()));
	};

	// editSelfNote(id, key, value) {
	// 	let { notes } = this.state;
	// 	const i = notes.findIndex((e) => e.id == id);
	// 	let newNotes = [...notes];
	// 	newNotes[i][key] = value;
	// 	this.setState({ notes: newNotes });
	// }

	getRelativeBox(parentBox, childBox) {
		const {
			top: parentY,
			left: parentX,
			width: parentWidth,
			height: parentHeight,
		} = parentBox;
		const {
			top: childY,
			left: childX,
			width: childWidth,
			height: childHeight,
		} = childBox;
		return {
			x: this.getRelativePosition(parentX, parentWidth, childX, childWidth),
			y: this.getRelativePosition(parentY, parentHeight, childY, childHeight),
		};
	}
	getDefaultPosition(parentBox, position) {
		if (!position) return undefined;
		return {
			x: position.x * (parentBox.width - 40),
			y: position.y * (parentBox.height - 40),
		};
	}

	getRelativePosition(parentStart, parentSize, childStart, childSize) {
		const start = childStart - parentStart;
		const size = parentSize - childSize;
		return start / size;
	}

	isNoteVisible(note) {
		let { videoTime } = this.state;
		if (!("startTime" in note && "endTime" in note)) return true;
		if (note.isEdit) return true;
		return videoTime >= note.startTime - 1 && videoTime <= note.endTime + 1;
	}

	render() {
		const { notes } = this.state;
		const { videoEl } = this.props;

		const videoBox = videoEl.getBoundingClientRect();
		let { top, left, width, height } = videoBox;
		let style = {
			top: top + "px",
			left: left + "px",
			width: width + "px",
			height: height + "px",
		};

		return (
			<div className="video-notes-wrapper" style={style}>
				<div className="notes-controls">
					<button className="add-notes-button" onClick={this.addNote}>
						+
					</button>
					<button
						className="add-notes-button"
						onClick={() => {
							console.log(notes, this.refs);
						}}
					>
						view notes
					</button>
				</div>

				{notes.filter(this.isNoteVisible).map((e) => (
					<Note
						key={e.id}
						startTime={e.startTime}
						endTime={e.endTime}
						content={e.content}
						isEdit={e.isEdit}
						startPosition={this.getDefaultPosition(videoBox, e.position)}
						setObj={e}
						remove={() => this.removeNote(e.id)}
						changeNote={(content) => this.setSelfNote(e.id, content)}
						ref={(instance) => {
							this.refs[e.id] = instance;
						}}
					/>
				))}
			</div>
		);
	}
}

export default VideoNotes;

// ReactDOM.render(<VideoNotes />, document.querySelector("#app"));
