# EslavaHub

O **EslavaHub** é uma aplicação web para centralizar e acompanhar projetos de programação em um único lugar.

A proposta é substituir o controle disperso em planilhas e anotações por uma visão organizada de cada projeto, reunindo informações de desenvolvimento, repositório, publicação, domínio e pendências.

## Objetivo

Cada projeto terá uma ficha central com as informações necessárias para acompanhamento do seu ciclo de vida, sem obrigar o preenchimento de campos que não façam sentido para aquele projeto.

## Informações por projeto

| Campo | Obrigatoriedade inicial |
| --- | --- |
| ID | Automático e obrigatório |
| Categoria | Obrigatório |
| Nome | Obrigatório |
| Link do repositório | Opcional |
| Link do deploy | Opcional |
| Cliente | Opcional |
| Status | Obrigatório |
| Linguagens/tecnologias utilizadas | Opcional |
| Domínio atribuído | Opcional |
| Data de expiração do domínio | Opcional |
| Observações rápidas | Opcional |
| Pendências | Opcional |

## Stack do MVP

- HTML5;
- CSS3;
- JavaScript com ES Modules;
- Firebase Web SDK 12.19.0;
- Firebase Authentication com Google;
- Cloud Firestore;
- Firestore Security Rules;
- Firebase Hosting.

Não há backend próprio no MVP inicial. O acesso do cliente ao Firestore é protegido pelas Security Rules e os dados são isolados por UID.

## Estrutura de dados

```text
users/{uid}/
  projects/
  categories/
  statuses/
  technologies/
  domains/
  pendingItems/
```

## Funcionalidades já implementadas em código

- login e logout com Google;
- bootstrap dos status padrão;
- CRUD/base de persistência dos modelos do MVP;
- cadastro, listagem, detalhe, edição, arquivamento e restauração de projetos;
- associação de tecnologias;
- gestão de categorias e tecnologias;
- pendências por projeto, incluindo status, prioridade, prazo e descarte;
- domínios por projeto, domínio principal e vencimento;
- visão global de domínios com alertas e filtros;
- testes unitários de validação e vencimento;
- lint e CI pelo GitHub Actions.

Os fluxos que dependem do Firebase real ainda precisam de validação end-to-end antes de serem considerados concluídos no backlog.

## Executar localmente

```bash
npm install
npm run serve
```

Também é possível servir `public/` por qualquer servidor HTTP local compatível com ES Modules.

Para o login funcionar, o provedor Google precisa estar habilitado no Firebase Authentication e `localhost` precisa estar entre os domínios autorizados.

Ver comandos e verificações em [Desenvolvimento local](docs/DEVELOPMENT.md).

## Firebase

Projeto configurado:

```text
eslavahub-434e5
```

Infraestrutura versionada:

```text
.firebaserc
firebase.json
firestore.rules
firestore.indexes.json
```

Detalhes: [Configuração Firebase](docs/SETUP_FIREBASE.md)

## Progresso

Backlog atual: **48 tasks**.

- 12 concluídas;
- 22 em progresso;
- 14 ainda não iniciadas.

O GitHub Actions já executa testes e lint com sucesso. O principal ponto pendente para encerrar as tasks em progresso é validar autenticação, Security Rules e leitura/escrita contra o projeto Firestore real.

## Documentação

- [Proposta do produto](docs/PROPOSTA.md)
- [Software Design Document (SDD)](docs/SDD.md)
- [Backlog e documentação das tasks](docs/TASKS.md)
- [Modelo Firestore](docs/FIRESTORE_MODEL.md)
- [Desenvolvimento local](docs/DEVELOPMENT.md)
- [Configuração Firebase](docs/SETUP_FIREBASE.md)

## Estado do projeto

**Fase:** implementação do núcleo do MVP e validação da integração Firebase.

Próximo passo crítico: executar o app autenticado e validar CRUD/Security Rules no Firestore real. Em paralelo, o desenvolvimento pode avançar para dashboard, busca e filtros.
