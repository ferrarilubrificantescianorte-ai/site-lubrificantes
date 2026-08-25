// Aguarda o HTML (esqueleto) carregar completamente antes de executar
document.addEventListener("DOMContentLoaded", function() {

    // 1. LÓGICA DO WHATSAPP (O Sistema Nervoso)
    const btnWhatsapp = document.getElementById("btn-whatsapp");
    
    if(btnWhatsapp) {
        btnWhatsapp.addEventListener("click", function() {
            // ATENÇÃO: Substitua pelo número real da empresa. 
            // Obrigatório: 55 + DDD (Cianorte é 44) + Número. Sem espaços ou traços.
            const numeroTelefone = "5544999998979"; 
            
            // A mensagem que obriga o cliente a já iniciar a conversa focado no orçamento
            const mensagem = "Olá! Acessei o site e gostaria de um orçamento para a troca de óleo. Para adiantar o atendimento, meu veículo é um (digite o Modelo e Ano): ";
            
            // Monta a URL segura e converte espaços e acentos para formato de web
            const url = `https://wa.me/${numeroTelefone}?text=${encodeURIComponent(mensagem)}`;
            
            // Abre o WhatsApp em uma nova aba, sem fechar o site da empresa
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