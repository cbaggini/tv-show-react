import React, {useState, useEffect} from "react";
import { useParams } from 'react-router-dom';

import ShowItem from "./ShowItem";

import data from "./data/shows";

const CreditsView = () => {

	const [credits, setCredits] = useState([]);
	const [actor, setActor] = useState('');
	const { id } = useParams();

	useEffect(() => {
		if (sessionStorage.getItem(`credits${id}`) === null) {
			fetch(`https://api.tvmaze.com/people/${id}?embed=castcredits`)
			.then(response => response.json())
			.then(data => {
				let newCredits = data._embedded.castcredits.map(el => el._links.show.href.slice(el._links.show.href.indexOf('shows/') + 6));
				newCredits = newCredits.filter((el, index, arr) => index === arr.indexOf(el));
				setCredits(newCredits);
				setActor(data.name);
				sessionStorage.setItem(`credits${id}`, JSON.stringify(newCredits));
				sessionStorage.setItem(`name${id}`, JSON.stringify(data.name));
			});
		} else {
			const newCredits = JSON.parse(sessionStorage.getItem(`credits${id}`));
			const newName = JSON.parse(sessionStorage.getItem(`name${id}`));
			setCredits(newCredits);
			setActor(newName);
		}
	}, [id])

	const getColor = (id) => { 
		const newColor =  "hsl(" + Math.round(360 * Math.random()) + ',' +
					Math.round(25 + 70 * Math.random()) + '%,' + 
					Math.round(85 + 10 * Math.random()) + '%)';
		sessionStorage.setItem(`divColor${id}`, JSON.stringify(newColor));
		return newColor;
	}

	return (
		<div className="credits">
			<h1>{actor}</h1>
			{credits && credits.map(el => {
				const selected = data.find(subEl => subEl.id === parseInt(el));
				if (selected) {return <ShowItem key={`series${selected.id}`} {...selected} color={sessionStorage.getItem(`divColor${selected.id}`) !== null ? JSON.parse(sessionStorage.getItem(`divColor${selected.id}`)) : getColor(selected.id)}/>} else {return null}
			})}
		</div>
	);
}

export default CreditsView;