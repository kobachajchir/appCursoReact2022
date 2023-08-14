import { useContext, useEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";
import { Button, Modal, Form } from "react-bootstrap";
import { GeneralCompany } from "../App";
import { getStorage } from "firebase/storage";
import LoadingComponent from "./LoadingComponent";
import { showNotification } from "./ToastNotification";
import { FileEarmarkArrowUpFill } from "react-bootstrap-icons";

export default function AddProductPanel() {
  const { productCategories: categories } = useContext(GeneralCompany);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInput = useRef();
  const [imagePreviews, setImagePreviews] = useState([]);
  const [rawImages, setRawImages] = useState([]); // For holding the raw image data for later upload
  const [newProduct, setNewProduct] = useState({
    code: "",
    title: "",
    picture: ["./../assets/images/testProduct.jpg"],
    category: "",
    description: "",
    detailedDescription: "",
    price: "",
    stock: "",
    amountSelled: 0,
    rating: 0,
    createdOn: serverTimestamp(),
  });

  const clearForm = () => {
    setNewProduct({
      ...initialState,
    });
    setImagePreviews([]);
    setRawImages([]);
  };

  const handleChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleSelectCategory = (e) => {
    setNewProduct({ ...newProduct, category: e.target.value });
    setSelectedCategory(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const confirmAddProduct = async () => {
    const db = getFirestore();

    // Handle image uploads
    const storage = getStorage();
    const uploadedImageURLs = [];

    for (let i = 0; i < rawImages.length; i++) {
      const storageRef = ref(
        storage,
        `appData/productImages/${newProduct.code}/${newProduct.code}_${
          i + 1
        }.jpg`
      );

      const snapshot = await uploadBytes(storageRef, rawImages[i]);
      const downloadURL = await getDownloadURL(storageRef);
      uploadedImageURLs.push(downloadURL);
    }

    // Modify the product's image URL list before uploading
    newProduct.picture = uploadedImageURLs;

    try {
      await addDoc(collection(db, "products"), newProduct);
    } catch (error) {
      console.error("Error adding product: ", error);
      return;
    }
    clearForm();
    setShowConfirmDialog(false);
  };

  const cancelAddProduct = () => {
    setShowConfirmDialog(false);
    clearForm();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      fileInput.current.value = null;
      showNotification(
        <FileEarmarkArrowUpFill />,
        "Demasiados elementos",
        "El maximo de fotos por producto es 5"
      );
      setPreviewImages([]);
      setRawImages([]);
      return;
    }
    setLoading(true);
    // Clear the previous previews and raw images
    let updatedPreviews = [];
    let updatedRawImages = [];

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new window.Image();

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          // Convert the image on the canvas to a JPG format.
          const jpegDataUrl = canvas.toDataURL("image/jpeg", 1); // 1 denotes maximum quality
          updatedPreviews.push(jpegDataUrl);

          // Convert the DataURL to a blob to be stored in rawImages
          fetch(jpegDataUrl)
            .then((res) => res.blob())
            .then((blob) => {
              updatedRawImages.push(
                new File(
                  [blob],
                  `${newProduct.code}_${updatedRawImages.length + 1}.jpg`,
                  { type: "image/jpeg" }
                )
              );
              setImagePreviews(updatedPreviews);
              setRawImages(updatedRawImages);
              setLoading(false);
            });
        };
        img.src = event.target.result;
      };

      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {}, [newProduct]);

  return (
    <>
      <div style={{ position: "relative", height: "10vh" }}>
        {!loading && imagePreviews.length > 0
          ? imagePreviews.map((preview, index) => (
              <img
                key={index}
                src={preview}
                alt="Preview"
                style={{ width: "50px", height: "50px", marginRight: "5px" }}
              />
            ))
          : loading && <LoadingComponent text={"fotos"} />}
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Imagenes de producto</Form.Label>
          <Form.Control
            type="file"
            name="images"
            multiple
            ref={fileInput}
            accept=".jpg,.jpeg,.png"
            onChange={handleFileChange}
          />
          <Form.Label>Codigo</Form.Label>
          <Form.Control
            type="text"
            name="code"
            onChange={handleChange}
            defaultValue={newProduct.code}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Titulo</Form.Label>
          <Form.Control
            type="text"
            name="title"
            onChange={handleChange}
            defaultValue={newProduct.title}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Categoria</Form.Label>
          <Form.Control
            as="select"
            defaultValue={selectedCategory}
            onChange={handleSelectCategory}
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
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Descripcion</Form.Label>
          <Form.Control
            type="text"
            name="description"
            onChange={handleChange}
            value={newProduct.description}
          />
        </Form.Group>
        <Form.Group>
          <label>Descripcion detallada</label>
          <textarea
            rows={3}
            className="form-control"
            name="detailedDescription"
            onChange={handleChange}
            value={newProduct.detailedDescription}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Precio</Form.Label>
          <Form.Control
            type="number"
            name="price"
            onChange={handleChange}
            value={newProduct.price}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Stock</Form.Label>
          <Form.Control
            type="number"
            name="stock"
            onChange={handleChange}
            value={newProduct.stock}
          />
        </Form.Group>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button onClick={clearForm} variant="danger">
            Restablecer
          </Button>
          <Button type="submit">Guardar</Button>
        </div>
      </Form>
      <Modal show={showConfirmDialog} onHide={cancelAddProduct}>
        <Modal.Header closeButton={false}>
          <Modal.Title>Confirmar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to add the following product?
          <ul>
            <li>Codigo: {newProduct.code}</li>
            <li>Titulo: {newProduct.title}</li>
            <li>Categoria: {newProduct.category}</li>
            <li>Descripcion: {newProduct.description}</li>
            <li>Descripcion detallada: {newProduct.detailedDescription}</li>
            <li>Precio: {newProduct.price}</li>
            <li>Stock: {newProduct.stock}</li>
          </ul>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-evenly">
          <Button variant="secondary" onClick={cancelAddProduct}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={confirmAddProduct}>
            Agregar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
