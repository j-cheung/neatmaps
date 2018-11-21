import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Login from "./login/login"
import Home from "./home/home"
import Upload from "./upload/upload"
import Cookies from 'universal-cookie'

const PrivateRoute = ({component: Component, ...rest}) => (
	<Route {...rest} render = {(props) => {
		const cookies = new Cookies()
		if(cookies.get('neatmaps-token')){
			return <Component {...props} />
		} else {
			return <Redirect to='login' />
		}
	}} />
)

export default class Routes extends React.Component {
	render() {
		return(
			<Switch>
				<Route exact path = "/">
					<Redirect to="/home"/>
				</Route>
				<Route exact path = "/login" component = { Login }/>
				<PrivateRoute exact path = "/home" component = { Home }/>
				<PrivateRoute exact path = "/upload" component = { Upload }/>
			</Switch>
		)
	}
}