import React from 'react'
import { Switch, Route, PrivateRoute } from 'react-router-dom'
import Login from "./login/login"
import Home from "./home/home"
import Upload from "./upload/upload"

export default class Routes extends React.Component {
	render() {
		return(
			<Switch>
				<Route exact path = "/login" component = { Login }/>
				<Route exact path = "/home" component = { Home }/>
				<Route exact path = "/upload" component = { Upload }/>
			</Switch>
		)
	}
}