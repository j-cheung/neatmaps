import React from 'react'
import "./login.css"

const LoginTitle = () => {
	return (
		<h1 className="loginTitle">Neat Maps</h1>
	)
}

class LoginForm extends React.Component {

	handleSubmit = (event) => {
		//validate, verify
		event.PreventDefault();
		//........
		//if success
		//launch app
		this.props.history.push({
			pathname:"/home"
		})
	}

	render () {
		return (
			<form className="loginForm" onSubmit={this.handleSubmit}>
				<input className="loginField" type="text" placeholder="Username"/>
				<input className="loginField" type="password" placeholder="Password"/>
				<input className="loginSubmit" type="submit" value="Login"/>
			</form>
		)
	}
}

export default class Login extends React.Component {
	render () {
		return (
			<div className="loginWrapper">
				<LoginTitle/>
				<LoginForm/>
			</div>
		)
	}
}