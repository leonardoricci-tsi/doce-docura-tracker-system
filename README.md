# 📦 Doce Doçura Tracker System

**Sistema de rastreabilidade de produtos alimentícios** desenvolvido para a empresa artesanal **Doce Doçura**, com foco no controle de lotes desde a produção até a expiração. A aplicação foi construída com backend em **Supabase**, com dashboard, QR Codes, automações e validação com distribuidores.

🔗 **Em uso real na empresa. Projeto ativo.**

---

## 🎯 Objetivo

Criar um sistema confiável e escalável para rastrear lotes de produção, garantir controle de validade, facilitar auditorias e permitir que clientes e distribuidores consultem informações de cada produto por QR Code.

---

## ✨ Funcionalidades

- 🧾 **Rastreamento por lote**  
  Registro completo: produto, data de fabricação, validade, cliente e destino final.

- 🔍 **Consulta via QR Code**  
  Cada produto possui uma etiqueta com QR Code que direciona para a página de rastreio do lote.

- ⏰ **Alertas de validade (automatizados)**  
  Notificações e destaques visuais para produtos próximos do vencimento.

- 📊 **Dashboard interativo**  
  Mapa dos locais de venda, fornecedores mais ativos, produtos em estoque e vencimento iminente.

- 📥 **Formulários e entrada de dados validada**  
  Inserção de dados feita por distribuidores e pela fábrica com autenticação via Supabase.

- 🔐 **Autenticação e segurança**  
  Controle de acesso com sistema de login e permissões por perfil.

---

## 🛠️ Tecnologias Utilizadas

- **Supabase** – Backend, banco de dados relacional e autenticação  
- **Lovable** – Front-end MVP validado com foco em experiência do usuário  
- **Google Sheets (validação inicial)** – Utilizado para teste e prototipação com dados reais  
- **Apps Script** – Versão anterior de automações (agora migradas para Supabase Functions)  
- **QR Code Generator** – Criação de etiquetas rastreáveis por lote  

---

## 🧪 Etapas do Projeto

- ✅ Validação da ideia com protótipo em Google Sheets  
- ✅ Desenvolvimento do MVP com Supabase  
- ✅ Testes com dados reais da Doce Doçura  
- ✅ Criação e impressão de etiquetas com QR Code  
- ✅ Deploy de interface e automações  
- 🔄 Planejamento de evolução do front-end com React ou Angular

---

## 📚 Aprendizados

- Estruturação de banco de dados relacional com Supabase  
- Criação de sistemas com foco em rastreabilidade e controle de qualidade  
- Conexão entre back-end (Supabase) e front-end (Lovable)  
- Validação ágil com usuários reais  
- Pensamento em MVP, UX e escalabilidade

---

## 👨‍💻 Autores

**Leonardo Oliveira**  
Estudante de Sistemas Inteligentes – FATEC  
GitHub: [@leonardoricci-tsi](https://github.com/leonardoricci-tsi)

**José Gabriel**  
Estudante de Big Data – FATEC  
Colaborador no desenvolvimento do sistema e apoio na modelagem e validação do projeto.  
GitHub: [@josegab1515](https://github.com/josegab1515)

---

## 📸 Capturas (futuro)



## 🏢 Sobre a Doce Doçura

Fundada em 2013 em Garça-SP, a **Doce Doçura** é uma marca artesanal especializada em pães de mel e alfajores personalizados, que se destaca pela qualidade dos ingredientes e identidade humanizada nas embalagens e atendimento.

---






# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/50a91ddc-39e8-440e-9342-31ea936cffc1

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/50a91ddc-39e8-440e-9342-31ea936cffc1) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/50a91ddc-39e8-440e-9342-31ea936cffc1) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
