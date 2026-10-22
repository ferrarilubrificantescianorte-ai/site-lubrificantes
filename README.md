# Site Ferrari Lubrificantes

Site estático (HTML + CSS + JavaScript puro, sem build e sem dependências) da Ferrari Lubrificantes, em Cianorte. Tem quatro páginas:

- **`index.html`**: página inicial. Apresenta a empresa e leva o cliente para um dos dois caminhos: troca de óleo ou produtos.
- **`troca-de-oleo.html`**: página da troca de óleo, com o formulário de orçamento em 3 passos, como funciona, marcas de óleo e perguntas frequentes.
- **`catalogo.html`**: aba de produtos, com filtros, um buscador "qual bateria serve no meu veículo" e um carrinho que monta o pedido e envia pelo WhatsApp.
- **`obrigado-orcamento.html`**: página de conversão do Google Ads. **Não renomeie nem mova.** Todo orçamento de troca de óleo passa por ela antes de abrir o WhatsApp.

O site não tem backend. Os pedidos e orçamentos viram uma mensagem pronta que é aberta em `https://wa.me/<número>`.

## Como rodar

Abra o `index.html` no navegador. Para testar como vai ficar publicado, sirva a pasta com qualquer servidor estático, por exemplo:

```sh
python -m http.server 8000
# depois acesse http://localhost:8000
```

Para publicar, envie a pasta inteira para qualquer hospedagem estática (GitHub Pages, Netlify, Vercel, cPanel etc.).

## Estrutura

```
index.html          Página inicial
troca-de-oleo.html  Troca de óleo + formulário de orçamento
catalogo.html       Produtos (catálogo)
obrigado-orcamento.html  Conversão do Google Ads (não renomear)
css/style.css       Estilos globais (as duas páginas usam)
css/catalogo.css    Estilos exclusivos do catálogo
js/site.js          Menu do celular (todas as páginas)
js/main.js          Formulário de orçamento em passos (troca-de-oleo)
js/catalogo.js      Catálogo: filtros, buscador de bateria, carrinho, envio ao WhatsApp
data/produtos.js    Categorias e produtos (exceto baterias)   ← editar aqui
data/baterias.js    Baterias Moura/Zetta e aplicações (gerado, não editar à mão)
data/fotos.js       Mapa de fotos dos produtos                ← editar aqui
assets/icons/       Logo, favicon, ícone do WhatsApp
assets/img/         Fotos da loja, vitrines e logos das marcas (arquivos *-opt.webp são as versões leves usadas no site)
assets/produtos/    Fotos dos produtos usadas no catálogo (.webp)
robots.txt          Orientação para o Google
sitemap.xml         Lista de páginas para o Google
```

Os scripts do catálogo precisam ser carregados nesta ordem em `catalogo.html`: `produtos.js` → `baterias.js` → `fotos.js` → `catalogo.js`.

## Tarefas comuns

### Adicionar ou remover produtos

Edite `data/produtos.js`. Cada produto é uma linha:

```js
{ nome: "Motul 8100 X-cess 5W40 Sintético 1L", marca: "Motul", categoria: "lubrificantes", detalhe: "Sintético • Linha leve" },
```

| Campo       | Obrigatório | Descrição |
|-------------|-------------|-----------|
| `nome`      | sim | Nome exibido. Também identifica o item no carrinho, então precisa ser **único**. |
| `marca`     | sim | Aparece no filtro de marcas. |
| `categoria` | sim | Uma das chaves de `CATEGORIAS`: `lubrificantes`, `filtros`, `estetica`, `baterias`, `baterias_moto`. |
| `detalhe`   | não | Texto curto embaixo do nome. |
| `aplicacao` | não | Veículos compatíveis (entra na busca). |
| `foto`      | não | Caminho da imagem. Também dá para definir a foto pelo `data/fotos.js`. |

Para criar uma categoria nova, adicione uma entrada em `CATEGORIAS` (no topo do mesmo arquivo) com `nome` e `imagem`. A imagem da categoria é usada nos produtos que não têm foto própria.

> Os produtos que estão hoje em `produtos.js` são **exemplos**. Substitua pelos itens reais.

### Baterias

`data/baterias.js` é **gerado** a partir da tabela de aplicações da Moura e contém:

