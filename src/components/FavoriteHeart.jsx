import { useContext, useState } from "react";
import { Heart, HeartFill } from "react-bootstrap-icons";
import { GeneralCompany } from "../App";
import { Toast, ToastContainer } from "react-bootstrap";
import { showNotification } from "./ToastNotification";

export default function FavoriteHeart(props) {
  const { setUserFavorites: setUserFavorites, userFavorites: favorites } =
    useContext(GeneralCompany);
  const [showToast, setShowToast] = useState(false);
  function changeFavoriteStatus() {
    let updatedFavorites;
    if (favorites.includes(props.productCode)) {
      updatedFavorites = favorites.filter(
        (favCode) => favCode !== props.productCode
      );
      showNotification(<HeartFill />, "Favorites", "Removed from favorites");
    } else {
      updatedFavorites = [...favorites, props.productCode];
      showNotification(<HeartFill />, "Favorites", "Added to favorites");
    }
    setUserFavorites(updatedFavorites);
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
