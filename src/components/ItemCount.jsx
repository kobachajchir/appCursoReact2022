import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { DashLg, PlusLg } from "react-bootstrap-icons";

export default function ItemCount({ stock, initial, onAdd }) {
  const [count, setCount] = useState(initial);
  const iconSize = 20;
  const add = () => {
    if (count < stock) {
      setCount(count + 1);
    }
  };

  const remove = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  return (
    <>
      <Col className="itemCount d-flex justify-content-center" xs={12}>
        <button onClick={remove}>
          <DashLg size={iconSize} />
        </button>
        <p
          style={{ paddingLeft: 25, paddingRight: 25, marginBottom: 0 }}
          className="itemCount d-flex align-self-center"
          xs={12}
        >
          {count}
        </p>
        <button onClick={add}>
          <PlusLg size={iconSize} />
        </button>
      </Col>
      <Col
        className="itemCount d-flex justify-content-center"
        xs={12}
        style={{ marginTop: 10 }}
      >
        <button onClick={() => onAdd(count)}>Add to cart</button>
      </Col>
    </>
  );
}
