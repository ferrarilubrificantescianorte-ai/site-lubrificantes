(function () {
  const WHATS = "5544999998979";
  const AVISO_ESTOQUE = "Se algum modelo não estiver em estoque na semana, fazemos a encomenda e ele chega em 1 a 2 semanas.";
  const CHAVE = "ferrari_carrinho_v2";
  const TODOS = PRODUTOS.filter((p) => p.categoria !== "baterias").concat(typeof BATERIAS !== "undefined" ? BATERIAS : []);
  // foto: nome completo > código (ex.: M60GD) > campo "foto" > "Marca:linha" > "linha:..." > "marca:X" (ver data/fotos.js)
  const FOTOS_ = typeof FOTOS !== "undefined" ? FOTOS : {};
  const linhaDe = (p) => { // AGM, EFB, leve (até 78Ah), pesada (acima de 78Ah) ou moto
    if (p.categoria === "baterias_moto") return "moto";
    if (p.categoria !== "baterias") return "";
    if (/^AGM/.test(p.detalhe)) return "AGM";
    if (/^EFB/.test(p.detalhe)) return "EFB";
    const m = p.detalhe.match(/(\d+)Ah/);
    return m ? (+m[1] <= 78 ? "leve" : "pesada") : "";
  };
  const fotoDe = (p) => { const l = linhaDe(p);
    return FOTOS_[p.nome] || FOTOS_[p.nome.split(" ").pop()] || p.foto || (l && (FOTOS_[p.marca + ":" + l] || FOTOS_["linha:" + l])) || FOTOS_["marca:" + p.marca] || ""; };
  const porNome = {}; TODOS.forEach((p) => (porNome[p.nome] = p));
  let carrinho = {}; // { nomeDoProduto: quantidade }
  try { carrinho = JSON.parse(localStorage.getItem(CHAVE)) || {}; } catch (e) {}
  let categoriaAtiva = new URLSearchParams(location.search).get("cat") || "todas";
  if (categoriaAtiva !== "todas" && !CATEGORIAS[categoriaAtiva]) categoriaAtiva = "todas";

  const $ = (id) => document.getElementById(id);
  const salvar = () => { try { localStorage.setItem(CHAVE, JSON.stringify(carrinho)); } catch (e) {} };
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const semAcento = (t) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const unicos = (a) => [...new Set(a)].sort((x, y) => x.localeCompare(y, "pt-BR"));
  const opts = (rotulo, lista) => `<option value="">${rotulo}</option>` + lista.map((v) => `<option>${esc(v)}</option>`).join("");

  // ---------- BUSCADOR POR VEÍCULO (cliente digita) ----------
  const ALIAS = { vw: "volkswagen", gm: "chevrolet", chevy: "chevrolet", merc: "mercedes", mb: "mercedes", benz: "mercedes" };
  const ICONE = { C: "🚗", M: "🏍️", T: "🚛" };
  const ALT_MOTO = { fan: "cg", titan: "cg", start: "cg" }; // Fan, Titan e Start usam a mesma bateria da linha CG
  const ehMotoAba = () => categoriaAtiva === "baterias_moto";
  const LINHAS = APLICACOES.map((a) => ({ t: a[0], marca: a[1], modelo: a[2], de: a[3], ate: a[4], bat: a[5], txt: semAcento(a[1] + " " + a[2]) }));
  const fBusca = $("f-busca"), fSug = $("f-sugestoes"), fRes = $("f-resultado");
  const chave = (l) => l.t + "|" + l.marca + "|" + l.modelo;
  let ultimaAba = null;
  let escolhido = null; // { chave, ano }

  function consulta() {
    let ano = null; const txt = [];
    semAcento(fBusca.value).split(/\s+/).filter(Boolean).forEach((p) => { if (/^(19|20)\d\d$/.test(p)) ano = +p; else txt.push(ALIAS[p] || p); });
    return { txt, ano };
  }
  const linhasDe = (txt, ano) => LINHAS.filter((l) => (ehMotoAba() ? l.t === "M" : l.t !== "M") && txt.every((t) => l.txt.includes(t) || (ehMotoAba() && ALT_MOTO[t] && l.txt.includes(ALT_MOTO[t]))) && (!ano || (ano >= l.de && ano <= l.ate)));

  function sugerir() {
    escolhido = null; fRes.innerHTML = "";
    const { txt, ano } = consulta();
    if (!txt.length || txt.join("").length < 2) { fSug.innerHTML = ""; return; }
    const vistos = new Map(); linhasDe(txt, ano).forEach((l) => { if (!vistos.has(chave(l))) vistos.set(chave(l), l); });
    const lista = [...vistos.values()].sort((x, y) => (x.marca + x.modelo).localeCompare(y.marca + y.modelo, "pt-BR"));
    if (!lista.length) {
      const msg = `Olá! Procuro bateria para: ${fBusca.value.trim()}`;
      fSug.innerHTML = `<p class="cart-aviso">Não encontramos esse veículo na lista. <a class="f-zap" target="_blank" rel="noopener" href="https://wa.me/${WHATS}?text=${encodeURIComponent(msg)}">Pergunte pelo WhatsApp</a> que verificamos para você.</p>`;
      return;
    }
    const nota = ehMotoAba() && txt.some((t) => ALT_MOTO[t]) ? '<p class="cart-aviso">Fan, Titan e Start usam a mesma bateria da linha CG da Honda (mesma cilindrada).</p>' : "";
    fSug.innerHTML = nota + lista.slice(0, 8).map((l) => `<button type="button" class="f-sug" data-k="${esc(chave(l))}" data-ano="${ano || ""}">${ICONE[l.t]} ${esc(l.marca)} ${esc(l.modelo)}</button>`).join("") +
      (lista.length > 8 ? `<p class="cart-aviso">Mostrando 8 de ${lista.length}. Digite mais (modelo ou ano) para refinar.</p>` : "");
  }

  function mostrar(k, ano) {
    escolhido = { k, ano };
    const linhas = LINHAS.filter((l) => chave(l) === k && (!ano || (ano >= l.de && ano <= l.ate)));
    const { marca, modelo } = linhas[0];
    const veic = `${marca} ${modelo}` + (ano ? " " + ano : "");
    fBusca.value = veic; fSug.innerHTML = "";
    const porBat = new Map(); linhas.forEach((l) => { if (!porBat.has(l.bat)) porBat.set(l.bat, []); porBat.get(l.bat).push(l.de === l.ate ? l.de : l.de + "–" + l.ate); });
    fRes.innerHTML = `<p class="cat-contagem">Para <strong>${esc(veic)}</strong>:</p>` + [...porBat.keys()].sort((x, y) => x - y).map((i) => {
      const b = BATERIAS[i], z = b.zetta && porNome["Bateria Zetta " + b.zetta];
      const anos = ano ? "" : `<br><small>Anos: ${esc(porBat.get(i).join(", "))}</small>`;
      return `<div class="f-bat moura"><div><strong>${esc(b.nome)}</strong><br><small>${esc(b.detalhe)}</small>${anos}</div>
        <button class="cat-add" data-nome="${esc(b.nome)}" data-veic="${esc(veic)}">+ Adicionar ao pedido</button></div>` +
        (z ? `<div class="f-bat f-econ"><div><span class="f-tag">Opção mais em conta</span><br><strong>${esc(z.nome)}</strong><br><small>${esc(z.detalhe.split(" • ").slice(0, 3).join(" • "))}</small></div>
        <button class="cat-add" data-nome="${esc(z.nome)}" data-veic="${esc(veic)}">+ Adicionar ao pedido</button></div>` : "");
    }).join("") + '<p class="cart-aviso">Mais de uma opção pode servir (ex.: convencional ou AGM). Nossa equipe confirma a ideal no WhatsApp. ' + AVISO_ESTOQUE + '</p>';
  }

  fBusca.addEventListener("input", sugerir);
  fBusca.addEventListener("keydown", (e) => { if (e.key === "Enter") { const s = fSug.querySelector(".f-sug"); if (s) mostrar(s.dataset.k, +s.dataset.ano || null); } });
  fSug.addEventListener("click", (e) => { const s = e.target.closest(".f-sug"); if (s) mostrar(s.dataset.k, +s.dataset.ano || null); });

  // ---------- LISTA DE PRODUTOS ----------
  const abas = $("cat-abas");
  abas.innerHTML = [["todas", "Todos"], ...Object.entries(CATEGORIAS).map(([k, v]) => [k, v.nome])]
    .map(([k, n]) => `<button class="cat-aba" data-cat="${k}">${n}</button>`).join("");
  $("cat-marca").innerHTML = opts("Todas as marcas", unicos(TODOS.map((p) => p.marca)));
  abas.addEventListener("click", (e) => { const b = e.target.closest(".cat-aba"); if (b) { categoriaAtiva = b.dataset.cat; desenhar(); } });
  $("cat-busca").addEventListener("input", desenhar);
  $("cat-cta").addEventListener("click", (e) => { const b = e.target.closest("[data-cat]"); if (!b) return; categoriaAtiva = b.dataset.cat; desenhar(); fBusca.focus(); $("bloco-bateria").scrollIntoView({ behavior: "smooth", block: "start" }); });
  $("cat-marca").addEventListener("change", desenhar);

  function desenhar() {
    document.querySelectorAll(".cat-aba").forEach((b) => b.classList.toggle("ativa", b.dataset.cat === categoriaAtiva));
    const abaBat = categoriaAtiva === "baterias" || categoriaAtiva === "baterias_moto";
    $("bloco-bateria").hidden = !abaBat;
    if (abaBat && ultimaAba !== categoriaAtiva) {
      fBusca.value = ""; fSug.innerHTML = ""; fRes.innerHTML = "";
      $("f-titulo").textContent = ehMotoAba() ? "🏍️ Qual bateria serve na sua moto?" : "🔋 Qual bateria serve no seu veículo?";
      fBusca.placeholder = ehMotoAba() ? "Digite a moto. Ex.: CG 160, Ninja 400, XRE 300" : "Digite o veículo. Ex.: Palio 2012, Onix, Hilux";
    }
    ultimaAba = categoriaAtiva;
    $("cat-cta").hidden = categoriaAtiva !== "todas" || !!$("cat-busca").value.trim();
    const q = semAcento($("cat-busca").value.trim()), marca = $("cat-marca").value;
    const itens = TODOS.filter((p) =>
      (categoriaAtiva === "todas" || p.categoria === categoriaAtiva) && (!marca || p.marca === marca) &&
      (!q || semAcento([p.nome, p.marca, p.detalhe, p.aplicacao, p.zetta].join(" ")).includes(q)));
    const ordemCat = {}; itens.forEach((p) => { if (!(p.categoria in ordemCat)) ordemCat[p.categoria] = Object.keys(ordemCat).length; });
    itens.sort((a, b) => ordemCat[a.categoria] - ordemCat[b.categoria] || (a.marca === "Zetta") - (b.marca === "Zetta")); // em cada categoria, Zetta depois da Moura
    $("cat-contagem").textContent = itens.length + (itens.length === 1 ? " produto" : " produtos");
    $("cat-grid").innerHTML = itens.length ? itens.map((p) => `
      <article class="cat-item${p.marca === "Moura" ? " moura" : p.marca === "Zetta" ? " zetta" : ""}">
        <img src="${esc(fotoDe(p) || CATEGORIAS[p.categoria].imagem)}" alt="${esc(p.nome)}" loading="lazy"${fotoDe(p) ? ' class="foto-produto"' : ""}>
        <div class="cat-item-corpo">
          <span class="cat-marca">${esc(p.marca)}</span>
          <h3>${esc(p.nome)}</h3>
          ${p.detalhe ? `<p class="cat-detalhe">${esc(p.detalhe)}</p>` : ""}
          ${p.zetta ? `<p class="cat-detalhe">Opção mais em conta: Zetta ${esc(p.zetta)}</p>` : ""}
          ${p.medidas ? `<p class="cat-detalhe">Medidas: ${esc(p.medidas)}</p>` : ""}
          ${p.aplicacao ? `<p class="cat-aplic" title="Clique para ver tudo"><b>Serve em:</b> ${esc(p.aplicacao)}</p>` : ""}
          <button class="cat-add" data-nome="${esc(p.nome)}">+ Adicionar<span class="cat-add-txt"> ao pedido</span></button>
        </div>
      </article>`).join("") : '<p class="cat-vazio">Nenhum produto encontrado. Não achou o que procura? Fale com a gente pelo WhatsApp — temos mais de 6000 itens!</p>';
  }

  function adicionar(e) {
    const ap = e.target.closest(".cat-aplic"); if (ap) { ap.classList.toggle("aberto"); return; }
    const b = e.target.closest(".cat-add"); if (!b) return;
    carrinho[b.dataset.nome] = (carrinho[b.dataset.nome] || 0) + 1;
    if (b.dataset.veic && !$("cart-veiculo").value) $("cart-veiculo").value = b.dataset.veic;
    salvar(); carrinhoUI(); b._t = b._t || b.innerHTML; b.textContent = "✓ Adicionado";
    clearTimeout(b._timer); b._timer = setTimeout(() => (b.innerHTML = b._t), 900);
  }
  $("cat-grid").addEventListener("click", adicionar);
  fRes.addEventListener("click", adicionar);

  // ---------- CARRINHO ----------
  const itensCarrinho = () => Object.keys(carrinho).filter((n) => porNome[n]);
  function carrinhoUI() {
    const ids = itensCarrinho(), total = ids.reduce((s, n) => s + carrinho[n], 0);
    $("cart-total").textContent = total; $("cart-enviar").disabled = !total;
    $("cart-lista").innerHTML = total ? ids.map((n) => `
      <div class="cart-linha">
        <div>${esc(n)}<small>${esc(porNome[n].marca)}</small></div>
        <div class="cart-qtd">
          <button data-acao="menos" data-nome="${esc(n)}" aria-label="Diminuir">−</button>
          <strong>${carrinho[n]}</strong>
          <button data-acao="mais" data-nome="${esc(n)}" aria-label="Aumentar">+</button>
        </div>
      </div>`).join("") : '<p class="cat-vazio">Seu pedido está vazio.</p>';
  }
  $("cart-lista").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-acao]"); if (!b) return;
    const n = b.dataset.nome; carrinho[n] += b.dataset.acao === "mais" ? 1 : -1;
    if (carrinho[n] <= 0) delete carrinho[n]; salvar(); carrinhoUI();
  });
  $("cart-limpar").addEventListener("click", () => { carrinho = {}; salvar(); carrinhoUI(); });
  const abrir = (v) => document.body.classList.toggle("cart-aberto", v);
  $("cart-fab").addEventListener("click", () => abrir(true));
  $("cart-fundo").addEventListener("click", () => abrir(false));
  $("cart-fechar").addEventListener("click", () => abrir(false));
  $("cart-enviar").addEventListener("click", () => {
    const ids = itensCarrinho(); if (!ids.length) return;
    const nome = $("cart-nome").value.trim(), veiculo = $("cart-veiculo").value.trim();
    let msg = "Olá! Vim pelo catálogo do site e gostaria de saber os valores e a disponibilidade destes itens:\n\n";
    msg += ids.map((n) => `• ${carrinho[n]}x ${n}`).join("\n");
    if (nome) msg += `\n\n*Nome:* ${nome}`;
    if (veiculo) msg += `\n*Veículo:* ${veiculo}`;
    window.open(`https://wa.me/${WHATS}?text=${encodeURIComponent(msg)}`, "_blank");
  });

  desenhar(); carrinhoUI();
})();
