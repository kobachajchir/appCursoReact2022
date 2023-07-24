import { useContext, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";
import { Button, Modal, Form } from "react-bootstrap";
import { GeneralCompany } from "../App";

export default function AddProductPanel() {
  const { productCategories: categories } = useContext(GeneralCompany);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
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

  useEffect(() => {}, [newProduct]);

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Code</Form.Label>
          <Form.Control
            type="text"
            name="code"
            onChange={handleChange}
            value={newProduct.code}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            onChange={handleChange}
            value={newProduct.title}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Category</Form.Label>
          <Form.Control
            as="select"
            defaultValue={selectedCategory}
            onChange={handleSelectCategory}
            value={newProduct.category}
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
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            name="description"
            onChange={handleChange}
            value={newProduct.description}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Detailed Description</Form.Label>
          <Form.Control
            type="text"
            name="detailedDescription"
            onChange={handleChange}
            value={newProduct.detailedDescription}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Price</Form.Label>
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
