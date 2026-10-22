// CAMPANHA DE FIM DE ANO: faixa no topo + pop-up (+ blocos marcados com data-campanha no HTML).
// Tudo some sozinho depois da data final. Para encerrar antes, troque "fim" por uma data passada.
// Para ver o pop-up a qualquer momento, abra a página com  ?campanha=1  no final do endereço.
(function () {
    var CAMP = {
        id: "fim-de-ano-2026",
        fim: "2026-12-31T23:59:59-03:00",     // a campanha termina no fim deste dia (horário de Brasília)
        validaAte: "31/12/2026",
        whats: "5544999998979",                // WhatsApp de produtos
        regulamento: "",                        // ex.: "Certificado de Autorização SPA/MF nº 00.000000/2026" (aparece no pop-up e na seção)
        diasSemReaparecer: 7,                   // depois de fechado, o pop-up só volta após esse prazo
        atrasoPopup: 7000                       // milissegundos até o pop-up abrir
    };

    // ---------- campanha encerrada: remove tudo e sai ----------
    var blocos = document.querySelectorAll("[data-campanha]");
    if (Date.now() > Date.parse(CAMP.fim)) {
        blocos.forEach(function (b) { b.parentNode && b.parentNode.removeChild(b); });
        return;
    }

    var pagina = document.body.getAttribute("data-pagina") || "";
    var forcar = /[?&]campanha=1\b/.test(location.search);
    var CHAVE_POPUP = "ferrari_campanha_" + CAMP.id;
    var CHAVE_FAIXA = "ferrari_faixa_" + CAMP.id;

    function lerLocal(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
    function gravarLocal(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
    function lerSessao(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
    function gravarSessao(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }

    var ICO = {
        gift: '<svg class="icone" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>',
        snow: '<svg class="icone" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v20"/><path d="m4.93 4.93 14.14 14.14"/><path d="M2 12h20"/><path d="m19.07 4.93-14.14 14.14"/><path d="m9.5 3.5 2.5 2 2.5-2"/><path d="m9.5 20.5 2.5-2 2.5 2"/></svg>',
        bike: '<svg class="icone" viewBox="0 0 24 24" aria-hidden="true"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>',
        x: '<svg class="icone" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
        seta: '<svg class="icone" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>'
    };

    var MSG = "Olá! Vi a campanha de fim de ano no site e quero saber como participar.";
    var LINK_ZAP = "https://wa.me/" + CAMP.whats + "?text=" + encodeURIComponent(MSG);
    var NOTA = "Campanha válida até " + CAMP.validaAte + ". " + (CAMP.regulamento ? CAMP.regulamento + "." : "Consulte as regras na loja.");

    // o texto de validade também aparece nos blocos fixos do HTML
    document.querySelectorAll("[data-camp-nota]").forEach(function (e) { e.textContent = NOTA; });

    // ---------- FAIXA NO TOPO ----------
    if (!lerSessao(CHAVE_FAIXA) && !forcar) {
        var faixa = document.createElement("div");
        faixa.className = "camp-faixa";
        faixa.setAttribute("role", "region");
        faixa.setAttribute("aria-label", "Campanha de fim de ano");
        faixa.innerHTML =
            '<div class="camp-faixa-in">' + ICO.gift +
            '<p><strong>Campanha de fim de ano:</strong> <span class="camp-longo">na compra de uma bateria, concorra a ar-condicionado, bicicleta e muitos prêmios.</span><span class="camp-curto">compre uma bateria e concorra a prêmios.</span></p>' +
            '<button type="button" class="camp-faixa-btn" data-camp-abrir>Saiba mais</button>' +
            '<button type="button" class="camp-faixa-x" aria-label="Fechar aviso da campanha">' + ICO.x + '</button></div>';
        document.body.insertBefore(faixa, document.body.firstChild);
        faixa.querySelector(".camp-faixa-x").addEventListener("click", function () {
            gravarSessao(CHAVE_FAIXA, "1");
            faixa.parentNode.removeChild(faixa);
        });
    }

    // ---------- POP-UP ----------
    var modal = document.createElement("div");
    modal.className = "camp-modal";
    modal.id = "camp-modal";
    modal.hidden = true;
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "camp-titulo");
    modal.innerHTML =
        '<div class="camp-fundo" data-camp-fechar></div>' +
        '<div class="camp-janela">' +
            '<button type="button" class="camp-x" aria-label="Fechar" data-camp-fechar>' + ICO.x + '</button>' +
            '<div class="camp-topo">' +
                '<span class="camp-selo">' + ICO.gift + ' Campanha de fim de ano</span>' +
                '<h2 id="camp-titulo">Compre uma bateria e <em>concorra a prêmios</em></h2>' +
            '</div>' +
            '<div class="camp-corpo">' +
                '<ul class="camp-premios">' +
                    '<li><span class="ico">' + ICO.snow + '</span><strong>1 ar-condicionado</strong></li>' +
                    '<li><span class="ico">' + ICO.bike + '</span><strong>1 bicicleta</strong></li>' +
                    '<li><span class="ico">' + ICO.gift + '</span><strong>e muitos prêmios</strong></li>' +
                '</ul>' +
                '<p class="camp-para"><strong>Baterias para:</strong> carros, motos, caminhões, alarme e nobreak.</p>' +
                '<div class="camp-acoes">' +
                    '<a class="btn btn-primario btn-grande btn-bloco" href="catalogo.html?cat=baterias">Ver baterias ' + ICO.seta + '</a>' +
                    '<a class="btn btn-contorno btn-bloco" href="' + LINK_ZAP + '" target="_blank" rel="noopener">Quero participar</a>' +
                '</div>' +
                '<p class="camp-nota">' + NOTA + '</p>' +
            '</div>' +
        '</div>';
    document.body.appendChild(modal);

    var ultimoFoco = null;
    function focaveis() {
        return Array.prototype.slice.call(modal.querySelectorAll("a[href], button:not([disabled])"));
    }
    function abrir() {
        if (!modal.hidden) return;
        ultimoFoco = document.activeElement;
        modal.hidden = false;
        document.body.classList.add("camp-aberto");
        requestAnimationFrame(function () { modal.classList.add("visivel"); });
        var f = focaveis(); if (f.length) f[0].focus();
        gravarLocal(CHAVE_POPUP, String(Date.now()));
    }
    function fechar() {
        if (modal.hidden) return;
        modal.classList.remove("visivel");
        document.body.classList.remove("camp-aberto");
        setTimeout(function () { modal.hidden = true; }, 220);
        if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
    }

    document.addEventListener("click", function (e) {
        if (e.target.closest("[data-camp-abrir]")) { e.preventDefault(); abrir(); }
        else if (e.target.closest("[data-camp-fechar]")) { fechar(); }
        else if (modal && !modal.hidden && e.target.closest("#camp-modal a.btn")) { gravarLocal(CHAVE_POPUP, String(Date.now())); }
    });
    document.addEventListener("keydown", function (e) {
        if (modal.hidden) return;
        if (e.key === "Escape") { fechar(); return; }
        if (e.key === "Tab") {      // mantém o foco dentro do pop-up
            var f = focaveis(); if (!f.length) return;
            var primeiro = f[0], ultimo = f[f.length - 1];
            if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
            else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
        }
    });

    // ---------- abertura automática (só na página inicial e no catálogo) ----------
    function podeAbrirSozinho() {
        if (pagina !== "inicio" && pagina !== "produtos") return false;
        var visto = parseInt(lerLocal(CHAVE_POPUP) || "0", 10);
        if (visto && Date.now() - visto < CAMP.diasSemReaparecer * 86400000) return false;
        return true;
    }
    if (forcar) { setTimeout(abrir, 400); }
    else if (podeAbrirSozinho()) {
        setTimeout(function () {
            var el = document.activeElement;
            var digitando = el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName);
            var carrinho = document.body.classList.contains("cart-aberto");
            if (!digitando && !carrinho && !document.hidden) abrir();
        }, CAMP.atrasoPopup);
    }
})();
