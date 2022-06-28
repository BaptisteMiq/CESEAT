import axios from "axios";
import { Store } from 'react-notifications-component';

const api = async (method, data, params, successMessage, notification = false) => {
    
    var token = localStorage.getItem('Token');
    var response = await axios({
        method: method,
        url: `http://${process.env.NEXT_PUBLIC_MDW_HOST}:${process.env.NEXT_PUBLIC_MDW_PORT}/graphql`,
        params: params,
        data: data,
        headers: {
            'Content-Type': 'application/json',
            withCredentials: true,
            Authorization: token
        }
    })
    .then(res => {
        if(res.data) {
            if(res.data.data) {
                if((res.data.errors === null || res.data.errors === undefined) && notification) {
                    Store.addNotification({
                        title: "Succès",
                        message: successMessage,
                        type: "success",
                        container: "bottom-right",
                        animationIn: ["animate__animated", "animate__fadeIn"],
                        animationOut: ["animate__animated", "animate__fadeOut"],
                        dismiss: {
                          duration: 10000,
                          onScreen: true
                        }
                      });
                } else if (res.data.errors && notification) {
                    res.data.errors.map(error => {
                        Store.addNotification({
                            title: "Erreur",
                            message: error.message,
                            type: "danger",
                            container: "bottom-right",
                            animationIn: ["animate__animated", "animate__fadeIn"],
                            animationOut: ["animate__animated", "animate__fadeOut"],
                            dismiss: {
                              duration: 10000,
                              onScreen: true
                            }
                        });
                    });
                }
            }
            return res.data;
        }
    })
    .catch(err => {
        if(err.response) {
            if(err.response.data.error && notification) {
                Store.addNotification({
                    title: "Erreur",
                    message: err.response.data.error,
                    type: "danger",
                    container: "bottom-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 10000,
                      onScreen: true
                    }
                });
            }
        } else {
            if(notification) {
                Store.addNotification({
                    title: "Erreur",
                    message: "Impossible de se connecter à l'API",
                    type: "danger",
                    container: "bottom-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 10000,
                      onScreen: true
                    }
                });
            }
        }
    })

    return response;
};

export default api;
