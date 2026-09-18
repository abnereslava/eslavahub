# Plano de otimização de leituras e escritas — Firestore

**Estado:** em execução  
**Implementação:** bootstrap versionado, cache em memória, IndexedDB persistente, cache-first e redução de writes implementados  
**Objetivo:** reduzir leituras/escritas desnecessárias no Cloud Firestore mantendo simplicidade, consistência e funcionamento offline.

---

## 1. Contexto

O EslavaHub usa Cloud Firestore no plano Spark.

Limites gratuitos atuais do Firestore Standard:

- 50.000 leituras de documentos por dia;
- 20.000 gravações de documentos por dia;
- 20.000 exclusões por dia;
- 1 GiB de armazenamento;
- 10 GiB/mês de transferência de saída.

O volume atual do EslavaHub é pequeno, então não existe emergência de custo. O objetivo deste plano é evitar uma arquitetura que escale o número de operações proporcionalmente ao número de telas abertas e recarregamentos do navegador.

---

## 2. Diagnóstico do código atual

### Dataset aproximado atual

A partir da base migrada:

- 27 projetos;
- 5 categorias;
- 6 status;
- 3 tecnologias iniciais;
- aproximadamente 5 domínios migrados;
- aproximadamente 20 pendências migradas.

Esses números podem crescer e são usados somente para estimar o padrão de consumo atual.

### 2.1 Bootstrap

Hoje, em cada login, `initializeUserWorkspace()` executa:

1. `ensureDefaults` de status;
2. `ensureDefaults` de categorias;
3. `ensureDefaults` de tecnologias;
4. migração da planilha legada;
5. enriquecimento de links GitHub;
6. enriquecimento de links Search Console;
7. garantia da numeração dos projetos.

Mesmo quando tudo já foi migrado, essas rotinas continuam lendo dados para descobrir que não há nada a fazer.

Estimativa atual em uma base já inicializada:

| Operação | Leituras aproximadas |
| --- | ---: |
| defaults | 14 |
| verificação da migração | 66 |
| enriquecimento GitHub | 27 |
| enriquecimento Search Console | 27 |
| numeração de projetos | 27 |
| **Total de bootstrap** | **~161** |

A quantidade real depende do número atual de documentos.

### 2.2 Dashboard

O Dashboard lê novamente:

- projetos;
- status;
- pendências;
- domínios.

Na base migrada, isso representa aproximadamente **58 leituras**.

### 2.3 Tela de Projetos

Ao abrir a listagem:

`getProjectListOptions()` lê:

- categorias;
- status;
- tecnologias;
- projetos.

Depois, `queryProjects()` lê novamente:

- projetos;
- categorias;
- status;
- tecnologias;
- domínios;
- pendências quando o filtro correspondente estiver ativo.

Sem filtro de pendências, a base atual representa aproximadamente:

- 41 leituras para opções;
- 46 leituras para a listagem;
- **~87 leituras para uma abertura da página**.

### 2.4 Sessão comum

Uma sessão simples:

1. login;
2. Dashboard;
3. Projetos;

pode chegar a aproximadamente:

```text
161 + 58 + 87 ≈ 306 leituras
```

Esse valor é uma estimativa arquitetural, não uma medição de faturamento.

O principal problema não é a quantidade de documentos, e sim a repetição das mesmas coleções na mesma sessão.

---

## 3. Decisão recomendada

Não criar um cache próprio completo em `localStorage`.

A estratégia recomendada é:

```text
Firestore
   ↓
cache persistente oficial do SDK (IndexedDB)
   ↓
WorkspaceStore em memória durante a sessão
   ↓
services / telas
```

`localStorage` pode continuar sendo usado futuramente apenas para metadados pequenos, como preferências de UI ou timestamps de sincronização.

Os dados de negócio devem continuar tendo o Firestore como fonte de verdade.

---

## 4. Por que não usar localStorage como banco secundário

Salvar projetos, domínios e pendências diretamente em `localStorage` criaria:

- dois bancos para sincronizar;
- invalidação manual;
- risco de dados antigos sobrescreverem dados novos;
- serialização manual de Firestore Timestamp;
- dificuldade com múltiplas abas;
- dificuldade com múltiplos dispositivos;
- lógica própria de fila offline;
- duplicação de funcionalidades já presentes no SDK do Firestore.

O Firestore Web SDK oferece cache local persistente usando IndexedDB e sincronização de alterações offline.

---

# Estado de implementação

## Entregue — 18/09/2026

### Bootstrap versionado

Implementado um documento:

