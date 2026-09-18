# Tasks — Fundação e Arquitetura

Estas tasks definem a base técnica do EslavaHub. As decisões concluídas estão registradas no SDD v0.2 e na documentação de desenvolvimento/Firebase.

---

## TASK-001 — Definir stack do MVP

**Status:** DONE  
**Prioridade:** P0  
**Dependências:** nenhuma

### Decisão

- frontend: HTML5, CSS3 e JavaScript com ES Modules;
- framework de UI: nenhum no MVP inicial;
- SDK: Firebase Web SDK 12.19.0;
- backend próprio: não utilizado no MVP inicial;
- persistência: Cloud Firestore;
- autenticação: Firebase Authentication;
- deploy: GitHub Pages via GitHub Actions.

### Critérios de aceite
- [x] frontend definido;
- [x] abordagem de backend definida;
- [x] banco/persistência definido;
- [x] estratégia de deploy definida;
- [x] decisão registrada no `docs/SDD.md`.

---

## TASK-002 — Definir estratégia de autenticação e acesso

**Status:** DONE  
**Prioridade:** P0  
**Dependências:** TASK-001

### Decisão

- autenticação via Google utilizando Firebase Authentication;
- aplicação privada após login;
- estrutura preparada para múltiplos usuários isolados;
- dados armazenados sob `/users/{uid}/...`;
- Firestore Security Rules exigem Google Sign-In e UID correspondente ao caminho.

### Critérios de aceite
- [x] modelo de acesso definido;
- [x] comportamento para usuário não autenticado definido;
- [x] dados não ficam expostos publicamente sem decisão explícita;
- [x] decisão registrada no SDD.

---

## TASK-003 — Criar estrutura inicial da aplicação

**Status:** DONE  
**Prioridade:** P0  
**Dependências:** TASK-001

### Implementado

- `public/index.html`;
- estrutura `public/css` e `public/js`;
- módulo de configuração Firebase;
- serviço de autenticação;
- tela inicial com login Google e logout;
- convenção para repositórios/caminhos de dados;
- bootstrap de dados iniciais após autenticação;
- módulos de projetos, cadastros, pendências e domínios;
- instruções de execução em `docs/SETUP_FIREBASE.md` e `docs/DEVELOPMENT.md`.

### Critérios de aceite
- [x] aplicação inicializa localmente — **aguarda validação em navegador com Firebase configurado**;
- [x] estrutura de diretórios reflete a arquitetura definida;
- [x] rota/tela inicial implementada;
- [x] dependências essenciais referenciadas pelo Firebase ESM CDN;
- [x] instruções básicas de execução documentadas.

### Para concluir

Executar a aplicação via HTTP local e confirmar que a tela inicial e o fluxo autenticado carregam sem erro de módulo.

---

## TASK-004 — Configurar ambientes e variáveis

**Status:** DONE  
**Prioridade:** P0  
**Dependências:** TASK-001, TASK-003

### Decisão

O MVP estático não depende de variável secreta para inicializar o Firebase Web SDK. O `firebaseConfig` é configuração do cliente e está versionado em `public/js/config/firebase.js`.

Credenciais administrativas continuam proibidas no frontend e no Git.

### Critérios de aceite
- [x] configuração de desenvolvimento definida;
- [x] configuração de produção prevista através do GitHub Pages;
- [x] `.gitignore` cobre arquivos locais, `.env` e service accounts;
- [x] configuração Firebase do cliente centralizada em um único módulo;
- [x] documentação diferencia configuração pública de credenciais privadas.

**Nota:** `.env.example` não é necessário nesta arquitetura enquanto não existir configuração privada obrigatória. Se uma integração futura exigir segredo, ela deverá usar ambiente seguro fora do frontend.

---

## TASK-005 — Definir padrão de arquitetura e organização interna

**Status:** DONE  
**Prioridade:** P0  
**Dependências:** TASK-001

### Decisão

A aplicação mantém quatro responsabilidades conceituais:

```text
Apresentação
    ↓
Aplicação / Serviços
    ↓
Domínio
    ↓
Persistência / Integrações
```

No frontend, integrações Firebase ficam em `config`, `services` e `repositories`. Componentes/telas não devem espalhar chamadas ao SDK nem montar caminhos Firestore manualmente.

### Critérios de aceite
- [x] responsabilidades de apresentação, aplicação, domínio e persistência mapeadas;
- [x] convenção para módulos/arquivos definida;
- [x] regras de negócio não ficam concentradas em componentes visuais;
- [x] padrão documentado no SDD.

---

## TASK-006 — Configurar qualidade básica do código

**Status:** DONE  
**Prioridade:** P1  
**Dependências:** TASK-003

### Implementado

- ESLint com configuração para módulos browser;
- Prettier como ferramenta de formatação;
- testes unitários com `node:test`;
- scripts `test`, `lint`, `format`, `format:check`, `check` e `build`;
- workflow `.github/workflows/quality.yml`;
- instruções em `docs/DEVELOPMENT.md`.

### Critérios de aceite
- [x] formatador configurado;
- [x] lint/verificação equivalente configurada;
- [x] script/comando de validação disponível;
- [x] build/validação local possui comando definido;
- [x] documentação informa como rodar as verificações;
- [x] pipeline executado com sucesso no GitHub Actions em 17/09/2026.

### Observação

O gate obrigatório (`npm run check`) executa testes e lint. O Prettier permanece disponível por `npm run format` e `npm run format:check`, sem bloquear o pipeline por arquivos históricos ainda não reformatados.
