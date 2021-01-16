import React, {useState, useEffect} from "react";
import { Link, useParams } from 'react-router-dom';

import EpisodeItem from "./EpisodeItem";

import data from "./data/shows";

const EpisodeView = () => {
	const [episodes, setEpisodes] = useState([]);
	const [filteredEpisodes, setFilteredEpisodes] = useState([]);
	const [season, setSeason] = useState(1);
	const [cast, setCast] = useState([]);
	const [color, setColor] = useState('');
	const { id } = useParams();
	const series = data.find(el => el.id.toString() === id);
	const uniqueSeries = episodes.map(el => String(el.season).padStart(2, '0')).filter((value, index, arr) => arr.indexOf(value) === index);

	useEffect(() => {
		fetch(`https://api.tvmaze.com/shows/${id}/episodes`)
		.then(response => response.json())
		.then(data => {setEpisodes(data)
			setFilteredEpisodes(data);
		});
		fetch(`https://api.tvmaze.com/shows/${id}/cast`)
		.then(response => response.json())
		.then(data => {
			const newCast = data.length > 9 ? data.slice(0,10) : data
			setCast(newCast)
		});
		const getColor = () => { 
		return "hsl(" + 360 * Math.random() + ',' +
					(25 + 70 * Math.random()) + '%,' + 
					(85 + 10 * Math.random()) + '%)'
		}
		setColor(getColor());
	}, [id]);

	const selectSeries = (e) => {
		setSeason(parseInt(e.target.value));
	}

	const filterEpisodes = (e) => {
		if (e.target.value) {
			const newEpisodeList = [...episodes].filter(function(el) {
				return (el.summary.toLowerCase().includes(e.target.value.toLowerCase()) || el.name.toLowerCase().includes(e.target.value.toLowerCase()));
			});
			setFilteredEpisodes(newEpisodeList);
		} else {
			setFilteredEpisodes(episodes);
		}
	}

	const selectEpisodes = (e) => {
		if (e.target.value) {
			const selected = [...episodes].find(el => el.id === parseInt(e.target.value));
			setFilteredEpisodes([selected]);
		} else {
			setFilteredEpisodes(episodes);
		}
	}

	
	return (
		<>
		<div className="searchBar" style={{backgroundColor: `${color}`}}>
			<Link to='/' >
				<button className="backBtn">Back to series list</button>
			</Link>
			<select name="episodes" className="episodeFilter" onChange={selectEpisodes}>
				<option value="">See all episodes</option>
				{[...episodes].filter(el => el.season === season).map(el => {
					const episodeCode = `S${String(el.season).padStart(2, '0')}E${String(el.number).padStart(2, '0')}`;
					return <option key={episodeCode} value={el.id}>{episodeCode} - {el.name}</option>
				})}
			</select>
			<input className="searchInput" type="text" placeholder="Your search term here" onChange={filterEpisodes}/>
			<p className="selected">Displaying {filteredEpisodes.length}/{episodes.length} episodes</p>
		</div>
		<h1>{series.name}</h1> 
		<article className="cast" style={{backgroundColor: `${color}`}}>
			<h2>Cast</h2>
			<div>
				{cast.map(el => <p className="actors" key={`person${el.person.id}${el.character.id}`}><a href={`/${el.person.id}/credits`}>{el.person.name}</a> as {el.character.name}</p>)}
			</div>
		</article>
		<div className="paginate">
			{uniqueSeries.map(el => <button type="button" className="paginationBtn" style={{backgroundColor: `${color}`}} onClick={selectSeries} value={parseInt(el)} key={el}>Series {el}</button>)}
		</div>
		<div className="episodes">
			{filteredEpisodes.filter(el => el.season === season).map(el => <EpisodeItem key={`episode${el.id}`} {...el} color={color}/>)}
		</div>
		</>
	);
}

export default EpisodeView;