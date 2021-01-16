import React, {useState, useEffect} from "react";
import { useParams } from 'react-router-dom';

import ShowItem from "./ShowItem";

import data from "./data/shows";

const CreditsView = () => {

	const [credits, setCredits] = useState([]);
	const [actor, setActor] = useState('');
	const { id } = useParams();

	useEffect(() => {
		fetch(`https://api.tvmaze.com/people/${id}?embed=castcredits`)
		.then(response => response.json())
		.then(data => {
			let newCredits = data._embedded.castcredits.map(el => el._links.show.href.slice(el._links.show.href.indexOf('shows/') + 6));
			newCredits = newCredits.filter((el, index, arr) => index === arr.indexOf(el));
			setCredits(newCredits)
			setActor(data.name);
		});
	}, [id])

	return (
		<div className="credits">
			<h1>{actor}</h1>
			{credits && credits.map(el => {
				const selected = data.find(subel => subel.id === parseInt(el));
				if (selected) {return <ShowItem key={`series${selected.id}`} {...selected}/>} else {return null}
			})}
		</div>
	);
}

export default CreditsView;