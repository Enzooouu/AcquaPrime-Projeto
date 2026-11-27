# Acqua Prime Piscinas: prévia do site

Prévia de site de uma página para a **Acqua Prime Piscinas** (Ponta Porã/MS), feita para apresentar ao dono da empresa.
HTML, CSS e JavaScript puros, sem framework e sem etapa de build.

## Como abrir

- **Mais simples:** dois cliques no `index.html`. Só o mapa e os botões de WhatsApp precisam de internet.
- **Igual a um site de verdade:** na pasta do projeto, rode `python -m http.server 8000` e abra http://localhost:8000.

## Estrutura

```
index.html            todo o conteúdo da página
assets/css/style.css  visual (cores e tamanhos no topo, em :root)
assets/js/main.js     interações (conversa de orçamento, aberto agora, menu, fotos ampliáveis)
assets/img/           fotos (todas provisórias) e favicon
assets/fonts/         Fredoka e Nunito (licença OFL), hospedadas no próprio site
logo/                 logo da Acqua Prime com fundo transparente (PNG, com e sem o slogan)
```

## Identidade

Tirada do logo da Acqua Prime: a bolha d'água, o respingo e as letras redondas. Fundo claro (céu), azul vivo,
bolhas subindo e ondas de água entre as seções. Títulos em Fredoka e textos em Nunito, as duas hospedadas no site.

## Seções

- **Tela de abertura:** o logo entra como uma bolha, com o slogan. Só na primeira visita da sessão (1,3 a 1,6 s); tocar pula.
- **Cabeçalho:** branco, com o logo, os links e o botão Orçamento. No celular, os links ficam num menu.
1. **Início:** "Sua piscina dos sonhos", aberto/fechado agora, botão do WhatsApp e a foto dentro de uma bolha com o selo 5,0 no Google.
2. **Tudo para a sua piscina:** venda, instalação, produtos e acessórios, pós-venda. Cada botão já começa a conversa de orçamento com a opção escolhida.
- **Faixa do slogan:** "Sua piscina com o nosso melhor!" num fundo azul com ondas.
3. **Piscinas instaladas:** grade de fotos que abrem grandes ao tocar, com o Instagram no fim.
4. **Monte seu orçamento:** um quadro em estilo conversa onde a pessoa preenche tudo de uma vez: o que procura, tamanho em m² (ou "Não sei"), ladrilho que gosta (azul clássico, azul-claro, verde-água, mosaico, branco ou ver na loja), nome, bairro e informações a mais. A prévia da mensagem monta ao vivo e o botão "Enviar tudo no WhatsApp" manda numa mensagem só para o (67) 99166-1449. As opções de ladrilho são exemplos: confirme com o dono quais a loja trabalha.
5. **Nota 5,0 no Google:** 50 avaliações e os três pontos que os clientes elogiam, em balões de fala.
6. **Onde estamos:** endereço, horário com o dia de hoje marcado, WhatsApp, Como chegar e mapa.
- **Rodapé:** logo, slogan, contatos e horário.
- **WhatsApp flutuante:** some quando outro botão de contato está na tela ou enquanto a pessoa digita na conversa.

## Antes de publicar: o que trocar

Procure por `TROCAR` no `index.html`.

| O quê | Arquivo | Observação |
| --- | --- | --- |
| Foto da bolha (início) | `assets/img/bolha-960.webp` e `bolha-560.webp` | quadradas, com a piscina no centro |
| Fotos dos serviços | `venda`, `instalacao`, `produtos`, `posvenda` (`.webp` e `-640.webp`) | 1100 × 800 e 640 px |
| Piscinas instaladas | seção `piscinas` no `index.html` | 6 fotos provisórias. Troque pelas fotos do Instagram @acquaprimepp, sempre com uma versão de 640 px |
| Imagem de compartilhamento | `assets/img/og.jpg` | 1200 × 630 |
| Elogios | seção `avaliacoes` | Se quiser, troque por trechos curtos copiados das avaliações reais do Google |

Ao trocar uma foto, salve em `.webp` com qualidade de 60 a 75 para o site continuar leve.

## Fotos provisórias (Unsplash)

**Todas as fotos agora são reais, do Instagram da Acqua Prime:** bolha-praia, praia, numai, vinil-antes, vinil-depois, hidro, reforma, reforma-obra, cloro, confort, trocador, aquecedor e og.jpg. Não há mais fotos de banco de imagem.

## Informações usadas

Só dados passados pela empresa: nome, endereço, WhatsApp, horário, Instagram, nota 5,0 com 50 avaliações no Google e os pontos elogiados.
Não há anos de mercado, número de obras, depoimentos com nome nem preços.
As frases curtas dos serviços (por exemplo, "acompanhamos a obra até a piscina estar cheia") são descrições gerais: confira com o dono.

## Cantos

Nenhum canto vivo, e os cantos aninhados são concêntricos: raio externo = raio interno + espaço
(ex.: cartão de 32px = foto de 22px + 10px de borda; celular da conversa 36px = balões de 22px + 14px).

## Cores

Tiradas do logo: azul-marinho do slogan (#072a5e), azul forte das letras (#0a63d1, cor dos botões), azul-claro da bolha (#19b8f5) e branco.
