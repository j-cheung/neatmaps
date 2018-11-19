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
			<form className="loginForm" onSubmit={this.props.handleSubmit}>
				<input className="loginField" type="text" placeholder="Username"/>
				<input className="loginField" type="password" placeholder="Password"/>
				<input className="loginSubmit" type="submit" value="Login" />
			</form>
		)
	}
}

class Login extends React.Component {

	handleSubmit = (event) => {
		event.preventDefault()
		//validate, verify
		//........
		//if success
		//launch app
		this.props.history.push("/home")
	}

	render () {
		return (
			<div className="loginWrapper">
				<LoginTitle/>
				<LoginForm handleSubmit={this.handleSubmit}/>
			</div>
		)
	}
}

export default withRouter(Login)