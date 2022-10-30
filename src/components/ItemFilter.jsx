export default function ItemFilter({ filter, setFilter }) {
  return (
    <div>
      <button
        onClick={() => setFilter("Starred")}
        className={`filterButton ${filter === "Starred" ? "activeFilter" : ""}`}
      >
        Starred
      </button>
      <button
        onClick={() => setFilter("New")}
        className={`filterButton ${filter === "New" ? "activeFilter" : ""}`}
      >
        New
      </button>
      <button
        onClick={() => setFilter("BestSelling")}
        className={`filterButton ${
          filter === "BestSelling" ? "activeFilter" : ""
        }`}
      >
        Best Selling
      </button>
    </div>
  );
}
