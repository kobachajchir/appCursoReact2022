import { useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import { X } from "react-bootstrap-icons";
import formatDateAndTime from "../tools/formatDate";

function OrderDetailPanel({ order, onClose }) {
  const handleViewOnMap = () => {
    let lat, long;
    Object.entries(order.shipping.address.mapLocation).map((entry) => {
      if (entry[0] === "_lat") {
        lat = entry[1];
      } else if (entry[0] === "_long") {
        long = entry[1];
      }
    });
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${lat},${long}`,
      "_blank"
    );
  };

  return (
    <div
      style={{
        backgroundColor: "var(--bs-light-bg-subtle)",
        border: "none",
        color: "var(--bs-secondary-text-emphasis)",
        padding: "25px",
        borderRadius: "var(--bs-border-radius)",
      }}
    >
      <div
        className="d-flex flex-row justify-content-center"
        style={{ marginBottom: "10px" }}
      >
        <Button
          onClick={onClose}
          variant="danger"
          className="d-flex align-items-center"
          style={{ padding: "5px" }}
        >
          <X size={25}></X>
        </Button>

        <h2 style={{ marginLeft: "25px" }}>Detalles de venta</h2>
      </div>

      <h3>Fecha de compra</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              style={{
                verticalAlign: "middle",
              }}
            >
              {formatDateAndTime(order.date)}
            </td>
          </tr>
        </tbody>
      </Table>
      <h3>Datos de comprador</h3>
      <Table striped bordered hover>
        <tbody>
          <tr>
            <td
              style={{
                verticalAlign: "middle",
              }}
            >
              <strong>Nombre de usuario</strong>
            </td>
            <td
              style={{
                verticalAlign: "middle",
              }}
            >
              {order.buyer.username}
            </td>
          </tr>
          <tr>
            <td
              style={{
                verticalAlign: "middle",
              }}
            >
              <strong>Telefono</strong>
            </td>
            <td
              style={{
                verticalAlign: "middle",
              }}
            >
              {order.buyer.userPhone}
            </td>
          </tr>
        </tbody>
      </Table>
      <h3>Detalle de compra</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Codigo</th>
            <th>Descripcion</th>
            <th>Cantidad</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, index) => (
            <tr key={index}>
              <td
                style={{
                  verticalAlign: "middle",
                }}
              >
                {item.code}
              </td>
              <td
                style={{
                  verticalAlign: "middle",
                }}
              >
                {item.description}
              </td>
              <td
                style={{
                  verticalAlign: "middle",
                }}
              >
                {item.amount}
              </td>
              <td
                style={{
                  verticalAlign: "middle",
                }}
              >
                ${item.price}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <h3>Detalles de pago</h3>
      <Table striped bordered hover>
        <tbody>
          <tr>
            <td
              style={{
                verticalAlign: "middle",
              }}
            >
              <strong>Tipo de pago</strong>
            </td>
            <td
              style={{
                verticalAlign: "middle",
              }}
            >
              {order.payment.card ? "Card" : "Cash"}
            </td>
          </tr>
          {order.payment.card && (
            <>
              <tr>
                <td
                  style={{
                    verticalAlign: "middle",
                  }}
                >
                  <strong>Nombre en tarjeta</strong>
                </td>
                <td
                  style={{
                    verticalAlign: "middle",
                  }}
                >
                  {order.payment.cardInfo.cardOwner}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    verticalAlign: "middle",
                  }}
                >
                  <strong>Cuotas</strong>
                </td>
                <td
                  style={{
                    verticalAlign: "middle",
                  }}
                >
                  {order.payment.cardInfo.dues}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    verticalAlign: "middle",
                  }}
                >
                  <strong>Precio por cuota</strong>
                </td>
                <td
                  style={{
                    verticalAlign: "middle",
                  }}
                >
                  ${order.payment.cardInfo.dueAmount}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    verticalAlign: "middle",
                  }}
                >
                  <strong>Fecha de vencimiento</strong>
                </td>
                <td
                  style={{
                    verticalAlign: "middle",
                  }}
                >{`${order.payment.cardInfo.expirationDate.month}/${order.payment.cardInfo.expirationDate.year}`}</td>
              </tr>
              <tr>
                <td
                  style={{
                    verticalAlign: "middle",
                  }}
                >
                  <strong>Ultimos numeros</strong>
                </td>
                <td
                  style={{
                    verticalAlign: "middle",
                  }}
                >
                  {order.payment.cardInfo.lastDigits}
                </td>
              </tr>
            </>
          )}
          <tr>
            <td
              style={{
                verticalAlign: "middle",
              }}
            >
              <strong>Total</strong>
            </td>
            <td
              style={{
                verticalAlign: "middle",
              }}
            >
              ${order.total}
            </td>
          </tr>
        </tbody>
      </Table>
      <h3>Datos de envio</h3>
      <Table striped bordered hover>
        <tbody>
          <tr>
            <td
              style={{
                verticalAlign: "middle",
              }}
            >
              <strong>Direccion</strong>
            </td>
            <td
              style={{
                verticalAlign: "middle",
              }}
            >
              {`Apartment: ${order.shipping.address.apartment}, Floor: ${order.shipping.address.floor}, ${order.shipping.address.street} ${order.shipping.address.houseNumber}`}
            </td>
          </tr>
          <tr>
            <td
              style={{
                verticalAlign: "middle",
              }}
            >
              <strong>Ciudad, Provincia, Pais</strong>
            </td>
            <td
              style={{
                verticalAlign: "middle",
              }}
            >{`${order.shipping.address.city}, ${order.shipping.address.state}, ${order.shipping.address.country}`}</td>
          </tr>
          <tr>
            <td
              style={{
                verticalAlign: "middle",
              }}
            >
              <strong>Codigo Postal</strong>
            </td>
            <td
              style={{
                verticalAlign: "middle",
              }}
            >
              {order.shipping.address.postalCode}
            </td>
          </tr>
          <tr>
            <td
              style={{
                verticalAlign: "middle",
              }}
            >
              <strong>Coordenadas</strong>
            </td>
            <td
              style={{
                verticalAlign: "middle",
              }}
            >
              {Object.entries(order.shipping.address.mapLocation)
                .map(
                  (entry, index) =>
                    `${parseFloat(entry[1]).toFixed(3)}${
                      index === 0 ? "° S" : "° W"
                    }`
                )
                .join(", ")}
              <button
                style={{
                  backgroundColor: "var(--bs-dark-bg-subtle)",
                  border: "none",
                  color: "var(--bs-secondary-text-emphasis)",
                  marginLeft: "10px",
                }}
                onClick={handleViewOnMap}
              >
                Ver en mapa
              </button>
            </td>
          </tr>

          <tr>
            <td
              style={{
                verticalAlign: "middle",
              }}
            >
              <strong>Enviado</strong>
            </td>
            <td
              style={{
                verticalAlign: "middle",
              }}
            >
              <input
                type="checkbox"
                checked={order.shipping.isShipped}
                readOnly
              />
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}

export default OrderDetailPanel;
