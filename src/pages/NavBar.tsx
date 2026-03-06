import { useNavigate } from "react-router-dom";

export default function Navbar() {

  const navigate = useNavigate();
  
  return (
    <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          SisFin
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarColor01"
          aria-controls="navbarColor01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarColor01">
          <ul className="navbar-nav me-auto">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
                href="#"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Seguro
              </a>
              <div className="dropdown-menu">
                <a className="dropdown-item" href="/propostas"
                onClick={(e) => {
                    e.preventDefault();
                    navigate("/propostas");
                  }}
                >
                  Proposta
                </a>
                <a
                  className="dropdown-item"
                  href="/apolices"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/apolices");
                  }}
                >
                  Apólice
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
