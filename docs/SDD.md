# Software Design Document (SDD) — EslavaHub

**Versão:** 0.1  
**Estado:** especificação inicial  
**Escopo:** MVP da aplicação web EslavaHub

---

## 1. Propósito

Este documento descreve como o EslavaHub deve funcionar do ponto de vista de software, cobrindo arquitetura lógica, entidades, regras de negócio, fluxos, telas, validações, requisitos não funcionais e critérios técnicos do MVP.

A stack ainda não está definida. Por isso, esta versão do SDD especifica **comportamento e responsabilidades**, sem amarrar a solução a frameworks, provedores ou banco de dados específicos.

---

## 2. Contexto do sistema

O EslavaHub será uma aplicação web para centralizar informações de projetos de programação.

O sistema deverá permitir que o usuário gerencie:

- projetos;
- categorias;
- status de projeto;
- tecnologias;
- links de repositório e deploy;
- clientes associados ao projeto;
- domínios e vencimentos;
- observações rápidas;
- pendências por projeto.

O projeto é a entidade central do sistema.

---

## 3. Objetivos arquiteturais

A arquitetura deverá priorizar:

- simplicidade de manutenção;
- separação clara entre interface, regras de negócio e persistência;
- facilidade para evoluir de uso pessoal para cenários mais amplos;
- modelo de dados que não dependa de campos preenchidos artificialmente;
- possibilidade futura de integração com serviços externos;
- responsividade;
- rastreabilidade das principais alterações de dados;
- baixo acoplamento entre módulos.

---

## 4. Arquitetura lógica

A solução deve ser organizada, conceitualmente, em quatro camadas.

### 4.1 Camada de apresentação

Responsável por:

- páginas;
- componentes visuais;
- formulários;
- filtros;
- feedback de carregamento, sucesso e erro;
- responsividade;
- acessibilidade básica.

A camada de apresentação não deve concentrar regras de negócio relevantes.

### 4.2 Camada de aplicação

Responsável pelos casos de uso, por exemplo:

- criar projeto;
- editar projeto;
- arquivar projeto;
- cadastrar pendência;
- alterar estado de pendência;
- registrar domínio;
- calcular situação de vencimento;
- carregar indicadores do dashboard.

### 4.3 Camada de domínio

Responsável pelas entidades e regras centrais:

- projeto;
- categoria;
- status;
- tecnologia;
- domínio;
- pendência;
- regras de validação;
- regras de vencimento;
- integridade entre entidades.

### 4.4 Camada de persistência/integrações

Responsável por:

- banco de dados;
- repositórios de dados;
- autenticação, quando definida;
- integrações externas;
- serviços futuros como GitHub, calendário, e-mail ou notificações.

---

## 5. Módulos do sistema

O MVP deve possuir os seguintes módulos funcionais:

1. **Dashboard**
2. **Projetos**
3. **Pendências**
4. **Domínios**
5. **Cadastros auxiliares**
6. **Configurações** — mínimo necessário

---

# 6. Modelo de domínio

## 6.1 Entidade `Project`

Representa um projeto acompanhado pelo sistema.

### Campos

| Campo | Tipo conceitual | Obrigatório | Regra |
| --- | --- | --- | --- |
| `id` | identificador | Sim | Gerado pelo sistema; imutável |
| `name` | texto | Sim | Nome do projeto |
| `category_id` | relação | Sim | Referência a uma categoria válida |
| `status_id` | relação | Sim | Referência a um status válido |
| `repository_url` | URL | Não | Deve ser URL válida quando informada |
| `deploy_url` | URL | Não | Deve ser URL válida quando informada |
| `client_name` | texto | Não | MVP pode manter cliente como texto simples |
| `quick_notes` | texto | Não | Observações curtas do projeto |
| `archived_at` | data/hora | Não | Preenchido quando arquivado |
| `created_at` | data/hora | Sim | Gerado pelo sistema |
| `updated_at` | data/hora | Sim | Atualizado automaticamente |

