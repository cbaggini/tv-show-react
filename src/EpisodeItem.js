import React from "react";

const EpisodeItem = ({id, name, season, number, image, summary}) => {

	let episodeCode = `S${String(season).padStart(2, '0')}E${String(number).padStart(2, '0')}`;

	return (
		<section id={episodeCode} className="episodeSection">
			<div className="title"><h4>{episodeCode} - {name}</h4></div>
			<img className="episodeImage" alt={name} src={image ? image.medium.replace('http','https') : "http://via.placeholder.com/250x140/0000FF/808080/"}></img>
			<article className="episodeArticle" dangerouslySetInnerHTML={{__html: summary}}></article>
			<button className="commentEpisode">Add comment</button>
		</section>

	);
}

export default EpisodeItem;