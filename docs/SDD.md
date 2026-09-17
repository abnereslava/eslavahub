# Software Design Document (SDD) — EslavaHub

**Versão:** 0.2  
**Estado:** arquitetura inicial definida; fundação em implementação  
**Escopo:** MVP da aplicação web EslavaHub

---

## 1. Propósito

Este documento descreve a arquitetura, o modelo de domínio, as regras de negócio, os fluxos e os requisitos técnicos do EslavaHub.

O EslavaHub é uma aplicação web para centralizar projetos de programação, reunindo repositório, deploy, cliente, status, tecnologias, domínios, vencimentos, observações e pendências.

---

## 2. Decisões técnicas do MVP

A fundação técnica inicial está definida da seguinte forma:

| Área | Decisão |
| --- | --- |
| Frontend | HTML5, CSS3 e JavaScript com ES Modules |
| Framework de UI | Nenhum no MVP inicial |
| SDK Firebase | Firebase Web SDK 12.19.0 via módulos ESM oficiais |
| Backend próprio | Não haverá backend próprio no MVP inicial |
| Autenticação | Firebase Authentication |
| Provedor de login | Google |
| Persistência | Cloud Firestore |
| Autorização dos dados | Firestore Security Rules |
| Hosting | Firebase Hosting |
| Projeto Firebase | `eslavahub-434e5` |

A aplicação deve continuar organizada em camadas para que uma mudança futura de frontend, infraestrutura ou persistência não exija reescrever as regras de negócio.

O Web SDK acessa Firebase Authentication e Firestore diretamente. Isso não significa acesso irrestrito: toda leitura e escrita do Firestore feita pelo cliente está sujeita às Security Rules.

---

## 3. Modelo de acesso

O MVP é um sistema autenticado e preparado para múltiplos usuários isolados.

### Regras

- login permitido pelo Google;
- usuário não autenticado visualiza apenas a entrada da aplicação;
- cada usuário acessa somente seus próprios dados;
- o UID gerado pelo Firebase Authentication é a raiz de autorização;
- dados de um usuário não podem ser consultados ou alterados por outro usuário através do cliente;
- acesso global é negado por padrão nas Firestore Security Rules.

Estrutura raiz:

```text
users/{uid}/
```

Coleções privadas:

```text
users/{uid}/projects/
users/{uid}/categories/
users/{uid}/statuses/
users/{uid}/technologies/
users/{uid}/domains/
users/{uid}/pendingItems/
```

As regras versionadas estão em `firestore.rules`.

---

## 4. Arquitetura lógica

### 4.1 Apresentação

Responsável por:

- páginas e componentes visuais;
- formulários;
- filtros e pesquisa;
- feedback de carregamento, sucesso e erro;
- responsividade e acessibilidade.

A apresentação não deve conter regras de negócio relevantes nem construir caminhos Firestore manualmente.

### 4.2 Aplicação/serviços

Responsável por casos de uso como:

- autenticar e encerrar sessão;
- criar, editar, arquivar e restaurar projeto;
- cadastrar e concluir pendência;
- registrar domínio;
- calcular alertas;
- montar indicadores do dashboard.

### 4.3 Domínio

Responsável por:

- validações;
- entidades e seus estados;
- normalização de domínio;
- cálculo de vencimentos;
- regras de arquivamento;
- transições de pendências.

### 4.4 Persistência/integrações

Responsável por:

- Firebase Authentication;
- Cloud Firestore;
- repositórios de dados;
- caminhos de coleção por usuário;
- futuras integrações externas.

A UI não deve chamar operações de persistência de forma espalhada. O acesso aos dados deve passar pela camada de repositórios/serviços.

Estrutura inicial do frontend:

```text
public/
  index.html
  css/
    styles.css
  js/
    main.js
    config/
      firebase.js
    services/
      auth-service.js
    repositories/
      user-paths.js
```

A estrutura crescerá por módulos conforme projetos, domínios e pendências forem implementados.

---

## 5. Módulos funcionais