### Regras

- `id` não pode ser alterado pelo usuário;
- projetos arquivados não devem aparecer por padrão na listagem ativa;
- arquivar é preferível a excluir definitivamente no fluxo normal;
- nome vazio não é permitido;
- categoria e status precisam existir e estar ativos;
- URLs vazias são aceitas; URLs preenchidas precisam ser válidas.

---

## 6.2 Entidade `Category`

Representa a classificação principal de um projeto.

### Campos

| Campo | Tipo | Obrigatório |
| --- | --- | --- |
| `id` | identificador | Sim |
| `name` | texto | Sim |
| `active` | booleano | Sim |
| `created_at` | data/hora | Sim |
| `updated_at` | data/hora | Sim |

### Regras

- nomes devem ser únicos dentro do conjunto ativo;
- uma categoria já utilizada não deve ser removida de forma destrutiva; deve poder ser desativada;
- categorias desativadas permanecem visíveis em projetos antigos.

---

## 6.3 Entidade `ProjectStatus`

Representa o estado do ciclo de vida do projeto.

### Campos

| Campo | Tipo | Obrigatório |
| --- | --- | --- |
| `id` | identificador | Sim |
| `name` | texto | Sim |
| `code` | texto estável | Sim |
| `active` | booleano | Sim |
| `sort_order` | inteiro | Sim |

### Sugestão inicial de registros

- `IDEALIZED` — Idealizado;
- `IN_DEVELOPMENT` — Em desenvolvimento;
- `FUNCTIONAL` — Funcional;
- `FINISHED` — Finalizado;
- `PAUSED` — Pausado;
- `ABANDONED` — Abandonado.

O código interno deve permanecer estável mesmo que o texto exibido seja alterado no futuro.

---

## 6.4 Entidade `Technology`

Representa linguagem, framework, biblioteca relevante, plataforma ou outra tecnologia associada a projetos.

### Campos

| Campo | Tipo | Obrigatório |
| --- | --- | --- |
| `id` | identificador | Sim |
| `name` | texto | Sim |
| `active` | booleano | Sim |

### Relação

`Project` N:N `Technology`

Um projeto pode utilizar várias tecnologias e uma tecnologia pode aparecer em vários projetos.

---

## 6.5 Entidade `Domain`

Representa o domínio associado a um projeto.

### MVP

O modelo deve ser preparado para suportar mais de um domínio por projeto, mesmo que a primeira interface trabalhe principalmente com um domínio principal.

### Campos

| Campo | Tipo | Obrigatório | Regra |
| --- | --- | --- | --- |
| `id` | identificador | Sim | Gerado pelo sistema |
| `project_id` | relação | Sim | Projeto relacionado |
| `hostname` | texto | Sim | Ex.: `exemplo.com.br` |
| `expiration_date` | data | Não | Quando conhecida |
| `is_primary` | booleano | Sim | Indica domínio principal |
| `notes` | texto | Não | Informação complementar |
| `created_at` | data/hora | Sim | Automático |
| `updated_at` | data/hora | Sim | Automático |

### Regras

- `hostname` deve ser armazenado sem protocolo e sem caminho;
- a URL pública do projeto continua separada em `deploy_url`;
- um projeto não pode ter mais de um domínio marcado como principal;
- domínio sem data de vencimento é permitido, mas não participa de alertas temporais.

---

## 6.6 Entidade `Task` / `PendingItem`

Representa uma pendência vinculada a um projeto.

### Campos

| Campo | Tipo | Obrigatório | Regra |
| --- | --- | --- | --- |
| `id` | identificador | Sim | Gerado pelo sistema |
| `project_id` | relação | Sim | Projeto relacionado |
| `status` | enum/relação | Sim | Estado da pendência |
| `area` | texto | Não | Equivale a Onde/Área |
| `description` | texto | Sim | O que precisa ser feito |
| `priority` | enum | Não | Baixa, média, alta ou equivalente |
| `due_date` | data | Não | Prazo opcional |
| `notes` | texto | Não | Complemento opcional |
| `completed_at` | data/hora | Não | Preenchido quando concluída |
| `created_at` | data/hora | Sim | Automático |
| `updated_at` | data/hora | Sim | Automático |

