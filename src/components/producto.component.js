import React, { Component } from "react";
import ProductService from "../services/product.service";
import EventBus from "../common/EventBus";
import { Redirect, Link } from "react-router-dom";
import { connect } from "react-redux";
import { parseJwt } from "../common/auth-verify";
import swal from "sweetalert";
import { deleteProduct, addProduct } from "../actions/product"; 

import Modal from 'react-modal';
import Input from "react-validation/build/input";
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";
import { BsDatabaseFillAdd } from "react-icons/bs";


const required = (value) => {
  if (!value) {
    return ( 
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const vPrecio = (value) => {
  const parsedValue = parseFloat(value);

  if (isNaN(parsedValue) || parsedValue <= 0) {
    return (
      <div className="alert alert-danger" role="alert">
        El precio debe ser un número válido y mayor que cero.
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


class Product extends Component {
  constructor(props) {
    super(props);
    this.state = { 
       content: "undefined",
       data: [], 
       modalIsOpen: false,
       nombre: "",
       precio: 0,
       loading: false,
       successful: false,
       };
  }

  componentDidMount() {
    ProductService.getProducts().then(
      (response) => {
        this.setState({ content: response.data.message });
        this.setState({ data: response.data });
      },
      (error) => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString(),
        });
        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }

  handleEliminar = (id) => {
    swal({
      title: "¿Estás seguro?",
      text: `¿Quieres eliminar el producto ${id}?`,
      icon: "warning",
      buttons: ["Cancelar", "Eliminar"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.props
          .dispatch(deleteProduct(id))
          .then(() => {
            this.setState({
              successful: true,
            });
            this.setState({
              data: this.state.data.filter((p) => p.id !== id),
            });
            swal("El producto ha sido eliminado.", {
              icon: "success",
            });
          })
          .catch(() => {
            this.setState({
              successful: false,
            });
            swal("Error al eliminar el producto.", {
              icon: "error",
            });
          });
      } else {
        swal("El producto no ha sido eliminado.");
      }
    });
  };

  //agregar

  openModal = () => {
    this.setState({ modalIsOpen: true });
  };
  
  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };

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
         .dispatch(addProduct(this.state.nombre, this.state.precio))
         .then(() => {
           this.setState({
             loading: false,
             successful: true,
           });
           // Aquí actualizamos la lista de productos
           ProductService.getProducts().then(
             (response) => {
               this.setState({ data: response.data });
               // Resetear los campos del formulario
               this.setState({
                 nombre: "",
                 precio: 0,
               });
               // Mostrar mensaje de éxito con SweetAlert
               swal("El producto ha sido agregado correctamente.", {
                 icon: "success",
               }).then(() => {
                 // Cerrar el modal después de que el usuario cierre el SweetAlert
                 this.closeModal();
               });
             },
             (error) => {
               this.setState({
                 loading: false,
                 successful: false,
               });
               // Manejar error al actualizar la lista de productos
               console.error("Error al actualizar la lista de productos:", error);
             }
           );
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

    return (
      <div className="card bg-light text-dark p-4">
        <h2>Lista de productos</h2>
        {currentUser.roles.includes("ROLE_ADMIN") && (
          <div className="p-2 mb-2">
            <button onClick={this.openModal} className="btn btn-success">Agregar productos</button>
          </div>
        )}
     {/* {this.state.successful && (
        <div className="alert alert-success" role="alert">
          El producto ha sido agregado correctamente.
        </div>
      )}*/ }
    <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal} contentLabel="Agregar Producto">
      <div className="d-flex justify-content-center">
        <div className="col-md-4 shadow-lg rounded p-4 ">
          <Form className="modal-content modal-dialog card" onSubmit={this.Submit} ref={(c) => {this.form = c;}}>
            <div className="modal-header justify-content-center p-4">
              <h1 className="modal-title fs-5" id="exampleModalLabel"> Nuevo producto </h1>
              <BsDatabaseFillAdd size={40}/>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="nombre">Nombre</label>
                <Input type="text" className="form-control" name="nombre" value={this.state.nombre} onChange={this.onChangeNombre}
                  validations={[required, vNombre]} />
              </div> 
              <div className="form-group mt-2" >
                <label htmlFor="precio"> Precio </label>
                <Input type="number" className="form-control" name="precio" value={this.state.precio} onChange={this.onChangePrecio}
                  validations={[required, vPrecio]} />
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
            <button type="button" className="btn btn-primary" onClick={this.closeModal}>
              Cerrar
            </button>
              <button className="btn btn-success" type="submit" disabled={this.state.loading}>
                {this.state.loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Agregar</span>
              </button>
            </div>
            <CheckButton style={{ display: "none" }} ref={(c) => { this.checkBtn = c; }} />
          </Form>
        </div>
      </div>
    </Modal>
   
        {this.state.data.length !== 0 ? (
          
          <table className="table table-striped" style={{width:'70%'}} >
            <thead className="table-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Nombre</th>
                <th scope="col">Precio</th>
                {currentUser.roles.includes("ROLE_ADMIN") && (
                  <th scope="col">Opciones</th>
                )}
              </tr>
            </thead>
            <tbody>
              {this.state.data.map((product) => (
                <tr className="table-active" key={product.id}>
                  <th scope="row">{product.id}</th>
                  <td>{product.nombre}</td>
                  <td>$ {product.precio}</td>
                  {currentUser.roles.includes("ROLE_ADMIN") && (
                    <td className="w-25">
                      <div className="btn-group" role="group" aria-label="Basic example">
                        <Link to={"/editProduct/" + product.id} className="btn btn-info" style={{margin:'3px'}}  >Editar</Link>
                        <button onClick={() => this.handleEliminar(product.id)} type="button" className="btn btn-danger" style={{margin:'3px'}}>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          
        ) : (
          <h5>Aun no hay productos registrados!</h5>
        )}

        {this.state.content && (
          <div className="form-group">
            <div className="alert alert-primary" role="alert">
              {this.state.content}
            </div>
          </div>
        )}
      </div>
    );


  }
}

function mapstateToProps(state) {
  const { user } = state.auth;
  return {
    user,
  };
}

export default connect(mapstateToProps)(Product);
