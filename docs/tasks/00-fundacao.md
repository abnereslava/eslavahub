# Tasks — Fundação e Arquitetura

Estas tasks definem a base técnica do EslavaHub. As escolhas feitas aqui devem ser registradas no SDD quando forem concluídas.

---

## TASK-001 — Definir stack do MVP

**Status:** TODO  
**Prioridade:** P0  
**Dependências:** nenhuma

### Objetivo
Escolher as tecnologias principais do MVP: frontend, backend/camada de aplicação, persistência e estratégia de deploy.

### Critérios de aceite
- [ ] frontend definido;
- [ ] abordagem de backend definida;
- [ ] banco/persistência definido;
- [ ] estratégia de deploy definida;
- [ ] decisão registrada no `docs/SDD.md`.

---

## TASK-002 — Definir estratégia de autenticação e acesso

**Status:** TODO  
**Prioridade:** P0  
**Dependências:** TASK-001

### Objetivo
Definir se o MVP será de uso pessoal protegido, multiusuário ou acessível por outro mecanismo controlado.

### Critérios de aceite
- [ ] modelo de acesso definido;
- [ ] comportamento para usuário não autenticado definido;
- [ ] dados não ficam expostos publicamente sem decisão explícita;
- [ ] decisão registrada no SDD.

---

## TASK-003 — Criar estrutura inicial da aplicação

**Status:** TODO  
**Prioridade:** P0  
**Dependências:** TASK-001

### Objetivo
Inicializar o projeto com a estrutura mínima necessária para desenvolvimento.

### Critérios de aceite
- [ ] aplicação inicializa localmente;
- [ ] estrutura de diretórios reflete a arquitetura definida;
- [ ] rota/tela inicial funcional;
- [ ] dependências essenciais instaladas;
- [ ] instruções básicas de execução documentadas.

---

## TASK-004 — Configurar ambientes e variáveis

**Status:** TODO  
**Prioridade:** P0  
**Dependências:** TASK-001, TASK-003

### Objetivo
Separar configurações locais e de produção e impedir que segredos sejam versionados.

### Critérios de aceite
- [ ] arquivo de exemplo de variáveis criado;
- [ ] segredos ignorados pelo Git;
- [ ] configuração de desenvolvimento definida;
- [ ] configuração de produção prevista;
- [ ] aplicação falha de forma compreensível quando variável obrigatória estiver ausente.

---

## TASK-005 — Definir padrão de arquitetura e organização interna

**Status:** TODO  
**Prioridade:** P0  
**Dependências:** TASK-001

### Objetivo
Traduzir as camadas conceituais do SDD para a stack escolhida.

### Critérios de aceite
- [ ] responsabilidades de apresentação, aplicação, domínio e persistência mapeadas;
- [ ] convenção para módulos/arquivos definida;
- [ ] regras de negócio não ficam concentradas em componentes visuais;
- [ ] padrão documentado no SDD ou em documento arquitetural relacionado.

---

## TASK-006 — Configurar qualidade básica do código

**Status:** TODO  
**Prioridade:** P1  
**Dependências:** TASK-003

### Objetivo
Estabelecer verificações automáticas mínimas antes do crescimento da base de código.

### Critérios de aceite
- [ ] formatador configurado;
- [ ] lint/verificação equivalente configurada;
- [ ] script/comando de validação disponível;
- [ ] build local executável;
- [ ] documentação informa como rodar as verificações.