O MVP contempla:

1. autenticação;
2. dashboard;
3. projetos;
4. pendências;
5. domínios;
6. categorias;
7. tecnologias;
8. configurações mínimas.

---

## 6. Modelo de domínio

### 6.1 Project

| Campo | Obrigatório | Observação |
| --- | --- | --- |
| `id` | Sim | Gerado pelo Firestore |
| `name` | Sim | Nome do projeto |
| `category_id` | Sim | Referência lógica à categoria |
| `status_id` | Sim | Referência lógica ao status |
| `repository_url` | Não | URL válida quando preenchida |
| `deploy_url` | Não | URL válida quando preenchida |
| `client_name` | Não | Cliente como texto no MVP |
| `quick_notes` | Não | Observações rápidas |
| `archived_at` | Não | Preenchido no arquivamento |
| `created_at` | Sim | Timestamp |
| `updated_at` | Sim | Timestamp |

Regras:

- ID não é editável nem reutilizado;
- arquivamento é preferível à exclusão definitiva;
- projetos arquivados ficam fora da listagem ativa padrão;
- categoria e status precisam ser válidos;
- campos não necessários podem permanecer vazios.

### 6.2 Category

Campos mínimos:

- `id`;
- `name`;
- `active`;
- `created_at`;
- `updated_at`.

Categorias utilizadas devem ser desativadas, e não removidas destrutivamente.

### 6.3 ProjectStatus

Campos mínimos:

- `id`;
- `name`;
- `code`;
- `active`;
- `sort_order`.

Estados iniciais:

- `IDEALIZED`;
- `IN_DEVELOPMENT`;
- `FUNCTIONAL`;
- `FINISHED`;
- `PAUSED`;
- `ABANDONED`.

### 6.4 Technology

Campos mínimos:

- `id`;
- `name`;
- `active`.

Um projeto pode possuir múltiplas tecnologias. Uma tecnologia pode aparecer em múltiplos projetos.

No Firestore essa relação poderá ser representada por IDs no documento de projeto ou por outra representação definida pelo repositório, sem alterar o contrato de domínio.

### 6.5 Domain

Campos mínimos:

- `id`;
- `project_id`;
- `hostname`;
- `expiration_date` opcional;
- `is_primary`;
- `notes` opcional;
- `created_at`;
- `updated_at`.

Regras:

- hostname armazenado sem protocolo e caminho;
- projeto pode possuir múltiplos domínios;
- somente um domínio pode ser principal por projeto;
- domínio sem vencimento é permitido;
- URL de deploy não é substituída pelo hostname.

### 6.6 PendingItem

Campos mínimos:

- `id`;
- `project_id`;
- `status`;
- `area` opcional;
- `description`;
- `priority` opcional;
- `due_date` opcional;
- `notes` opcional;
- `completed_at` opcional;
- `created_at`;
- `updated_at`.

Estados iniciais:

- `PENDING`;
- `IN_PROGRESS`;
- `WAITING`;
- `COMPLETED`;
- `DISCARDED`.

Ao entrar em `COMPLETED`, `completed_at` deve ser preenchido. Pendências concluídas não entram na contagem padrão de itens abertos.

---

## 7. Regras de vencimento de domínio

Quando houver `expiration_date`:

```text
dias_restantes = expiration_date - data_atual
```

Classificação inicial:

```text
> 30 dias       NORMAL
16–30 dias      ATTENTION
8–15 dias       WARNING
0–7 dias        URGENT
< 0 dias        EXPIRED
```

Os limites devem existir em um módulo central de domínio, nunca duplicados em componentes de interface.

No MVP, os alertas são internos à aplicação. E-mail, push e calendário ficam fora do escopo inicial.

---

## 8. Contratos da camada de aplicação

A implementação deve oferecer operações equivalentes a:

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

Cada operação que acessa Firestore deve derivar o caminho a partir do UID da sessão autenticada.

---

## 9. Casos de uso principais

### Criar projeto

