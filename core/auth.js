const Auth = {
    // Tenta fazer login
    login: (user, pass) => {
        // Substitui 'admin' e '123' pelas tuas credenciais se quiseres
        if (user === "admin" && pass === "123") {
            localStorage.setItem("isLogged", "true");
            localStorage.setItem("userSession", user);
            return true;
        }
        return false;
    },

    // Verifica se existe sessão ativa
    isLogged: () => {
        return localStorage.getItem("isLogged") === "true";
    },

    // Encerra a sessão (Botão Sair)
    logout: () => {
        localStorage.removeItem("isLogged");
        localStorage.removeItem("userSession");
        return true;
    }
};
