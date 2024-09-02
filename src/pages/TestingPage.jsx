import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

const TestingPage = () => {
  const [barcodeDisplay, setBarcodeDisplay] = useState("No barcode scanned");
  const [barcodeScan, setBarcodeScan] = useState("");

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Enter" && barcodeScan.length > 20) {
        handleScan(barcodeScan);
        setBarcodeScan(""); // Clear the barcode after handling it
        return;
      }

      if (e.key === "Shift") {
        return; // Skip if Shift key is pressed
      }

      setBarcodeScan((prev) => prev + e.key); // Accumulate the barcode string

      setTimeout(() => {
        setBarcodeScan("");
      }, 1000);
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [barcodeScan]);

  const handleScan = (barcodeString) => {
    setBarcodeDisplay(barcodeString);
  };

  // console.log(barcodeDisplay);

  return (
    <div>
      {barcodeDisplay}
      <QRCode
        size={256}
        style={{ height: "auto", maxWidth: "50%", width: "20%", margin: "0 auto" }}
        value={"bFDEUFxBUNxjgn4942Cvjs"}
        viewBox={`0 0 256 256`}
      />
    </div>
  );
};

export default TestingPage;
