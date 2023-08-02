// ToastNotification.js
import { useState, useEffect } from "react";
import { Toast } from "react-bootstrap";

let toastCallback = null;

export function showNotification(
  icon,
  headerText,
  bodyContent,
  autohide = true
) {
  toastCallback(icon, headerText, bodyContent, autohide);
}

export default function ToastNotification() {
  const [showToast, setShowToast] = useState(false);
  const [icon, setIcon] = useState(null);
  const [headerText, setHeaderText] = useState("");
  const [bodyContent, setBodyContent] = useState(null);
  const [autoHide, setAutoHide] = useState(true);

  useEffect(() => {
    toastCallback = (icon, headerText, bodyContent, autohide) => {
      setIcon(icon);
      setHeaderText(headerText);
      setBodyContent(bodyContent);
      setShowToast(true);
      setAutoHide(autohide);
    };
    return () => {
      toastCallback = null;
    };
  }, []);

  return (
    <Toast
      onClose={() => setShowToast(false)}
      show={showToast}
      delay={3000}
      autohide={autoHide}
      style={{ position: "fixed", bottom: "40px", right: "20px" }}
    >
      <Toast.Header>
        {icon}
        <strong className="me-auto" style={{ marginLeft: "5px" }}>
          {headerText}
        </strong>
      </Toast.Header>
      <Toast.Body>{bodyContent}</Toast.Body>
    </Toast>
  );
}
