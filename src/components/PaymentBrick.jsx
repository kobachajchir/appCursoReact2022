import React, { useEffect, useState } from "react";

const PaymentBrickComponent = () => {
  const onSubmit = async ({ selectedPaymentMethod, formData }) => {
    // callback llamado al hacer clic en el botón enviar datos
    return new Promise((resolve, reject) => {
      fetch(
        "http://127.0.0.1:5001/pachacreaciones3d/us-central1/createPaymentPreference",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      )
        .then((response) => response.json())
        .then((response) => {
          // recibir el resultado del pago
          resolve();
        })
        .catch((error) => {
          // manejar la respuesta de error al intentar crear el pago
          reject();
        });
    });
  };
  const onError = async (error) => {
    // callback llamado para todos los casos de error de Brick
    console.log(error);
  };
  const onReady = async () => {
    /*
    Callback llamado cuando el Brick está listo.
    Aquí puede ocultar cargamentos de su sitio, por ejemplo.
  */
  };
};

export default PaymentBrickComponent;
