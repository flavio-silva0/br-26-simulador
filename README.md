# BR26 — Simule, revele e compartilhe sua tabela do Brasileirão 2026

Aplicativo web responsivo e independente para experimentar a reta final do Campeonato Brasileiro Série A 2026. O torcedor escolhe um clube, palpita nas **44 partidas restantes** em seis etapas, sem ver a classificação parcial, assiste a uma **revelação animada** e pode compartilhar uma imagem com a **tabela final completa dos 20 clubes**.

## Como funciona

- **Visão geral, classificação e risco de queda:** dados e projeções originais com referência em 05/11/2026.
- **Modo Torcedor:** escolha seu clube, determine 1 / X / 2, avance rodada por rodada; os resultados finais permanecem secretos até o último palpite.
- **Apito final cinematográfico:** animação de apuração com contagem, efeitos de estádio e progresso antes da revelação.
- **Emblemas reais:** os 20 escudos e a logo do Brasileirão Série A 2026 são exibidos como imagens, com uma rota `/api/crest` de consulta por lista fechada.
- **Compartilhamento:** gera PNG com todos os 20 clubes em Stories (1080 × 1920) ou feed (1080 × 1350). Inclui prévia, download, convite editável e link do próprio site.
- **WhatsApp, Instagram, Telegram e X:** compatibilidade progressiva com Web Share API no celular e fallback para abrir a rede, salvar a imagem e anexar manualmente.
- **Responsividade:** navegação dedicada, cards e modal adaptados para smartphones.

## Estrutura

```text
brasileirao-2026/
├── index.html              # Interface, dados e motor de simulação
├── favicon.svg             # Ícone da aplicação
├── vercel.json             # Configuração mínima
├── api/
│   └── crest.mjs           # Rota para imagens em mesma origem (PNG Canvas)
└── assets/
    ├── share-v4.css        # Animação, logos e modal responsivo
    └── share-v4.js         # Revelação, geração PNG e compartilhamento
```

## Publicar na Vercel

1. Copie o conteúdo deste pacote para a raiz de seu repositório GitHub.
2. Faça `git add . && git commit -m "feat: revelacao animada e compartilhamento social" && git push`.
3. A Vercel fará o deploy automaticamente se já estiver conectada ao repositório. Em novo projeto, use **Framework Preset: Other**, **Root Directory: ./**, **sem Build Command**.
4. A URL pública da plataforma é identificada automaticamente a partir de `window.location`. **Não é necessário escrever o domínio no código**. Se estiver testando localmente, o link de divulgação só estará disponível depois do deploy.

### Testar localmente

O HTML funciona sem instalação de dependências; para testar a rota de logos real, use `vercel dev` com a Vercel CLI. Abrir o HTML via arquivo local mostra os logos por URL pública, mas a exportação completa com logos depende da rota `/api/crest` (ativada na Vercel). O site em produção usa HTTPS, necessário para o compartilhamento nativo nos celulares compatíveis.

## Importante sobre as redes sociais

Websites **não conseguem anexar uma imagem automaticamente a qualquer rede social por um link simples**, em especial Instagram Stories e o link `wa.me`. A aplicação tenta o **compartilhamento nativo do celular** (imagem PNG + convite em texto, sempre que o navegador e o aplicativo aceitarem arquivos). Se não estiver disponível, o sistema baixa o PNG e abre o app/site com a mensagem para o usuário anexar a arte. A compatibilidade exata depende do dispositivo e do aplicativo instalado. Essa distinção é indicada no próprio modal.

A imagem mostra todos os 20 times, pontos, jogos, vitórias, empates, derrotas, gols e saldo. A geração é feita inteiramente no navegador; **não envia palpites nem imagens a um servidor**. O progresso é salvo em `localStorage`.

## Fontes dos emblemas e marca da competição

- Clubes: [FootyLogos — escudos Brasileirão Série A 2026](https://www.footylogos.com/pt-br/competition/brasileirao-serie-a) (imagens de identificação; citar FootyLogos conforme solicitado pelo acervo).
- Campeonato: [Wikimedia Commons — Logo Brasileirão Série A 2026](https://commons.wikimedia.org/wiki/File:Campeonato_Brasileiro_S%C3%A9rie_A_logo_(2026).svg).
- Tabela e referências probabilísticas: CBF e Brasileirão360, conforme a aba Metodologia do aplicativo.

**Marcas e escudos pertencem aos titulares dos direitos.** Este é um projeto independente, ilustrativo, não afiliado à CBF ou aos clubes. Resultados e placares de desempate são fictícios. A fonte de dados é um recorte de 05/11/2026 e **não é atualizada automaticamente**.
