import React from 'react';
import {Switch, Route} from 'react-router-dom';

import Home from './Components/Home/Home';
import NotFound from './404';
import Login from './Components/Auth/Login';
import Signup from './Components/Auth/Register';

const Router = () => (
	<Switch>
		<Route exact path='/' render={() => (
			<Home
			/>
		)}
		/>
		<Route exact path='/login' render={() => (
			<Login
			/>
		)}
		/>
		<Route exact path='/signup' render={() => (
			<Signup
			/>
		)}
		/>
		<Route path='*' component={NotFound} />
	</Switch>
)

export default Router;