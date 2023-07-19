import { useEffect } from "react";
import "./../styles/ItemFilter.css";
import { Col, Row } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";

export default function ItemFilter(props) {
  const isLg = useMediaQuery({ query: "(max-width: 992px)" });
  return (
    <Row
      className="d-flex flex-row align-items-center justify-content-center text-center filterControls themeTerciaryBgColor"
      style={{ marginBottom: isLg ? "80px" : 0 }}
    >
      <Col
        xs={12}
        lg={"auto"}
        style={{
          padding: 0,
          paddingLeft: "15px",
          paddingTop: isLg ? "10px" : 0,
          marginBottom: isLg ? "-15px" : 0,
        }}
        className="d-flex flex-row justify-content-center"
      >
        <input
          type="checkbox"
          id="enableFilters"
          checked={props.itemFilter.criteria !== "none"}
          onChange={(e) => {
            if (e.target.checked) {
              // Checkbox is checked: enable first filter
              props.setFilter({
                criteria: props.filters[0],
                order: "desc",
              });
            } else {
              // Checkbox is unchecked: disable all filters
              props.setFilter({
                criteria: "none",
                order: "desc",
              });
            }
          }}
        />
        <h5 style={{ margin: "0 10px" }}>Filtros</h5>
      </Col>
      <Col
        xs={12}
        lg={"auto"}
        style={{ padding: 0 }}
        className={`d-flex flex-row justify-content-center filterRadios${
          props.itemFilter.criteria === "none" ? " disabledFilters" : ""
        }`}
      >
        {props.filters.map((filter, index) => (
          <div key={index} className="filterDiv">
            <input
              type="radio"
              id={filter}
              name="filter"
              value={filter}
              className="radioInputFilter"
              checked={props.itemFilter.criteria === filter}
              onChange={() => {
                if (props.itemFilter.criteria === filter) {
                  props.setFilter({
                    criteria: filter,
                    order: props.itemFilter.order === "desc" ? "asc" : "desc",
                  });
                } else {
                  props.setFilter({
                    criteria: filter,
                    order: "desc",
                  });
                }
              }}
              disabled={props.itemFilter.criteria === "none"}
            />
            <label
              htmlFor={filter}
              disabled={props.itemFilter.criteria === "none"}
              className={`radioInputFilter filterButton themeEmphasisColor${
                props.itemFilter.criteria === filter ? " activeFilter" : ""
              }`}
            >
              {props.itemFilter.criteria === filter
                ? props.itemFilter.order === "desc"
                  ? filter + " (Desc)"
                  : filter + " (Asc)"
                : filter}
            </label>
          </div>
        ))}
      </Col>
      <Col xs={12} lg={"auto"} style={{ padding: 0 }}>
        <button
          className="changeFilterOrdenBtn"
          disabled={props.itemFilter.criteria === "none"}
          style={
            !isLg
              ? {
                  borderTopRightRadius: "15px",
                  borderBottomRightRadius: "15px",
                }
              : {
                  borderRadius: "15px",
                  width: "100%",
                }
          }
          onClick={() => {
            props.setFilter({
              criteria: props.itemFilter.criteria,
              order: props.itemFilter.order === "desc" ? "asc" : "desc",
            });
          }}
        >
          {props.itemFilter.order === "desc"
            ? "Cambiar a orden ascendente"
            : "Cambiar a orden descendente"}
        </button>
      </Col>
    </Row>
  );
}
