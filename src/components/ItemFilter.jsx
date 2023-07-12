import { useEffect } from "react";

export default function ItemFilter(props) {
  useEffect(() => {
    console.log(props);
  }, []);
  return (
    <div>
      {props.filters.map((filter, index) => (
        <button
          key={index}
          onClick={() => {
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
          className={`filterButton ${
            props.itemFilter.criteria === filter ? "activeFilter" : ""
          }`}
        >
          {props.itemFilter.criteria === filter
            ? props.itemFilter.order === "desc"
              ? filter + " (Desc)"
              : filter + " (Asc)"
            : filter}
        </button>
      ))}
    </div>
  );
}