- `BATERIAS`: lista de baterias (Moura e Zetta), com o campo `zetta` apontando para a opção equivalente mais em conta.
- `APLICACOES`: linhas no formato `[tipo, marca, modelo, anoDe, anoAte, índiceEmBATERIAS]`, com tipo `C` = carro, `M` = moto e `T` = caminhão. O buscador por veículo usa essa lista.

Não edite esse arquivo à mão. O script que gera esse arquivo não está nesta pasta, então para atualizar é preciso gerar de novo a partir da tabela da Moura.

### Fotos dos produtos

1. Coloque a imagem em `assets/produtos/`. Prefira `.webp` ou `.jpg`, com cerca de 800×800 px e até ~100 KB.
2. Adicione uma linha em `data/fotos.js`: `"CHAVE": "assets/produtos/arquivo.webp",`

Ordem de prioridade da chave (da mais específica para a mais geral):

1. Nome completo do produto: `"Cera Carnaúba Vonixx"`
2. Código da bateria (última palavra do nome): `"M60GD"`
3. Campo `foto` do próprio produto
4. Marca + linha (baterias): `"Zetta:leve"`, `"Zetta:pesada"`
5. Linha (baterias): `"linha:AGM"`, `"linha:EFB"`, `"linha:leve"` (convencional até 78Ah), `"linha:pesada"` (acima de 78Ah), `"linha:moto"`
6. Marca: `"marca:Zetta"`
7. Se nada bater, usa a imagem da categoria.

> ⚠️ **Maiúsculas e minúsculas importam** na maioria das hospedagens (Linux), mesmo que no Windows funcione. Use nomes de arquivo **minúsculos, sem espaços e sem acentos**, e escreva o caminho no `fotos.js` exatamente igual ao nome do arquivo.

### Trocar o número do WhatsApp

São dois números, no formato internacional (só dígitos):

- **Troca de óleo:** `554436373709`, em `js/main.js` (constante `NUMERO_WHATSAPP`), no botão flutuante e nos botões "WhatsApp" de `index.html` e `troca-de-oleo.html`, e como link de reserva em `obrigado-orcamento.html`.
- **Produtos:** `5544999998979`, em `js/catalogo.js` (constante `WHATS`) e no botão "WhatsApp: produtos" de `index.html`.

Os telefones exibidos (topo e rodapé) estão em cada HTML.

### Aviso de estoque

O texto sobre encomenda (1 a 2 semanas) fica na constante `AVISO_ESTOQUE` em `js/catalogo.js`.

## Como o catálogo funciona

- **Abas e filtros:** as abas saem de `CATEGORIAS`. A busca ignora acentos e procura em nome, marca, detalhe e aplicação. Dá para abrir direto numa categoria com `catalogo.html?cat=baterias`. A barra de busca, marca e abas fica fixa ao rolar a página.
- **Imagem do produto:** usa a foto do produto (`data/fotos.js`) quando existe. Sem foto, mostra o logo da marca, se houver `assets/img/logo-<marca>.webp` (a lista está em `LOGOS`, em `js/catalogo.js`); sem logo, usa a imagem da categoria.
- **Preços:** o site não mostra preços. Cada produto tem **"+ Adicionar ao pedido"** e **"Consultar valor"** (pergunta só aquele item no WhatsApp).
- **Buscador de bateria:** aparece nas abas Baterias e Baterias de Moto. Entende abreviações (`vw`, `gm`, `mb`…) e um ano no meio do texto (ex.: `Palio 2012`). Fan, Titan e Start são tratadas como linha CG. Para cada veículo mostra a Moura e, quando existir, a opção Zetta mais em conta.
- **Carrinho:** fica salvo no `localStorage` (chave `ferrari_carrinho_v2`). Se o formato do carrinho mudar, troque essa chave para não carregar dados antigos.
- **Envio e rastreamento (Google Ads):** "Enviar para o WhatsApp" e "Consultar valor" guardam a mensagem em `sessionStorage` e abrem `obrigado-orcamento.html?origem=produtos`, que dispara a conversão e abre o WhatsApp de produtos. O `?origem=produtos` serve só para identificar a origem; o nome da página não pode mudar.

## Formulário de orçamento (troca-de-oleo)

`js/main.js` controla o formulário em passos (Serviço → Veículo → Envio):

