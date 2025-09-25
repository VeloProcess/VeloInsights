# 🚀 Guia de Deploy - Velodados no Vercel

## 📋 Passos para Deploy Manual

### 1. **Preparação do Projeto** ✅
- ✅ Projeto configurado com VeloHub Design System
- ✅ Arquivos de configuração criados (vercel.json, .gitignore)
- ✅ Git inicializado e commitado

### 2. **Criar Repositório no GitHub**

#### Opção A: Via GitHub Web
1. Acesse [github.com](https://github.com)
2. Clique em "New repository"
3. Nome: `velodados-dashboard`
4. Descrição: "Dashboard de Atendimentos Velotax com VeloHub Design System"
5. Marque como **Private** (recomendado)
6. Clique em "Create repository"

#### Opção B: Via GitHub CLI (se instalado)
```bash
gh repo create velodados-dashboard --private --description "Dashboard de Atendimentos Velotax"
```

### 3. **Conectar Repositório Local ao GitHub**
```bash
# Adicionar remote (substitua SEU_USUARIO pelo seu username do GitHub)
git remote add origin https://github.com/SEU_USUARIO/velodados-dashboard.git

# Fazer push do código
git branch -M main
git push -u origin main
```

### 4. **Deploy no Vercel**

#### Via Dashboard do Vercel:
1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta
3. Clique em "New Project"
4. Conecte sua conta do GitHub
5. Selecione o repositório `velodados-dashboard`
6. Configure o projeto:
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (padrão)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
7. Clique em "Deploy"

#### Via CLI do Vercel:
```bash
# Fazer deploy direto (se já logado)
vercel --prod

# Ou fazer deploy de preview primeiro
vercel
```

### 5. **Configurações Adicionais**

#### Domínio Personalizado (Opcional):
1. No dashboard do Vercel, vá em "Settings" > "Domains"
2. Adicione um domínio personalizado se desejar
3. Configure DNS conforme instruções

#### Variáveis de Ambiente (se necessário):
1. Vá em "Settings" > "Environment Variables"
2. Adicione variáveis se o projeto precisar

## 🎯 **Resultado Esperado**

Após o deploy, você terá:
- ✅ **URL pública** do Velodados (ex: `velodados-dashboard.vercel.app`)
- ✅ **Deploy automático** a cada push no GitHub
- ✅ **Preview deployments** para branches
- ✅ **Analytics** e métricas de performance
- ✅ **HTTPS** automático

## 🔧 **Comandos Úteis**

### Atualizar Deploy:
```bash
# Fazer alterações no código
git add .
git commit -m "Atualização: nova funcionalidade"
git push origin main
# O Vercel fará deploy automático
```

### Deploy Manual:
```bash
vercel --prod
```

### Ver Logs:
```bash
vercel logs
```

## 📱 **Funcionalidades Online**

O Velodados estará disponível online com:
- 🎨 **Design System VeloHub** completo
- 🌙 **Tema claro/escuro** funcional
- 📊 **Dashboard de atendimentos** interativo
- 📈 **Gráficos** com Chart.js
- 📱 **Responsividade** completa
- 🔒 **HTTPS** seguro

## 🆘 **Troubleshooting**

### Erro de Build:
- Verifique se todas as dependências estão no `package.json`
- Execute `npm run build` localmente para testar

### Erro de Deploy:
- Verifique o arquivo `vercel.json`
- Confirme que o `dist` é o diretório de output correto

### Problemas de CORS:
- O projeto é frontend-only, não deve ter problemas de CORS
- Todos os dados são processados localmente no navegador

---

## 🎉 **Pronto para Deploy!**

Seu projeto Velodados está preparado para ir ao ar com:
- ✅ Sistema de design profissional VeloHub
- ✅ Funcionalidades completas de dashboard
- ✅ Interface moderna e responsiva
- ✅ Tema escuro/claro automático

**Boa sorte com o deploy!** 🚀
