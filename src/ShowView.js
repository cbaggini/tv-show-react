import React, {useState} from "react";
import { useHistory } from "react-router-dom";
import ShowItem from "./ShowItem";

import data from "./data/shows";

const ShowView = () => {

	const [selectedSeries, setSelectedSeries] = useState(data.sort((a,b) => a.name > b.name));
	const [filteredSeries, setFilteredSeries] = useState(data.sort((a,b) => a.name > b.name));
	const [sorting, setSorting] = useState('name');
	const history = useHistory();

	const selectSeries = (e) => {
		const selected = data.find(el => el.id === parseInt(e.target.value));
		history.push(`/${selected.id}/episodes`);
	}

	const filterSeries = (e) => {
		if (e.target.value) {
			const newSeriesList = selectedSeries.filter(function(el) {
				return (el.name ? el.name.toLowerCase().includes(e.target.value.toLowerCase()) : false) || (el.summary ? el.summary.toLowerCase().includes(e.target.value.toLowerCase()) : false)
			});
			setFilteredSeries(newSeriesList);
		} else {
			setFilteredSeries(selectedSeries);
		}
	}

	const toggleFilter = () => {
		if (sorting === 'name') {
			setSelectedSeries([...selectedSeries].sort((a,b) => (a.rating.average < b.rating.average) ? 1 : ((b.rating.average < a.rating.average) ? -1 : 0)));
			setFilteredSeries([...filteredSeries].sort((a,b) => (a.rating.average < b.rating.average) ? 1 : ((b.rating.average < a.rating.average) ? -1 : 0)));
			setSorting('rating');
		} else {
			setSelectedSeries([...selectedSeries].sort((a,b) => a.name > b.name));
			setFilteredSeries([...filteredSeries].sort((a,b) => a.name > b.name));
			setSorting('name');
		}
	}

	return (
		<>
		<div className="seriesSearchBar"><p>Filtering for </p>
			<input className="seriesSearchInput" type="text" placeholder="Your search term here" onChange={filterSeries}/>
			<p className="selectedSeries">found {selectedSeries.length} shows</p>
			<select name="series" className="seriesFilter" onChange={selectSeries}>
				{selectedSeries.map(el => <option key={`series${el.name}${el.id}`} value={el.id}>{el.name}</option>)}
			</select>
			<label htmlFor="alphabetic">
			<input type="radio" className="alphabetic" name="sort" value="alphabetic" checked={sorting === 'name'} onChange={toggleFilter}/>
			Sort by name</label><br/>
			<label htmlFor="rating">
			<input type="radio" className="rating" name="sort" value="rating" checked={sorting === 'rating'} onChange={toggleFilter}/>
			Sort by rating</label> 
		</div>
		<div className="series">{filteredSeries.map(el => <ShowItem key={`series${el.id}`} {...el}/>)}</div>
		</>
	);
}

export default ShowView;