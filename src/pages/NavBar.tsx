import { useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";

export default function Navbar() {
  const navigate = useNavigate();
  const auth = useAuth();


  console.log(auth.user?.profile)

  const nomeUsuario =
    auth.user?.profile?.name ||
    auth.user?.profile?.preferred_username ||
    "Usuário";

  const handleLogout = () => {
    auth.signoutRedirect();
  };

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
                <a
                  className="dropdown-item"
                  href="/propostas"
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

                    {auth.isAuthenticated && (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  href="#"
                  data-bs-toggle="dropdown"
                >
                  {/* Avatar */}
                  <img
                    src="https://ui-avatars.com/api/?name=User"
                    alt="user"
                    width="30"
                    height="30"
                    className="rounded-circle me-2"
                  />

                  {nomeUsuario}
                </a>

                <div className="dropdown-menu dropdown-menu-end">
                  <span className="dropdown-item-text">
                    👤 {nomeUsuario}
                  </span>

                  <div className="dropdown-divider"></div>

                  <button
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                  >
                    🚪 Logout
                  </button>
                </div>
              </li>
            </ul>
          )}

        </div>
      </div>
    </nav>
  );
}
