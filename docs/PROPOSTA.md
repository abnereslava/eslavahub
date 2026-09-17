# Proposta do Produto — EslavaHub

## 1. Visão

O **EslavaHub** será uma aplicação web para organizar e acompanhar projetos de programação em um único ambiente.

Seu papel principal é funcionar como uma central operacional dos projetos: em vez de consultar planilhas, repositórios, URLs, registros de domínio e listas de pendências separadamente, o usuário poderá abrir o EslavaHub e encontrar a situação atual de cada projeto.

A aplicação deve manter a praticidade do controle atual em planilha, mas acrescentar recursos próprios de um sistema: filtros, pesquisa, relações entre dados, indicadores, alertas e acompanhamento de pendências.

---

## 2. Problema que o produto resolve

À medida que a quantidade de projetos aumenta, informações importantes passam a ficar distribuídas entre diferentes locais, por exemplo:

- nome e categoria do projeto;
- repositório de código;
- endereço de deploy;
- cliente relacionado;
- estágio atual do projeto;
- tecnologias utilizadas;
- domínio registrado;
- data de vencimento do domínio;
- observações pontuais;
- correções, melhorias e outras pendências.

Essa dispersão dificulta responder rapidamente perguntas como:

- Quais projetos ainda estão em desenvolvimento?
- Quais projetos possuem pendências?
- O que falta fazer em determinado projeto?
- Quais projetos pertencem a determinado cliente?
- Quais aplicações estão publicadas?
- Qual é o repositório de determinado projeto?
- Quais domínios vencem em breve?
- Quais tecnologias estão sendo utilizadas nos projetos?

O EslavaHub centraliza essas respostas.

---

## 3. Objetivos

### 3.1 Objetivo principal

Manter um inventário vivo dos projetos de programação e oferecer uma visão clara do estado atual de cada um.

### 3.2 Objetivos específicos

- centralizar informações técnicas e administrativas dos projetos;
- reduzir dependência de planilhas para acompanhamento;
- facilitar acesso a repositórios, deploys e domínios;
- tornar rapidamente visíveis projetos que precisam de atenção;
- acompanhar pendências sem transformar o sistema em uma ferramenta complexa de gestão de tarefas;
- acompanhar vencimentos de domínio;
- permitir localizar projetos por filtros e pesquisa;
- manter histórico e organização mesmo depois que um projeto for finalizado ou abandonado.

---

## 4. Princípios do produto

### 4.1 Projeto como unidade principal

Toda informação deve partir de um projeto. Domínios, tecnologias e pendências existem vinculados a ele.

### 4.2 Preenchimento mínimo

Nem todo projeto possui cliente, domínio, deploy ou repositório público. Por isso, apenas os campos essenciais devem ser obrigatórios.

### 4.3 Consulta rápida

As informações mais utilizadas devem estar acessíveis com poucos cliques.

### 4.4 Sinalização, não burocracia

O EslavaHub deve chamar atenção para aquilo que precisa de ação — como uma pendência ou domínio próximo do vencimento — sem exigir processos complexos de gestão.

### 4.5 Estrutura expansível

O MVP deve ser simples, mas o modelo deve permitir a inclusão futura de integrações e automações.

---

## 5. Estrutura de um projeto

Cada projeto poderá conter:

| Informação | Regra inicial |
| --- | --- |
| ID | Gerado automaticamente e imutável |
| Categoria | Obrigatória |
| Nome | Obrigatório |
| Link do repositório | Opcional |
| Link do deploy | Opcional |
| Cliente | Opcional |
| Status | Obrigatório |
| Linguagens/tecnologias | Opcional; aceita mais de uma |
| Domínio | Opcional |
| Data de expiração | Opcional quando não aplicável; associada ao domínio |
| Observações rápidas | Opcional |
| Pendências | Opcional; lista vinculada ao projeto |

### 5.1 Categorias

As categorias devem ser tratadas como dados configuráveis, evitando que a aplicação dependa de uma lista fixa no código.

Exemplos iniciais que podem ser utilizados:

- Aplicação Web;
- Landing Page;
- Site;
- Plataforma Web;
- Programa;
- Jogo;
- Automação/Script;
- Outro.

### 5.2 Status de projeto

Sugestão inicial:

- Idealizado;
- Em desenvolvimento;
- Funcional;
- Finalizado;
- Pausado;
- Abandonado.

A interface poderá utilizar nomes de exibição amigáveis, enquanto internamente cada status terá um identificador estável.

---

## 6. Pendências

Cada projeto poderá possuir zero ou mais pendências.

A estrutura mínima preserva a lógica simples de acompanhamento:

- **Estado** — situação da pendência;
- **Onde/Área** — parte do projeto a que ela se refere;
- **O que** — descrição objetiva do que precisa ser feito.

Campos adicionais poderão ser opcionais:

- prioridade;
- prazo;
- observação complementar;
- data de conclusão.

Sugestão inicial de estados:

- Pendente;
- Em andamento;
- Aguardando;
- Concluída;
- Descartada.

O objetivo não é reproduzir uma ferramenta completa de gestão ágil, mas registrar com clareza o que ainda exige atenção em cada projeto.

