import React, { Component } from "react";
import Input from "react-validation/build/input";
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";
import { editProduct } from "../actions/product";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import { parseJwt } from "../common/auth-verify";
import ProductService from "../services/product.service";
import EventBus from "../common/EventBus";
import swal from "sweetalert";
import { FcEditImage } from "react-icons/fc";


const vId = (value) => {
  const parsedValue = parseInt(value);

  if (isNaN(parsedValue) || parsedValue <= 0) {
    return false;
  }
  return true;
};


class EditProduct extends Component {
  constructor(props) {
    super(props);
    const idParameter = this.props.match.params.id;
    this.state = {
      id: idParameter,
      nombre: undefined,
      precio: undefined,
      loading: false,
      successful: false,
      content: "",
    };
  }

  componentDidMount() {
    if (vId(this.state.id)) {
      ProductService.getProduct(this.state.id).then(
        (response) => {
          this.setState({
            content: response.data.message,
            nombre: response.data.nombre,
            precio: response.data.precio,
          });
        },
        (error) => {
          this.setState({
            content:
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.tostring(),
          });
          if (error.response && error.response.status === 401) {
            EventBus.dispatch("logout");
          }
        }
      );
    }
  }

  onChangeNombre = (e) => {
    this.setState({
      nombre: e.target.value,
    });
  };

  onChangePrecio = (e) => {
    this.setState({
      precio: e.target.value,
    });
  };

  
 Submit = (e) => {
  e.preventDefault();

  this.setState({
    loading: true,
    successful: false,
  });

  this.form.validateAll();
  if (this.checkBtn.context._errors.length === 0) {
    this.props
      .dispatch(
        editProduct(this.state.id, this.state.nombre, this.state.precio)
      )
      .then(() => {
        this.setState({
          loading: false,
          successful: true,
        });
        // Mostrar mensaje de éxito y redirigir
        swal("El producto ha sido actualizado correctamente.", {
          icon: "success",
        }).then(() => {
          // Redirigir al usuario a la vista de productos
          this.props.history.push("/product");
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
          successful: false,
        });
      });
  }
};
  render() {
    const { message } = this.props;
    var { user: currentUser } = this.props;
    if (!currentUser) {
      return <Redirect to="/login" />;
    }

    currentUser = parseJwt(currentUser.token);

    if (!currentUser.roles.includes("ROLE_ADMIN") || !vId(this.state.id)) {
      return <Redirect to="/product" />;
    }
    return (
      <div className="d-flex justify-content-center">
        <div className="col-md-4 shadow-lg rounded p-4">
          <Form className="modal-content modal-dialog card" onSubmit={this.Submit} ref={(c) => { this.form = c; }}>
            <div className="modal-header justify-content-center p-4">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Editar producto</h1>
              <FcEditImage  size={40}/>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="nombre">Nombre</label>
                <Input type="text" className="form-control" name="nombre" value={this.state.nombre} onChange={this.onChangeNombre} />
              </div>
              <div className="form-group mt-2">
                <label htmlFor="precio">Precio</label>
                <Input type="number" className="form-control" name="precio" value={this.state.precio} onChange={this.onChangePrecio} />
              </div>
            </div>
            {message && (
              <div className="form-group mt-2">
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
            <div className="modal-footer d-flex justify-content-between py-4">
              <Link to={"/product"} className="btn btn-secondary">Regresar </Link>
              <button className="btn btn-success" type="submit" disabled={this.state.loading} >
                {this.state.loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Actualizar</span>
              </button>
            </div>
            <CheckButton style={{ display: "none" }} ref={(c) => { this.checkBtn = c; }} />
          </Form>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { message } = state.message;
  const { user } = state.auth;
  return { user, message };
}

export default connect(mapStateToProps)(EditProduct);
