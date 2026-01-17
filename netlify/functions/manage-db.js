const { neon } = require('@netlify/neon');

exports.handler = async (event) => {
    // A variável NETLIFY_DATABASE_URL é preenchida automaticamente pela extensão Neon
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    
    // Cabeçalhos para permitir a comunicação e evitar erros de JSON
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
    };

    // Responde a verificações de segurança do navegador
    if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers };

    try {
        const body = JSON.parse(event.body);
        const { action, slug, nome, html } = body;

        // AÇÃO: LISTAR PROJETOS
        if (action === 'get_list') {
            const projects = await sql`SELECT slug, nome FROM projetos ORDER BY updated_at DESC`;
            return { statusCode: 200, headers, body: JSON.stringify(projects) };
        }

        // AÇÃO: CARREGAR UM PROJETO
        if (action === 'load') {
            const project = await sql`SELECT html, nome FROM projetos WHERE slug = ${slug}`;
            if (project.length === 0) return { statusCode: 404, headers, body: JSON.stringify({error: "Não encontrado"}) };
            return { statusCode: 200, headers, body: JSON.stringify(project[0]) };
        }

        // AÇÃO: SALVAR OU ATUALIZAR
        if (action === 'save') {
            await sql`
                INSERT INTO projetos (slug, nome, html) 
                VALUES (${slug}, ${nome}, ${html})
                ON CONFLICT (slug) 
                DO UPDATE SET html = ${html}, nome = ${nome}, updated_at = CURRENT_TIMESTAMP
            `;
            return { statusCode: 200, headers, body: JSON.stringify({ message: "Salvo com sucesso" }) };
        }

        // AÇÃO: ELIMINAR
        if (action === 'delete') {
            await sql`DELETE FROM projetos WHERE slug = ${slug}`;
            return { statusCode: 200, headers, body: JSON.stringify({ message: "Eliminado" }) };
        }

        return { statusCode: 400, headers, body: "Ação não reconhecida" };

    } catch (e) {
        console.error("Erro no Banco:", e);
        return { 
            statusCode: 500, 
            headers, 
            body: JSON.stringify({ error: e.message }) 
        };
    }
};
