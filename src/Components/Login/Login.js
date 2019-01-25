import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import {login} from '../../authService';

import {
	Form,
	Icon,
	Input,
	Button,
	Checkbox,
} from 'antd';

const FormItem = Form.Item;

class LoginForm extends Component {

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				login(values, this.props.history);
			}
		});
	}

	render(){
		const {getFieldDecorator} = this.props.form
		return (
			<div className='login-envelop'>
				<div>
					<img src='favicon.ico' alt='logo' />
				</div>
				<div>
					<Form onSubmit={this.handleSubmit} className='form-envelop'>
						<div>
							<h1>Login</h1>
						</div>
						
						<FormItem>
              {getFieldDecorator('userName', {
                rules: [{ required: true, message: 'Type your username!' }],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Username"/>
              )}
            </FormItem>
						<FormItem>
							{getFieldDecorator('password', {
								rules: [{ required: true, message: 'Type your password!'}],
							})(
								<Input
									prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)'}} />}
									type='password'
									placeholder='Password' />
							)}
						</FormItem>

            <FormItem>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(
                <Checkbox>Remember me</Checkbox>
								)}
								<Link className="login-form-forgot" to='/forgot'>Forgot password</Link>
							<Button type="primary" htmlType="submit" className="login-form-button">
								Login
							</Button>
							Or <Link to='/register'>register now!</Link>
            </FormItem>
					</Form>
				</div>
			</div>
		)
	}
}

const Login = Form.create({name: 'login-form'})(LoginForm)

export default Login;