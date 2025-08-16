# 🎬 MovieMind - Recomendações Inteligentes de Filmes
Plataforma de recomendação de filmes personalizada para seus interesses pessoais.

O **MovieMind** é um projeto que combina **React**, **Node.js**, **OpenAI API** e **TMDb API** para gerar recomendações de filmes personalizadas com base nos desejos do usuário.  
A aplicação utiliza inteligência artificial para sugerir títulos e, em seguida, busca detalhes (pôster, sinopse, avaliação) na API do The Movie Database.

---

## 🚀 Tecnologias Utilizadas

### **Frontend** – React
- Construção da interface interativa.
- Formulário para captura das preferências do usuário.
- Exibição dinâmica dos filmes retornados pelo backend.

### **Backend** – Node.js + Express
- Endpoint para receber as preferências do usuário.
- Integração com a **OpenAI API** para gerar uma lista de títulos de filmes.
- Consulta à **API do TMDb** para buscar informações completas sobre os títulos.

### **API Externa** – TMDb
- Fonte de dados de filmes, incluindo:
  - Pôsteres
  - Sinopses
  - Datas de lançamento
  - Avaliações

### **IA** – OpenAI API
- Interpretação das preferências do usuário.
- Geração de lista de títulos relevantes e coerentes.

---

## 📂 Estrutura do Projeto

/frontend → Aplicação React

/backend → API Node.js


---

## 🔄 Fluxo de Funcionamento

1. **Usuário** informa suas preferências de filmes no frontend.
2. **Backend** recebe as preferências e envia para a OpenAI API.
3. **OpenAI API** retorna títulos de filmes que combinam com os desejos.
4. **Backend** consulta a TMDb API para cada título.
5. **Frontend** exibe os filmes com imagem, sinopse, nota e data de lançamento.

---

## ⚙️ Como Rodar o Projeto

### 1. Clonar o repositório
```bash
git clone https://github.com/SantosVicente/MovieMind.git
```
### 2. Backend

```bash
cd backend
npm install
# Criar um arquivo .env com as chaves:
# OPENAI_API_KEY=chave_da_openai
# TMDB_API_KEY=chave_do_tmdb
npm start
cd ..
```

# 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

🔑 APIs utilizadas:

OpenAI: https://platform.openai.com
TMDb: https://developer.themoviedb.org
