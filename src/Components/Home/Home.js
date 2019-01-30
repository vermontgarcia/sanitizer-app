import React, {Component} from 'react';
import {Button} from 'antd';
import {isLoggedIn} from '../../authService';

class Home extends Component {


	componentWillMount(){

    const token = localStorage.getItem('token');
    token ? isLoggedIn(this.props.history) : this.props.history.push('/login');

  }

	render(){
		return (
			<div>
				<h1>Home</h1>
				<Button type='primary'>Clik on me!</Button>

			</div>
		)
	}
}

export default Home;