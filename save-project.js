const { Octokit } = require("@octokit/rest");

exports.handler = async (event) => {
  // Segurança: Só aceita métodos POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { slug, content, token, owner, repo } = JSON.parse(event.body);
  const octokit = new Octokit({ auth: token });
  const path = `projects/${slug}/index.html`;

  try {
    let sha;
    try {
      const { data } = await octokit.repos.getContent({ owner, repo, path });
      sha = data.sha;
    } catch (e) {
      // Arquivo novo, não tem SHA ainda
    }

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: `Admin: Atualizando ${slug}`,
      content: Buffer.from(content).toString("base64"),
      sha,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Salvo com sucesso no GitHub!" }),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};
