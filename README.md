<<<<<<< HEAD
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
=======
# 🏆 BR26 — Simulador do Brasileirão 2026

### O futuro está em jogo.
>>>>>>> b6b1314507561c8f518a71b0fa6d1b21abbe81cb

Uma plataforma interativa de análise e simulação do **Campeonato Brasileiro Série A 2026**, desenvolvida para transformar estatísticas, probabilidades e confrontos em uma experiência visual moderna.

<<<<<<< HEAD
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
=======
O BR26 permite explorar cenários para a reta final do campeonato, acompanhar a classificação projetada e descobrir as chances de rebaixamento de cada equipe.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## ⚽ Sobre o projeto

O BR26 nasceu com o objetivo de responder a uma das perguntas mais interessantes do futebol brasileiro:

**Quais clubes têm mais chances de conquistar seus objetivos e quais correm maior risco de rebaixamento?**

Utilizando probabilidades de resultados e simulações estatísticas, a aplicação apresenta diferentes possibilidades para a classificação final do Brasileirão.

O projeto combina análise de dados, estatística e desenvolvimento web em uma plataforma responsiva, acessível tanto pelo computador quanto pelo celular.

## 🚀 Funcionalidades

### 📊 Dashboard executivo

Visão geral da reta final do campeonato, com indicadores, projeções e destaques da disputa pelo título e contra o rebaixamento.

### 🏆 Classificação projetada

- Classificação completa dos 20 clubes.
- Comparação entre pontuação atual e pontuação projetada.
- Projeções de desempenho até a última rodada.
- Identificação visual das zonas da tabela.

### 📉 Probabilidade de rebaixamento

- Chances estimadas de cada equipe terminar no Z4.
- Ranking dos clubes mais ameaçados.
- Gráficos e indicadores interativos.
- Comparação entre diferentes cenários.

### 📅 Calendário de confrontos

- Jogos restantes do campeonato.
- Probabilidade de vitória do mandante.
- Probabilidade de empate.
- Probabilidade de vitória do visitante.
- Destaque para confrontos diretos.

### 🧪 Laboratório de simulações

A principal funcionalidade da plataforma.

O usuário pode selecionar resultados de partidas e observar como eles impactam as projeções do campeonato.

**Exemplo:** o que acontece com as chances de rebaixamento do Corinthians se ele vencer o Grêmio?

A aplicação recalcula os cenários considerando os resultados definidos pelo usuário.

### 📱 Design responsivo

Interface adaptada para diferentes dispositivos:

- Desktop e notebooks.
- Tablets.
- Smartphones Android e iOS.
- Navegação otimizada para telas pequenas.
- Animações e transições suaves.

---

## 🧠 Metodologia estatística

O simulador utiliza uma abordagem probabilística baseada no método de **Monte Carlo**.

Em vez de considerar apenas um resultado possível para cada partida, o modelo avalia milhares de combinações para estimar os cenários mais prováveis.

### Etapas da simulação

1. Obtenção da classificação e do calendário restante.
2. Definição das probabilidades de vitória, empate e derrota para cada confronto.
3. Simulação dos resultados das partidas.
4. Atualização da pontuação dos clubes.
5. Classificação das equipes conforme os critérios do campeonato.
6. Contabilização das posições finais e dos rebaixamentos.
7. Cálculo das probabilidades estimadas.

### Parâmetros

| Parâmetro | Configuração |
|---|---|
| Campeonato | Brasileirão Série A 2026 |
| Equipes | 20 |
| Simulações de referência | 250.000 |
| Simulações de novos cenários | 30.000 |
| Jogos restantes na base inicial | 44 |
| Método | Monte Carlo |
| Dados de referência | 05/11/2026 |

**Fórmula básica:**

Probabilidade de rebaixamento = (Simulações em que o clube terminou no Z4 / Total de simulações) × 100

> **Nota:** as probabilidades são estimativas estatísticas, não garantias de resultados. O projeto utiliza uma base histórica de referência, sem atualização automática dos dados em tempo real. Os resultados podem variar conforme as premissas do modelo.

---

## 🎨 Interface e experiência

O projeto utiliza uma identidade visual inspirada no universo do futebol, com foco em modernidade, legibilidade e interatividade.

**Principais características:**

- Tema escuro com detalhes em verde-limão.
- Tipografia Manrope e Space Grotesk.
- Ícones vetoriais SVG.
- Cards com indicadores esportivos.
- Gráficos e barras de probabilidade.
- Microinterações e animações.
- Navegação mobile dedicada.

## 🛠️ Tecnologias utilizadas

| Tecnologia | Aplicação |
|---|---|
| HTML5 | Estrutura da interface |
| CSS3 | Estilização, responsividade e animações |
| JavaScript | Interatividade e motor de simulação |
| SVG | Elementos gráficos e ícones |
| Vercel | Hospedagem e deploy |

A aplicação funciona sem backend e não exige a instalação de frameworks.

---

## 💻 Como executar localmente

**1. Clone o repositório**

```bash
git clone https://github.com/SEU_USUARIO/brasileirao-2026.git
```

**2. Acesse a pasta**

```bash
cd brasileirao-2026
```

**3. Execute o projeto**

Abra o arquivo `index.html` no navegador ou utilize a extensão **Live Server** no VS Code.

Não é necessário instalar dependências.

## ☁️ Deploy na Vercel

O projeto pode ser publicado diretamente pela Vercel.

1. Acesse [vercel.com](https://vercel.com).
2. Conecte sua conta do GitHub.
3. Importe o repositório `brasileirao-2026`.
4. Selecione o framework `Other`.
5. Mantenha o diretório raiz como `./`.
6. Clique em **Deploy**.

Como se trata de uma aplicação estática, não há necessidade de configurar um comando de build.

Após a publicação, novos pushes para a branch de produção poderão gerar deploys automaticamente.

---

## 🔮 Possíveis evoluções

- [ ] Integração com API de resultados do Brasileirão.
- [ ] Atualização automática da classificação.
- [ ] Probabilidades dinâmicas conforme novos resultados.
- [ ] Histórico de evolução do risco de rebaixamento.
- [ ] Comparação entre clubes e cenários.
- [ ] Simulação de chances de título e classificação para competições continentais.
- [ ] Compartilhamento de cenários personalizados.

## 📚 Dados e limitações

A versão inicial foi desenvolvida com uma fotografia do Campeonato Brasileiro em **5 de novembro de 2026**.

O calendário e as probabilidades por confronto foram utilizados como entradas do modelo de simulação.

O BR26 é um projeto independente, de caráter demonstrativo, analítico e educacional, sem vínculo oficial com a CBF ou os clubes participantes.

---

## 👨‍💻 Autor

**Flávio Silva**

Projeto desenvolvido com foco em análise de dados, estatística, simulação probabilística e experiência web interativa.

---

**BR26 — Porque cada ponto muda tudo. ⚽**
>>>>>>> b6b1314507561c8f518a71b0fa6d1b21abbe81cb