```text
users/{uid}/meta/workspace
```

Ele registra as versões das etapas de inicialização. Quando todas estão atuais, o login faz apenas a leitura desse documento e não executa novamente defaults, migração, enriquecimentos ou numeração.

Enquanto a Security Rule de `meta` não estiver publicada no Firebase, o app usa automaticamente o bootstrap legado como fallback e continua funcionando.

### Cache em memória por sessão

`FirestoreRepository.list()` agora mantém listas completas por **5 minutos** em memória.

Regras:

- cache separado por UID e coleção;
- apenas listagens completas são cacheadas;
- queries arbitrárias continuam indo ao Firestore;
- create/update/delete invalidam imediatamente a coleção afetada;
- logout limpa o cache do usuário;
- Domínios e Pendências por projeto reutilizam a lista da sessão.

Isso já elimina boa parte das leituras repetidas entre Dashboard, Projetos, Detalhe e Cadastros.

### Status defaults

A verificação de status padrão passou a listar a coleção uma vez, alimentando também o cache da sessão, em vez de buscar cada status isoladamente.

### Cache persistente oficial

O Firestore agora é inicializado com:

```js
initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
})
```

Os documentos ficam no IndexedDB e podem ser reutilizados entre sessões e abas.

### Cache-first com TTL

As coleções usam os seguintes TTLs iniciais:

| Coleção | TTL |
| --- | ---: |
| categorias | 60 min |
| status | 60 min |
| tecnologias | 60 min |
| projetos | 5 min |
| domínios | 10 min |
| pendências | 5 min |
| metadata do workspace | 24 h |

O `localStorage` guarda somente:

```text
timestamp da última sincronização + quantidade de documentos
```

Os dados de negócio permanecem exclusivamente no cache oficial do Firestore/IndexedDB.

Antes de confiar no cache persistente, o app compara a quantidade esperada de documentos com a quantidade disponível no IndexedDB. Se estiver incompleto, volta ao servidor.

### Fallback offline

Quando uma leitura de servidor falha:

1. tenta o IndexedDB;
2. devolve os dados disponíveis;
3. mantém o app utilizável offline.

### Refresh manual

O header possui uma ação `Atualizar`.

Ela:

- limpa o cache em memória;
- invalida os timestamps locais;
- força a próxima leitura a consultar o servidor;
- não apaga o IndexedDB.

### Indicador offline

Quando `navigator.onLine` indica ausência de rede, o header mostra `Offline`.

### Redução de writes

`updateDoc` é ignorado quando:

- a coleção está no cache de sessão;
- o documento está presente;
- todos os campos enviados já possuem exatamente os mesmos valores.

Nenhuma leitura adicional é feita apenas para descobrir se uma escrita pode ser evitada.

## Ainda não implementado

- métricas reais de consumo;
- medição comparativa antes/depois no console do Firebase;
- sincronização visual de writes pendentes além do indicador simples de offline.

---

# Fases propostas

## Fase 1 — Bootstrap versionado

### Problema

O bootstrap tenta descobrir em cada login se operações antigas ainda precisam ser executadas.

### Solução

Criar um documento pequeno de metadata, por exemplo:

```text
users/{uid}/meta/workspace
```

ou uma coleção equivalente permitida pelas Security Rules.

Campos possíveis:

```json
{
  "bootstrap_version": 4,
  "legacy_migration_version": 1,
  "repository_enrichment_version": 1,
  "search_console_enrichment_version": 1,
  "project_number_version": 1
}
```

### Fluxo

```text
login
  ↓
1 leitura do metadata
  ↓
versão atual?
  ├─ sim → não executar migrations
  └─ não → executar somente a etapa pendente
```

### Impacto esperado

O bootstrap normal pode cair de ~161 leituras para aproximadamente **1 leitura**.

### Observação

Essa mudança exigirá atualizar as Firestore Security Rules para permitir a nova coleção de metadata.

---

## Fase 2 — WorkspaceStore em memória

### Problema

Cada service carrega suas próprias cópias de:

- projetos;
- categorias;
- status;
- tecnologias;
- domínios;
- pendências.

### Solução

Criar um `WorkspaceStore` compartilhado durante a sessão.

Exemplo conceitual:

```text
WorkspaceStore
├── projects
├── categories
├── statuses
├── technologies
├── domains
└── pendingItems
```

Na primeira necessidade de uma coleção:

1. lê Firestore;
2. guarda o resultado em memória;
3. próximas telas reutilizam o resultado.

### Invalidação

