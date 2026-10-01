# Site Ferrari Lubrificantes

Site estático (HTML + CSS + JavaScript puro, sem build e sem dependências) da Ferrari Lubrificantes, em Cianorte. Tem duas páginas:

- **`index.html`**: página institucional com os diferenciais, a vitrine de categorias, informações sobre a oficina, o formulário de orçamento, as marcas e a localização.
- **`catalogo.html`**: catálogo de produtos com filtros, um buscador "qual bateria serve no meu veículo" e um carrinho que monta o pedido e envia pelo WhatsApp.

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
index.html          Página principal
catalogo.html       Página do catálogo
css/style.css       Estilos globais (as duas páginas usam)
css/catalogo.css    Estilos exclusivos do catálogo
js/main.js          Formulário de orçamento dinâmico + rolagem suave (index)
js/catalogo.js      Catálogo: filtros, buscador de bateria, carrinho, envio ao WhatsApp
data/produtos.js    Categorias e produtos (exceto baterias)   ← editar aqui
data/baterias.js    Baterias Moura/Zetta e aplicações (gerado, não editar à mão)
data/fotos.js       Mapa de fotos dos produtos                ← editar aqui
assets/icons/       Logo, favicon, ícone do WhatsApp
assets/img/         Fotos da loja, vitrines e logos das marcas
assets/produtos/    Fotos dos produtos usadas no catálogo
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

O número (formato internacional, só dígitos, ex.: `5544999998979`) aparece em três lugares:

- `js/catalogo.js`: constante `WHATS`
- `js/main.js`: constante `numeroTelefone`
- `index.html`: link do botão flutuante (`whatsapp-flutuante`)

### Aviso de estoque

O texto sobre encomenda (1 a 2 semanas) fica na constante `AVISO_ESTOQUE` em `js/catalogo.js`.

## Como o catálogo funciona

- **Abas e filtros:** as abas saem de `CATEGORIAS`. A busca ignora acentos e procura em nome, marca, detalhe e aplicação. Dá para abrir direto numa categoria com `catalogo.html?cat=baterias`.
- **Buscador de bateria:** aparece nas abas Baterias e Baterias de Moto. Entende abreviações (`vw`, `gm`, `mb`…) e um ano no meio do texto (ex.: `Palio 2012`). Fan, Titan e Start são tratadas como linha CG. Para cada veículo mostra a Moura e, quando existir, a opção Zetta mais em conta.
- **Carrinho:** fica salvo no `localStorage` (chave `ferrari_carrinho_v2`). Ao enviar, abre o WhatsApp com a lista de itens e, se preenchidos, o nome e o veículo do cliente. Se o formato do carrinho mudar, troque essa chave para não carregar dados antigos.

## Formulário de orçamento (index)

`js/main.js` mostra ou esconde campos conforme o serviço escolhido:

- **Troca Simples / Troca Completa / Troca de Câmbio:** pede os dados do veículo (modelo, ano, motor, combustível). Troca de Câmbio também pede o tipo de transmissão.
- **Radiador / Outros:** mostra só um campo de mensagem livre.

Os serviços são as `<option>` do campo `tipo-servico` em `index.html`. Se você renomear "Radiador", "Outros" ou "Troca de Câmbio", atualize as comparações em `js/main.js`.
- Escolhendo **Motor → Outro**, aparece um campo de texto para digitar o motor.
