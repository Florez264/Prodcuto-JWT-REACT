import {
  DELETE_SUCCESS,
  DELETE_FAIL,
  ADD_SUCCESS,
  ADD_FAIL,
  UPDATE_SUCCESS,
  UPDATE_FAIL,
  LOGOUT,
  SET_MESSAGE,
} from "./types";

import ProductService from "../services/product.service";

export const deleteProduct = (id) => (dispatch) => {
  return ProductService.deleteProduct(id).then(
    (response) => {
      dispatch({
        type: DELETE_SUCCESS,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: response.data.mensaje,
      });
      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.mensaje) ||
        error.message ||
        error.tostring();

      dispatch({
        type: DELETE_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};

export const addProduct = (nombre, precio) => (dispatch) => {
  return ProductService.addProduct(nombre, precio).then(
    (response) => {
      dispatch({
        type: ADD_SUCCESS,
      });
      dispatch({
        type: SET_MESSAGE,
        payload: response.data.mensaje,
      });
      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.mensaje) ||
        error.message ||
        error.tostring();

      dispatch({
        type: ADD_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};
export const editProduct = (id, nombre, precio) => (dispatch) => {
  return ProductService.putProduct(id, nombre, precio).then(
    (response) => {
      dispatch({
        type: UPDATE_SUCCESS,
      });
      dispatch({
        type: SET_MESSAGE,
        payload: response.data.mensaje,
      });
      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.mensaje) ||
        error.message ||
        error.tostring();

      dispatch({
        type: UPDATE_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};
