async function loadProject(slug) {
    const app = document.getElementById("app");
    try {
        const res = await fetch("/.netlify/functions/manage-db", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: 'load', slug: slug })
        });
        const data = await res.json();
        
        if (data && data.html) {
            app.innerHTML = data.html;
            
            // Executa os scripts internos (Carrinho, WhatsApp, etc)
            const scripts = app.querySelectorAll("script");
            scripts.forEach(oldScript => {
                const newScript = document.createElement("script");
                newScript.text = oldScript.innerHTML;
                document.body.appendChild(newScript);
            });
        }
    } catch (e) {
        app.innerHTML = "<div class='text-white p-10'>Erro ao carregar do Neon.</div>";
    }
}