### Estados sugeridos

- `PENDING` — Pendente;
- `IN_PROGRESS` — Em andamento;
- `WAITING` — Aguardando;
- `COMPLETED` — Concluída;
- `DISCARDED` — Descartada.

### Regras

- toda pendência pertence a exatamente um projeto;
- descrição é obrigatória;
- ao entrar em `COMPLETED`, `completed_at` deve ser preenchido;
- ao sair de `COMPLETED`, `completed_at` deve ser limpo ou substituído conforme a política definida na implementação;
- pendências concluídas não entram, por padrão, na contagem de pendências abertas.

---

# 7. Relacionamentos

Modelo conceitual:

```text
Category 1 ─────── N Project N ─────── N Technology
                       │
                       ├────── 1:N Domain
                       │
                       └────── 1:N PendingItem

ProjectStatus 1 ─── N Project
```

---

# 8. Regras de negócio

## 8.1 Identificação de projetos

- o ID é gerado automaticamente;
- IDs não são reutilizados;
- o usuário não informa manualmente o ID;
- exclusão lógica/arquivamento não libera ID para reutilização.

## 8.2 Campos opcionais

O sistema não deve exigir:

- cliente;
- repositório;
- deploy;
- domínio;
- vencimento;
- tecnologia;
- observações;
- pendências.

A ausência desses campos não torna o projeto incompleto ou inválido.

## 8.3 Domínio e vencimento

Quando houver `expiration_date`, o sistema deve calcular:

```text
dias_restantes = expiration_date - data_atual
```

Classificação inicial sugerida:

```text
> 30 dias       NORMAL
16–30 dias      ATTENTION
8–15 dias       WARNING
0–7 dias        URGENT
< 0 dias        EXPIRED
```

Os limites devem ficar centralizados em configuração/regra de domínio e não espalhados pela interface.

## 8.4 Alertas

No MVP, alerta significa **sinalização dentro do sistema**.

Devem existir, no mínimo:

- indicador no dashboard;
- indicador na listagem de domínios;
- indicador na página do projeto.

Notificações externas não devem ser consideradas requisito obrigatório até que o canal seja definido.

## 8.5 Arquivamento

Projetos devem poder ser arquivados sem destruição dos dados associados.

Ao arquivar:

- pendências permanecem registradas;
- domínios permanecem registrados;
- tecnologias permanecem associadas;
- o projeto sai das visualizações ativas padrão;
- o usuário pode consultar projetos arquivados por filtro específico.

---

# 9. Casos de uso

## UC-01 — Criar projeto

### Entrada mínima

- nome;
- categoria;
- status.

### Fluxo

1. usuário abre o formulário;
2. informa os dados desejados;
3. sistema valida obrigatórios e URLs;
4. sistema gera ID;
5. projeto é persistido;
6. usuário é direcionado à página do projeto ou recebe confirmação equivalente.

### Resultado

Projeto disponível na listagem ativa.

---

## UC-02 — Editar projeto

1. usuário abre projeto existente;
2. entra em modo de edição;
3. altera campos;
4. sistema valida os dados;
5. sistema persiste a atualização;
6. `updated_at` é atualizado.

O ID não pode ser alterado.

---

## UC-03 — Pesquisar e filtrar projetos

Filtros mínimos:

- texto;
- categoria;
- status;
- cliente;
- tecnologia;
- possui pendência aberta;
- arquivado/ativo.

A pesquisa textual deve considerar pelo menos nome, cliente e, quando viável, observações.

---

## UC-04 — Adicionar pendência

