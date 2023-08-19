import { Check } from "react-bootstrap-icons";

export default function CheckOut({ onClick, disabled = false }) {
  return (
    <button className="btn btn-success" onClick={onClick} disabled={disabled}>
      <Check size={20} className="align-self-center" />
      Terminar mi compra
    </button>
  );
}
