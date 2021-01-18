import React from "react";
import { Link } from 'react-router-dom';



const ShowItem = ({id, name, image, summary, rating, genres, status, runtime, color}) => {

	const storedPref = JSON.parse(sessionStorage.getItem(`seriesLiked${id}`));

	const toggleLike = (e) => {
		e.preventDefault();
		if (e.target.className === "fa fa-heart-o") {
			e.target.className = "fa fa-heart";
			sessionStorage.setItem(`seriesLiked${id}`, JSON.stringify("fa fa-heart"));
		} else {
			e.target.className = "fa fa-heart-o";
			sessionStorage.setItem(`seriesLiked${id}`, JSON.stringify("fa fa-heart-o"));
		}
	}


	return (
		<Link to={`/${id}/episodes/${color.slice(color.indexOf('(')+1).replace(')','').replace(/%/g, '').replace(/,/g,'-')}`}>
		<section className="seriesClass" style={{backgroundColor: `${color}`}}>
			<div className="seriesTitle"><h1>{name}</h1></div>
			<div className="seriesDescription">
				<img className="seriesImage" alt={name} src={image ? image.medium.replace('http','https') : "http://via.placeholder.com/210x295/0000FF/808080/"} ></img>
				<article className="seriesArticle"><p dangerouslySetInnerHTML={{__html: summary}} /><i className={storedPref ? storedPref : "fa fa-heart-o"} onClick={toggleLike} style={{fontSize:"24px"}}></i></article>
				<aside>
					<p><strong>Rated:&nbsp;</strong>{rating.average}</p>
					<p><strong>Genres:&nbsp;</strong>{genres.join(" | ")}</p>
					<p><strong>Status:&nbsp;</strong>{status}</p>
					<p><strong>Runtime:&nbsp;</strong>{runtime}</p>
				</aside>
			</div>
		</section>
		</Link>
	);
}

export default ShowItem;