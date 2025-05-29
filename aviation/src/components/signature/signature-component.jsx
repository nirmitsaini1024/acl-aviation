import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

// This component creates a signature canvas with save functionality
const SignatureComponent = ({ onSave }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [signatureImage, setSignatureImage] = useState(null);
  const [printName, setPrintName] = useState("");

  // Handle mouse down event
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    const rect = canvas.getBoundingClientRect();
    // Calculate position accounting for canvas scaling
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  // Handle mouse move event
  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    // Calculate position accounting for canvas scaling
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  // Handle mouse up event
  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  // Handle touch start event
  const handleTouchStart = (e) => {
    e.preventDefault(); // Prevent scrolling when drawing
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    // Calculate position accounting for canvas scaling
    const x = (touch.clientX - rect.left) * (canvas.width / rect.width);
    const y = (touch.clientY - rect.top) * (canvas.height / rect.height);
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  // Handle touch move event
  const handleTouchMove = (e) => {
    e.preventDefault(); // Prevent scrolling when drawing
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    // Calculate position accounting for canvas scaling
    const x = (touch.clientX - rect.left) * (canvas.width / rect.width);
    const y = (touch.clientY - rect.top) * (canvas.height / rect.height);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  // Handle touch end event
  const handleTouchEnd = () => {
    setIsDrawing(false);
  };

  // Initialize canvas on component mount
  const initCanvas = (canvas) => {
    if (canvas) {
      canvasRef.current = canvas;
      const ctx = canvas.getContext("2d");
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.strokeStyle = "black";
    }
  };

  // Save signature as image
  const saveSignature = () => {
    const canvas = canvasRef.current;
    // Check if canvas is empty
    const ctx = canvas.getContext("2d");
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const isEmpty = !data.some((channel) => channel !== 0);

    if (isEmpty) {
      alert("Please provide a signature first!");
      return;
    }

    const signatureURL = canvas.toDataURL("image/png");
    setSignatureImage(signatureURL);
    setIsSigned(true);

    // Call onSave callback with signature URL
    if (onSave) {
      onSave(signatureURL);
    }
  };

  // Clear signature
  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsSigned(false);
    setSignatureImage(null);
  };

  const handleUseSignature = () => {
    setIsSigned(true);
    setSignatureImage("/sig-2.png");
    if (onSave) {
      onSave("/sig-2.png");
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex w-full justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 text-blue-600 hover:text-blue-800 p-0 underline"
          onClick={handleUseSignature}
        >
          Use Sign
        </Button>
      </div>
      {!isSigned ? (
        <>
          <div className="border border-gray-300 rounded-md bg-gray-50 w-full h-28">
            <canvas
              ref={initCanvas}
              width={450}
              height={96}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="w-full h-full cursor-crosshair"
            />
          </div>
          <div className="flex justify-between space-x-2">
            <div className="flex gap-2 items-center">
              {printName ?<Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 text-blue-600 hover:text-blue-800 p-0 underline"
                onClick={() => setPrintName("")}
              >
                Remove name
              </Button> : <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 text-blue-600 hover:text-blue-800 p-0 underline"
                onClick={() => setPrintName("John Doe")}
              >
                Print name
              </Button>}
              {printName && <p className="text-sm font-medium"> - {printName}</p>}
            </div>
            <div className="flex gap-2 items-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearSignature}
              >
                Clear
              </Button>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={saveSignature}
              >
                Save Signature
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full border border-gray-300 rounded-md p-2 bg-white">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 font-medium">Signed</div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 text-blue-600 hover:text-blue-800 p-0 underline"
              onClick={clearSignature}
            >
              Re-sign
            </Button>
          </div>
          <div className="mt-1">
            <img
              src={signatureImage}
              alt="Your signature"
              className="max-h-16"
            />
          </div>
           <div className="flex gap-2 items-center">
              {printName ?<Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 text-blue-600 hover:text-blue-800 p-0 underline"
                onClick={() => setPrintName("")}
              >
                Remove name
              </Button> : <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 text-blue-600 hover:text-blue-800 p-0 underline"
                onClick={() => setPrintName("John Doe")}
              >
                Print name
              </Button>}
              {printName && <p className="text-sm font-medium"> - {printName}</p>}
            </div>
        </div>
      )}
    </div>
  );
};

export default SignatureComponent;
