import React, { Component } from "react";
import { connect } from "react-redux";
import { Router, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./Css/App.css";
import Login from "./components/login.component";
import Register from "./components/register.component";
import Profile from "./components/profile.component";
import User from "./components/user.component";
import Product from "./components/producto.component";
import EditProduct from "./components/editar.component";
import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";
import { history } from "./helpers/history";
import EventBus from "./common/EventBus"; 
import logo from "./images/logo.png"


class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
    this.state = { currentUser: undefined };

    history.listen((location) => {
      props.dispatch(clearMessage());
    });
  }
  componentDidMount() {
    const user = this.props.user;
    if (user) {
      this.setState({ currentUser: user });
    }
    EventBus.on("logout", () => {
      this.logOut();
    });
  }
  componentWillUnmount() {
    EventBus.remove("logout");
  }

  logOut() {
    this.props.dispatch(logout());
    this.setState({ currentuser: undefined });
  }
  render() {
    const { currentUser } = this.state;

    return (
      <Router history={history}>
        <div>
          <nav className="navbar navbar-expand navbar-dark" data-bs-theme="dark" style={{ backgroundColor: "#A93239" }}>
            <div className="container-fluid">
              <a className="navbar-brand" href="#"><img src={logo} width="50" height="50" alt="logo" className="text-center mx-auto"/></a>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation" >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNavDropdown">
                {/*<Link to={"/"} className="navbar-brand"></Link>
                <div className="navbar-nav mr-auto">
              {currentUser && (
                <li className="nav-item">
                  <Link to={"/user"} className="nav-link">
                    Resource
                  </Link>
                </li>
              )}
            </div> */}
                {currentUser ? (
                  <div className="navbar-nav">
                    <li className="nav-item">
                      <Link to={"/user"} className="nav-link">user</Link>
                    </li>
                    <li className="nav-item">
                      <Link to={"/product"} className="nav-link">Productos</Link>
                    </li>
                    <li className="nav-item">
                      <Link to={"/profile"} className="nav-link">Perfil </Link>
                    </li>
                    <li className="nav-item">
                      <a href="/login" className="nav-link" onClick={this.logOut}>Cerrar Sesión</a>
                    </li>
                  </div>
                ) : (
                  <div className="navbar-nav">
                    <li className="nav-item">
                      <Link to={"/login"} className="nav-link">Iniciar Sesión</Link>
                    </li>
                    <li className="nav-item">
                      <Link to={"/register"} className="nav-link">Registrate </Link>
                    </li>
                  </div>
                )}
              </div>
            </div>
          </nav>

          <div className="container-fluid my-3 d-flex flex-column justify-content-center align-items-center">
            <div className="w-100">
              <Switch>
                <Route exact path={["/", "/login"]} component={Login} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/profile" component={Profile} />
                <Route exact path="/product" component={Product} />
                <Route exact path="/editProduct/:id" component={EditProduct} />
                <Route exact path="/user" component={User} />
                
              </Switch>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}
function mapStateToProps(state) {
  const { user } = state.auth;
  return { user };
}

export default connect(mapStateToProps)(App);


