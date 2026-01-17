const Auth = {
    // Função de Login
    login: (user, pass) => {
        // Aqui você pode conferir se o código é 4866 ou qualquer outra senha
        if ((user === "admin" && pass === "4866") || (user === "admin" && pass === "123")) {
            localStorage.setItem("isLogged", "true");
            localStorage.setItem("adm_code", "4866"); // Guarda a permissão
            return true;
        }
        return false;
    },

    // Verifica se está logado
    isLogged: () => {
        return localStorage.getItem("isLogged") === "true";
    },

    // Botão de Sair (Limpa tudo)
    logout: () => {
        localStorage.clear();
        return true;
    }
};
