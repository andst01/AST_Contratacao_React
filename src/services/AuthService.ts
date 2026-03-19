export class AuthService {

  static logout() {
    sessionStorage.clear();
    localStorage.clear();

    const currentAppUrl = window.location.origin;
    
    window.location.href = `https://localhost:5001/Account/ExternalLogout?returnUrl=${currentAppUrl}`;
  }

}
