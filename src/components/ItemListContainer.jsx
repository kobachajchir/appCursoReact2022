import { Col, Row } from "react-bootstrap";
import ItemCount from "./ItemCount";

export default function ItemListContainer(props) {
  const handleOnAdd = (count) => {
    console.log(count);
  };

  return (
    <>
      <Row>
        <Col>
          <h1>{props.greeting}</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <ItemCount stock={5} initial={1} onAdd={handleOnAdd} />
        </Col>
      </Row>
    </>
  );
}
