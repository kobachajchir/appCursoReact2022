import { useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Row, Image } from "react-bootstrap";
import { GeneralCompany } from "../App";
import { useMediaQuery } from "react-responsive";
import { ArrowLeft, PlusLg } from "react-bootstrap-icons";

const EditProductPanel = ({ product, productChange, onClose }) => {
  const [code, setCode] = useState(product.code);
  const [price, setPrice] = useState(product.price);
  const [stock, setStock] = useState(product.stock);
  const [title, setTitle] = useState(product.title);
  const [shortdescription, setDescriptionShort] = useState(product.description);
  const [longdescription, setDescriptionLong] = useState(
    product.detailedDescription
  );
  const [category, setCategory] = useState(product.category);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // new state for the selected image index
  const { productCategories: categories } = useContext(GeneralCompany);
  const [isModified, setIsModified] = useState(false); // new state for checking if any change has been made
  const [imageUrls, setImageUrls] = useState(
    product.picture.map((imagePath) => new URL(imagePath, import.meta.url).href)
  );

  const isLg = useMediaQuery({ query: "(max-width: 992px)" }); // xs: screens less than 576px wide

  const handleUpdate = () => {
    const { id, ...restOfProduct } = product; // removing id attribute
    const updatedProduct = {
      ...restOfProduct,
      code,
      price,
      stock,
      title,
      description: shortdescription, // changed to description
      detailedDescription: longdescription, // changed to detailedDescription
      category,
      picture: [
        imageUrls[selectedImageIndex],
        ...imageUrls.filter((_, index) => index !== selectedImageIndex),
      ],
    };
    productChange(updatedProduct, id);
  };

  const handleSelect = (selectedIndex, e) => {
    setSelectedImageIndex(selectedIndex); // update the selected image index state with the clicked image index
  };

  const handleReset = () => {
    setCode(product.code);
    setPrice(product.price);
    setStock(product.stock);
    setTitle(product.title);
    setDescriptionShort(product.description);
    setDescriptionLong(product.detailedDescription);
    setCategory(product.category);
    setSelectedImageIndex(0);
  };

  const uploadImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrls((oldUrls) => [...oldUrls, reader.result]);
      };
      reader.readAsDataURL(file);
    }
  };

  const longDescriptionRef = useRef(null); // create a ref

  const autoResize = () => {
    const element = longDescriptionRef.current;
    element.style.height = "inherit"; // Reset the height
    element.style.height = `${element.scrollHeight}px`; // Set it to the scroll height
  };

  // Using useEffect to monitor any changes in the product state
  useEffect(() => {
    setIsModified(
      product.code !== code ||
        product.price !== price ||
        product.stock !== stock ||
        product.title !== title ||
        product.description !== shortdescription ||
        product.detailedDescription !== longdescription ||
        product.category !== category ||
        product.picture[0] !== imageUrls[selectedImageIndex] // check if the selected image has been changed
    );
  }, [
    product,
    code,
    price,
    stock,
    title,
    shortdescription,
    longdescription,
    category,
    selectedImageIndex,
    imageUrls,
  ]);
  useEffect(() => {
    autoResize();
  }, [longdescription]);
  const inputStyles = {
    color: "var(--bs-body-color)",
    backgroundColor: "var(--bs-secondary-bg)",
    borderRadius: "var(--bs-border-radius)",
    border: "none",
    fontSize: "1.25rem",
    padding: "5px",
    marginLeft: "10px",
  };
  return (
    <>
      <Row className="d-flex justify-content-center align-items-center flex-row text-center">
        <Col xs="auto">
          <Button variant="danger" onClick={onClose}>
            <ArrowLeft
              className="d-flex justify-content-center align-items-center flex-row text-center"
              size={25}
            ></ArrowLeft>
          </Button>
        </Col>
        <Col xs="auto">
          <h2>{title}</h2>
        </Col>
      </Row>
      <Row className="d-flex justify-content-center align-items-center flex-row text-center">
        <Col xs={12}>
          <h4>Foto por defecto:</h4>
        </Col>
        <Col
          xs={10}
          lg={2}
          className={`diferentImages d-flex justify-content-center ${
            isLg ? "" : ""
          }`}
          style={{ marginBottom: isLg ? "25px" : "" }}
        >
          {imageUrls.map((imageUrl, imageIndex) => (
            <Image
              key={imageIndex}
              src={imageUrl}
              onClick={() => handleSelect(imageIndex)}
              thumbnail
              style={{
                width: isLg ? "100px" : "auto",
                height: "auto",
                border:
                  selectedImageIndex === imageIndex
                    ? "var(--bs-emphasis-color) 2px solid"
                    : "none",
              }}
            />
          ))}
          <input
            type="file"
            accept="image/*"
            onChange={uploadImage}
            style={{ display: "none" }}
            id="fileInput"
          />
          <Button
            variant="outline-secondary"
            style={{
              width: "100px",
              height: isLg ? "100px" : "auto",
              border: "none",
              color: "var(--bs-emphasis-color)",
            }}
            onClick={() => document.getElementById("fileInput").click()}
          >
            <PlusLg></PlusLg>
          </Button>
        </Col>
      </Row>
      <Col xs={12} lg={"auto"} style={{ marginTop: "15px" }}>
        <h5>Code: </h5>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={inputStyles}
        />
        <h5>Price: </h5>
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={inputStyles}
        />
      </Col>
      <Col xs={12} lg={"auto"} style={{ marginTop: "15px" }}>
        <h5>Stock: </h5>
        <input
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          style={inputStyles}
        />
        <h5>Title: </h5>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyles}
        />
      </Col>
      <Col xs={12} lg={"auto"} style={{ marginTop: "15px" }}>
        <h5>Descripcion corta:</h5>
        <textarea
          value={shortdescription}
          onChange={(e) => setDescriptionShort(e.target.value)}
          style={inputStyles}
        />
      </Col>
      <Col xs={12} style={{ marginTop: "15px" }}>
        <h5>Descripcion larga:</h5>
        <textarea
          value={longdescription}
          onChange={(e) => {
            setDescriptionLong(e.target.value);
            autoResize(e);
          }}
          style={{
            ...inputStyles,
            minHeight: "50px", // Set a minimum height
            overflow: "hidden", // Hide the scroll bar
            width: "80%", // Set width to 100%
          }}
          ref={longDescriptionRef}
        />
      </Col>
      <Col xs={12} lg={"auto"} style={{ marginTop: "15px" }}>
        <h5>Category: </h5>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={inputStyles}
        >
          {categories.map((categoryItem) =>
            !categoryItem.subcategories ? (
              <option key={categoryItem.id} value={categoryItem.id}>
                {categoryItem.name}
              </option>
            ) : (
              <>
                <option disabled>──────────</option>
                <option
                  key={categoryItem.id}
                  disabled
                  style={{ fontWeight: "bold" }}
                >
                  {categoryItem.name}
                </option>
                {categoryItem.subcategories.map((subcategory) => (
                  <option key={subcategory.code} value={subcategory.code}>
                    {subcategory.name}
                  </option>
                ))}
              </>
            )
          )}
        </select>
      </Col>
      <Row className="justify-content-evenly mt-3">
        <Col xs="auto">
          <Button onClick={handleReset}>Restablecer</Button>
        </Col>
        <Col xs="auto">
          <Button disabled={!isModified} onClick={handleUpdate}>
            Guardar
          </Button>{" "}
          {/* disable the button when no change is made */}
        </Col>
      </Row>
    </>
  );
};

export default EditProductPanel;
