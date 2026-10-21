// Comportamentos comuns a todas as páginas: menu do celular
document.addEventListener("DOMContentLoaded", function () {
    var cab = document.getElementById("cabecalho");
    var btn = document.getElementById("menu-toggle");
    if (!cab || !btn) return;

    function definir(aberto) {
        cab.classList.toggle("menu-aberto", aberto);
        btn.setAttribute("aria-expanded", aberto ? "true" : "false");
        btn.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
    }

    btn.addEventListener("click", function () { definir(!cab.classList.contains("menu-aberto")); });

    // fecha ao tocar num link, ao apertar Esc ou ao tocar fora do menu
    cab.addEventListener("click", function (e) { if (e.target.closest(".menu-navegacao a")) definir(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") definir(false); });
    document.addEventListener("click", function (e) { if (!cab.contains(e.target)) definir(false); });
});
