import type { CSSProperties } from "react";
import { ClipLoader } from "react-spinners";

export interface LoadingSpinnerProps {
  isLoading: boolean;
}

export const LoadingSpinner = ({ isLoading }: LoadingSpinnerProps) => {
  if (!isLoading) return null;

  return (
    <div style={overlayStyle}>
      <ClipLoader color="#36d7b7" size={50} speedMultiplier={1} />
      <p style={{ color: "#fff", marginTop: "10px" }}>Processando...</p>
    </div>
  );
};

const overlayStyle: CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};
