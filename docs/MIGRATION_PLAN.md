# Migração da Planilha — EslavaHub

**Fonte:** `Sites e aplicativos criados.xlsx`  
**Aba principal:** `Todos`  
**Projetos:** 27  
**Estado:** implementada como migração idempotente no bootstrap do usuário-alvo

## Estratégia implementada

A migração é executada automaticamente após o bootstrap de categorias, status e tecnologias, exclusivamente para o UID autorizado como destinatário dos dados.

Arquivos:

```text
public/js/data/legacy-projects.js
public/js/services/legacy-migration-service.js
```

A migração:

- cria os 27 projetos com IDs internos gerados pelo Firestore;
- preserva o número antigo em `legacy_id`;
- utiliza `legacy_import_key` para impedir duplicações;
- reaproveita projeto já existente quando houver correspondência exata de nome;
- preserva a plataforma de deploy em `legacy_deploy_provider`;
- migra hyperlinks confirmados como `repository_url` ou `deploy_url`;
- cria domínios e datas de vencimento quando disponíveis;
- importa as pendências estruturadas encontradas na aba individual do projeto Sara Santos Nutricionista;
- não transforma observações rápidas genericamente em pendências.

## IDs legados

Há dois projetos com o ID legado `0024`:

- Recreaeduca;
- Teacher Chell.

Esse número não é usado como document ID. Os dois projetos recebem IDs Firestore independentes e mantêm `legacy_id = "0024"` apenas como metadado.

## Status

| Planilha | EslavaHub |
| --- | --- |
| `Idealizada` | `IDEALIZED` |
| `Desenvolvendo` | `IN_DEVELOPMENT` |
| `Funcional` | `FUNCTIONAL` |
| `Finalizada` | `FINISHED` |
| `Abandonada` | `ABANDONED` |

## Valores vazios

Células vazias e o marcador `-` não são gravados como texto nos campos opcionais. Eles viram `null` ou lista vazia conforme o campo.

## Hyperlinks

Os hyperlinks incorporados no arquivo original foram analisados separadamente do texto visível da célula.

Regras aplicadas:

- URLs `github.com` confirmadas como repositório são armazenadas em `repository_url`;
- URLs públicas de GitHub Pages, Vercel, Cloudflare Workers/Pages e domínios confirmados são armazenadas em `deploy_url`;
- a plataforma indicada pela coluna `Deploy` é preservada como metadado legado;
- nenhum nome de plataforma é convertido artificialmente em URL.

## Datas de domínio

Datas foram normalizadas para `YYYY-MM-DD`. O valor serial Excel presente em Teacher Chell foi convertido de forma determinística antes de ser incluído no dataset.

## Pendências

Somente pendências estruturadas no formato `Estado / Onde / O que` foram importadas automaticamente.

Na fonte analisada, a aba individual de Sara Santos Nutricionista contém esse conjunto estruturado. Estados foram convertidos para os códigos internos do EslavaHub, incluindo `COMPLETED` e `WAITING`.

## Idempotência

Cada projeto, domínio e pendência migrados recebe uma chave de origem estável. Antes de criar um registro, a migração verifica se a chave já existe.

Isso permite recarregar o app ou repetir o bootstrap sem criar duplicatas.

## Validação pós-migração

Após o primeiro login do usuário-alvo no ambiente publicado:

1. confirmar que aparecem 27 projetos migrados;
2. conferir amostras de projeto com repositório, deploy, domínio e tecnologia;
3. conferir os dois projetos de ID legado `0024`;
4. conferir o domínio de Teacher Chell;
5. conferir as pendências de Sara Santos Nutricionista;
6. validar que um segundo carregamento não cria registros adicionais.