---

## 7. Domínios

Quando um projeto possuir domínio, o usuário poderá registrar:

- domínio;
- data de expiração;
- observação opcional sobre registro/hospedagem.

O sistema deverá calcular automaticamente a distância até a data de expiração.

### 7.1 Alertas

O MVP deverá possuir alertas visuais dentro da aplicação.

Sugestão de faixas iniciais, posteriormente configuráveis:

- mais de 30 dias: normal;
- até 30 dias: atenção;
- até 15 dias: alerta;
- até 7 dias: urgente;
- data ultrapassada: vencido.

Notificações externas por e-mail, push ou calendário poderão ser avaliadas após o MVP.

---

## 8. Dashboard

A tela inicial deverá resumir o estado da carteira de projetos.

Indicadores possíveis:

- total de projetos;
- projetos em desenvolvimento;
- projetos com pendências abertas;
- total de pendências abertas;
- domínios próximos do vencimento;
- domínios vencidos.

Blocos de destaque:

- projetos em andamento;
- pendências que precisam de atenção;
- domínios próximos do vencimento;
- projetos atualizados recentemente.

O dashboard deve servir como ponto de entrada para ação, não apenas como painel estatístico.

---

## 9. Listagem de projetos

A listagem deverá permitir alternar, se necessário, entre visualização tabular e cartões.

Deverá oferecer:

- pesquisa textual;
- filtro por categoria;
- filtro por status;
- filtro por cliente;
- filtro por tecnologia;
- filtro por presença de pendências;
- ordenação por nome, ID e atualização mais recente.

Cada item deverá dar acesso rápido à página completa do projeto e, quando existirem, aos links de repositório e deploy.

---

## 10. Página do projeto

A página de detalhes será o centro de acompanhamento de cada projeto.

Estrutura sugerida:

### Cabeçalho

- nome;
- ID;
- categoria;
- status;
- cliente;
- ações de edição.

### Links rápidos

- repositório;
- deploy;
- domínio.

### Tecnologias

Lista das linguagens, frameworks e outras tecnologias associadas.

### Domínio

- endereço;
- vencimento;
- dias restantes;
- indicador visual de situação.

### Pendências

Lista das pendências abertas e concluídas, com possibilidade de criação e atualização rápida.

### Observações

Campo para informações breves que não justificam a criação de uma pendência.

---

## 11. Escopo do MVP

O MVP deverá incluir:

1. criação, visualização, edição e arquivamento de projetos;
2. categorias e status;
3. pesquisa e filtros;
4. cadastro de repositório e deploy;
5. registro de cliente como informação do projeto;
6. associação de múltiplas tecnologias;
7. cadastro de domínio e vencimento;
8. cálculo e alerta visual de vencimento;
9. observações rápidas;
10. CRUD de pendências vinculadas ao projeto;
11. dashboard com indicadores essenciais;
12. interface responsiva para desktop e dispositivos móveis.

---

## 12. Fora do escopo inicial

Para evitar crescimento prematuro do produto, estes recursos não fazem parte obrigatória do primeiro MVP:

- gestão financeira de projetos;
- CRM completo de clientes;
- controle de horas;
- sprints e metodologias ágeis completas;
- armazenamento do código-fonte dentro do EslavaHub;
- edição de arquivos do repositório;
- sistema completo de tickets;
- notificações externas multicanal;
- monitoramento de uptime;
- analytics de deploy;
- automações com provedores de domínio.

Esses recursos poderão ser avaliados posteriormente.

---

## 13. Possíveis evoluções

Após validação do MVP, o EslavaHub poderá evoluir para incluir:

- integração com GitHub para importar repositórios e dados automaticamente;
- identificação da linguagem principal do repositório;
- sincronização de status de deploy;
- histórico de alterações do projeto;
- cadastro estruturado de clientes;
- múltiplos domínios por projeto;
- notificações de vencimento por e-mail ou push;
- integração com Google Calendar;
- indicadores de manutenção técnica;
- tags personalizadas;
- anexos e documentação relacionada;
- API própria;
- importação dos registros existentes em planilha.

---

## 14. Critérios de sucesso do MVP

O MVP pode ser considerado funcional quando o usuário conseguir:

- registrar todos os projetos atuais sem depender de campos artificiais;
- encontrar um projeto rapidamente por busca ou filtro;
- abrir repositório e deploy a partir da ficha do projeto;
- saber quais projetos ainda possuem pendências;
- consultar e atualizar as pendências de um projeto;
- identificar imediatamente domínios próximos do vencimento;
- visualizar em uma única tela quais projetos exigem atenção.

---

## 15. Decisões ainda em aberto

Estas escolhas devem ser definidas antes ou durante o início da implementação:

- stack de frontend;
- stack de backend;
- banco de dados;
- modelo de autenticação;
- forma de hospedagem;
- estratégia de backup;
- necessidade de funcionamento multiusuário;
- integração ou não com GitHub no primeiro ciclo;
- política definitiva de alertas de domínio;
- estratégia de importação dos dados da planilha existente.

As decisões técnicas correspondentes devem ser registradas no [SDD](SDD.md) ou em ADRs futuros.