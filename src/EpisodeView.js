import React, {useState, useEffect} from "react";
import { Link, useParams } from 'react-router-dom';

import EpisodeItem from "./EpisodeItem";

import data from "./data/shows";

const EpisodeView = () => {
	const [episodes, setEpisodes] = useState([]);
	const [filteredEpisodes, setFilteredEpisodes] = useState({eps: [], search: '', season: 1});
	const [cast, setCast] = useState([]);
	const { id, colorCode } = useParams();
	const series = data.find(el => el.id.toString() === id);
	const uniqueSeries = episodes.map(el => String(el.season).padStart(2, '0')).filter((value, index, arr) => arr.indexOf(value) === index);
	const colorArr = colorCode.split('-');
	const color = "hsl(" + colorArr[0] + ',' +
					colorArr[1] + '%,' + 
					colorArr[2] + '%)';

	useEffect(() => {
		if (sessionStorage.getItem(`series${id}`) === null) {
			fetch(`https://api.tvmaze.com/shows/${id}/episodes`)
			.then(response => response.json())
			.then(data => {setEpisodes(data)
				setFilteredEpisodes({eps: data, search: '', season: 1});
				sessionStorage.setItem(`series${id}`, JSON.stringify(data));
			});
		} else {
			const newSeries = JSON.parse(sessionStorage.getItem(`series${id}`));
			setEpisodes(newSeries);
			setFilteredEpisodes({eps: newSeries, search: '', season: 1});
		}
		
		if (sessionStorage.getItem(`cast${id}`) === null) {
			fetch(`https://api.tvmaze.com/shows/${id}/cast`)
			.then(response => response.json())
			.then(data => {
				const newCast = data.length > 9 ? data.slice(0,10) : data;
				setCast(newCast);
				sessionStorage.setItem(`cast${id}`, JSON.stringify(newCast));
			});
		} else {
			const newCast = JSON.parse(sessionStorage.getItem(`cast${id}`));
			setCast(newCast);
		}
	}, [id]);

	const selectSeries = (e) => {
		setFilteredEpisodes({...filteredEpisodes, eps: episodes.filter(el => el.season === parseInt(e.target.value)), season: parseInt(e.target.value), search: ''});
	}

	const filterEpisodes = (e) => {
		if (e.target.value) {
			const newEpisodeList = [...episodes].filter(function(el) {
				return ((el.summary ? el.summary.toLowerCase().includes(e.target.value.toLowerCase()) : false)|| (el.name ? el.name.toLowerCase().includes(e.target.value.toLowerCase()) : false));
			});
			setFilteredEpisodes({...filteredEpisodes, eps: newEpisodeList, search: e.target.value});
			
		} else {
			setFilteredEpisodes({...filteredEpisodes, eps: episodes, search: ''});
		}
	}

	const selectEpisodes = (e) => {
		if (e.target.value !== "") {
			const selected = [...episodes].find(el => el.id === parseInt(e.target.value));
			setFilteredEpisodes({...filteredEpisodes, eps: [selected]});
		} else {
			setFilteredEpisodes({...filteredEpisodes, eps: episodes});
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
				{filteredEpisodes.eps.map(el => {
					const episodeCode = `S${String(el.season).padStart(2, '0')}E${String(el.number).padStart(2, '0')}`;
					return <option key={episodeCode} value={el.id}>{episodeCode} - {el.name}</option>
				})}
			</select>
			<input className="searchInput" type="text" placeholder="Your search term here" onChange={filterEpisodes} value={filteredEpisodes.search}/>
			{filteredEpisodes.search && <p className="selected">Displaying {filteredEpisodes.eps.length}/{episodes.length} episodes</p>}
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
			{filteredEpisodes.eps.map(el => <EpisodeItem key={`episode${el.id}`} {...el} color={color}/>)}
		</div>
		</>
	);
}

export default EpisodeView;