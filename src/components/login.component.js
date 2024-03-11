import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { connect } from "react-redux";
import { login } from "../actions/auth";
import logo from "../images/login.jpg";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.onChangeNombreUsuario = this.onChangeNombreUsuario.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      nombreUsuario: "",
      password: "",
      loading: false,
    };
  }

  onChangeNombreUsuario(e) {
    this.setState({
      nombreUsuario: e.target.value,
    });
  }
  onChangePassword(e) {
    this.setState({
      password: e.target.value,
    });
  }
  handleLogin(e) {
    e.preventDefault();

    this.setState({
      loading: true,
    });

    this.form.validateAll();

    const { dispatch, history } = this.props;

    if (this.checkBtn.context._errors.length === 0) {
      dispatch(login(this.state.nombreUsuario, this.state.password))
        .then(() => {
          history.push("/profile");
          window.location.reload();
        })
        .catch(() => {
          this.setState({
            loading: false,
          });
        });
    } else {
      this.setState({
        loading: false,
      });
    }
  }

  render() {
    const { isLoggedIn, message } = this.props;

    this.message = null;

    if (isLoggedIn) {
      return <Redirect to="/profile" />;
    }
    return (
      <div className="w-100 d-flex justify-content-center">
        <div className="col-md-4 shadow-lg rounded p-1">
          <div className="text-dark p-3 d-flex flex-column justify-content-center">
            <img src={logo} width="250" height="250" alt="logo" className="text-center mx-auto"/>
            <Form onSubmit={this.handleLogin} ref={(c) => { this.form = c;}}>
              <div className="form-group">
                <label htmlFor="nombreUsuario">Nombre De Usuario</label>
                <Input type="text" className="form-control" name="nombreUsuario" value={this.state.nombreUsuario} onChange={this.onChangeNombreUsuario} validations={[required]}/>
              </div>
              <div className="form-group mt-2">
                <label htmlFor="password">Contraseña</label>
                <Input type="password" className="form-control" name="password" value={this.state.password} onChange={this.onChangePassword} validations={[required]} />
              </div>
              <div className="form-group d-flex justify-content-center m-4">
                <button className="btn btn-dark btn-block" disabled={this.state.loading} >
                  {this.state.loading && ( <span className="spinner-border spinner-border-sm"></span>  )} <span>Login</span>
                </button>
              </div>
              {message && (
                <div className="form-group">
                  <div className="alert alert-danger" role="alert">
                    {message}
                  </div>
                </div>
              )}
              <CheckButton style={{ display: "none" }} ref={(c) => { this.checkBtn = c; }} />
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { isLoggedIn } = state.auth;
  const { message } = state.message;
  return {
    isLoggedIn,
    message,
  };
}
export default connect(mapStateToProps)(Login);
