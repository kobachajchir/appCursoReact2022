import { createContext, useCallback, useEffect, useState } from "react";
import "./App.css";
import Navigationbar from "./components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import ItemListContainer from "./components/ItemListContainer";
import ItemDetailContainer from "./components/ItemDetailContainer";
import Home from "./components/Home";
import Cart from "./components/Cart";
import User from "./components/User";
import NotFound from "./components/NotFound";
import CartProvider from "./providers/CartProvider";
import OrdersContainer from "./components/OrdersContainer";
import Order from "./components/Order";
import { initializeApp } from "firebase/app";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import AboutUs from "./components/AboutUs";
import FavoritesListContainer from "./components/FavoritesListContainer";
export const GeneralCompany = createContext();
const firebaseConfig = {
  apiKey: "AIzaSyClyM0t39WQ8SI37pIZycGy2o02d57byxs",
  authDomain: "pachacreaciones3d.firebaseapp.com",
  projectId: "pachacreaciones3d",
  storageBucket: "pachacreaciones3d.appspot.com",
  messagingSenderId: "399612336262",
  appId: "1:399612336262:web:6ce144e7f2f050b6541907",
};
initializeApp(firebaseConfig);

function App() {
  const db = getFirestore();
  const [navCat, setNavCat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companyInfo, setCompanyInfo] = useState();
  const [userInfo, setUserInfo] = useState({
    userDarkMode: true,
    isUserLogged: true,
    username: "kobachajchir",
  });
  const [favorites, setFavorites] = useState([]);
  const fetchCompanyInfo = async () => {
    const db = getFirestore();
    const data = await getDocs(collection(db, "companyInfo"));
    const results = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    console.log(results);
    return results;
  };
  const fetchCategories = async () => {
    const db = getFirestore();
    const data = await getDocs(collection(db, "categories"));
    const results = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    console.log(results);
    return results;
  };
  async function fetchFavorites(username) {
    const q = query(
      collection(db, "users"),
      where("username", "==", userInfo.username)
    );
    const querySnapshot = await getDocs(q);
    let favorites;
    querySnapshot.forEach((doc) => {
      favorites = doc.data().favorites;
      console.log(doc.id, " => ", doc.data());
    });
    return favorites;
  }
  useEffect(() => {
    Promise.all([fetchCompanyInfo(), fetchCategories()])
      .then(([info, cats]) => {
        setCompanyInfo(info[0]);
        setNavCat(cats);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // You might also want to set an error state here to display an error message
      });
  }, []);
  useEffect(() => {
    const htmlElement = document.getElementById("htmlElement");
    htmlElement.setAttribute(
      "data-bs-theme",
      !userInfo.userDarkMode ? "light" : "dark"
    );
  }, [userInfo.userDarkMode]);
  const fetchFavoritesCallback = useCallback(async () => {
    if (userInfo.isUserLogged) {
      setFavorites(await fetchFavorites(userInfo.username));
    } else {
      setFavorites([]);
    }
  }, [userInfo.username, userInfo.isUserLogged]);
  useEffect(() => {
    fetchFavoritesCallback();
  }, [fetchFavoritesCallback, userInfo.isUserLogged]);
  return !loading ? (
    <>
      <GeneralCompany.Provider
        value={{
          companyInfo: companyInfo,
          productCategories: navCat,
          isDarkTheme: userInfo.userDarkMode,
          isUserLogged: userInfo.isUserLogged,
          username: userInfo.username,
          userFavorites: favorites,
          userInfo: userInfo,
          setUserFavorites: setFavorites,
          setUserInfo: setUserInfo,
        }}
      >
        <CartProvider>
          <BrowserRouter>
            <Navigationbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route exact path="/aboutUs" element={<AboutUs />} />
              <Route exact path="/cart" element={<Cart />} />
              <Route
                exact
                path="/category/:idCat"
                element={<ItemListContainer />}
              />
              <Route exact path="/category/" element={<ItemListContainer />} />

              <Route
                exact
                path="/product/:idProd"
                element={<ItemDetailContainer />}
              />
              <Route exact path="/order/:idOrder" element={<Order />} />
              <Route exact path="/orders" element={<OrdersContainer />} />
              <Route exact path="/user/" element={<User />} />
              <Route
                exact
                path="/user/favorites"
                element={<FavoritesListContainer />}
              />
              <Route exact path="/user/myOrders" element={<User />} />
              <Route exact path="/user/settings" element={<User />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </GeneralCompany.Provider>
    </>
  ) : null; //Agregar spinner de carga aca
}

export default App;