- **Troca Simples / Troca Completa / Troca de Câmbio:** passam pelos 3 passos e pedem os dados do veículo (modelo, ano, motor, combustível). Troca de Câmbio também pede o tipo de transmissão.
- **Radiador / Outro:** pulam o passo do veículo e pedem só nome e uma observação (obrigatória em "Outro").
- Escolhendo **Motor → Outro**, aparece um campo de texto para digitar o motor.
- Links como `troca-de-oleo.html?servico=completa#orcamento` já abrem com o serviço escolhido (`simples`, `completa`, `cambio`, `radiador`, `outro`).
- Ao enviar, a mensagem é guardada em `sessionStorage` e o navegador vai para `obrigado-orcamento.html`, que abre o WhatsApp.

Os serviços são os botões `name="servico"` em `troca-de-oleo.html`. Se renomear algum valor, atualize `PRECISA_VEICULO` e `ATALHOS` em `js/main.js`.

## SEO e desempenho

- Cada página tem título e descrição próprios, link canônico e pré-visualização para compartilhar (Open Graph). Os endereços usam `https://ferrarilubrificantes.com.br/`. Se o domínio mudar, troque nas tags `canonical`, `og:url`, `og:image`, nos blocos `application/ld+json` e no `sitemap.xml`/`robots.txt`.
- **Dados estruturados (JSON-LD):** `index.html` descreve o negócio local (endereço, horário, telefones, localização); `troca-de-oleo.html` tem o serviço e as perguntas frequentes; `catalogo.html` tem o caminho de navegação. O Instagram (`@f.lubrificantes`) está no rodapé, na seção "Onde estamos" e no `sameAs` do JSON-LD da página inicial. Se mudar endereço, horário, telefone ou redes sociais, atualize também esses blocos (fim do `<head>`).
- As perguntas frequentes em `troca-de-oleo.html` também alimentam o JSON-LD `FAQPage`: ao editar um texto, edite nos dois lugares.
- `obrigado-orcamento.html` fica de fora do `sitemap.xml` e tem `noindex` de propósito (página só de conversão).
- Imagens: todas as fotos do site são `.webp` leves. Ao adicionar fotos novas, use no máximo ~1000 px de largura e ~150 KB, e informe `width` e `height` no `<img>`.

## Arquivos antigos que podem ser apagados

Depois da reforma, estes arquivos não são mais usados pelo site (os `*-opt.webp` e as fotos `.webp` novas os substituíram). Apagar libera cerca de 13 MB:

- `assets/img/`: `imagem-hero.webp`, `fachada-frente.webp`, `interno-loja.webp`, `loja-barracao.webp`, `loja-box-oleo.webp`, `loja-interno.webp`, `servico-elevador.webp`, `vitrine-motul.webp`, `vitrine-moura.webp`, `vitrine-vonixx.webp`, `vitrine-wega.webp`, `logo-empresa.webp`
- `assets/produtos/`: `Linha_AGM.png`, `linha_leve.png`, `Linha_pesada.png`, `linha-EFB.webp`, `linha-moto.png`, `Zetta-leve.png`, `zetta-pesada.png`
- A pasta `_backup-antes-da-reforma` guarda a versão anterior do site; apague quando não precisar mais.

## Campanha de fim de ano (baterias + prêmios)

Arquivos: `js/campanha.js`, `css/campanha.css` e os blocos marcados com `data-campanha` / `data-camp-nota` em `index.html` e `catalogo.html`.

- **Configuração**: no topo de `js/campanha.js`, objeto `CAMP`:
  - `fim`: data final (depois dela faixa, pop-up e blocos somem sozinhos). Para encerrar antes, coloque uma data passada.
  - `validaAte`: texto exibido ("31/12/2026").
  - `regulamento`: texto do certificado de autorização/regulamento (aparece no pop-up e na seção). Hoje está vazio.
  - `diasSemReaparecer`: depois de fechado, o pop-up só volta após esse número de dias (7).
  - `atrasoPopup`: tempo até abrir sozinho, em milissegundos (7000).
  - `whats`: WhatsApp do botão "Quero participar".
- **Onde aparece**: faixa amarela no topo (todas as páginas, exceto a de obrigado), pop-up automático só na página inicial e no catálogo (nunca na troca de óleo), seção na home e aviso na aba Baterias.
- **Pré-visualizar**: abra qualquer página com `?campanha=1` no final do endereço.
- **Textos**: pop-up e faixa em `js/campanha.js`; seção da home em `index.html` (id `campanha`); aviso do catálogo em `catalogo.html` (classe `camp-mini`).
- **Encerrar de vez**: apague `data-campanha` blocks, os links de `campanha.css`/`campanha.js` nas 3 páginas.
