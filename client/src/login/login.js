import React from 'react'
import Cookies from 'universal-cookie'
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
						onChange={this.props.handleOnChangeEmail}/>
				<input className="loginField" type="password" placeholder="Password"
						onChange={this.props.handleOnChangePassword}/>
				<input className="loginSubmit" type="submit" value="Login" />
			</form>
		)
	}
}

export default class Login extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			email: '',
			password: ''
		}
	}

	handleOnChangeEmail = (e) => {
		this.setState({email: e.target.value})
	};

	handleOnChangePassword = (e) => {
		this.setState({password: e.target.value})
	};

	getSignJWT = () => {
		return fetch('/api/sign_jwt',{
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					username: this.state.email
				})
			})
			.then(res => {
				if(!res.ok){
					console.log(res)
					throw Error(res.status.toString() +" "+ res.statusText)
				}
				return res.text()
			})
			.catch(err => {console.log(err)})
	};

	handleSubmit = (event) => {
		event.preventDefault()
		//validate, verify
		if(this.state.email === '' || this.state.password === ''){
			alert('Please enter credentials')
			return
		}
		var url = new URL('http://neat-mvp-api.herokuapp.com/v1/auth'),
			params = {
				email: this.state.email, 
				password: this.state.password
			}
		Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
		fetch(url,{
			method:'POST'
		})
		.then(response => {
			if(!response.ok){
				console.log(response)
				throw Error(response.status.toString() +" "+ response.statusText)
			}
			//sign jwt get token
			return this.getSignJWT()
		})
		.then(token => {
			const cookies = new Cookies()
			cookies.set('neatmaps-token', token, {path: '/'})
			this.props.history.push("/home")
		})
		.catch(err => {
			console.log(err)
		})
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
