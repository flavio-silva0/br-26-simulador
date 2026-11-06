# BR26 — Simulador do Brasileirão 2026

Um simulador para dar palpites nos 42 jogos restantes da Série A e conferir como fica a classificação. A tabela só aparece depois do último palpite.

[Abrir o site](https://brasileirao-2026-rho.vercel.app/)

## O que dá para fazer

- Escolher um dos 20 clubes e preencher os resultados em seis etapas.
- Revisar os palpites antes ou depois de ver a classificação.
- Conferir pontos, vitórias, empates, derrotas, gols e saldo da tabela final.
- Salvar a tabela em PNG ou compartilhar pelo celular.
- Consultar um cenário possível de classificação e as chances de rebaixamento.
- Comparar o risco de queda conforme o resultado de um confronto direto.

O progresso fica salvo no navegador. Não é necessário criar uma conta.

## Como os resultados são calculados

A base usa a classificação e o calendário de **6 de novembro de 2026, após os jogos de 5 de novembro**, com 42 partidas por disputar. Os dados são estáticos: o site não acompanha resultados em tempo real.

As projeções e chances de queda vêm de uma base de 250 mil temporadas simuladas por Monte Carlo. A aba Classificação mostra um cenário com pontos inteiros. As faixas de pontos e os riscos são informações estatísticas dessa base, não garantias de resultado.

No simulador, cada palpite define vitória do mandante, empate ou vitória do visitante. O site gera um placar compatível com a escolha para calcular gols e desempates. A ordem considera pontos, vitórias, saldo de gols e gols marcados; se ainda houver empate, a ordem é aproximada. Esses placares são fictícios.

Resultados incorporados em 05/11: Palmeiras 6 × 1 Remo e Cruzeiro 3 × 2 Bahia. Pontos, gols e projeções foram recalculados; essas partidas não recebem novos palpites.

## Compartilhamento

A imagem inclui os 20 clubes e destaca o time escolhido, sem rodapé promocional.

| Formato | Resolução do PNG |
| --- | --- |
| Stories, 9:16 | 2160 × 3840 |
| Feed, 4:5 | 2160 × 2700 |

Em navegadores compatíveis, o botão de compartilhar envia imagem e mensagem pelo menu do celular. Nos demais, é possível salvar o PNG e copiar a mensagem. Alguns aplicativos exigem que a imagem seja anexada manualmente.

## Executar localmente

O projeto usa HTML, CSS e JavaScript, sem framework ou etapa de build.

```sh
git clone https://github.com/flavio-silva0/br-26-simulador.git
cd br-26-simulador
npx vercel dev
```

O comando da Vercel serve a interface e a rota `/api/crest`, usada para carregar escudos na mesma origem e permitir a exportação pelo Canvas. O endereço local aparece no terminal.

Um servidor estático também permite navegar pela interface, mas não executa a rota de escudos.

## Arquivos principais

```text
index.html                         Interface, dados e cálculo da classificação
assets/site.css                    Estilo das telas e ajustes para celular
assets/share-v4.css                 Componentes do compartilhamento
assets/share-v4.js                  Geração de PNG e compartilhamento
assets/brasileirao-serie-a-2026.svg  Logo da competição
api/crest.mjs                      Carregamento dos escudos por lista permitida
vercel.json                        Configuração da hospedagem
```

## Publicação

Na Vercel, use o preset **Other**, com a raiz do projeto em `./` e sem comando de build. A rota `api/crest.mjs` precisa ser executada como função.

Com a integração GitHub habilitada, os pushes na branch de produção podem iniciar um deploy. O resultado deve ser conferido em **Deployments** na Vercel; um push concluído, sozinho, não confirma a publicação.

## Fontes

- [CBF — Série A 2026](https://www.cbf.com.br/futebol-brasileiro/tabelas/campeonato-brasileiro/serie-a/2026): classificação e calendário.
- [Brasileirão 360](https://brasileirao360.com/rodada/34): probabilidades usadas nas partidas da base.
- [FootyLogos](https://www.footylogos.com/pt-br/competition/brasileirao-serie-a): escudos dos clubes.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Campeonato_Brasileiro_S%C3%A9rie_A_logo_(2026).svg): logo do Brasileirão.

Projeto independente, sem vínculo oficial com a CBF ou os clubes. Marcas e escudos pertencem aos respectivos titulares.

Desenvolvido por [Flávio Silva](https://github.com/flavio-silva0).
