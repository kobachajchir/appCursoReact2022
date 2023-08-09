import { useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Row, Image } from "react-bootstrap";
import { GeneralCompany } from "../App";
import { useMediaQuery } from "react-responsive";
import { ArrowLeft, PlusLg } from "react-bootstrap-icons";
import {
  getDownloadURL,
  getStorage,
  list,
  ref,
  uploadString,
} from "firebase/storage";
import LoadingComponent from "./LoadingComponent";

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
  const [pictures, setPictures] = useState([]);
  const [pictureAmount, setPictureAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const fileInput = useRef();
  async function fetchProductImages() {
    const storage = getStorage();

    // Construct the path to the directory in Firebase Storage
    const dirPath = `appData/productImages/${product.code}`;

    // Create a reference to the directory
    const dirRef = ref(storage, dirPath);

    // List files in the directory and limit results to 5
    let urls = [];
    let amount = 0;
    try {
      const listResults = await list(dirRef, { maxResults: 5 });
      amount = listResults.items.length;
      for (let i = 0; i < listResults.items.length; i++) {
        const url = await getDownloadURL(listResults.items[i]);
        urls.push(url);
      }
    } catch (error) {
      console.error("Error listing files in directory:", error);
    }

    return [urls, amount];
  }

  useEffect(() => {
    console.log(pictureAmount);
  }, [pictureAmount]);

  useEffect(() => {
    if (loading) {
      fetchProductImages().then(([pictureUrls, amount]) => {
        setPictures(pictureUrls);
        setPictureAmount(amount);
        setLoading(false);
      });
    }
  }, [loading]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file);
    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        console.log("FileReader is done reading the file.");
        const img = new window.Image();

        img.onload = () => {
          console.log("Image is loaded.");
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          canvas.width = img.width;
          canvas.height = img.height;

          ctx.drawImage(img, 0, 0);

          const dataUrl = canvas.toDataURL("image/jpeg");
          console.log("Data URL is created:", dataUrl);

          const storage = getStorage();
          const storageRef = ref(
            storage,
            `appData/productImages/${product.code}/${product.code}_${
              pictureAmount + 1
            }.jpg`
          );

          uploadString(storageRef, dataUrl, "data_url")
            .then((snapshot) => {
              console.log("Image is uploaded:", snapshot);
              return getDownloadURL(storageRef);
            })
            .then((downloadURL) => {
              console.log("Download URL is obtained:", downloadURL);
              // Set loading to true to show the loading component
              setLoading(true);
              // Refetch image
            })
            .catch((error) => {
              console.error("Error occurred during the upload process:", error);
            });
        };

        img.src = event.target.result;
      };

      reader.readAsDataURL(file);
    } else {
      console.log("No file selected.");
    }
  };

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
        product.category !== category
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
    pictures,
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
          <h4>Imagenes del producto</h4>
        </Col>
        <Col
          xs={10}
          lg={2}
          className={`diferentImages d-flex justify-content-center ${
            isLg ? "" : ""
          }`}
          style={{
            position: "relative",
            height: "100px",
            marginBottom: isLg ? "25px" : "",
          }}
        >
          {loading ? (
            <LoadingComponent
              style={{
                width: isLg ? "100px" : "auto",
                maxHeight: "100px",
              }}
            />
          ) : (
            pictures.map((imageUrl, imageIndex) => (
              <Image
                key={imageIndex}
                src={imageUrl}
                onClick={() => handleSelect(imageIndex)}
                thumbnail
                style={{
                  width: "100px",
                  height: "100%",
                  border:
                    selectedImageIndex === imageIndex
                      ? "var(--bs-emphasis-color) 2px solid"
                      : "none",
                }}
              />
            ))
          )}
          <input
            type="file"
            ref={fileInput}
            style={{ display: "none" }}
            accept=".jpg,.jpeg,.png"
            onChange={handleFileChange}
          />
        </Col>
        <Col
          xs={12}
          className="d-flex justify-content-center align-items-center flex-row text-center"
          as={Row}
        >
          <Col>
            <Button
              variant="primary"
              style={{
                border: "none",
                color: "var(--bs-emphasis-color)",
              }}
              disabled={pictureAmount >= 5}
              onClick={() => {
                if (pictureAmount < 5) {
                  fileInput.current.click();
                }
              }}
            >
              Agregar imagen
            </Button>
          </Col>
          <Col>
            <Button
              variant="danger"
              style={{
                border: "none",
                color: "var(--bs-emphasis-color)",
              }}
              disabled={pictureAmount <= 0}
              onClick={() => {
                if (pictureAmount < 0) {
                  //deleteimage
                }
              }}
            >
              Borrar seleccionada
            </Button>
          </Col>
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
