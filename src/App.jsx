import { createContext, useCallback, useEffect, useState } from "react";
import "./App.css";
import Navigationbar from "./components/Navbar";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
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
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import AboutUs from "./components/AboutUs";
import FavoritesListContainer from "./components/FavoritesListContainer";
import Contact from "./components/Contact";
import AdminPage from "./components/AdminPage";
import LoginPage from "./components/LoginPage";
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
  const username = "kobachajchir";
  const genericUserData = {
    username: "notLogged",
    prefersDarkMode: true,
    status: "user",
  };
  const [navCat, setNavCat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companyInfo, setCompanyInfo] = useState();
  const [userInfo, setUserInfo] = useState(genericUserData);
  const [isUserLogged, setUserLogged] = useState(false);
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/");
  };
  const NotLoginRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
      navigate("/login");
    }, [navigate]);

    return null;
  };
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
    return results;
  };
  const fetchUserData = useCallback(async (userEmail) => {
    const q = query(
      collection(db, "users"),
      where("userEmail", "==", userEmail)
    );
    const querySnapshot = await getDocs(q);
    let userData;
    querySnapshot.forEach((doc) => {
      userData = doc.data();
    });
    return userData;
  }, []);
  function updateUserTheme(isDarkTheme) {
    setUserInfo((userInfo) => ({ ...userInfo, prefersDarkMode: isDarkTheme }));
  }
  function updateUserFavorites(favorites) {
    setUserInfo((userInfo) => ({ ...userInfo, favorites: favorites }));
  }
  function logOut() {
    setUserInfo(genericUserData);
    setUserLogged(false);
  }
  const logIn = useCallback(
    (email, password) => {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          console.log(userCredential);
          const userData = await fetchUserData(email);
          if (userData) {
            setUserInfo(userData);
            setUserLogged(true);
            goToHome();
          } else {
            setUserInfo(undefined);
            setUserLogged(false);
          }
        })
        .catch((error) => {
          console.error(`Error ${error.code}: ${error.message}`);
          setUserInfo(genericUserData);
          setUserLogged(false);
        });
    },
    [fetchUserData]
  );
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
    console.log(userInfo);
    const htmlElement = document.getElementById("htmlElement");
    htmlElement.setAttribute(
      "data-bs-theme",
      !userInfo.prefersDarkMode ? "light" : "dark"
    );
  }, [userInfo]);
  useEffect(() => {
    if (isUserLogged) {
      fetchUserData(userInfo.username);
    }
  }, [fetchUserData, isUserLogged, userInfo.username]);
  useEffect(() => {}, []);
  return !loading ? (
    <>
      <GeneralCompany.Provider
        value={{
          companyInfo: companyInfo,
          productCategories: navCat,
          isDarkTheme: userInfo.prefersDarkMode,
          isUserAdmin: userInfo.status === "admin" ? true : false,
          isUserLogged: isUserLogged,
          username: userInfo.username,
          userFavorites: userInfo.favorites,
          userInfo: userInfo,
          setUserFavorites: updateUserFavorites,
          setUserTheme: updateUserTheme,
          logIn: logIn,
          logOut: logOut,
        }}
      >
        <CartProvider>
          {isUserLogged && <Navigationbar />}
          <Routes>
            <Route exact path="/login" element={<LoginPage logIn={logIn} />} />
            <Route path="*" element={<NotLoginRedirect />} />
            {isUserLogged && (
              <>
                <Route path="/" element={<Home />} />
                <Route exact path="/aboutUs" element={<AboutUs />} />
                <Route exact path="/contact" element={<Contact />} />
                {userInfo.status === "admin" && (
                  <Route exact path="/adminPage" element={<AdminPage />} />
                )}
                <Route exact path="/cart" element={<Cart />} />
                <Route
                  exact
                  path="/category/:idCat"
                  element={<ItemListContainer />}
                />
                <Route
                  exact
                  path="/category/"
                  element={<ItemListContainer />}
                />
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
                <Route exact path="/user/settings" element={<User />} />{" "}
                <Route path="*" element={<NotFound />} />
              </>
            )}
          </Routes>
        </CartProvider>
      </GeneralCompany.Provider>
    </>
  ) : null; //Agregar spinner de carga aca
}

export default App;