1. usuário abre um projeto;
2. cria uma nova pendência;
3. informa descrição;
4. opcionalmente define área, prioridade, prazo e observação;
5. sistema salva vinculando a pendência ao projeto.

---

## UC-05 — Concluir pendência

1. usuário altera estado para concluída;
2. sistema registra data/hora de conclusão;
3. dashboard e contadores são atualizados.

---

## UC-06 — Registrar domínio

1. usuário informa hostname;
2. opcionalmente informa data de expiração;
3. sistema normaliza o hostname;
4. sistema salva o domínio;
5. quando existir vencimento, situação é calculada automaticamente.

---

## UC-07 — Visualizar alertas de domínio

1. sistema consulta domínios com data de expiração;
2. calcula dias restantes;
3. classifica cada domínio;
4. destaca os domínios que exigem atenção.

---

## UC-08 — Arquivar projeto

1. usuário solicita arquivamento;
2. sistema pede confirmação;
3. preenche `archived_at`;
4. projeto deixa a listagem ativa padrão.

---

# 10. Telas

## 10.1 Dashboard

### Deve exibir

- total de projetos ativos;
- projetos em desenvolvimento;
- projetos com pendências abertas;
- quantidade de pendências abertas;
- domínios em atenção;
- domínios vencidos.

### Blocos

- projetos em andamento;
- pendências prioritárias/recentes;
- próximos vencimentos de domínio;
- projetos atualizados recentemente.

Cada indicador relevante deve funcionar como entrada para a listagem já filtrada correspondente.

---

## 10.2 Projetos

### Componentes

- campo de pesquisa;
- filtros;
- ordenação;
- botão de novo projeto;
- tabela ou cards;
- paginação ou carregamento progressivo quando necessário.

### Informações resumidas por item

- ID;
- nome;
- categoria;
- status;
- cliente, se houver;
- tecnologias principais, se houver;
- quantidade de pendências abertas;
- atalhos para repositório/deploy, quando disponíveis.

---

## 10.3 Detalhe do projeto

Seções:

1. resumo;
2. links;
3. tecnologias;
4. domínio;
5. pendências;
6. observações.

Ações rápidas desejáveis:

- abrir repositório;
- abrir deploy;
- criar pendência;
- editar projeto;
- concluir pendência;
- arquivar projeto.

---

## 10.4 Domínios

Deve permitir visualizar:

- projeto;
- domínio;
- vencimento;
- dias restantes;
- classificação do alerta.

Filtros úteis:

- vencido;
- até 7 dias;
- até 15 dias;
- até 30 dias;
- sem vencimento cadastrado.

Ordenação padrão recomendada: vencimento mais próximo primeiro.

---

## 10.5 Cadastros auxiliares

No mínimo:

- categorias;
- tecnologias.

Status de projeto pode começar pré-configurado e receber interface administrativa posteriormente.

---

# 11. Navegação sugerida

```text
Dashboard
Projetos
  ├─ Todos
  ├─ Novo projeto
  └─ Detalhe do projeto
Domínios
Cadastros
  ├─ Categorias
  └─ Tecnologias
Configurações
```

Pendências podem permanecer principalmente dentro dos projetos no MVP, com uma futura tela global caso haja necessidade.

---

# 12. Contratos de aplicação

Independentemente de a implementação utilizar REST, RPC, server actions ou outro padrão, a camada de aplicação deverá oferecer operações equivalentes a:

```text
listProjects(filters, pagination)
getProject(id)
createProject(data)
updateProject(id, data)
archiveProject(id)
restoreProject(id)

listPendingItems(projectId, filters)
createPendingItem(projectId, data)
updatePendingItem(id, data)
deleteOrDiscardPendingItem(id)

listDomains(filters)
createDomain(projectId, data)
updateDomain(id, data)
removeDomain(id)

listCategories()
createCategory(data)
updateCategory(id, data)

listTechnologies()
createTechnology(data)
updateTechnology(id, data)

getDashboardSummary()
```