Entrada mínima:

- nome;
- categoria;
- status.

O sistema valida, gera o ID pelo Firestore, grava timestamps e disponibiliza o projeto na listagem ativa.

### Editar projeto

O usuário altera campos editáveis. O ID permanece inalterado e `updated_at` é renovado.

### Pesquisar e filtrar

Filtros mínimos:

- texto;
- categoria;
- status;
- cliente;
- tecnologia;
- possui pendência aberta;
- ativo/arquivado.

### Pendências

O usuário pode criar, editar, priorizar, concluir e descartar pendências associadas a um projeto.

### Domínios

O usuário pode registrar domínio, vencimento e domínio principal. A situação temporal é calculada automaticamente na leitura/apresentação.

### Arquivamento

Arquivar um projeto preserva domínios, pendências e tecnologias e remove o projeto das visualizações ativas padrão.

---

## 10. Telas

### 10.1 Login

- marca EslavaHub;
- ação Entrar com Google;
- feedback de falha de autenticação.

### 10.2 Dashboard

Exibe pelo menos:

- total de projetos ativos;
- projetos em desenvolvimento;
- projetos com pendências abertas;
- quantidade de pendências abertas;
- domínios em atenção;
- domínios vencidos;
- projetos atualizados recentemente.

### 10.3 Projetos

- pesquisa;
- filtros;
- ordenação;
- criação;
- tabela/cards;
- atalhos para repositório e deploy.

### 10.4 Detalhe do projeto

Seções:

- resumo;
- links;
- tecnologias;
- domínios;
- pendências;
- observações.

### 10.5 Domínios

Deve apresentar projeto, hostname, vencimento, dias restantes e classificação de alerta.

### 10.6 Cadastros auxiliares

- categorias;
- tecnologias.

---

## 11. Validação e integridade

### Projeto

- nome obrigatório após trim;
- categoria e status obrigatórios;
- URLs opcionais, porém válidas quando informadas.

### Domínio

- hostname obrigatório;
- protocolo/caminho removidos na normalização;
- vencimento deve ser data válida quando informado.

### Pendência

- projeto obrigatório;
- descrição obrigatória;
- status deve pertencer ao conjunto permitido.

Itens em uso devem ser desativados ou arquivados sempre que exclusão destrutiva puder quebrar referências.

---

## 12. Segurança

### Firebase Authentication

O MVP utiliza somente Google Sign-In.

### Firestore Security Rules

A autorização deve ser aplicada também no Firestore e não apenas escondendo telas no frontend.

Regra estrutural principal:

```text
request.auth != null
request.auth.token.firebase.sign_in_provider == "google.com"
request.auth.uid == userId
```

O cliente não possui credenciais administrativas.

O `firebaseConfig` do Web SDK pode ser versionado; arquivos de service account, private keys, tokens administrativos e outros segredos não podem ser incluídos no frontend ou Git.

### Validação de dados

A primeira versão das rules isola usuários. Conforme os modelos forem implementados, as rules deverão ganhar validação campo a campo para operações sensíveis.

---

## 13. Persistência Firestore

Firestore é schemaless; portanto, não haverá migrations SQL tradicionais.

A evolução do schema será tratada por:

- contratos de modelo no código;
- valores padrão;
- versionamento quando necessário;
- scripts de migração específicos quando uma alteração exigir transformar documentos existentes.

Acesso ao Firestore deve ficar encapsulado em repositórios.

O arquivo `public/js/repositories/user-paths.js` centraliza a convenção inicial de caminhos privados.

---

## 14. Requisitos não funcionais

### Responsividade

Prioridade:

1. desktop;
2. celular;
3. tablet.

### Performance

- evitar leituras desnecessárias;
- utilizar filtros/queries Firestore adequados;
- criar índices compostos somente conforme consultas reais exigirem;
- usar paginação ou carregamento progressivo quando a base crescer.

### Acessibilidade

- ações principais acessíveis por teclado;
- labels em formulários;
- contraste adequado;
- alertas não dependem apenas de cor;
- estados possuem texto acessível.

