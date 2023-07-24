import React, { useState, useEffect, useContext } from "react";
import { Col, Button } from "react-bootstrap";
import { ChromePicker, SketchPicker } from "react-color";
import { useMediaQuery } from "react-responsive";
import { GeneralCompany } from "../App";

const CompanyDataPanel = () => {
  const {
    companyInfo: defaultData,
    setCompData: setCompData,
    productCategories: categories,
  } = useContext(GeneralCompany);
  const [companyData, setCompanyData] = useState(defaultData);
  const [isChanged, setIsChanged] = useState(false);
  const isLg = useMediaQuery({ query: "(max-width: 992px)" });

  useEffect(() => {
    console.log(defaultData.companyColors[0]);
  }, []);

  useEffect(() => {
    setIsChanged(JSON.stringify(companyData) !== JSON.stringify(defaultData));
  }, [companyData, defaultData]);

  const handleContactInfoChange = (e) => {
    const { name, value } = e.target;
    setCompanyData((prevState) => ({
      ...prevState,
      companyContactInfo: {
        ...prevState.companyContactInfo,
        [name]: value,
      },
    }));
  };

  const handleCompanyNameChange = (e) => {
    const { value } = e.target;
    setCompanyData((prevState) => ({
      ...prevState,
      companyName: value,
    }));
  };
  const handleColorChange = (color, name) => {
    setCompanyData((prevState) => {
      return {
        ...prevState,
        companyColors: [{ ...prevState.companyColors[0], [name]: color.hex }],
      };
    });
  };
  const handleReset = () => {
    setCompanyData(defaultData);
  };

  const handleSave = () => {
    setCompData(companyData);
  };
  const inputStyles = {
    color: "var(--bs-body-color)",
    backgroundColor: "var(--bs-secondary-bg)",
    borderRadius: "var(--bs-border-radius)",
    border: "none",
    fontSize: "1.25rem",
    padding: "5px",
    marginLeft: "10px",
  };
  return (
    <>
      <Col
        xs={12}
        className="d-flex justify-content-center align-items-center"
        style={{
          marginTop: "20px",
        }}
      >
        <h4>Nombre:</h4>
        <input
          type="text"
          value={companyData.companyName}
          name="companyName"
          onChange={handleCompanyNameChange}
          style={inputStyles}
        />
      </Col>

      <Col
        xs={12}
        className="d-flex justify-content-center align-items-center flex-column"
        style={{
          marginTop: "20px",
        }}
      >
        <h4>Colores de la empresa:</h4>
        <div
          className={`d-flex justify-content-center align-items-center ${
            !isLg ? "flex-row" : "flex-column"
          }`}
        >
          {Object.entries(companyData.companyColors[0]).map(
            ([colorName, colorValue]) => (
              <div
                key={colorName}
                style={{
                  margin: "20px",
                }}
                id={colorName}
              >
                <label>{colorName.toUpperCase()}:</label>
                <ChromePicker
                  color={colorValue}
                  onChangeComplete={(color) =>
                    handleColorChange(color, colorName)
                  }
                  disableAlpha={true}
                  styles={{
                    default: {
                      picker: {
                        backgroundColor: "var(--bs-secondary-bg)",
                        color: "color: var(--bs-emphasis-color)",
                        borderRadius: "10px",
                        marginTop: "10px",
                      },
                    },
                  }}
                />
              </div>
            )
          )}
        </div>
      </Col>

      <Col
        xs={12}
        className="d-flex justify-content-center align-items-center flex-column"
        style={{
          marginTop: "20px",
        }}
      >
        <h4>Links de contacto:</h4>
        {Object.entries(companyData.companyContactInfo).map(([key, value]) => (
          <div
            key={key}
            style={{
              marginTop: "7.5px",
              marginBottom: "7.5px",
            }}
          >
            <label>{key}:</label>
            <input
              type="text"
              value={value}
              name={key}
              onChange={handleContactInfoChange}
              style={inputStyles}
            />
          </div>
        ))}
      </Col>
      <Col
        xs={12}
        className="d-flex justify-content-center align-items-center"
        style={{
          marginTop: "20px",
        }}
      >
        <Button onClick={handleReset} className="me-2">
          Restablecer
        </Button>
        <Button onClick={handleSave} disabled={!isChanged}>
          Guardar
        </Button>
      </Col>
    </>
  );
};

export default CompanyDataPanel;
