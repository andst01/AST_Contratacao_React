import { useNavigate } from "react-router-dom";

export function Home(){

    const navigate = useNavigate();

    return (
        <div className="container mt-5 text-center">
            <h1 className="mb-4">Sistema de Apolíces</h1>
            <button className="btn btn-primary btn-lg" onClick={() => navigate("/apolices")}>
                Ir para a Lista de Apolíces
            </button>
        </div>
    )
}