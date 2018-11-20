import React from 'react'
import { withRouter } from 'react-router-dom'
import "./login.css"

const LoginTitle = () => {
	return (
		<h1 className="loginTitle">Neat Maps</h1>
	)
}

class LoginForm extends React.Component {

	render () {
		return (
			<form id="loginForm" className="loginForm" onSubmit={this.props.handleSubmit}>
				<input className="loginField" type="text" placeholder="Email" 
						onChange={(e) => {this.props.handleOnChangeEmail(e.target.value)}}/>
				<input className="loginField" type="password" placeholder="Password"
						onChange={(e) => {this.props.handleOnChangePassword(e.target.value)}}/>
				<input className="loginSubmit" type="submit" value="Login" />
			</form>
		)
	}
}

class Login extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			email: '',
			password: ''
		}
	}

	handleOnChangeEmail = (value) => {
		this.setState({email: value})
	};

	handleOnChangePassword = (value) => {
		this.setState({password: value})
	}

	handleSubmit = (event) => {
		event.preventDefault()
		//validate, verify
		var url = new URL('http://neat-mvp-api.herokuapp.com/v1/auth'),
			params = this.state
		console.log(this.state)
		Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
		fetch(url,{
			method:'POST'
		})
		.then(response => response.json())
		.then(data => console.log(data))
		//........
		//if success
		//launch app
		// this.props.history.push("/home")
	}

	render () {
		return (
			<div className="loginWrapper">
				<LoginTitle/>
				<LoginForm 
					handleOnChangeEmail = {this.handleOnChangeEmail} 
					handleOnChangePassword = {this.handleOnChangePassword} 
					handleSubmit={this.handleSubmit}
				/>
			</div>
		)
	}
}

export default withRouter(Login)