async function loadProject(slug) {
    const app = document.getElementById("app");
    try {
        const res = await fetch("/.netlify/functions/manage-db", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: 'load', slug: slug })
        });
        const data = await res.json();
        
        if (data.html) {
            app.innerHTML = data.html;
            document.title = data.nome || "LUGH LT";
            
            // Re-executa scripts se houver no HTML injetado
            const scripts = app.querySelectorAll("script");
            scripts.forEach(oldScript => {
                const newScript = document.createElement("script");
                newScript.text = oldScript.innerHTML;
                document.body.appendChild(newScript);
            });
        }
    } catch (e) {
        app.innerHTML = "Erro ao carregar projeto do Banco Neon.";
    }
}
