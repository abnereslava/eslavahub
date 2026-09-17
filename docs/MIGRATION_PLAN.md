# Plano de Migração da Planilha — EslavaHub

**Fonte analisada:** `Sites e aplicativos criados.xlsx`  
**Aba principal:** `Todos`  
**Registros encontrados:** 27 projetos

Este documento define como os dados atuais da planilha deverão chegar ao EslavaHub sem transformar os identificadores e convenções legados em regras estruturais do novo sistema.

## 1. Estratégia escolhida

A migração inicial será feita por **script único assistido**, executado somente depois que Authentication, Security Rules e CRUD do Firestore forem validados no ambiente real.

O importador automático permanente não faz parte do MVP.

Antes da execução definitiva, o script deverá gerar uma prévia/relatório com:

- projetos reconhecidos;
- linhas com informação incompleta;
- IDs legados duplicados;
- datas que não puderam ser interpretadas;
- campos sem mapeamento automático;
- registros que exigem revisão manual.

## 2. Dados iniciais extraídos da planilha

### Categorias

- `Aplicação WEB`
- `Jogo`
- `Landing Page`
- `Plataforma web`
- `Programa`

Essas categorias são inicializadas automaticamente no primeiro bootstrap do usuário.

### Tecnologias encontradas

- `Html`
- `Python`
- `Typescript`

Essas tecnologias também são inicializadas automaticamente.

### Status legados

| Planilha | EslavaHub |
| --- | --- |
| `Idealizada` | `IDEALIZED` |
| `Desenvolvendo` | `IN_DEVELOPMENT` |
| `Funcional` | `FUNCTIONAL` |
| `Finalizada` | `FINISHED` |
| `Abandonada` | `ABANDONED` |

`PAUSED` existe no EslavaHub, mas não foi encontrado como status na planilha analisada.

## 3. IDs

O número da planilha é **ID legado**, não ID interno do EslavaHub.

Foi identificada duplicidade do ID legado `0024`. Por isso:

- o ID interno continua sendo gerado automaticamente pelo Firestore;
- o importador nunca deve usar o número antigo como `documentId`;
- o número legado pode ser mantido no relatório de migração ou em metadado auxiliar do importador;
- duplicidades de ID antigo não bloqueiam a criação de projetos distintos.

## 4. Mapeamento de colunas

| Planilha | Destino no EslavaHub | Regra |
| --- | --- | --- |
| `Nº` | referência legada de migração | nunca usar como ID Firestore |
| `Categoria` | `Project.category_id` | resolver pelo nome em `categories` |
| `Nome/link` | `Project.name` | nome visível; eventual hyperlink deve ser tratado separadamente |
| `Cliente` | `Project.client_name` | `-` e vazio viram `null` |
| `Status` | `Project.status_id` | mapear pela tabela de status deste documento |
| `Deploy` | revisão de migração | valores atuais representam principalmente plataforma, não URL pública |
| `Ling.` | `Project.technology_ids` | resolver/criar tecnologia correspondente |
| `Domínio` | `Domain.hostname` | criar somente quando houver domínio válido |
| `Vencimeto` | `Domain.expiration_date` | converter para `YYYY-MM-DD`; revisar valores numéricos Excel |
| `Observação rápida` | `Project.quick_notes` | `-` e vazio viram `null` |

## 5. Repositório e deploy

A estrutura atual da aba `Todos` não fornece em texto simples uma coluna separada de URL de repositório e URL pública de deploy.

O processo de migração deverá:

1. verificar se `Nome/link` contém hyperlink no arquivo original;
2. somente preencher `repository_url` quando uma URL de repositório puder ser confirmada;
3. não transformar valores como `Vercel`, `Github Pages`, `Cloudflare Pages` ou `Greatpages` em `deploy_url`;
4. manter `deploy_url = null` quando a URL pública não puder ser confirmada;
5. permitir complementação posterior pela interface do EslavaHub.

## 6. Datas de domínio

Datas devem ser convertidas para uma representação de data sem horário (`YYYY-MM-DD`).

O importador deve aceitar:

- texto no formato apresentado pela planilha;
- número serial de data do Excel;
- campo vazio.

Qualquer valor que não puder ser convertido de forma inequívoca deve ser sinalizado no relatório, sem inventar uma data.

## 7. Valores vazios

Os valores abaixo devem ser tratados como ausência de informação:

- célula vazia;
- `-` quando usado apenas como marcador de ausência.

Não devem ser gravados `"-"` nos campos opcionais do Firestore.

## 8. Pendências

A aba `Todos` possui observações rápidas, mas nem toda observação representa necessariamente uma pendência estruturada.

Por isso, a migração automática não deve transformar todas as observações em `PendingItem`.

Pendências existentes em abas individuais poderão ser importadas em uma etapa específica, usando a estrutura `Estado / Onde / O que` quando disponível.

## 9. Ordem da migração

```text
1. autenticar usuário
2. inicializar categorias, status e tecnologias
3. ler planilha
4. normalizar valores vazios
5. validar/marcar IDs legados duplicados
6. resolver categoria, status e tecnologia
7. criar Project com ID Firestore automático
8. criar Domain quando aplicável
9. gerar relatório de itens pendentes de revisão
10. validar contagem e amostra dos dados no EslavaHub
```

## 10. Critério de sucesso

A migração estará pronta para execução quando:

- o CRUD real no Firestore estiver validado;
- as Security Rules estiverem confirmadas com o usuário autenticado;
- o script possuir modo de prévia sem escrita;
- nenhuma linha for descartada silenciosamente;
- IDs legados duplicados não colidirem;
- datas ambíguas forem sinalizadas;
- a quantidade de projetos importados puder ser confrontada com os 27 registros da fonte.