A interface não deve acessar diretamente a persistência sem passar pelas regras de aplicação/domínio.

---

# 13. Validação

## Projeto

- nome: obrigatório, após remoção de espaços laterais;
- categoria: obrigatória e válida;
- status: obrigatório e válido;
- `repository_url`: URL válida ou vazio;
- `deploy_url`: URL válida ou vazio.

## Domínio

- hostname não pode conter caminho arbitrário;
- protocolo deve ser removido/normalizado caso o usuário o informe;
- `expiration_date`, quando preenchida, deve ser uma data válida.

## Pendência

- descrição obrigatória;
- projeto relacionado obrigatório;
- estado deve pertencer ao conjunto permitido.

---

# 14. Exclusão e integridade

## Exclusão de projeto

O fluxo padrão deve utilizar arquivamento.

Exclusão definitiva, se implementada, deve exigir confirmação explícita e considerar dependências.

## Categoria/tecnologia em uso

Itens já relacionados a projetos não devem ser apagados silenciosamente. Deve-se priorizar desativação.

## Pendências

Uma pendência pode ser descartada ou, se houver exclusão definitiva, a ação deve ser explícita.

---

# 15. Auditoria mínima

Todas as entidades principais devem possuir:

- `created_at`;
- `updated_at`.

Projetos devem possuir também `archived_at`.

Pendências concluídas devem possuir `completed_at`.

Histórico detalhado de alterações não é obrigatório no MVP, mas a modelagem não deve impedir sua inclusão futura.

---

# 16. Requisitos não funcionais

## 16.1 Responsividade

A aplicação deve ser utilizável em desktop e dispositivos móveis.

Prioridade de uso:

1. desktop;
2. celular;
3. tablet.

A visualização em celular deve preservar ações essenciais, mesmo que tabelas precisem virar cards ou listas compactas.

## 16.2 Performance

- carregamentos comuns devem evitar buscar dados desnecessários;
- listagens devem suportar paginação ou estratégia equivalente;
- dashboard deve utilizar consultas agregadas adequadas;
- filtros não devem exigir carregamento integral de toda a base quando ela crescer.

## 16.3 Segurança

Quando autenticação for implementada:

- rotas privadas devem exigir sessão válida;
- operações de escrita devem validar autorização no servidor;
- dados recebidos do cliente devem ser validados novamente no backend;
- segredos não podem ser armazenados no frontend;
- credenciais de integrações externas não devem ser persistidas em texto puro.

## 16.4 Acessibilidade

Requisitos mínimos:

- navegação por teclado nas ações principais;
- labels em formulários;
- contraste adequado;
- alertas não podem depender exclusivamente de cor;
- estados devem possuir texto ou ícone acompanhado de descrição acessível.

## 16.5 Compatibilidade

A aplicação deve priorizar navegadores modernos com suporte ativo.

---

# 17. Tratamento de erros

A interface deverá diferenciar:

- erro de validação;
- erro de autenticação/autorização;
- recurso não encontrado;
- erro de integração externa;
- erro inesperado do servidor;
- ausência de conexão, quando detectável.

Mensagens devem orientar a ação possível sem expor detalhes sensíveis da implementação.

---

# 18. Estados de interface

Toda tela que dependa de dados deverá prever:

- carregando;
- carregado com dados;
- carregado sem dados;
- erro;
- atualização em andamento.

Formulários devem evitar envios duplicados durante processamento.

---

# 19. Estratégia de testes

## 19.1 Testes unitários

Prioridade para regras de domínio:

- cálculo de vencimento;
- classificação de alerta;
- normalização de domínio;
- transição de estado de pendência;
- validações de projeto.

## 19.2 Testes de integração

Cobrir:

- criação de projeto;
- edição;
- filtros;
- arquivamento;
- criação/conclusão de pendência;
- cadastro de domínio;
- geração do resumo do dashboard.

## 19.3 Testes de interface/E2E

Fluxos mínimos:

1. criar projeto;
2. localizar projeto;
3. editar projeto;
4. adicionar pendência;
5. concluir pendência;
6. cadastrar domínio;
7. visualizar alerta;
8. arquivar projeto.

---

# 20. Observabilidade

A implementação deve permitir, no mínimo:

- registro de erros de backend;
- registro de falhas de integração;
- identificação do contexto da operação sem expor dados sensíveis.

Métricas e monitoramento avançados podem ser adicionados posteriormente.

---

# 21. Migração da planilha

A aplicação deve ser desenhada considerando que os dados atuais podem ser importados posteriormente.

Uma estratégia futura de importação deve mapear pelo menos:

```text
ID antigo -> referência externa opcional
Categoria -> Category
Nome -> Project.name
Repositório -> Project.repository_url
Deploy -> Project.deploy_url
Cliente -> Project.client_name
Status -> ProjectStatus
Linguagem -> Technology
Domínio -> Domain.hostname
Vencimento -> Domain.expiration_date
Observações -> Project.quick_notes
Pendências -> PendingItem
```

O ID interno novo deve continuar sendo controlado pelo sistema. Caso seja importante preservar o ID histórico da planilha, ele deverá ficar em um campo separado de referência/migração.

---

# 22. Evoluções previstas

A arquitetura deve deixar pontos claros de extensão para:

- integração com GitHub;
- importação automática de repositórios;
- leitura de linguagem principal;
- sincronização de deploys;
- notificações externas;
- Google Calendar;
- cadastro completo de clientes;
- histórico de mudanças;
- tags;
- documentação/anexos;
- múltiplos usuários;
- papéis e permissões;
- API pública/privada;
- monitoramento de uptime.

Nenhuma dessas evoluções deve aumentar a complexidade do MVP sem necessidade atual.

---

# 23. Decisões técnicas pendentes

Antes da implementação, deverão ser tomadas e registradas as seguintes decisões:

1. framework/frontend;
2. backend ou arquitetura full-stack;
3. banco de dados;
4. ORM/query layer, se aplicável;
5. autenticação;
6. hospedagem;
7. estratégia de migrations;
8. estratégia de backup;
9. testes e CI;
10. mecanismo de notificações futuras;
11. estratégia de importação da planilha;
12. modelo inicial single-user ou multi-user.

Quando uma decisão tiver impacto arquitetural relevante, recomenda-se registrá-la em um ADR dentro de `docs/adr/`.

---

# 24. Critérios de aceite do MVP

O MVP estará tecnicamente apto para uso quando:

- projetos puderem ser criados com apenas nome, categoria e status;
- campos opcionais puderem permanecer vazios sem gerar inconsistência;
- IDs forem gerados automaticamente sem duplicidade;
- projetos puderem ser pesquisados e filtrados;
- múltiplas tecnologias puderem ser associadas a um projeto;
- pendências puderem ser criadas e concluídas dentro de um projeto;
- domínios puderem ser cadastrados com vencimento opcional;
- o sistema classificar corretamente domínios próximos do vencimento;
- o dashboard apresentar projetos, pendências e alertas relevantes;
- projetos puderem ser arquivados sem perda de seus dados relacionados;
- os fluxos principais funcionarem adequadamente em desktop e celular.

---

# 25. Próximo passo recomendado

Após aprovação deste SDD, o desenvolvimento deve começar pela definição da stack e por um pequeno conjunto de ADRs. Em seguida, a implementação pode seguir esta ordem:

```text
1. Modelo de dados
2. Cadastros auxiliares
3. CRUD de projetos
4. Página de detalhe
5. Pendências
6. Domínios e regras de vencimento
7. Busca e filtros
8. Dashboard
9. Responsividade e acabamento
10. Importação dos dados existentes
```

A [proposta do produto](PROPOSTA.md) define o que o EslavaHub pretende resolver; este SDD define a estrutura inicial de como o software deverá atender a essa proposta.