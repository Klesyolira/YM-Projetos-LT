async function loadProject(slug) {
    const app = document.getElementById("app");
    app.innerHTML = "Carregando do Banco de Dados...";

    try {
        const res = await fetch("/.netlify/functions/manage-db", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: 'load', slug: slug })
        });

        const data = await res.json();
        
        if (data.html) {
            app.innerHTML = data.html;
            document.title = data.nome || "Loja";
            
            // Executa scripts que venham dentro do HTML salvo
            const scripts = app.querySelectorAll("script");
            scripts.forEach(s => {
                const newScript = document.createElement("script");
                newScript.text = s.innerHTML;
                document.body.appendChild(newScript);
            });
        }
    } catch (err) {
        app.innerHTML = "Erro ao carregar o projeto da nuvem.";
    }
}
