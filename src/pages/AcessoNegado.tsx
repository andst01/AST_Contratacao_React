export function AcessoNegado() {
  return (
    <div className="access-denied-container">
      <div className="card">
        <div className="icon">🚫</div>
        <h1>Acesso Negado</h1>
        <p>Você não tem permissão para acessar esta página.</p>

        <div className="actions">
          <a href="/" className="btn-primary-acesso">
            Voltar para Home
          </a>
          <a href="/Home/Logout" className="btn-secondary-acesso">
            Trocar usuário
          </a>
        </div>
      </div>
    </div>
  );
}
