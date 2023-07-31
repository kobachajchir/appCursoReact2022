import { Col, Container, Image, Row } from "react-bootstrap";
import testCanvas from "../assets/images/testCanvas.jpg";
import BlobScene from "../assets/images/blobScene.svg";
import BlobScene2 from "../assets/images/blobScene2.svg";
import BlurryScene from "../assets/images/blurryScene.svg";
import BlurryScene2Png from "../assets/images/blurryScene2Png.png";
import ReactLogo from "../assets/react.svg";
import "../styles/Home.css";
import ItemListContainer from "./ItemListContainer";
import {
  FullPageSections,
  Fullpage,
  FullpageSection,
} from "@ap.cx/react-fullpage";
import { Parallax, ParallaxBanner } from "react-scroll-parallax";
import { useContext, useEffect, useState } from "react";
import { GeneralCompany } from "../App";
import { ArrowDown, ArrowDownCircleFill } from "react-bootstrap-icons";
import ShowItemFlipCard from "./ShowItemFlipCard";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useMediaQuery } from "react-responsive";

export default function Home(props) {
  const { companyInfo: compInfo } = useContext(GeneralCompany);
  const [products, setProducts] = useState([]);
  const isLg = useMediaQuery({ query: "(max-width: 992px)" });

  useEffect(() => {
    fetchProducts().then((prods) => {
      setProducts(prods);
    });
  }, []);

  async function fetchProducts() {
    const db = getFirestore();
    const q = collection(db, "products");
    const querySnapshot = await getDocs(q);
    let prods = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return prods;
  }
  return (
    <Fullpage>
      <FullPageSections>
        <FullpageSection
          style={{
            height: "100vh",
            width: "100%",
            padding: 0,
            display: "flex",
            justifyContent: "center",
            position: "relative",
            marginTop: "50px",
          }}
        >
          <div
            style={{
              height: "100%",
              width: "100%",
              backgroundImage: "none",
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              padding: 0,
            }}
            className="text-center"
          >
            <ParallaxBanner
              style={{ height: "100%", width: "100%" }}
              layers={[
                {
                  speed: 15,
                  children: (
                    <div
                      className="d-flex align-items-center justify-content-center flex-column"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        overflow: "hidden",
                        margin: 0,
                        padding: 0,
                      }}
                    >
                      <svg
                        viewBox="0 0 900 600"
                        width="100%"
                        height="100%"
                        preserveAspectRatio="none"
                      >
                        <rect
                          x="0"
                          y="0"
                          width="900"
                          height="600"
                          fill="var(--bs-dark-bg-subtle)"
                        ></rect>
                        <defs>
                          <linearGradient
                            id="grad1_0"
                            x1="33.3%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop
                              offset="20%"
                              stop-color="#001122"
                              stop-opacity="1"
                            ></stop>
                            <stop
                              offset="80%"
                              stop-color="#001122"
                              stop-opacity="1"
                            ></stop>
                          </linearGradient>
                        </defs>
                        <defs>
                          <linearGradient
                            id="grad2_0"
                            x1="0%"
                            y1="0%"
                            x2="66.7%"
                            y2="100%"
                          >
                            <stop
                              offset="20%"
                              stop-color="#001122"
                              stop-opacity="1"
                            ></stop>
                            <stop
                              offset="80%"
                              stop-color="#001122"
                              stop-opacity="1"
                            ></stop>
                          </linearGradient>
                        </defs>
                        <g transform="translate(900, 0)">
                          <path
                            d="M0 378.6C-44 346.2 -88 313.9 -117.1 282.7C-146.2 251.6 -160.5 221.6 -202.9 202.9C-245.3 184.3 -315.8 176.8 -349.8 144.9C-383.7 112.9 -381.2 56.5 -378.6 0L0 0Z"
                            fill="#0066FF"
                          ></path>
                        </g>
                        <g transform="translate(0, 600)">
                          <path
                            d="M0 -378.6C31.2 -321.9 62.5 -265.2 101.8 -245.8C141.1 -226.3 188.5 -244.2 234.8 -234.8C281 -225.3 326 -188.6 349.8 -144.9C373.5 -101.2 376.1 -50.6 378.6 0L0 0Z"
                            fill="#0066FF"
                          ></path>
                        </g>
                      </svg>
                    </div>
                  ),
                },
                {
                  speed: -20,
                  children: (
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        position: "relative",
                        left: "0",
                        top: "110vh",
                      }}
                    >
                      <ArrowDownCircleFill
                        size={!isLg ? "5vw" : "7vw"}
                        className="bounce"
                      />
                    </div>
                  ),
                },
                {
                  speed: 40,
                  children: (
                    <div
                      className="d-flex align-items-center justify-content-center flex-column"
                      style={{
                        position: "relative",
                        top: "60vh",
                      }}
                    >
                      <img
                        src={ReactLogo}
                        alt="React Logo"
                        style={{
                          width: "25vw",
                          marginBottom: "10px",
                        }}
                      />
                      <h1>{compInfo.companyName}</h1>
                    </div>
                  ),
                },
                {
                  speed: -40,
                  children: (
                    <div className="d-flex align-items-center flex-column">
                      <h1
                        className=""
                        style={{
                          fontSize: !isLg ? "5vw" : "7vw",
                          textAlign: "start",
                          fontWeight: "bold",
                          position: "relative",
                          top: "110vh",
                          color: "var(--bs-body-color)",
                        }}
                      >
                        BIENVENIDO A NUESTRA WEB
                      </h1>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </FullpageSection>
        <FullpageSection
          style={{
            height: "100vh",
            width: "100%",
            padding: 0,
            display: "flex",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              height: "100%",
              width: "100%",
              backgroundImage: "none",
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              padding: 0,
            }}
            className="text-center"
          >
            <ParallaxBanner
              style={{ height: "100%", width: "100%" }}
              layers={[
                {
                  speed: 15,
                  children: (
                    <div
                      className="d-flex align-items-center justify-content-center flex-column"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        overflow: "hidden",
                        margin: 0,
                        padding: 0,
                      }}
                    >
                      <img
                        src={BlurryScene2Png}
                        alt="React Logo"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          overflow: "hidden",
                        }}
                      />
                    </div>
                  ),
                },
                {
                  speed: 50,
                  children: (
                    <div
                      className="d-flex align-items-center justify-content-center flex-column"
                      style={{ height: "100%" }}
                    >
                      <img
                        src={ReactLogo}
                        alt="React Logo"
                        style={{ height: "25vh" }}
                      />
                      <h1 className="text-8xl text-white font-thin">
                        {compInfo.companyName}
                      </h1>
                      <h5 className="text-8xl text-white font-thin">
                        {compInfo.companyName}
                      </h5>
                    </div>
                  ),
                },
                {
                  speed: 70,
                  children: (
                    <div
                      className="d-flex align-items-start justify-content-center flex-column"
                      style={{ height: "100%" }}
                    >
                      <h1
                        className="text-8xl text-white font-thin"
                        style={{
                          fontSize: "9vh",
                          textAlign: "start",
                          fontWeight: "bold",
                          position: "absolute",
                          top: "30%",
                        }}
                      >
                        HOLA MUNDO
                      </h1>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </FullpageSection>
      </FullPageSections>
    </Fullpage>
  );
}