### Compatibilidade

Navegadores modernos com suporte a ES Modules.

---

## 15. Tratamento de erros e estados

A UI deve prever:

- carregando;
- carregado com dados;
- vazio;
- erro de validação;
- erro de autenticação/autorização;
- erro de Firestore;
- recurso inexistente;
- ausência de conexão quando detectável;
- atualização em andamento.

Formulários devem bloquear envios duplicados durante processamento.

---

## 16. Auditoria mínima

Entidades principais:

- `created_at`;
- `updated_at`.

Projeto:

- `archived_at`.

Pendência concluída:

- `completed_at`.

Histórico completo de alterações fica fora do MVP.

---

## 17. Estratégia de testes

### Unitários

Prioridade:

- vencimento de domínio;
- classificação de alerta;
- normalização de hostname;
- transição de pendência;
- validação de projeto.

### Integração

- autenticação e isolamento por usuário;
- criação/edição/arquivamento de projeto;
- filtros;
- pendências;
- domínios;
- dashboard.

### E2E

Fluxos mínimos:

1. entrar com Google;
2. criar projeto;
3. localizar projeto;
4. editar projeto;
5. adicionar e concluir pendência;
6. cadastrar domínio;
7. visualizar alerta;
8. arquivar projeto;
9. sair.

As Firestore Rules devem possuir testes próprios antes de regras mais restritivas serem consideradas concluídas.

---

## 18. Deploy e infraestrutura

Arquivos versionados:

```text
.firebaserc
firebase.json
firestore.rules
firestore.indexes.json
```

Hosting publica o conteúdo de `public/`.

Projeto padrão:

```text
eslavahub-434e5
```

Procedimentos estão documentados em [`SETUP_FIREBASE.md`](SETUP_FIREBASE.md).

---

## 19. Migração da planilha

A importação da planilha atual fica fora do caminho crítico do MVP, porém a modelagem deve permitir mapear:

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

IDs internos continuarão sendo gerados pelo Firestore.

---

## 20. Evoluções previstas

Fora do MVP inicial:

- integração automática com GitHub;
- leitura automática de linguagem/repositório;
- sincronização de deploys;
- notificações externas;
- Google Calendar;
- CRM de clientes;
- histórico completo;
- anexos;
- papéis e permissões avançados;
- API externa;
- monitoramento de uptime;
- WHOIS/renovação automática de domínio.

---

## 21. Decisões ainda pendentes

Mesmo com a fundação definida, permanecem decisões posteriores:

- estratégia de backup/exportação do Firestore;
- ferramentas de lint/formatação/testes;
- CI;
- política de validação campo a campo das Firestore Rules;
- estratégia definitiva de importação da planilha.

---

## 22. Critérios de aceite do MVP

O MVP estará apto para uso quando:

- login Google estiver funcional;
- usuário não autenticado não acessar os dados;
- dados estiverem isolados por UID;
- projetos puderem ser criados com nome, categoria e status;
- campos opcionais puderem ficar vazios;
- projetos puderem ser pesquisados, filtrados e arquivados;
- múltiplas tecnologias puderem ser associadas;
- pendências puderem ser criadas e concluídas;
- domínios puderem ser cadastrados com vencimento opcional;
- alertas de vencimento forem calculados corretamente;
- dashboard apresentar os principais indicadores;
- fluxos essenciais funcionarem em desktop e celular;
- Security Rules e fluxos principais estiverem testados.

---

## 23. Estado atual da implementação

Já versionados:

- Firebase Web configuration;
- serviço de autenticação Google;
- tela inicial de login/sessão;
- convenção de caminhos Firestore por UID;
- Firestore Security Rules;
- configuração Firebase Hosting;
- configuração de índices Firestore;
- documentação de setup Firebase.

A execução local, o login real e a conexão real com Firestore ainda precisam ser validados em ambiente executável antes das tasks correspondentes serem consideradas integralmente concluídas.