Uma escrita bem-sucedida deve atualizar também o store local.

Exemplo:

```text
updateProject()
   ↓
Firestore
   ↓
sucesso
   ↓
WorkspaceStore.patchProject()
```

### Benefício

Dashboard → Projetos → Detalhe podem reutilizar o mesmo snapshot da sessão.

Com a base atual, uma carga completa do workspace representa aproximadamente **66 documentos**, em vez de centenas de leituras repetidas.

---

## Fase 3 — Cache persistente oficial do Firestore

### Situação atual

O app usa:

```js
getFirestore(app)
```

O cache padrão Web é em memória.

### Proposta

Avaliar a troca para:

```js
initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
})
```

Isso usa IndexedDB e mantém dados entre sessões.

### Benefícios

- leitura offline;
- queries offline;
- fila de gravações offline;
- sincronização automática quando a conexão volta;
- suporte a múltiplas abas com o tab manager apropriado.

### Atenção

Persistência local **não significa automaticamente zero leituras de servidor**.

Chamadas padrão de `getDoc/getDocs`, quando online, tentam obter dados atuais do servidor.

Para reduzir operações de servidor também será necessário adotar uma estratégia cache-first.

---

## Fase 4 — Cache-first + stale-while-revalidate

### Estratégia

Ao abrir uma tela:

```text
1. tentar cache
2. renderizar imediatamente
3. avaliar idade do snapshot
4. buscar servidor somente se necessário
5. atualizar cache/store
```

O SDK oferece APIs como:

- `getDocFromCache`;
- `getDocsFromCache`.

### TTL sugerido inicialmente

| Dados | TTL sugerido |
| --- | ---: |
| categorias | 60 min |
| status | 60 min |
| tecnologias | 60 min |
| projetos | 5–10 min |
| domínios | 10 min |
| pendências | 5 min |

Esses valores devem ser ajustados por uso real.

### Atualização imediata

Quando o próprio usuário escreve algo pelo EslavaHub, não é necessário esperar o TTL:

- atualizar Firestore;
- atualizar cache em memória;
- considerar os dados locais atuais.

### Refresh manual

Adicionar futuramente uma ação discreta:

```text
Atualizar dados
```

que força leitura do servidor.

---

## Fase 5 — Eliminar leituras duplicadas dentro da mesma operação

### Casos atuais

A tela Projetos chama separadamente:

- `getProjectListOptions()`;
- `queryProjects()`.

Ambas leem projetos, categorias, status e tecnologias.

### Refatoração futura

Criar algo equivalente a:

```js
const workspace = await workspaceStore.getSnapshot(uid);
```

e passar o mesmo snapshot para:

- geração dos filtros;
- enriquecimento da listagem;
- ordenação;
- paginação.

Isso elimina leituras duplicadas mesmo sem cache persistente.

---

## Fase 6 — Bootstrap sem scans

Após introduzir metadata versionada:

### Hoje

```text
login
→ lista projetos
→ lista projetos de novo
→ lista projetos de novo
→ lista projetos de novo
```

### Futuro

```text
login
→ lê metadata
→ nenhuma migração necessária
→ abre aplicação
```

As rotinas de migração continuam disponíveis, mas são acionadas apenas quando a versão muda.

---

## Fase 7 — Otimizar gravações

Gravações ainda estão muito abaixo de leituras, mas algumas medidas são úteis.

### Não escrever valor inalterado

Antes de `updateDoc`, comparar campos editados com o snapshot conhecido.

### Edição inline

Pendências já salvam texto no blur, o que reduz gravações comparado a salvar cada tecla.

Manter esse comportamento.

Se no futuro houver autosave por digitação:

- debounce mínimo de 500–1000 ms;
- preferir salvar ao sair do campo.

### Bootstrap

Nenhuma rotina de bootstrap deve executar writes quando a versão atual já estiver aplicada.

### Operações em lote

Usar batch somente quando uma operação logicamente exigir várias gravações, como troca de domínio principal.

---

## Fase 8 — Queries e paginação server-side quando houver escala

Atualmente o EslavaHub possui poucas dezenas de projetos.

Carregar 27 projetos uma vez em cache é simples e eficiente.

Não vale aumentar a complexidade agora apenas para evitar algumas dezenas de documentos.

Quando a base passar, por exemplo, de 100–200 projetos, revisar:

- `limit()`;
- `startAfter()`;
- queries por status/categoria;
- índices compostos;
- paginação server-side.

Evitar `offset`, porque documentos ignorados também podem gerar cobrança de leitura.

---

