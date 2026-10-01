// CATÁLOGO DE PRODUTOS — edite apenas este arquivo para adicionar/remover itens.
// Campos: nome, marca, categoria ("lubrificantes" | "filtros" | "estetica" | "baterias" | "baterias_moto"),
//         detalhe (texto curto, opcional), aplicacao (veículos compatíveis, opcional — útil p/ baterias), foto (opcional, ex.: "assets/produtos/motul-5w30.webp")
// As baterias vêm do arquivo data/baterias.js (tabela Moura). Itens abaixo são EXEMPLOS — substitua pelos produtos reais.
const CATEGORIAS = {
  lubrificantes: { nome: "Lubrificantes", imagem: "assets/img/vitrine-motul.webp" },
  filtros:       { nome: "Filtros",       imagem: "assets/img/vitrine-wega.webp" },
  estetica:      { nome: "Estética Automotiva", imagem: "assets/img/vitrine-vonixx.webp" },
  baterias:      { nome: "Baterias",      imagem: "assets/img/vitrine-moura.webp" },
  baterias_moto: { nome: "Baterias de Moto", imagem: "assets/img/vitrine-moura.webp" }
};
const PRODUTOS = [
  { nome: "Motul 8100 X-cess 5W40 Sintético 1L", marca: "Motul", categoria: "lubrificantes", detalhe: "Sintético • Linha leve" },
  { nome: "Lubrax Valora 5W30 Semissintético 1L", marca: "Lubrax", categoria: "lubrificantes", detalhe: "Semissintético • Linha leve" },
  { nome: "Mobil Super 1000 15W40 Mineral 1L", marca: "Mobil", categoria: "lubrificantes", detalhe: "Mineral" },
  { nome: "Yamalube 10W40 4T Moto 1L", marca: "Yamalube", categoria: "lubrificantes", detalhe: "Motos" },
  { nome: "Shell Helix Diesel 15W40 20L", marca: "Shell", categoria: "lubrificantes", detalhe: "Linha pesada" },
  { nome: "Filtro de Óleo Wega", marca: "Wega", categoria: "filtros", detalhe: "Informe o modelo do veículo no WhatsApp" },
  { nome: "Filtro de Ar Wega", marca: "Wega", categoria: "filtros", detalhe: "Informe o modelo do veículo no WhatsApp" },
  { nome: "Filtro de Combustível Wega", marca: "Wega", categoria: "filtros", detalhe: "Informe o modelo do veículo no WhatsApp" },
  { nome: "Filtro de Cabine Wega", marca: "Wega", categoria: "filtros", detalhe: "Informe o modelo do veículo no WhatsApp" },
  { nome: "Shampoo Automotivo Vonixx 500ml", marca: "Vonixx", categoria: "estetica", detalhe: "Lavagem" },
  { nome: "Cera Carnaúba Vonixx", marca: "Vonixx", categoria: "estetica", detalhe: "Proteção e brilho" },
  { nome: "Renovador de Plásticos Vonixx", marca: "Vonixx", categoria: "estetica", detalhe: "Acabamento interno" }
];
