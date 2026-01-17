const { neon } = require('@netlify/neon');

exports.handler = async (event) => {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
    };

    if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers };

    try {
        const body = JSON.parse(event.body);
        const { action, slug, nome, html } = body;

        if (action === 'get_list') {
            const projects = await sql`SELECT slug, nome FROM projetos ORDER BY updated_at DESC`;
            return { statusCode: 200, headers, body: JSON.stringify(projects) };
        }

        if (action === 'load') {
            const project = await sql`SELECT html, nome FROM projetos WHERE slug = ${slug}`;
            return { statusCode: 200, headers, body: JSON.stringify(project[0] || { html: "" }) };
        }

        if (action === 'save') {
            await sql`
                INSERT INTO projetos (slug, nome, html) 
                VALUES (${slug}, ${nome}, ${html})
                ON CONFLICT (slug) 
                DO UPDATE SET html = ${html}, nome = ${nome}, updated_at = CURRENT_TIMESTAMP
            `;
            return { statusCode: 200, headers, body: JSON.stringify({ message: "Sucesso" }) };
        }

        return { statusCode: 400, headers, body: "Ação inválida" };
    } catch (e) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
    }
};
