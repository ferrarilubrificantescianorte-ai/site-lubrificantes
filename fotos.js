// FOTOS DOS PRODUTOS
// 1) Coloque a imagem na pasta  assets/produtos/
// 2) Escreva uma linha aqui:  "CHAVE": "assets/produtos/arquivo.webp",
//
// A CHAVE pode ser (do mais específico para o mais geral):
//   - nome completo do produto:      "Cera Carnaúba Vonixx": "assets/produtos/cera-vonixx.webp"
//   - código da bateria:             "M60GD": "assets/produtos/m60gd.webp"
//   - marca + linha (só baterias):   "Zetta:leve": "assets/produtos/zetta-leve.webp"
//   - linha (só baterias):           "linha:AGM" | "linha:EFB" | "linha:leve" | "linha:pesada" | "linha:moto"
//   - marca (qualquer produto):      "marca:Zetta": "assets/produtos/zetta.webp"
//
// Linhas: AGM e EFB = baterias desse tipo (qualquer Ah); leve = convencional até 78Ah; pesada = convencional acima de 78Ah.
// "linha:..." vale para Moura e Zetta; para uma foto só da Zetta use "Zetta:leve" ou "Zetta:pesada".
// Produtos sem foto usam a imagem da categoria.
// Dica de imagem: .webp ou .jpg, cerca de 800x800 px, até ~100 KB, nome em minúsculas e sem espaços/acentos.
const FOTOS = {
  "linha:AGM":    "assets/produtos/Linha_AGM.png",
  "linha:EFB":    "assets/produtos/linha-EFB.webp",
  "linha:leve":   "assets/produtos/linha_leve.png",
  "linha:pesada": "assets/produtos/Linha_pesada.png",
  "Zetta:leve": "assets/produtos/Zetta-leve.png",
  "Zetta:pesada": "assets/produtos/zetta-pesada.png",
  "linha:moto": "assets/produtos/linha-moto.png"
  //
  // Exemplos de fotos específicas (têm prioridade sobre as linhas):
  // "M60GD": "assets/produtos/m60gd.webp",
  // "Zetta:leve": "assets/produtos/zetta-leve.webp",
};
