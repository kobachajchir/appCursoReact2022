import { useCallback, useContext, useEffect, useState } from "react";
import { GeneralCompany } from "../App";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import {
  Button,
  Col,
  FormCheck,
  FormControl,
  FormSelect,
  Modal,
  Row,
} from "react-bootstrap";
import EditProductPanel from "./EditProductPanel";
import { useMediaQuery } from "react-responsive";

export default function ProductListingPanel() {
  const { productCategories: categories } = useContext(GeneralCompany);
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchByCode, setSearchByCode] = useState(false);
  const [searchByTitle, setSearchByTitle] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchByCategory, setSearchByCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const isLg = useMediaQuery({ query: "(max-width: 992px)" });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const db = getFirestore();
    const q = collection(db, "products");
    const querySnapshot = await getDocs(q);
    let prods = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProducts(prods);
    setDisplayedProducts(prods);
  }

  const handleSelectCategory = (target) => {
    setSelectedCategory(target.value);
    handleSearch();
  };

  const handleSearch = useCallback(() => {
    if (searchByCode || searchByTitle || searchByCategory) {
      if (searchTerm !== "" || selectedCategory !== "") {
        const filteredProducts = products.filter(
          (product) =>
            (searchByCode && product.code.includes(searchTerm)) ||
            (searchByTitle &&
              product.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (searchByCategory && product.category === selectedCategory) // check if product category is the selected category
        );
        setDisplayedProducts(filteredProducts);
      } else {
        setDisplayedProducts(products);
      }
    } else {
      setDisplayedProducts(products);
    }
  }, [
    searchByCode,
    searchByTitle,
    searchByCategory,
    searchTerm,
    selectedCategory,
    products,
  ]);

  const handleSearchByCategory = (checked) => {
    setSearchByCategory(checked);
    if (checked) {
      setSearchByCode(false);
      setSearchByTitle(false);
    } else {
      setSelectedCategory("");
    }
    setSearchTerm("");
    handleSearch();
    if (!checked) {
      setDisplayedProducts(products);
    }
  };

  const handleModify = (product) => {
    setSelectedProduct(product);
  };

  const handleDelete = (product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const deleteProduct = async () => {
    if (!productToDelete) return;

    const db = getFirestore();
    const productRef = doc(db, "products", productToDelete.id);

    try {
      await deleteDoc(productRef);
    } catch (error) {
      console.error("Error deleting product: ", error);
      return;
    }

    fetchProducts();
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleSearchByCode = (checked) => {
    setSearchByCode(checked);
    if (searchByTitle || searchByCategory) {
      if (checked) {
        setSearchByTitle(false);
        setSearchByCategory(false);
        setSelectedCategory("");
      }
    }
    setSearchTerm("");
    handleSearch();
    if (!checked) {
      setDisplayedProducts(products);
    }
  };

  const handleSearchByTitle = (checked) => {
    setSearchByTitle(checked);
    if (searchByCode || searchByCategory) {
      if (checked) {
        setSearchByCode(false);
        setSearchByCategory(false);
        setSelectedCategory("");
      }
    }
    setSearchTerm("");
    handleSearch();
    if (!checked) {
      setDisplayedProducts(products);
    }
  };

  const handleProductChange = async (updatedProduct, id) => {
    const db = getFirestore();
    const productRef = doc(db, "products", id);
    console.log(id);
    try {
      await updateDoc(productRef, updatedProduct);
    } catch (error) {
      console.error("Error updating product: ", error);
      return;
    }

    fetchProducts();
    setSelectedProduct(null);
  };

  const handleProductPanelClose = () => {
    setSearchByCode(false);
    setSearchByTitle(false);
    setSearchTerm("");
    setSelectedProduct(null);
    fetchProducts();
  };

  const productStyle = {
    backgroundColor: "var(--bs-secondary-bg)",
    borderRadius: "var(--bs-border-radius)",
    marginTop: "10px",
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    paddingTop: isLg ? "10px" : "0",
    paddingBottom: isLg ? "10px" : "0",
  };
  useEffect(() => {
    handleSearch();
  }, [searchTerm, selectedCategory]);
  return (
    <>
      {!selectedProduct && (
        <Row className="d-flex justify-content-center align-items-center flex-column">
          <Col
            xs={12}
            className="d-flex justify-content-center align-items-center flex-column"
          >
            <FormCheck
              type="checkbox"
              id="searchByCode"
              checked={searchByCode}
              onChange={(e) => handleSearchByCode(e.target.checked)}
              label="Buscar por código"
              className="text-start"
            />
          </Col>
          {searchByCode && (
            <Col
              xs={10}
              className="d-flex justify-content-center align-items-center flex-row text-center"
              as={Row}
            >
              <Col lg={8} xs={12}>
                <FormControl
                  placeholder="Buscar producto por código"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyUp={handleSearch}
                />
              </Col>
            </Col>
          )}
          <Col
            xs={12}
            className="d-flex justify-content-center align-items-center flex-column"
          >
            <FormCheck
              type="checkbox"
              id="searchByTitle"
              checked={searchByTitle}
              onChange={(e) => handleSearchByTitle(e.target.checked)}
              label="Buscar por título"
              className="text-start"
            />
          </Col>
          {searchByTitle && (
            <Col
              xs={10}
              className="d-flex justify-content-center align-items-center flex-row text-center"
              as={Row}
            >
              <Col lg={8} xs={12}>
                <FormControl
                  placeholder="Buscar producto por título"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyUp={handleSearch}
                />
              </Col>
            </Col>
          )}
          <Col
            xs={12}
            className="d-flex justify-content-center align-items-center flex-column"
          >
            <FormCheck
              type="checkbox"
              id="searchByCategory"
              checked={searchByCategory}
              onChange={(e) => handleSearchByCategory(e.target.checked)}
              label="Buscar por categoría"
              className="text-start"
            />
          </Col>
          {searchByCategory && (
            <Col
              xs={10}
              className="d-flex justify-content-center align-items-center flex-row text-center"
              as={Row}
            >
              <Col lg={8} xs={12}>
                <FormSelect
                  defaultValue={selectedCategory}
                  onChange={(e) => {
                    handleSelectCategory(e.target);
                  }}
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
                          <option
                            key={subcategory.code}
                            value={subcategory.code}
                          >
                            {subcategory.name}
                          </option>
                        ))}
                      </>
                    )
                  )}
                </FormSelect>
              </Col>
            </Col>
          )}
        </Row>
      )}
      {!selectedProduct &&
        displayedProducts.map((product) => (
          <Row key={product.id} style={productStyle}>
            <Col xs={12} lg={4}>
              <img
                src={new URL(product.picture[0], import.meta.url).href}
                alt={product.title}
                style={{ height: "100px", width: "auto" }}
              />
            </Col>
            <Col
              xs={12}
              lg={"auto"}
              style={{
                marginTop: isLg ? "10px" : "0",
                marginBottom: isLg ? "10px" : "0",
              }}
            >
              <h5 style={{ margin: 0 }}>{product.title}</h5>
              <p style={{ margin: 0 }}>Código: {product.code}</p>
            </Col>
            <Col xs={12} as={Row} lg={"auto"}>
              <Col xs={6} lg={"auto"}>
                <Button onClick={() => handleModify(product)}>Modificar</Button>
              </Col>
              <Col xs={6} lg={"auto"}>
                <Button variant="danger" onClick={() => handleDelete(product)}>
                  Eliminar
                </Button>
              </Col>
            </Col>
          </Row>
        ))}
      {selectedProduct && (
        <EditProductPanel
          product={selectedProduct}
          productChange={handleProductChange}
          onClose={handleProductPanelClose}
        />
      )}
      <Modal show={isDeleteDialogOpen} onHide={cancelDelete}>
        <Modal.Header closeButton={false}>
          <Modal.Title>Confirmar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Confirmas que quieres borrar el producto{" "}
          <strong>{productToDelete?.title}</strong>?
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-evenly">
          <Button variant="secondary" onClick={cancelDelete}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={deleteProduct}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
