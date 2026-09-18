# M6 — Enriquecimento de dados

## TASK-061 — Localizar repositórios no GitHub e vincular aos projetos

**Status:** TODO  
**Prioridade:** P1

### Objetivo

Pesquisar, na conta GitHub conectada, quais repositórios correspondem aos projetos cadastrados no EslavaHub e preencher o campo `repository_url` dos projetos corretos.

### Escopo

- listar os repositórios acessíveis da conta;
- comparar nomes de repositório com nomes e aliases dos projetos;
- confirmar correspondências por README, descrição, deploy/homepage ou conteúdo quando o nome sozinho for ambíguo;
- cadastrar a URL canônica do repositório em cada projeto correspondente;
- preservar links já cadastrados quando corretos;
- não inventar correspondências quando houver dúvida.

### Estratégia

1. coletar os projetos atuais do EslavaHub;
2. listar repositórios GitHub acessíveis;
3. gerar correspondências exatas e prováveis;
4. validar correspondências ambíguas;
5. aplicar atualização idempotente no usuário dono dos projetos;
6. registrar quais projetos continuam sem repositório localizado.

### Restrições

- não alterar `deploy_url`;
- não substituir repository URL já correta;
- não associar forks/repositórios de terceiros sem confirmação;
- não usar semelhança de nome como única evidência em casos ambíguos;
- a atualização deve poder ser executada mais de uma vez sem duplicar nem corromper dados.

### Critérios de aceite

- [ ] repositórios acessíveis foram inventariados;
- [ ] correspondências foram documentadas;
- [ ] URLs confirmadas foram cadastradas nos projetos corretos;
- [ ] projetos sem correspondência ficaram explicitamente registrados;
- [ ] nenhum projeto recebeu repository URL sem evidência suficiente.
