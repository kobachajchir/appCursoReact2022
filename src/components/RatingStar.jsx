import { StarFill } from "react-bootstrap-icons";

export default function RatingStar(props) {
  return (
    <div className="d-flex flex-row align-items-center text-center justify-content-center">
      <StarFill color="#CD9D00" size={props.size}></StarFill>
      <p style={{ margin: 0, marginLeft: "5px", marginRight: "10px" }}>
        {props.rating}
      </p>
    </div>
  );
}
