# M6 — Enriquecimento de dados

## TASK-061 — Localizar repositórios no GitHub e vincular aos projetos

**Status:** IN PROGRESS  
**Prioridade:** P1

### Objetivo

Pesquisar, na conta GitHub conectada, quais repositórios correspondem aos projetos cadastrados no EslavaHub e preencher o campo `repository_url` dos projetos corretos.

## Resultado do inventário

Foram inventariados os repositórios pertencentes à conta GitHub conectada e cruzados com os 27 projetos legados.

### Já possuíam vínculo

| Projeto | Repositório |
| --- | --- |
| Galeria da Fé TCG | `abnereslava/galeria_da_fe_tcg` |
| DrakenBlood RPG | `abnereslava/DarkenbloodRPG` |
| Tabletop Educativo | `abnereslava/TabletopEducativo` |
| Bloqueador de teclas | `abnereslava/BloqueadorTeclas` |
| VisualStudioMaker | `abnereslava/VisualStudioMaker` |

### Novos vínculos confirmados

| Projeto | Repositório |
| --- | --- |
| Eslava Soluções Digitais | `abnereslava/eslava_solucoes_digitais` |
| Liscano Faz•Tudo | `abnereslava/Liscano-Faz-Tudo` |
| Cristalizando | `abnereslava/landingpage_cristalizando` |
| RPG Educacional | `abnereslava/rpg_perguntasv3` |
| Corrida Educacional | `abnereslava/race_gamev2` |
| Duelo Educacional | `abnereslava/duel_game` |
| Festa de Aniversário Vicente | `abnereslava/festa-vicente` |
| Gerenciador RPG Policial | `abnereslava/gerenciador_rpg_policial` |
| IBV Pinhais | `abnereslava/LandingPageIBVPinhais` |
| AvaliaTrilhas | `abnereslava/avaliatrilhas` |
| Blizpay | `abnereslava/Blizpay` |
| Dostais | `abnereslava/appdobb` |
| Selah | `abnereslava/SelahApp` |
| To doOS | `abnereslava/RotinaOS` |
| Vallor.nest | `abnereslava/Gest-o-Financeira` |
| Teacher Invest | `abnereslava/landingpage_teacherinvest` |
| RPG Educacional 2.0 | `abnereslava/rpg_animais` |
| Recreaeduca | `abnereslava/recreaeduca` |
| Sara Santos Nutricionista | `abnereslava/landingpage_sara_nutricionista` |

### Sem vínculo automático

| Projeto | Motivo |
| --- | --- |
| Gerenciador Manutenções Carro | nenhum repositório correspondente localizado |
| Klein Holtz | nenhum repositório correspondente localizado |
| Teacher Chell | nenhum repositório correspondente localizado |

## Implementação

Arquivos:

```text
public/js/data/project-repository-links.js
public/js/services/repository-link-enrichment-service.js
```

O enriquecimento roda durante `initializeUserWorkspace()`, depois da migração legada.

Regras:

- executa apenas para o UID dono dos projetos migrados;
- localiza o projeto pela chave de migração e possui fallback por nome;
- preenche somente `repository_url` vazio;
- nunca sobrescreve um repository URL já cadastrado;
- pode ser executado repetidamente sem duplicar ou corromper dados.

Após o próximo bootstrap bem-sucedido da conta principal, o resultado esperado é:

- **24 projetos com repository URL**;
- **3 projetos sem repository URL confirmado**.

## Evidências usadas

Foram utilizadas, conforme o projeto:

- correspondência exata do nome do repositório;
- caminho do deploy GitHub Pages, que identifica diretamente o repositório;
- homepage do repositório igual ao deploy cadastrado;
- descrição do repositório coerente com a finalidade do projeto.

O vínculo `RPG Educacional 2.0 → abnereslava/rpg_animais` foi confirmado explicitamente pelo proprietário do projeto.

## Critérios de aceite

- [x] repositórios acessíveis foram inventariados;
- [x] correspondências foram documentadas;
- [x] atualização idempotente foi implementada para URLs confirmadas;
- [x] projetos sem correspondência ficaram explicitamente registrados;
- [x] nenhum projeto recebeu repository URL sem evidência suficiente;
- [ ] execução confirmada no Firestore real após bootstrap da conta principal.
