# AG Tech — Tecnologia Embarcada

Site estático (HTML + CSS + JS, sem dependências). Abra `index.html` no navegador ou publique a pasta em qualquer hospedagem estática (Vercel, Netlify, GitHub Pages, Hostinger…).

## Estrutura

```
index.html          Página única
css/style.css       Estilos (cores em :root)
js/main.js          Hero por rolagem, abas, parallax, formulário → WhatsApp
assets/img/
  logo.png                      Logo AG Tech (fundo transparente, menu)
  logo-cena.jpg                 Logo em cena (imagem de compartilhamento)
  logo-tecnologia-embarcada.jpg Logo com assinatura (rodapé)
  hero-conectados.jpg           Quadro final do hero (todos os veículos conectados)
  painel-ag-tech.jpg            Arte institucional (reserva)
  favicon.png
  seq/                          Quadros do hero: moto → carro → caminhonete → caminhão → trator → máquina
  bg/                           Fotos das faixas de transição e fundos de seção
```

## Trocar fotos

Para usar fotos ou vídeos próprios dos clientes, substitua os arquivos em `assets/img/seq/` e `assets/img/bg/` mantendo os mesmos nomes. Em `index.html`, o atributo `data-pos` de cada `.frame` define o ponto focal (posição do veículo) e a posição da mira do HUD.

## Contato configurado

- WhatsApp: (64) 99326-6464 (`WHATSAPP` em `js/main.js` e links `wa.me` no HTML)
- E-mail: agtech.commercial@gmail.com
- Instagram: @_ag_tech_

## Créditos das fotos de apoio

As fotos em `seq/` e `bg/` são do [Unsplash](https://unsplash.com) (Licença Unsplash, uso comercial livre):
moto `photo-1568772585407`, carro `photo-1533106418989`, caminhonete `photo-1559416523`, caminhão `photo-1601584115197`, trator `photo-1530267981375`, máquina `photo-1527847263472`, cidade `photo-1519501025264`, campo `photo-1563514227147`, instalação `photo-1625047509168`, região `photo-1500382017468`.
