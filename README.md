# Acqua Prime Piscinas — prévia do site

Site de uma página, em HTML, CSS e JavaScript puros (sem build). Para ver, abra `index.html` no navegador.

## Estrutura

```
index.html          página
css/style.css       estilos (pensado primeiro para celular)
js/main.js          "aberto agora", montador de orçamento, animações, mapa sob demanda
img/                fotos de água em WebP (leves)
img/galeria/        espaços da galeria (trocar pelas fotos do Instagram)
img/creditos.json   fonte e licença de cada foto usada
```

## Trocar as fotos da galeria

1. Baixe as fotos do Instagram @acquaprimepp.
2. Recorte em quadrado, cerca de 900 × 900 px, e salve como `img/galeria/piscina-01.jpg` (até `piscina-06.jpg`). Tente ficar abaixo de 150 KB por foto.
3. No `index.html`, na seção da galeria, troque `piscina-01.svg` por `piscina-01.jpg` (e assim por diante).
4. Troque o `alt` de cada foto por uma descrição do que ela mostra.

## Ideia do design

A piscina vista de cima é o único motivo da página: uma borda (a borda atérmica) em volta da água.
Ela vira a moldura das fotos, dos cartões, do mapa, do formulário e do botão de WhatsApp.
Todo canto aninhado segue a regra **raio externo = raio interno + espaçamento**
(ex.: botão 15px + painel 12px = 27px; + água 8px = 35px; + borda 10px = 45px).

## O que é real e o que é provisório

- Todos os dados da empresa (endereço, WhatsApp, horário, nota 5.0 com 50 avaliações, Instagram e os elogios) vieram do cliente.
- As fotos de água são de bancos abertos e estão creditadas no rodapé. Nenhuma delas é de uma piscina da Acqua Prime.
- Os desenhos da galeria e dos serviços são provisórios, até chegarem as fotos reais.
