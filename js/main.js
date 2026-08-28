// Aguarda o HTML (esqueleto) carregar completamente antes de executar
document.addEventListener("DOMContentLoaded", function() {

    // 1. LÓGICA DO WHATSAPP COM CAMPO DINÂMICO
    // 1. O CÉREBRO DO FORMULÁRIO DINÂMICO
    const formOrcamento = document.getElementById("form-orcamento");
    const selectServico = document.getElementById("tipo-servico");
    const blocoVeiculo = document.getElementById("bloco-dados-veiculo");
    const blocoCambio = document.getElementById("bloco-cambio");
    const blocoMensagem = document.getElementById("bloco-mensagem-direta");
    const btnEnviar = document.getElementById("btn-enviar-form");

    // Campos que precisam ter a obrigatoriedade ligada/desligada
    const inputsObrigatoriosVeiculo = [
        document.getElementById("veiculo-modelo"),
        document.getElementById("veiculo-ano"),
        document.getElementById("veiculo-motor"),
        document.getElementById("veiculo-combustivel")
    ];
    const selectCambio = document.getElementById("tipo-cambio");
    const selectMotor = document.getElementById("veiculo-motor");
    const inputMotorOutro = document.getElementById("motor-outro");

    // Lógica quando o cliente escolhe o serviço
    if(selectServico) {
        selectServico.addEventListener("change", function() {
            const servico = this.value;
            
            // Libera o botão
            btnEnviar.disabled = false;
            btnEnviar.innerHTML = '<img src="assets/icons/icone-whatsapp.png" alt="Ícone WhatsApp"> Enviar para o WhatsApp';

            // Se for Radiador ou Outros
            if(servico === "Radiador" || servico === "Outros") {
                blocoVeiculo.classList.add("escondido");
                blocoMensagem.classList.remove("escondido");
                inputsObrigatoriosVeiculo.forEach(el => el.required = false);
                selectCambio.required = false;
            } 
            // Se for Óleo ou Câmbio
            else {
                blocoVeiculo.classList.remove("escondido");
                blocoMensagem.classList.add("escondido");
                inputsObrigatoriosVeiculo.forEach(el => el.required = true);
                
                // Exibe campo de Câmbio apenas se for troca de câmbio
                if(servico === "Troca de Câmbio") {
                    blocoCambio.classList.remove("escondido");
                    selectCambio.required = true;
                } else {
                    blocoCambio.classList.add("escondido");
                    selectCambio.required = false;
                }
            }
        });
    }

    // Campo dinâmico do motor corrigido
    if(selectMotor) {
        selectMotor.addEventListener("change", function() {
            if(this.value === "Outro") {
                inputMotorOutro.classList.remove("escondido");
                inputMotorOutro.required = true;
                inputMotorOutro.focus(); // Já coloca o cursor piscando para o cliente digitar
            } else {
                inputMotorOutro.classList.add("escondido");
                inputMotorOutro.required = false;
                inputMotorOutro.value = ""; 
            }
        });
    }
    
    // Disparo para o WhatsApp
    if(formOrcamento) {
        formOrcamento.addEventListener("submit", function(e) {
            e.preventDefault(); 
            
            const servico = selectServico.value;
            const identificacao = document.getElementById("veiculo-identificacao").value;
            
            // ATENÇÃO: Coloque o número do WhatsApp
            const numeroTelefone = "5544999998979"; 
            let mensagem = `Olá! Vim pelo site e gostaria de um orçamento.\n\n*Serviço Solicitado:* ${servico}`;

            // Se for um serviço que exige dados do carro, monta o resto da ficha
            if(servico !== "Radiador" && servico !== "Outros") {
                const modelo = document.getElementById("veiculo-modelo").value;
                const ano = document.getElementById("veiculo-ano").value;
                let motor = selectMotor.value === "Outro" ? inputMotorOutro.value : selectMotor.value;
                const combustivel = document.getElementById("veiculo-combustivel").value;
                
                if(identificacao) mensagem += `\n*Placa/Chassi:* ${identificacao}`;
                mensagem += `\n*Veículo:* ${modelo}\n*Ano:* ${ano}\n*Motor:* ${motor}\n*Combustível:* ${combustivel}`;
                
                if(servico === "Troca de Câmbio") {
                    mensagem += `\n*Tipo de Transmissão:* ${selectCambio.value}`;
                }
            }
            
            const url = `https://wa.me/${numeroTelefone}?text=${encodeURIComponent(mensagem)}`;
            window.open(url, '_blank');
        });
    }

    // 2. ROLAGEM SUAVE (Os Tendões)
    // Faz o botão "Solicitar Orçamento" do cabeçalho deslizar até a seção, em vez de pular secamente
    const linksInternos = document.querySelectorAll('a[href^="#"]');
    
    linksInternos.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault(); // Impede o pulo seco padrão do HTML
            
            const destino = this.getAttribute("href"); // Pega o ID (ex: #orcamento)
            const elementoDestino = document.querySelector(destino);
            
            if(elementoDestino) {
                elementoDestino.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });
});