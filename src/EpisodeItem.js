import React, {useState, useEffect} from "react";

const EpisodeItem = ({id, name, season, number, image, summary, color}) => {

	const episodeCode = `S${String(season).padStart(2, '0')}E${String(number).padStart(2, '0')}`;
	const storedComments = sessionStorage.getItem(`comments${id}${name}`) === null ? [] : JSON.parse(sessionStorage.getItem(`comments${id}${name}`));
	const [editedSummary, setEditedSummary] = useState('');
	const [editState, setEditState] = useState('');
	const [isCommentActive, setIsCommentActive] = useState(false);
	const [comments, setComments] = useState(storedComments);

	useEffect(() => {
		if (summary && summary.length > 200) {
			setEditedSummary(summary.slice(0,summary.indexOf(' ', 200)));
			setEditState('cut');
		} else if (summary) {
			setEditedSummary(summary);
		} else {
			setEditedSummary('Summary not available');
		}
	}, [summary])

	const toggleRead = () => {
		if (editState === 'cut') {
			setEditedSummary(summary);
			setEditState('uncut');
		} else {
			setEditedSummary(summary.slice(0,summary.indexOf(' ', 200)));
			setEditState('cut');
		}
	}

	const activateComment = () => {
		setIsCommentActive(true);
	}

	const saveComment = (e) => {
		const newComments = [...comments, e.target.previousElementSibling.value];
		setComments(newComments);
		sessionStorage.setItem(`comments${id}${name}`, JSON.stringify(newComments));
		e.target.previousElementSibling.value = '';
		setIsCommentActive(false);
	}

	return (
		<section id={episodeCode} className="episodeSection" style={{backgroundColor: `${color}`}}>
			<div className="title"><h4>{episodeCode} - {name}</h4></div>
			<img className="episodeImage" alt={name} src={image ? image.medium.replace('http','https') : "http://via.placeholder.com/250x140/0000FF/808080/"}></img>
			<article className="episodeArticle" dangerouslySetInnerHTML={{__html: editedSummary}}></article> 
			{ editState === 'cut' && <p className="read" onClick={toggleRead}>Read more</p>}
			{ editState === 'uncut' && <p className="read" onClick={toggleRead}>Read less</p>}
			{ comments.length > 0 && <> 
				<p className="episodeComment"><strong>Comments:</strong></p> 
				{comments.map(el => <p className="episodeComment" key={el}>{el}</p>)}
			</>}
			<button className="commentEpisode" onClick={activateComment}>Add comment</button>
			{ isCommentActive && <div className="newComment"><textarea></textarea><button className="sendComment" onClick={saveComment}>Save</button></div>}
		</section>
	);
}

export default EpisodeItem;