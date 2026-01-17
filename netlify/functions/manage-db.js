const { neon } = require('@netlify/neon');

exports.handler = async (event) => {
    // Força a conexão com o banco 'neondb' que aparece na sua foto
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    
    try {
        if (!event.body) return { statusCode: 400, body: "Corpo da requisição vazio" };
        const body = JSON.parse(event.body);
        const { action, slug, nome, html } = body;

        if (action === 'get_list') {
            const projects = await sql`SELECT slug, nome FROM projetos ORDER BY updated_at DESC`;
            return { statusCode: 200, body: JSON.stringify(projects) };
        }

        if (action === 'load') {
            const project = await sql`SELECT html, nome FROM projetos WHERE slug = ${slug}`;
            return { statusCode: 200, body: JSON.stringify(project[0] || {html: ""}) };
        }

        if (action === 'save') {
            await sql`
                INSERT INTO projetos (slug, nome, html) 
                VALUES (${slug}, ${nome}, ${html})
                ON CONFLICT (slug) 
                DO UPDATE SET html = ${html}, nome = ${nome}, updated_at = CURRENT_TIMESTAMP
            `;
            return { statusCode: 200, body: JSON.stringify({ message: "Sucesso" }) };
        }

        if (action === 'delete') {
            await sql`DELETE FROM projetos WHERE slug = ${slug}`;
            return { statusCode: 200, body: JSON.stringify({ message: "Excluído" }) };
        }

    } catch (e) {
        console.error("ERRO NO BANCO:", e);
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: e.message }) 
        };
    }
};
