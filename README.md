# ♻️ Conecta Bragança — Pontos de Doação

**Conecta Bragança** é uma plataforma colaborativa desenvolvida para facilitar a doação e distribuição de itens essenciais (alimentos, roupas, remédios) em Bragança Paulista. O projeto permite que doadores cadastrem pontos de apoio e que cidadãos encontrem ajuda de forma rápida e intuitiva através de um mapa interativo.

---

## 🎓 Projeto Acadêmico
Este sistema foi desenvolvido como parte integrante das atividades acadêmicas da **UNIASSELVI**.

*   **Desenvolvedor:** Lucas Alves
*   **Instituição:** UNIASSELVI
*   **Ano:** 2026
*   **Localidade:** Bragança Paulista, SP

---

## 🚀 Funcionalidades Principais

-   **📍 Mapa Interativo:** Localização em tempo real de pontos de doação utilizando Leaflet.
-   **🔐 Sistema de Perfis (RBAC):** 
    -   **Doador:** Pode cadastrar, editar e excluir seus próprios pontos de doação.
    -   **Recebedor:** Foco na navegação e busca de auxílio.
-   **🕒 Gestão de Horários:** Cadastro detalhado de dias e horários de funcionamento de cada ponto.
-   **🔍 Busca Inteligente:** Integração com a API Nominatim para geolocalização e busca de endereços.
-   **📱 Design Responsivo:** Experiência otimizada para dispositivos móveis e desktops.
-   **🌓 Dark Mode:** Interface moderna e confortável para o usuário.

---

## 🛠️ Tecnologias Utilizadas

-   **Frontend:** [Next.js 16 (App Router)](https://nextjs.org/)
-   **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
-   **Banco de Dados & Auth:** [Supabase](https://supabase.com/)
-   **Mapas:** [Leaflet](https://leafletjs.com/)
-   **Validação:** [Zod](https://zod.dev/)
-   **Ícones:** [Lucide React](https://lucide.dev/)

---

## ⚙️ Instalação e Execução

Para rodar o projeto localmente:

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/lucasalves3733/conecta-braganca.git
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env.local` com suas chaves do Supabase:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=sua_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
    SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
    NEXT_PUBLIC_SITE_URL=http://localhost:3000
    ```

4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

---

## 📄 Licença

Este projeto foi desenvolvido para fins estritamente acadêmicos.

---

> "Conectando quem quer ajudar com quem precisa de apoio." ♻️🤝🌍
