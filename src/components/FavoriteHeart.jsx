import { useContext, useState } from "react";
import { Heart, HeartFill, PersonXFill } from "react-bootstrap-icons";
import { GeneralCompany } from "../App";
import { Toast, ToastContainer } from "react-bootstrap";
import { showNotification } from "./ToastNotification";

export default function FavoriteHeart(props) {
  const {
    setUserFavorites: setUserFavorites,
    userFavorites: favorites,
    isUserLogged: isUserLogged,
  } = useContext(GeneralCompany);
  const [showToast, setShowToast] = useState(false);
  function changeFavoriteStatus() {
    if (isUserLogged) {
      let updatedFavorites;
      if (favorites.includes(props.productCode)) {
        updatedFavorites = favorites.filter(
          (favCode) => favCode !== props.productCode
        );
        showNotification(<HeartFill />, "Favorites", "Eliminado de Favoritos");
      } else {
        updatedFavorites = [...favorites, props.productCode];
        showNotification(<HeartFill />, "Favorites", "Agregado a Favoritos");
      }
      setUserFavorites(updatedFavorites);
    } else {
      showNotification(
        <PersonXFill />,
        "Inicie sesion",
        "Requiere iniciar sesion"
      );
    }
  }
  return (
    <>
      <div className="align-items-center">
        {props.isFavorite ? (
          <HeartFill
            color="#D32F2F"
            size={props.size}
            onClick={changeFavoriteStatus}
          />
        ) : (
          <Heart
            color="#D32F2F"
            size={props.size}
            onClick={changeFavoriteStatus}
          />
        )}
      </div>
    </>
  );
}
