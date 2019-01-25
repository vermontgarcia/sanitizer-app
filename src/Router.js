import React from 'react';
import {Switch, Route} from 'react-router-dom';

import Home from './Components/Home/Home';
import NotFound from './404';
import Login from './Components/Login/Login';

const Router = () => (
	<Switch>
		<Route exact path='/' render={() => (
			<Home
			/>)}
		/>
		<Route exact path='/login' render={() => (
			<Login
			/>)}
		/>
		<Route path='*' component={NotFound} />
	</Switch>
)

export default Router;