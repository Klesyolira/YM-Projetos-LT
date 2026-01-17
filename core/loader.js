async function loadProject(slug) {
    try {
        const res = await fetch("/.netlify/functions/manage-db", {
            method: "POST",
            body: JSON.stringify({ action: 'load', slug: slug })
        });
        
        const data = await res.json();
        document.title = data.nome || "Loja";
        document.getElementById("app").innerHTML = data.html;
        
        // Executa os scripts que estão dentro do HTML carregado
        runScripts();
    } catch (e) {
        document.getElementById("app").innerHTML = "Erro ao carregar projeto do Banco de Dados.";
    }
}

function runScripts() {
    document.querySelectorAll("#app script").forEach(oldScript => {
        const newScript = document.createElement("script");
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        oldScript.parentNode.replaceChild(newScript, oldScript);
    });
}
