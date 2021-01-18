import React from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

import ShowView from "./ShowView";
import EpisodeView from "./EpisodeView";
import CreditsView from "./CreditsView";

function App() {
  return (
		<Router >
			<Switch>
				<Route exact path='/'>
					<ShowView />
				</Route>
					<Route path='/:id/episodes/:colorCode' children={<EpisodeView />}>
				</Route>
				<Route path='/:id/credits' children={<CreditsView />}>
				</Route>
			</Switch>
		</Router>
	);
}

export default App;
