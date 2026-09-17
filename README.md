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

## Estrutura inicial de dados

```text
users/{uid}/
  projects/
  categories/
  statuses/
  technologies/
  domains/
  pendingItems/
```

## Executar localmente

A aplicação precisa ser servida por HTTP por utilizar ES Modules.

Exemplo:

```bash
python -m http.server 5500 --directory public
```

Acesse `http://localhost:5500`.

Para o login funcionar, o provedor Google precisa estar habilitado no Firebase Authentication e `localhost` precisa estar entre os domínios autorizados.

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

- 4 concluídas;
- 2 em progresso;
- 42 ainda não iniciadas.

A fundação Firebase e o fluxo inicial de autenticação já estão implementados no repositório. A execução local, o login real e a conexão real com Firestore ainda precisam ser validados antes de encerrar as tasks correspondentes.

## Documentação

- [Proposta do produto](docs/PROPOSTA.md)
- [Software Design Document (SDD)](docs/SDD.md)
- [Backlog e documentação das tasks](docs/TASKS.md)
- [Configuração Firebase](docs/SETUP_FIREBASE.md)

## Estado do projeto

**Fase:** fundação técnica do MVP.

Próximo passo: validar a execução local e a conexão autenticada com Firestore, depois iniciar os modelos `Project` e `Category/ProjectStatus`.
