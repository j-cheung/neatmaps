import React from 'react'

const LoginTitle = () => {
	return (
		<h1 className="loginTitle">Neat Maps</h1>
	)
}

export default class Login extends React.Component {
	render () {
		return (
			<div className="loginWrapper">
				<LoginTitle/>
			</div>
		)
	}
}