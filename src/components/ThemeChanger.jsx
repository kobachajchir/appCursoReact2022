import { useContext, useEffect, useState } from "react";
import useDelayUnmount from "../tools/useDelayUnmount";
import { MoonFill, SunFill } from "react-bootstrap-icons";
import { GeneralCompany } from "../App";
import { useMediaQuery } from "react-responsive";

export default function ThemeChanger(props) {
  const {
    isDarkTheme: isDarkTheme,
    setUserInfo: setUserInfo,
    userInfo: userInfo,
  } = useContext(GeneralCompany);
  const shouldRenderChild = useDelayUnmount(isDarkTheme, 500);
  const mountedStyle = { opacity: 1, transition: "opacity 500ms ease-in-out" };
  const unmountedStyle = {
    opacity: 0,
    transition: "opacity 500ms ease-in-out",
  };
  const isLg = useMediaQuery({ query: "(max-width: 992px)" });
  const handleToggleClicked = () => {
    setUserInfo({ ...userInfo, userDarkMode: !isDarkTheme });
  };
  return (
    <>
      {shouldRenderChild ? (
        <MoonFill
          style={isDarkTheme ? mountedStyle : unmountedStyle}
          onClick={handleToggleClicked}
          color="#2979ff"
        />
      ) : (
        <SunFill
          style={isDarkTheme ? unmountedStyle : mountedStyle}
          onClick={handleToggleClicked}
          color="#ffa000"
        />
      )}
    </>
  );
}
