import React from 'react';
import {Switch, Route} from 'react-router-dom';

import Home from './Components/Home/Home';
import NotFound from './404';
import Login from './Components/Auth/Login';
import Signup from './Components/Auth/Register';

const Router = () => (
	<Switch>
		<Route exact path='/' render={(props) => (
			<Home
			{...props}
			/>
		)}
		/>
		<Route exact path='/login' render={(props) => (
			<Login
			{...props}
			/>
		)}
		/>
		<Route exact path='/signup' render={(props) => (
			<Signup
			{...props}
			/>
		)}
		/>
		<Route path='*' component={NotFound} />
	</Switch>
)

export default Router;