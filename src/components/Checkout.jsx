import { Check } from "react-bootstrap-icons";

export default function CheckOut({ onClick }) {
  return (
    <button className="btn btn-success" onClick={onClick}>
      <Check size={20} className="align-self-center" />
      Terminar mi compra
    </button>
  );
}
