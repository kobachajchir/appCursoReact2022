import { PersonCircle } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

export default function UserWidget() {
  return (
    <Link
      to={"/user"}
      className="navItemLogo"
      style={{ display: "flex", alignItems: "center" }}
    >
      <PersonCircle />
    </Link>
  );
}
