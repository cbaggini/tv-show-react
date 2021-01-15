import React, {useState, useEffect} from "react";
import { Link, useParams } from 'react-router-dom';

import EpisodeItem from "./EpisodeItem";

import data from "./data/shows";

const EpisodeView = () => {
	const [episodes, setEpisodes] = useState([]);
	const [season, setSeason] = useState(1);
	const { id } = useParams();
	const series = data.find(el => el.id.toString() === id);
	const uniqueSeries = episodes.map(el => String(el.season).padStart(2, '0')).filter((value, index, arr) => arr.indexOf(value) === index);

	useEffect(() => {
		fetch(`https://api.tvmaze.com/shows/${id}/episodes`)
		.then(response => response.json())
		.then(data => setEpisodes(data));
	}, [id]);

	const selectSeries = (e) => {
		setSeason(parseInt(e.target.value));
	}

	return (
		<>
		<Link to='/' >
			<button>Back to shows</button>
		</Link>
		<h1>{series.name}</h1> 
		<article className="cast">
			
		</article>
		<div className="paginate">
			{uniqueSeries.map(el => <button type="button" className="paginationBtn" onClick={selectSeries} value={parseInt(el)} key={el}>Series {el}</button>)}
		</div>
		<div className="episodes">
			{episodes.filter(el => el.season === season).map(el => <EpisodeItem key={el.id} {...el}/>)}
		</div>
		</>
	);
}

export default EpisodeView;