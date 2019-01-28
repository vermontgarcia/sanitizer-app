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

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class LoginForm extends Component {

	componentDidMount(){
		this.props.form.validateFields();
	}

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);
				//login(values, this.props.history);
			}
		});
	}

	render(){
		const {
			getFieldDecorator,
			getFieldsError,
			getFieldError,
			isFieldTouched
		} = this.props.form;

		const userNameError = isFieldTouched('userName') && getFieldError('userName');
		const passwordError = isFieldTouched('password') && getFieldError('password');


		return (
			<div className='login-envelop'>
				<div>
					<img src='https://www.prosamexico.mx/images/logo.png' alt='PROSA logo' />
				</div>
				<div>
					<Form onSubmit={this.handleSubmit} className='form-envelop'>
						<div>
							<h1>Login</h1>
						</div>
						
						<FormItem
							validateStatus={userNameError ? 'error' : ''}
							help={userNameError || ''}
						>
              {getFieldDecorator('userName', {
                rules: [{ required: true, message: 'Type your username!' }],
              })(
                <Input
                  prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder='Username'/>
              )}
            </FormItem>
						<FormItem
							validateStatus={passwordError ? 'error' : ''}
							help={passwordError || ''}
						>
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
								<Link className='login-form-forgot' to='/forgot'>Forgot password</Link>.
							<Button
								type='primary'
								htmlType='submit'
								className='login-form-button'
								disabled={hasErrors(getFieldsError())}>
								Login
							</Button>
							Or <Link to='/signup'>register now!</Link>
            </FormItem>
					</Form>
				</div>
			</div>
		)
	}
}

const Login = Form.create({name: 'login-form'})(LoginForm)

export default Login;