import React, { Component, useState, useEffect, useCallback } from "react";

import Draggable from "react-draggable";

class Note extends Component {
	//{ startTime, setObj, remove, changeNote }
	constructor(props) {
		super(props);
		const { isEdit, content, startTime, endTime, startPosition } = this.props;
		this.state = {
			isEdit: isEdit,
			content: content,
			duration: endTime - startTime || 5,
		};

		this.toggleEdit = this.toggleEdit.bind(this);
		this.handleStop = this.handleStop.bind(this);
	}

	// const [isEdit, setIsEdit] = useState(true);
	// const [content, setContent] = useState("");
	// const [duration, setDuration] = useState(5);

	// useEffect(() => {
	// 	if (!isEdit) {
	// 		changeNote({ startTime, endTime: startTime + duration, content });
	// 	}
	// }, [isEdit]);
	formatTime(seconds) {
		let startChar = 0;
		if (seconds > 3600) startChar = 2;
		if (seconds > 36000) startChar = 3;
		return new Date(seconds * 1000)
			.toISOString()
			.substr(14 - startChar, 5 + startChar);
	}

	toggleEdit(event) {
		event.preventDefault();

		const { isEdit, duration, content } = this.state;
		const { startTime, changeNote } = this.props;
		const newEdit = !isEdit;
		this.setState({ isEdit: newEdit });

		changeNote({
			startTime: startTime,
			endTime: startTime + duration,
			content: content,
			isEdit: newEdit,
		});
	}
	handleStop(event) {
		this.props.changeNote();
	}
	render() {
		const { startTime, setObj, remove, changeNote, startPosition } = this.props;
		const { isEdit, duration, content } = this.state;

		return isEdit ? (
			<Draggable
				onStop={this.handleStop}
				bounds="parent"
				defaultPosition={startPosition}
			>
				<form onSubmit={this.toggleEdit} className="video-note">
					<label htmlFor="noteContent">note</label>
					<br />
					<input
						type="text"
						name="noteContent"
						value={content}
						onChange={(e) => this.setState({ content: e.target.value })}
					/>
					<br />
					<label htmlFor="duration">duration</label>
					<br />
					<input
						type="number"
						name="duration"
						value={duration}
						onChange={(e) =>
							this.setState({ duration: parseFloat(e.target.value) })
						}
					/>
					<br />
					<input type="submit" value="create" />
				</form>
			</Draggable>
		) : (
			<Draggable
				onStop={this.handleStop}
				bounds="parent"
				defaultPosition={startPosition}
			>
				<div className="video-note">
					<h2>
						{this.formatTime(startTime)}-{this.formatTime(startTime + duration)}
					</h2>
					<div>{content}</div>
					<button onClick={this.toggleEdit}>edit</button>
					<button onClick={remove}>remove</button>
				</div>
			</Draggable>
		);
	}
}

export default Note;
