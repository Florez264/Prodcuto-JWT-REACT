import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import { connect } from "react-redux";
import { register } from "../actions/auth";
import logo from "../images/registro.png";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const email = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
};

const vNombreUsuario = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The username must be between 3 and 20 characters.
      </div>
    );
  }
};
const vNombre = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The name must be between 3 and 20 characters.
      </div>
    );
  }
};

const vpassword = (value) => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    ); 
  }
};

class Register extends Component {
  constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
    this.onChangeNombre = this.onChangeNombre.bind(this);
    this.onChangeNombreUsuario = this.onChangeNombreUsuario.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      nombre: "",
      nombreUsuario: "",
      email: "",
      password: "",
      successful: false,
    };
  }
  onChangeNombre(e) {
    this.setState({ nombre: e.target.value });
  }
  onChangeNombreUsuario(e) {
    this.setState({ nombreUsuario: e.target.value });
  }

  onChangeEmail(e) {
    this.setState({ email: e.target.value });
  }
  onChangePassword(e) {
    this.setState({ password: e.target.value });
  }
  handleRegister(e) {
    e.preventDefault();

    this.setState({
      successful: false,
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      this.props
        .dispatch(
          register(
            this.state.nombre,
            this.state.nombreUsuario,
            this.state.email,
            this.state.password
          )
        )
        .then(() => {
          this.setState({
            successful: true,
          });
        })
        .catch(() => {
          this.setState({
            successful: false,
          });
        });
    }
  }

  render() {
    const { message } = this.props;

    return (
      <div className="w-100 d-flex justify-content-center">
        <div className="col-md-4 shadow-lg rounded p-1">
          <div className="text-dark p-3 d-flex justify-content-center flex-column">
            <img src={logo} width="200" height="250" alt="logo" className="text-center mx-auto" />
            <Form onSubmit={this.handleRegister}
              ref={(c) => {
                this.form = c;
              }}
            >
              {!this.state.successful && (
                <div>
                  <div className="form-group">
                    <label htmlFor="nombre">Nombres y Apellidos</label>
                    <Input type="text" className="form-control" name="nombre" value={this.state.nombre} onChange={this.onChangeNombre} validations={[required, vNombre]} />
                  </div>
                  <div className="form-group mt-2">
                    <label htmlFor="nombreUsuario">Nombre De Usuario</label>
                    <Input type="text" className="form-control" name="nombreUsuario" value={this.state.nombreUsuario} onChange={this.onChangeNombreUsuario} 
                    validations={[required, vNombreUsuario]} />
                  </div>

                  <div className="form-group mt-2">
                    <label htmlFor="email">Correo Electrónico</label>
                    <Input type="text" className="form-control" name="email" value={this.state.email} onChange={this.onChangeEmail}
                      validations={[required, email]} />
                  </div>
                  <div className="form-group mt-2">
                    <label htmlFor="password">Contraseña</label>
                    <Input type="password" className="form-control" name="password" value={this.state.password} onChange={this.onChangePassword}
                      validations={[required, vpassword]} />
                  </div>
                  <div className="form-group d-flex justify-content-center m-4">
                    <button className="btn btn-dark btn-block">Registrate</button>
                  </div>
                </div>
              )}
              {message && (
                <div className="form-group">
                  <div
                    className={
                      this.state.successful
                        ? "alert alert-success"
                        : "alert alert-danger"
                    }
                    role="alert"
                  >
                    {message}
                  </div>
                </div>
              )}

              <CheckButton
                style={{ display: "none" }}
                ref={(c) => {
                  this.checkBtn = c;
                }}
              />
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { message } = state.message;
  return { message };
}

export default connect(mapStateToProps)(Register);
