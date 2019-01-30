import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import {signup} from '../../authService';

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

class SignupForm extends Component {
	
	constructor (){
		super();
		this.state = {
			confirmDirty: false,
			autoCompleteResult: [],
		};
	}

	componentDidMount() {
    this.props.form.validateFields();
  }
	
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				//console.log('Received values of form: ', values);
				signup(values, this.props.history);
			}
		});
	}

	handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('¡La contraseña no coincide!');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
	}
	
	validateCheckedAgreement = (rule, value, callback) => {
		//const form = this.props.form;
		if(value === false){
			callback('Please confirm the agreement!');
		}
		callback();
	}

	render(){
		const {
			getFieldDecorator,
			getFieldsError,
			getFieldError,
			isFieldTouched
		} = this.props.form;

		const nameError = isFieldTouched('name') && getFieldError('name');
		const emailError = isFieldTouched('email') && getFieldError('email');
		const passwordError = isFieldTouched('password') && getFieldError('password');
		const confirmPasswordError = isFieldTouched('confirm') && getFieldError('confirm');
		const agreementError = isFieldTouched('agreement') && getFieldError('agreement');
		
		return (
			<div className='signup-envelop'>
				<div>
					<img className='prosa-logo' src='logo.png' alt='PROSA logo' />
				</div>
				<div>
					<Form onSubmit={this.handleSubmit} className='form-envelop'>
						<div>
							<h1>Register</h1>
						</div>
						<FormItem
							validateStatus={nameError ? 'error' : ''}
							help={nameError || ''}
						>
              {getFieldDecorator('name', {
                rules: [{
									required: true,
									message: 'Please enter your name',
									whitespace: true }],
              })(
                <Input
                  prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder='What is your name?'/>
              )}
            </FormItem>
            <FormItem
							validateStatus={emailError ? 'error' : ''}
							help={emailError || ''}
						>
              {getFieldDecorator('email', {
                rules: [{
									type: 'email',
									message: 'Please enter a valid email!',
                },{
                  required: true, message: 'Please enter your email!',
                }],
              })(
                <Input
                  prefix={<Icon type='mail' style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder='user.name@prosa.com.mx'/>
              )}
            </FormItem>
            <FormItem
							validateStatus={passwordError ? 'error' : ''}
							help={passwordError || ''}
						>
              {getFieldDecorator('password', {
                rules: [{
                  required: true, message: 'Please enter your password',
                },{
                  validator: this.validateToNextPassword,
                }],
              })(
                <Input
                  prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type='password'
                  placeholder='Password'/>
              )}
            </FormItem>
            <FormItem
							validateStatus={confirmPasswordError ? 'error' : ''}
							help={confirmPasswordError || ''}
						>
              {getFieldDecorator('confirm', {
                rules: [{
                  required: true, message: 'Please, confirm your password!',
                },{
                  validator: this.compareToFirstPassword,
                }],
              })(
                <Input
                  prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type='password'
                  placeholder='Confirm your password'/>
              )}
            </FormItem>
            <FormItem
							validateStatus={agreementError ? 'error' : ''}
							help={agreementError || ''}
						>
              {getFieldDecorator('agreement', {
								rules: [{
									required: true, message: 'Please confirm agreement!'
								},{
									validator: this.validateCheckedAgreement,
								}],
                valuePropName: 'checked',
              })(
                <Checkbox>I have read and accept the <Link to='/agreement'>agreement.</Link></Checkbox>
                )}
            </FormItem>
						<FormItem>
							<Button
								type='primary' 
								htmlType='submit'
								className='login-form-button'
								disabled={hasErrors(getFieldsError())}>
									Register
							</Button>
							Already have an account? <Link to='/login' >Login</Link>
						</FormItem>				
					
					</Form>
				</div>
			</div>
		)
	}
}

const Signup = Form.create({name: 'signup-form'})(SignupForm);

export default Signup;