import React, { useEffect, useState } from "react";

function ShowItemFlipCard({ product, size }) {
  const [isFlipped, setFlipped] = useState(false);
  useEffect(() => {
    console.log(product);
  }, []);
  const commonStyles = {
    backgroundColor: "var(--bs-dark-bg-subtle)",
    color: "var(--bs-body-color)",
    borderRadius: "var(--bs-border-radius)",
    width: size,
    height: size,
    position: "absolute",
    backfaceVisibility: "hidden",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    transition: "transform 1s",
    boxSizing: "border-box",
  };

  const frontStyles = {
    ...commonStyles,
    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
  };

  const backStyles = {
    ...commonStyles,
    transform: isFlipped ? "rotateY(0deg)" : "rotateY(180deg)",
  };

  const imageStyle = {
    objectFit: "contain",
    height: "auto",
    width: "100%",
  };

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
      }}
      onClick={() => setFlipped(!isFlipped)}
    >
      <div style={{ ...frontStyles }}>
        <img src={product.picture[0]} alt={product.title} style={imageStyle} />
        <h2 style={{ color: "var(--bs-body-color)" }}>{product.title}</h2>
      </div>
      <div style={backStyles}>
        <h4>{product.description}</h4>
        <p>{product.detailedDescription}</p>
      </div>
    </div>
  );
}

export default ShowItemFlipCard;
