import { createContext, useCallback, useEffect, useState } from "react";
import "./App.css";
import Navigationbar from "./components/Navbar";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { Container, ToastContainer } from "react-bootstrap";
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
  updateDoc,
  where,
} from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import AboutUs from "./components/AboutUs";
import FavoritesListContainer from "./components/FavoritesListContainer";
import Contact from "./components/Contact";
import AdminPage from "./components/AdminPage";
import LoginPage from "./components/LoginPage";
import Footer from "./components/Footer";
import UserOrders from "./components/UserOrders";
import { ParallaxProvider } from "react-scroll-parallax";
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
  const [error, setError] = useState(undefined);
  const [developerData, setDeveloperData] = useState();
  const [userDocRef, setUserDocRef] = useState(null);

  const handleLoginError = (error) => {
    console.log(error);
    setError(error);
  };

  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/");
  };
  const LoginRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
      navigate("/");
    }, [navigate]);

    return null;
  };
  const NotLoginRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
      navigate("/login");
    }, [navigate]);

    return null;
  };
  const fetchDeveloperData = async () => {
    const data = await getDocs(collection(db, "developerData"));
    const results = data.docs.map((doc) => ({ ...doc.data() }));
    const objRes = Object.entries(results[0]).map(([key, value]) => {
      return { key, value };
    });
    console.log(objRes);
    return objRes;
  };
  const fetchCompanyInfo = async () => {
    const data = await getDocs(collection(db, "companyInfo"));
    const results = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    console.log(results[0]);
    return results[0];
  };
  const fetchCategories = async () => {
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
    let docRef;
    querySnapshot.forEach((doc) => {
      userData = doc.data();
      docRef = doc.ref;
    });
    return [docRef, userData];
  }, []);

  function updateUserTheme(isDarkTheme) {
    setUserInfo((userInfo) => ({ ...userInfo, prefersDarkMode: isDarkTheme }));

    if (userDocRef) {
      updateDoc(userDocRef, {
        prefersDarkMode: isDarkTheme,
      })
        .then(() => {
          console.log("User theme preference updated in Firestore");
        })
        .catch((error) => {
          console.error("Error updating theme preference: ", error);
        });
    }
  }

  function updateUserFavorites(favorites) {
    setUserInfo((userInfo) => ({ ...userInfo, favorites: favorites }));

    if (userDocRef) {
      updateDoc(userDocRef, {
        favorites: favorites,
      })
        .then(() => {
          console.log("User favorites updated in Firestore");
        })
        .catch((error) => {
          console.error("Error updating favorites: ", error);
        });
    }
  }

  function updateCompData(info) {
    setCompanyInfo(info);
  }
  function logOut() {
    signOut(auth)
      .then(() => {
        setUserInfo(genericUserData);
        setUserLogged(false);
        setUserDocRef(null);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const logIn = useCallback(
    (email, password) => {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          const [docRef, userData] = await fetchUserData(email);
          if (userData.enabled) {
            setUserInfo(userData);
            setUserLogged(true);
            setUserDocRef(docRef);
            goToHome();
          } else {
            setUserInfo(genericUserData);
            setUserLogged(false);
            setUserDocRef(null);
            const error = { code: "auth/account-disabled" };
            handleLoginError(error);
          }
        })
        .catch((error) => {
          handleLoginError(error);
          setUserInfo(genericUserData);
          setUserLogged(false);
          console.log(error);
        });
    },
    [fetchUserData]
  );
  useEffect(() => {
    if (isUserLogged) {
      console.log(isUserLogged);
      Promise.all([fetchCompanyInfo(), fetchCategories(), fetchDeveloperData()])
        .then(([info, cats, devData]) => {
          setCompanyInfo(info);
          setNavCat(cats);
          setDeveloperData(devData);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          // You might also want to set an error state here to display an error message
        });
    }
  }, [isUserLogged]);
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
    console.log(navCat);
  }, [fetchUserData, isUserLogged, userInfo.username]);
  useEffect(() => {}, []);
  return (
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
          devData: developerData,
          setCompData: updateCompData,
          setUserFavorites: updateUserFavorites,
          setUserTheme: updateUserTheme,
          logIn: logIn,
          logOut: logOut,
        }}
      >
        <CartProvider>
          <ParallaxProvider>
            {isUserLogged && !loading && <Navigationbar />}
            <div
              id="routerComponentOutlet"
              style={{ minHeight: "90vh", marginTop: "50px" }}
            >
              <Routes>
                {!isUserLogged ? (
                  <>
                    <Route
                      path="/login"
                      element={<LoginPage logIn={logIn} error={error} />}
                    />
                    <Route path="*" element={<NotLoginRedirect />} />
                  </>
                ) : (
                  !loading && (
                    <>
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<LoginRedirect />} />
                      <Route path="/aboutUs" element={<AboutUs />} />
                      <Route path="/contact" element={<Contact />} />
                      {userInfo.status === "admin" && (
                        <Route path="/adminPage" element={<AdminPage />} />
                      )}
                      <Route path="/cart" element={<Cart />} />
                      <Route
                        path="/category/:idCat"
                        element={<ItemListContainer />}
                      />
                      <Route
                        path="/category/"
                        element={<ItemListContainer />}
                      />
                      <Route
                        path="/product/:idProd"
                        element={<ItemDetailContainer />}
                      />
                      <Route path="/order/:idOrder" element={<Order />} />
                      <Route path="/orders" element={<OrdersContainer />} />
                      <Route path="/user/" element={<User />} />
                      <Route
                        path="/user/favorites"
                        element={<FavoritesListContainer />}
                      />
                      <Route path="/user/myOrders" element={<UserOrders />} />
                      <Route path="/user/settings" element={<User />} />
                      <Route path="*" element={<NotFound />} />
                    </>
                  )
                )}
              </Routes>
            </div>
            {isUserLogged && !loading && <Footer />}
          </ParallaxProvider>
        </CartProvider>
      </GeneralCompany.Provider>
    </>
  );
}

export default App;
