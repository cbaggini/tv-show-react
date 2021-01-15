import React from "react";
import ShowItem from "./ShowItem";

import data from "./data/shows";

const ShowView = () => {
	return (
		<div className="series">{data.map(el => <ShowItem key={el.id} {...el}/>)}</div>
	);
}

export default ShowView;