# Acqua Prime Piscinas: prévia do site

Prévia de site de uma página para a **Acqua Prime Piscinas** (Ponta Porã/MS), feita para apresentar ao dono da empresa.
Segue a mesma linha do protótipo da Belcor Piscinas: HTML, CSS e JavaScript puros, sem framework e sem etapa de build.

## Como abrir

- **Mais simples:** dois cliques no `index.html`. Só o mapa e os botões de WhatsApp precisam de internet.
- **Igual a um site de verdade:** na pasta do projeto, rode `python -m http.server 8000` e abra http://localhost:8000.

## Estrutura

```
index.html            todo o conteúdo da página
assets/css/style.css  visual (cores e tamanhos no topo, em :root)
assets/js/main.js     interações (orçamento, fileira de fotos, aberto agora, menu, fotos ampliáveis)
assets/img/           fotos (todas provisórias) e favicon
assets/fonts/         Hanken Grotesk (licença OFL), hospedada no próprio site
```

## Seções

- **Tela de abertura:** a piscina enche de água, o nome aparece e a tela sobe. Só na primeira visita da sessão, dura de 1,3 a 1,6 s e some ao tocar. Quem ativou "reduzir movimento" não vê.
- **Cabeçalho fixo:** transparente sobre a foto do topo, branco quando a pessoa rola. No celular, os links ficam num menu.
1. **Topo:** foto em tela cheia, "Sua piscina dos sonhos" com a parte de baixo das letras ondulando como debaixo d'água, o botão "Pedir orçamento no WhatsApp" e a nota 5,0 com 50 avaliações.
2. **Serviços:** venda de piscinas, instalação, produtos e acessórios, pós-venda. Cada link "Orçar…" já marca a opção no orçamento.
3. **Piscinas instaladas:** fileira de fotos que dá a volta sem fim e avança sozinha. Cada foto abre grande ao tocar. No fim, o botão para o Instagram.
4. **Monte seu orçamento:** o que procura, tamanho aproximado, medidas (calcula os litros), nome, bairro e observações. A mensagem só leva o que a pessoa escolheu e abre o WhatsApp (67) 99166-1449 com o texto pronto.
5. **Avaliações no Google:** nota 5,0, 50 avaliações e os três pontos que os clientes elogiam (atendimento e pós-venda, qualidade dos produtos, melhor preço da cidade).
6. **Onde estamos:** aberto/fechado agora (horário de MS), endereço, horário, WhatsApp, Como chegar e mapa.
- **Rodapé:** o número grande, Instagram e endereço.
- **WhatsApp fixo** no canto. Some quando outro botão de contato está na tela ou enquanto a pessoa digita no orçamento.

## Antes de publicar: o que trocar

Procure por `TROCAR` no `index.html`.

| O quê | Arquivo | Observação |
| --- | --- | --- |
| Foto do topo (computador) | `assets/img/hero-1920.webp` | 1920 × 1280, horizontal |
| Foto do topo (celular) | `assets/img/hero-828.webp` | 828 × 1242, vertical, com a água no meio |
| Fotos dos serviços | `venda`, `instalacao`, `produtos`, `posvenda` (`.webp` e `-640.webp`) | 1100 × 800 e 640 px |
| Piscinas instaladas | seção `obras` no `index.html` | 6 fotos provisórias. Troque pelas fotos do Instagram @acquaprimepp, sempre com uma versão de 640 px |
| Imagem de compartilhamento | `assets/img/og.jpg` | 1200 × 630 |
| Logo | cabeçalho e rodapé (`.logo-mark` e `.logo-text`) | Hoje é um logo provisório em código (uma piscina vista de cima). Se a loja tiver logo, troque por ele |
| Elogios | seção `avaliacoes` | Se quiser, troque por trechos curtos copiados das avaliações reais do Google |

Ao trocar uma foto, salve em `.webp` com qualidade de 60 a 75 para o site continuar leve.

## Fotos provisórias (Unsplash)

Todas são do [Unsplash](https://unsplash.com/license), de uso livre. **Nenhuma mostra uma piscina da Acqua Prime.**

| Arquivo | Foto |
| --- | --- |
| hero-1920 / casa-640 / og | https://images.unsplash.com/photo-1613490493576-7fde63acd811 |
| hero-828 / venda | https://images.unsplash.com/photo-1575429198097-0414ec08e8cd |
| instalacao | https://images.unsplash.com/photo-1582610116397-edb318620f90 |
| produtos | https://images.unsplash.com/photo-1572331165267-854da2b10ccc |
| posvenda | https://images.unsplash.com/photo-1530053969600-caed2596d242 |
| obra-5 | https://images.unsplash.com/photo-1584132967334-10e028bd69f7 |
| obra-6 | https://images.unsplash.com/photo-1596178065887-1198b6148b2b |

## Informações usadas

Só dados passados pela empresa: nome, endereço, WhatsApp, horário, Instagram, nota 5,0 com 50 avaliações no Google e os pontos elogiados.
Não há anos de mercado, número de obras, depoimentos com nome nem preços.
As frases curtas dos serviços (por exemplo, "acompanhamos a obra até a piscina estar cheia") são descrições gerais: confira com o dono.

## Cantos

Nenhum canto vivo, e os cantos aninhados são concêntricos: raio externo = raio interno + espaço
(ex.: blocos de 30px = cartões de 22px + 8px de espaço; logo de 9px = água de 5px + borda de 4px).
