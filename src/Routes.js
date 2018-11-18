import React from 'react'
import { Switch, Route, PrivateRoute } from 'react-router-dom'
import Login from "./login/login"

export default class Routes extends React.Component {
	render() {
		return(
			<Switch>
				<Route exact path = "/" component = { Login }/>
			</Switch>
		)
	}
}