// Formulário de orçamento de troca de óleo (troca-de-oleo.html) — em 3 passos.
// O envio monta a mensagem e passa por obrigado-orcamento.html (página de conversão do Google Ads),
// que abre o WhatsApp. NÃO renomeie nem remova essa página.
document.addEventListener("DOMContentLoaded", function () {

    // Troca de óleo e demais serviços: (44) 3637-3709
    var NUMERO_WHATSAPP = "554436373709";

    var form = document.getElementById("form-orcamento");
    if (!form) return;

    // serviços que precisam dos dados do veículo
    var PRECISA_VEICULO = { "Troca Simples": true, "Troca Completa": true, "Troca de Câmbio": true };
    // atalhos da home: troca-de-oleo.html?servico=completa#orcamento
    var ATALHOS = { simples: "Troca Simples", completa: "Troca Completa", cambio: "Troca de Câmbio", radiador: "Radiador", outro: "Outro" };

    var painelDe = {};
    form.querySelectorAll(".passo-form").forEach(function (p) { painelDe[p.dataset.passo] = p; });

    var progresso = document.getElementById("progresso");
    var progressoTexto = document.getElementById("progresso-texto");
    var btnVoltar = document.getElementById("btn-voltar");
    var btnSeguir = document.getElementById("btn-seguir");
    var btnEnviar = document.getElementById("btn-enviar-form");

    var selMotor = document.getElementById("veiculo-motor");
    var inputMotorOutro = document.getElementById("motor-outro");
    var blocoCambio = document.getElementById("bloco-cambio");
    var selCambio = document.getElementById("tipo-cambio");
    var blocoObs = document.getElementById("bloco-observacao");
    var obs = document.getElementById("observacao");
    var obsLabel = document.getElementById("observacao-label");
    var resumo = document.getElementById("resumo-pedido");

    var passoAtual = 0;

    function servico() {
        var marcado = form.querySelector('input[name="servico"]:checked');
        return marcado ? marcado.value : "";
    }
    function precisaVeiculo() { return !!PRECISA_VEICULO[servico()]; }
    // enquanto nenhum serviço foi escolhido, mostra 3 passos (o caso mais comum)
    function passos() { return (!servico() || precisaVeiculo()) ? ["servico", "veiculo", "envio"] : ["servico", "envio"]; }

    // ---------- desenha o passo atual ----------
    function desenhar() {
        var lista = passos();
        if (passoAtual >= lista.length) passoAtual = lista.length - 1;
        var id = lista[passoAtual];

        Object.keys(painelDe).forEach(function (k) { painelDe[k].classList.toggle("ativo", k === id); });

        progresso.innerHTML = lista.map(function (_, i) { return '<span class="' + (i <= passoAtual ? "feito" : "") + '"></span>'; }).join("");
        progressoTexto.textContent = "Passo " + (passoAtual + 1) + " de " + lista.length;

        btnVoltar.classList.toggle("escondido", passoAtual === 0);
        var ultimo = passoAtual === lista.length - 1;
        btnSeguir.classList.toggle("escondido", ultimo);
        btnEnviar.classList.toggle("escondido", !ultimo);
        btnSeguir.disabled = id === "servico" && !servico();

        if (id === "envio") montarEnvio();
    }

    // ---------- passo final: observação + resumo ----------
    function montarEnvio() {
        var s = servico();
        var temVeiculo = precisaVeiculo();
        blocoObs.classList.toggle("escondido", temVeiculo);
        if (!temVeiculo) {
            obs.required = s === "Outro";
            obsLabel.innerHTML = s === "Outro"
                ? 'Conte o que você precisa'
                : 'Alguma observação? <small>(opcional)</small>';
        } else {
            obs.required = false;
        }
        var linhas = ["<strong>Serviço:</strong> " + esc(rotuloServico(s))];
        if (temVeiculo) {
            var v = valor("veiculo-modelo") + " " + valor("veiculo-ano");
            linhas.push("<strong>Veículo:</strong> " + esc(v.trim()));
            linhas.push("<strong>Motor:</strong> " + esc(motor()) + " • " + esc(valor("veiculo-combustivel")));
            if (s === "Troca de Câmbio" && selCambio.value) linhas.push("<strong>Transmissão:</strong> " + esc(selCambio.value));
        }
        resumo.innerHTML = linhas.map(function (l) { return "<span>" + l + "</span>"; }).join("");
    }

    function rotuloServico(s) { return s === "Outro" ? "Outro serviço / dúvida" : s; }
    function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
    function valor(id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; }
    function motor() { return selMotor.value === "Outro" ? inputMotorOutro.value.trim() : selMotor.value; }

    // ---------- validação do passo ----------
    function passoValido() {
        var id = passos()[passoAtual];
        var campos = painelDe[id].querySelectorAll("input, select, textarea");
        for (var i = 0; i < campos.length; i++) {
            var c = campos[i];
            if (c.type === "radio") continue;
            if (c.offsetParent === null) continue; // campo escondido
            if (!c.checkValidity()) { c.reportValidity(); c.focus(); return false; }
        }
        return true;
    }

    function irPara(delta) {
        if (delta > 0 && !passoValido()) return;
        passoAtual = Math.max(0, passoAtual + delta);
        desenhar();
        var topo = document.getElementById("orcamento");
        if (topo) topo.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // ---------- eventos ----------
    form.querySelectorAll('input[name="servico"]').forEach(function (r) {
        r.addEventListener("change", function () {
            var s = servico();
            var precisa = !!PRECISA_VEICULO[s];
            // campos do veículo só são obrigatórios quando o serviço pede os dados
            ["veiculo-modelo", "veiculo-ano", "veiculo-motor", "veiculo-combustivel"].forEach(function (id) { document.getElementById(id).required = precisa; });
            var cambio = s === "Troca de Câmbio";
            blocoCambio.classList.toggle("escondido", !cambio);
            selCambio.required = cambio;
            desenhar();
        });
    });

    selMotor.addEventListener("change", function () {
        var outro = this.value === "Outro";
        inputMotorOutro.classList.toggle("escondido", !outro);
        inputMotorOutro.required = outro;
        if (outro) inputMotorOutro.focus(); else inputMotorOutro.value = "";
    });

    btnSeguir.addEventListener("click", function () { irPara(1); });
    btnVoltar.addEventListener("click", function () { irPara(-1); });

    // ---------- envio para o WhatsApp ----------
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        // Enter num campo antes do último passo = "continuar"
        if (passoAtual < passos().length - 1) { irPara(1); return; }
        if (!passoValido()) return;

        var s = servico();
        var mensagem = "Olá! Vim pelo site e gostaria de um orçamento.\n\n*Serviço Solicitado:* " + rotuloServico(s);
        var nome = valor("cliente-nome");
        if (nome) mensagem += "\n*Nome:* " + nome;

        if (precisaVeiculo()) {
            var placaChassi = valor("veiculo-identificacao");
            if (placaChassi) mensagem += "\n*Placa/Chassi:* " + placaChassi;
            mensagem += "\n*Veículo:* " + valor("veiculo-modelo") +
                        "\n*Ano:* " + valor("veiculo-ano") +
                        "\n*Motor:* " + motor() +
                        "\n*Combustível:* " + valor("veiculo-combustivel");
            if (s === "Troca de Câmbio") mensagem += "\n*Tipo de Transmissão:* " + selCambio.value;
        } else if (obs.value.trim()) {
            mensagem += "\n*Observação:* " + obs.value.trim();
        }

        var url = "https://wa.me/" + NUMERO_WHATSAPP + "?text=" + encodeURIComponent(mensagem);
        // Passa pela página de agradecimento (URL de conversão do Google Ads), que abre o WhatsApp
        try { sessionStorage.setItem("orcamento_whatsapp", url); } catch (err) {}
        window.location.href = "obrigado-orcamento.html";
    });

    // ---------- atalho vindo da home (?servico=completa) ----------
    var param = new URLSearchParams(window.location.search).get("servico");
    if (param && ATALHOS[param]) {
        var radio = form.querySelector('input[name="servico"][value="' + ATALHOS[param] + '"]');
        if (radio) {
            radio.checked = true;
            radio.dispatchEvent(new Event("change"));
            passoAtual = 1;
        }
    }
    desenhar();
});
