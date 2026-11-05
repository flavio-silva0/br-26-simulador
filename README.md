# BR26 — Simulador do Brasileirão Série A 2026

Site estático, responsivo e interativo. A simulação acontece no navegador; não requer backend ou banco de dados.

## Publicar na Vercel

1. Crie um repositório com os arquivos desta pasta (`index.html`, `favicon.svg` e `vercel.json`) ou importe a pasta no Vercel CLI.
2. Em **New Project → Import Git Repository**, escolha **Framework Preset: Other**.
3. Deixe **Build Command** vazio e **Output Directory** vazio (padrão da raiz do projeto).
4. Clique em **Deploy**. O arquivo `index.html` é publicado automaticamente.

Também pode executar `npx vercel` dentro desta pasta, após autenticar no Vercel CLI.

## Sobre os dados

Snapshot de 05/11/2026. O site não atualiza automaticamente os placares. 250.000 simulações compõem a base; cenários personalizados sorteiam 30.000 novas temporadas com os resultados escolhidos travados. Consulte a página **Metodologia** para detalhes e fontes.
