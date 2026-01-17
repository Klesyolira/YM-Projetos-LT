const { neon } = require('@netlify/neon');

exports.handler = async (event) => {
    // O Netlify preenche o NETLIFY_DATABASE_URL automaticamente
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    
    try {
        const body = JSON.parse(event.body);
        const { action, slug, nome, html } = body;

        // LISTAR PROJETOS
        if (action === 'get_list') {
            const projects = await sql`SELECT slug, nome FROM projetos ORDER BY updated_at DESC`;
            return { statusCode: 200, body: JSON.stringify(projects) };
        }

        // CARREGAR UM PROJETO ESPECÍFICO
        if (action === 'load') {
            const project = await sql`SELECT html, nome FROM projetos WHERE slug = ${slug}`;
            if (project.length === 0) return { statusCode: 404, body: "Não encontrado" };
            return { statusCode: 200, body: JSON.stringify(project[0]) };
        }

        // SALVAR OU ATUALIZAR
        if (action === 'save') {
            await sql`
                INSERT INTO projetos (slug, nome, html) 
                VALUES (${slug}, ${nome}, ${html})
                ON CONFLICT (slug) 
                DO UPDATE SET html = ${html}, nome = ${nome}, updated_at = CURRENT_TIMESTAMP
            `;
            return { statusCode: 200, body: "Guardado no Neon com sucesso!" };
        }

        // EXCLUIR
        if (action === 'delete') {
            await sql`DELETE FROM projetos WHERE slug = ${slug}`;
            return { statusCode: 200, body: "Eliminado!" };
        }

    } catch (e) {
        return { statusCode: 500, body: e.toString() };
    }
};