## Fase 9 — Dashboard

O Dashboard atualmente lê quatro coleções completas.

Com `WorkspaceStore`, ele deve calcular os indicadores usando o snapshot já carregado.

### Não recomendado agora

Criar documentos de contadores agregados atualizados a cada write.

Isso reduziria leituras, mas:

- aumenta complexidade;
- aumenta gravações;
- cria risco de divergência;
- não é necessário para o volume atual.

Reavaliar apenas se o volume crescer significativamente.

---

# Estratégia offline

## Leitura

O usuário deve conseguir abrir o último snapshot disponível.

## Escrita

O Firestore SDK pode enfileirar alterações locais e sincronizá-las quando a conexão voltar.

Para conflitos no mesmo documento, a política padrão é last-write-wins.

## Indicador visual futuro

Adicionar um estado discreto:

```text
Online
Offline — alterações serão sincronizadas
Sincronizando…
```

Isso evita que o usuário confunda dado local com confirmação do servidor.

---

# Segurança e privacidade

O cache persistente sobrevive ao fechamento da página.

Como o EslavaHub contém informações privadas de projetos, a implementação deve considerar:

- uso em dispositivo confiável;
- comportamento no logout;
- possibilidade de limpar o cache local;
- não armazenar tokens ou credenciais manualmente;
- nunca usar `localStorage` para secrets.

---

# Plano de implementação recomendado

## OTIM-01 — Instrumentação

Medir:

- leituras por fluxo;
- tempo de carregamento;
- coleções mais repetidas.

Nenhuma mudança de arquitetura.

## OTIM-02 — Bootstrap metadata — CONCLUÍDO

Versão do workspace implementada em `users/{uid}/meta/workspace`.

## OTIM-03 — Cache em memória — PRIMEIRA VERSÃO CONCLUÍDA

Listagens completas são reutilizadas por até 5 minutos dentro da sessão.

Ainda poderá evoluir para um `WorkspaceStore` com snapshot explícito, caso a complexidade futura justifique.

## OTIM-04 — Invalidação após writes — CONCLUÍDO PARA O CACHE ATUAL

Create/update/delete invalidam a coleção correspondente. Operações batch de domínio também invalidam o cache.

## OTIM-05 — Persistent Firestore cache — CONCLUÍDO

`persistentLocalCache` com `persistentMultipleTabManager` está ativo.

## OTIM-06 — Cache-first — CONCLUÍDO

Implementados:

- TTL por coleção;
- validação de completude do cache;
- fallback offline;
- refresh manual;
- timestamps de sincronização sem duplicar dados no localStorage.

## OTIM-07 — Estado offline — PARCIALMENTE CONCLUÍDO

O header indica quando o navegador está offline.

Ainda pode evoluir para mostrar writes pendentes/sincronizando.

## OTIM-08 — Medir novamente — PENDENTE

Comparar consumo real antes/depois usando as métricas do Firebase.

---

# Meta inicial de redução

Com a base atual, uma sessão login → Dashboard → Projetos pode ficar na ordem de **~300 leituras** devido às releituras.

Com bootstrap versionado, cache em memória e IndexedDB cache-first, a expectativa é:

- **primeiro acesso sem cache:** uma leitura inicial de cada coleção necessária;
- **navegação adicional dentro do TTL:** zero novas leituras de servidor para as coleções já sincronizadas;
- **reabertura do app dentro do TTL:** reutilização do IndexedDB sem nova leitura de servidor para as coleções elegíveis;
- **bootstrap após cache aquecido:** pode ser atendido pelo metadata persistente sem nova leitura do servidor.

A meta continua sendo **menos de 100 leituras de servidor na primeira sessão fria**, seguida de forte redução nas navegações e reaberturas subsequentes.

Essa é uma estimativa de engenharia e deverá ser validada com métricas reais.

---

# Ordem recomendada

```text
1. metadata do bootstrap
        ↓
2. cache em memória por sessão
        ↓
3. invalidação correta após writes
        ↓
4. persistentLocalCache
        ↓
5. cache-first + TTL
        ↓
6. offline UX
        ↓
7. medir consumo
```

---

# Decisão sobre localStorage

## Usar

Pode ser adequado para:

- preferência de ordenação;
- filtros preferidos;
- timestamps de sync;
- configurações puramente locais.

## Não usar

Não usar como cópia principal de:

- projetos;
- clientes;
- pendências;
- domínios;
- categorias;
- tecnologias.

Para dados Firestore, preferir o cache persistente mantido pelo próprio SDK.
