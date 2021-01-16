import React, { Component, useState, useEffect, useCallback } from "react";
import Draggable from "react-draggable";

class Note extends Component {
	//{ startTime, setObj, remove, changeNote }
	constructor(props) {
		super(props);
		this.state = {
			isEdit: true,
			content: "",
			duration: 5,
		};

		this.toggleEdit = this.toggleEdit.bind(this);
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
		this.setState({ isEdit: !isEdit });

		changeNote({
			startTime: startTime,
			endTime: startTime + duration,
			content: content,
		});
	}

	render() {
		const { startTime, setObj, remove, changeNote } = this.props;
		const { isEdit, duration, content } = this.state;

		return isEdit ? (
			<Draggable>
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
			<Draggable>
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
