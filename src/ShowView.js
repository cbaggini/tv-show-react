import React, {useState} from "react";
import { useHistory } from "react-router-dom";
import ShowItem from "./ShowItem";

import data from "./data/shows";

const ShowView = () => {

	const [selectedSeries, setSelectedSeries] = useState(data.sort((a,b) => a.name > b.name));
	const [filteredSeries, setFilteredSeries] = useState(data.sort((a,b) => a.name > b.name));
	const [sorting, setSorting] = useState('name');
	const [itemsNumber, setItemsNumber] = useState(10);
	
	
	const history = useHistory();

	const getColor = (id) => { 
		const newColor =  "hsl(" + Math.round(360 * Math.random()) + ',' +
					Math.round(25 + 70 * Math.random()) + '%,' + 
					Math.round(85 + 10 * Math.random()) + '%)';
		sessionStorage.setItem(`divColor${id}`, JSON.stringify(newColor));
		return newColor;
	}  

	const selectSeries = (e) => {
		const selected = data.find(el => el.id === parseInt(e.target.value));
		const selectedColor = sessionStorage.getItem(`divColor${selected.id}`) !== null ? JSON.parse(sessionStorage.getItem(`divColor${selected.id}`)) : getColor();
		history.push(`/${selected.id}/episodes/${selectedColor.slice(selectedColor.indexOf('(')+1).replace(')','').replace(/%/g, '').replace(/,/g,'-')}`);
	}

	const filterSeries = (e) => {
		if (e.target.value) {
			const newSeriesList = selectedSeries.filter(function(el) {
				return (el.name ? el.name.toLowerCase().includes(e.target.value.toLowerCase()) : false) || (el.summary ? el.summary.toLowerCase().includes(e.target.value.toLowerCase()) : false)
			});
			setFilteredSeries(newSeriesList);
			setItemsNumber(10);
		} else {
			setFilteredSeries(selectedSeries);
			setItemsNumber(10);
		}
	}

	const toggleFilter = () => {
		if (sorting === 'name') {
			setSelectedSeries([...selectedSeries].sort((a,b) => (a.rating.average < b.rating.average) ? 1 : ((b.rating.average < a.rating.average) ? -1 : 0)));
			setFilteredSeries([...filteredSeries].sort((a,b) => (a.rating.average < b.rating.average) ? 1 : ((b.rating.average < a.rating.average) ? -1 : 0)));
			setSorting('rating');
			setItemsNumber(10);
		} else {
			setSelectedSeries([...selectedSeries].sort((a,b) => a.name > b.name));
			setFilteredSeries([...filteredSeries].sort((a,b) => a.name > b.name));
			setSorting('name');
			setItemsNumber(10);
		}
	}

	const loadMore = () => {
		setItemsNumber(itemsNumber => itemsNumber + 10);
	}

	return (
		<>
		<div className="seriesSearchBar"><p>Filtering for </p>
			<input className="seriesSearchInput" type="text" placeholder="Your search term here" onChange={filterSeries}/>
			<p className="selectedSeries">found {filteredSeries.length} shows</p>
			<select name="series" className="seriesFilter" onChange={selectSeries}>
				<option value="">See all series</option>
				{filteredSeries.map(el => <option key={`series${el.name}${el.id}`} value={el.id}>{el.name}</option>)}
			</select>
			<label htmlFor="alphabetic">
			<input type="radio" className="alphabetic" name="sort" value="alphabetic" checked={sorting === 'name'} onChange={toggleFilter}/>
			Sort by name</label><br/>
			<label htmlFor="rating">
			<input type="radio" className="rating" name="sort" value="rating" checked={sorting === 'rating'} onChange={toggleFilter}/>
			Sort by rating</label> 
		</div>
		<div className="series">{filteredSeries.slice(0, itemsNumber).map(el => <ShowItem key={`series${el.id}`} {...el} color={sessionStorage.getItem(`divColor${el.id}`) !== null ? JSON.parse(sessionStorage.getItem(`divColor${el.id}`)) : getColor(el.id)}/>)}</div>
		{filteredSeries.length >= itemsNumber && 
		<div className="loading" onClick={loadMore}>
            <h2>Load more series...</h2>
        </div>}
		</>
	);
}

export default ShowView;