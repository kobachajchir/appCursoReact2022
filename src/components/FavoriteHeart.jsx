import { useContext } from "react";
import { Heart, HeartFill } from "react-bootstrap-icons";
import { GeneralCompany } from "../App";

export default function FavoriteHeart(props) {
  const { setUserFavorites: setUserFavorites, userFavorites: favorites } =
    useContext(GeneralCompany);
  function changeFavoriteStatus() {
    let updatedFavorites;
    if (favorites.includes(props.productCode)) {
      updatedFavorites = favorites.filter(
        (favCode) => favCode !== props.productCode
      );
    } else {
      updatedFavorites = [...favorites, props.productCode];
    }
    console.log(updatedFavorites);
    setUserFavorites(updatedFavorites);
  }

  return (
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
  );
}
