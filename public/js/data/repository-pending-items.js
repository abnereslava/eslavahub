const REPOSITORY_PENDING_IMPORT_TARGET_UID = "056LHaaeFKYeqYCvNRUwbmww8AH3";

const REPOSITORY_PENDING_PROJECTS = Object.freeze([
  {
    legacy_key: "0015-dostais",
    project_name: "Dostais",
    repository: "abnereslava/appdobb",
    default_source_path: "dev/diario.md",
    items: [
      {
        key: "google-calendar",
        description: "Vincular a agenda ao Google Calendar em vez de usar exportação manual",
        status: "PENDING",
        area: "Calendário",
        notes: "O diário informa que já existe uma spec para essa integração."
      },
      {
        key: "lembrete-consulta-email",
        description: "Enviar por e-mail um lembrete de consulta ou exame um dia antes",
        status: "PENDING",
        area: "Lembretes"
      },
      {
        key: "validar-pdf-dispositivo",
        description: "Validar manualmente a exportação em PDF no dispositivo",
        status: "PENDING",
        area: "PDF",
        notes: "Validar especialmente foto no cabeçalho e funcionamento offline."
      },
      {
        key: "pdf-medicamentos",
        description: "Adicionar exportação em PDF à tela de Medicamentos",
        status: "PENDING",
        area: "PDF"
      },
      {
        key: "validar-medicamentos-dispositivo",
        description: "Validar manualmente a tela de Medicamentos no dispositivo",
        status: "PENDING",
        area: "Medicamentos"
      },
      {
        key: "eventos-revelacao-progressiva",
        description: "Retrabalhar a inserção de eventos com revelação progressiva de campos",
        status: "PENDING",
        area: "UX"
      },
      {
        key: "capacitor-play-store",
        description: "Empacotar o app com Capacitor e publicar na Play Store",
        status: "PENDING",
        area: "Distribuição",
        notes: "Manter a mesma base web para Android e eventual iOS. O diário recomenda concluir as pendências anteriores antes de avançar."
      },
      {
        key: "modelo-monetizacao",
        description: "Definir o modelo de monetização da versão Android",
        status: "PENDING",
        area: "Negócio",
        notes: "Avaliar Google Play Billing versus versão gratuita/básica na loja com upgrade vendido pela versão web."
      },
      {
        key: "imagens-eventos",
        description: "Suportar upload ou anexo real de imagens nos eventos de saúde",
        status: "PENDING",
        area: "Imagens",
        notes: "Avaliar IndexedDB local ou serviço externo e depois decidir se as imagens entram na exportação em PDF."
      },
      {
        key: "notificacoes-dose",
        description: "Implementar notificações de horário de dose",
        status: "PENDING",
        area: "Notificações",
        notes: "Avaliar junto com lembretes de consulta. Em PWA há limitações; com Capacitor, notificações locais seriam mais confiáveis."
      },
      {
        key: "refinar-insercao-remedios",
        description: "Refinar o fluxo de inserção de remédios",
        status: "IN_PROGRESS",
        area: "Medicamentos",
        priority: "HIGH",
        notes: "Prioridade atual do diário. Rever unidade/dose, reduzir o formulário longo, tornar o campo Fim explícito e alinhar o padrão de revelação progressiva com a inserção de eventos."
      }
    ]
  },
  {
    legacy_key: "0016-selah",
    project_name: "Selah",
    repository: "abnereslava/SelahApp",
    default_source_path: "dev/diario.md",
    items: [
      {
        key: "expandir-areas-vida-crista",
        description: "Expandir o Selah para gerenciar outras áreas da vida cristã",
        status: "PENDING",
        area: "Roadmap",
        priority: "LOW",
        notes: "O diário cita oração, dízimos, ofertas, pregação, escala da igreja e outras áreas além de devocionais."
      },
      {
        key: "graficos-estatisticas",
        description: "Criar gráficos e estatísticas dos registros",
        status: "PENDING",
        area: "Gráficos",
        notes: "Prever filtros por palavras-chave, data, livro bíblico, autor e tipo de registro."
      },
      {
        key: "migrar-vercel",
        description: "Migrar o deploy do Selah para Vercel",
        status: "PENDING",
        area: "Deploy"
      },
      {
        key: "novo-registro-colapsado",
        description: "Rever qual painel deve abrir expandido após o login",
        status: "PENDING",
        area: "UX",
        notes: "Sugestão do diário: deixar Novo Registro colapsado ou abrir Meus Registros por padrão."
      },
      {
        key: "menu-perfil",
        description: "Substituir o botão Sair fixo por um menu de perfil/configurações",
        status: "PENDING",
        area: "UX"
      },
      {
        key: "passagem-combobox",
        description: "Trocar a digitação livre da passagem bíblica por seletores estruturados",
        status: "PENDING",
        area: "Registros",
        notes: "Usar livro, capítulo, versículo inicial e versículo final opcional para padronizar os dados."
      },
      {
        key: "integrar-biblia",
        description: "Integrar uma Bíblia ao seletor de passagem",
        status: "PENDING",
        area: "Registros",
        notes: "Ao selecionar a passagem, exibir o texto bíblico; considerar diferenças de versão."
      },
      {
        key: "validar-registro-vazio",
        description: "Impedir o salvamento de registro sem texto",
        status: "PENDING",
        area: "Validação"
      },
      {
        key: "quebra-perguntas-orientadoras",
        description: "Evitar corte das perguntas orientadoras e forçar quebra de linha",
        status: "PENDING",
        area: "UX"
      },
      {
        key: "icone-confirmacao-acoes",
        description: "Trocar o ícone de adicionar por confirmação nas ações e links",
        status: "PENDING",
        area: "UX"
      },
      {
        key: "titulo-unico",
        description: "Avaliar título de registro único com validação case-insensitive",
        status: "PENDING",
        area: "Dados"
      }
    ]
  },
  {
    legacy_key: "0022-teacher-invest",
    project_name: "Teacher Invest",
    repository: "abnereslava/landingpage_teacherinvest",
    default_source_path: "dev/diario.md",
    items: [
      {
        key: "inserir-testemunhos",
        description: "Inserir testemunhos/prova",
        status: "WAITING",
        area: "Cliente"
      },
      {
        key: "licenca-angelina",
        description: "Verificar licença da fonte Angelina",
        status: "WAITING",
        area: "Cliente"
      },
      {
        key: "video-youtube",
        description: "Subir vídeo no YouTube",
        status: "WAITING",
        area: "Cliente"
      },
      {
        key: "validar-whatsapp",
        description: "Validar formulário do WhatsApp",
        status: "WAITING",
        area: "Cliente"
      },
      {
        key: "adicionar-dominio",
        description: "Adicionar domínio",
        status: "WAITING",
        area: "Cliente"
      }
    ]
  },
  {
    legacy_key: "0023-rpg-educacional-2",
    project_name: "RPG Educacional 2.0",
    repository: "abnereslava/rpg_animais",
    default_source_path: "dev/diario.md",
    items: [
      {
        key: "poses-por-fala",
        description: "Rever as poses dos personagens por fala",
        status: "PENDING",
        area: "Personagens"
      },
      {
        key: "cutscenes-capitulos-final",
        description: "Criar cutscenes dos capítulos e do final",
        status: "PENDING",
        area: "Cutscenes"
      },
      {
        key: "enquadramento-cutscenes",
        description: "Ajustar enquadramento das cutscenes transitórias de capítulo",
        status: "PENDING",
        area: "Cutscenes"
      },
      {
        key: "obfuscar-cloudflare",
        description: "Obfuscar o projeto e subir no Cloudflare",
        status: "PENDING",
        area: "Deploy"
      },
      {
        key: "menu-modo-oral",
        description: "Ajustar abertura do menu de opções no modo oral",
        status: "PENDING",
        area: "UX",
        notes: "Deixar o menu acima por padrão e inverter a direção de abertura conforme a posição para evitar que as opções saiam da tela."
      }
    ]
  },
  {
    legacy_key: "0024-recreaeduca",
    project_name: "Recreaeduca",
    repository: "abnereslava/recreaeduca",
    default_source_path: "docs/tasks.md",
    items: [
      {
        key: "ordenacao-referencia",
        description: "Criar jogo de referência de Ordenação e validar antes de reativar no catálogo",
        status: "PENDING",
        area: "Jogos"
      },
      {
        key: "lacunas-recursos",
        description: "Definir recursos de Lacunas durante sua reformulação",
        status: "PENDING",
        area: "Jogos"
      },
      {
        key: "classificacao-referencia",
        description: "Criar jogo de referência de Classificação em grupos e validar antes de reativar",
        status: "PENDING",
        area: "Jogos"
      },
      {
        key: "cloudflare-segredos-dominio",
        description: "Configurar variáveis, segredos e domínio no painel da Cloudflare",
        status: "PENDING",
        area: "Produção"
      },
      {
        key: "cron-retencao",
        description: "Configurar a rotina de retenção como Cron Trigger da Cloudflare",
        status: "PENDING",
        area: "Produção"
      },
      {
        key: "firebase-dominio",
        description: "Autorizar o domínio final no Firebase Authentication",
        status: "PENDING",
        area: "Produção"
      },
      {
        key: "firestore-rules",
        description: "Publicar as regras atualizadas do Firestore",
        status: "PENDING",
        area: "Produção"
      },
      {
        key: "backup-cloud",
        description: "Criar o agendamento de backup no Google Cloud",
        status: "PENDING",
        area: "Produção"
      },
      {
        key: "nova-chave-admin",
        description: "Criar nova chave administrativa e revogar a chave de desenvolvimento",
        status: "PENDING",
        area: "Segurança"
      },
      {
        key: "health-alerta",
        description: "Conectar /api/health a um serviço de alerta",
        status: "PENDING",
        area: "Produção"
      },
      {
        key: "validacao-final",
        description: "Executar a validação final planejada pelo responsável do produto",
        status: "PENDING",
        area: "QA"
      }
    ]
  },
  {
    legacy_key: "0020-gerenciador-manutencoes-carro",
    project_name: "Carango Véio",
    repository: "abnereslava/manutencao_carro",
    default_source_path: "tasks/README.md",
    items: [
      {
        key: "criar-firebase",
        description: "criar firebase para o projeto",
        status: "PENDING"
      },
      {
        key: "executar-tasks",
        description: "executar tasks (toda a documentação já está pronta)",
        status: "PENDING"
      }
    ]
  },
  {
    legacy_key: "0014-blizpay",
    project_name: "Blizpay",
    repository: "abnereslava/Blizpay",
    default_source_path: "docs/proximas-atualizacoes.md",
    items: [
      {
        key: "atualizar-admin-hub",
        description: "Atualizar o hub do administrador",
        status: "PENDING",
        area: "Admin"
      },
      {
        key: "revisar-bugs",
        description: "Procurar e revisar erros e bugs",
        status: "PENDING",
        area: "QA"
      },
      {
        key: "revisar-acentos",
        description: "Procurar e revisar textos sem acento",
        status: "PENDING",
        area: "Conteúdo"
      },
      {
        key: "publicacao-pendencias",
        description: "Verificar pendências para tornar o app público",
        status: "PENDING",
        area: "Publicação"
      },
      {
        key: "proximas-features",
        description: "Revisar e definir as próximas features",
        status: "PENDING",
        area: "Roadmap"
      },
      {
        key: "checklist-prepublicacao",
        description: "Revisar infraestrutura e experiência antes da publicação",
        status: "PENDING",
        area: "Publicação",
        notes: "Revisar Firebase Rules, índices, manifest, service worker e experiência mobile."
      },
      {
        key: "qa-fluxos-principais",
        description: "Executar QA dos fluxos principais antes de novas features",
        status: "PENDING",
        area: "QA",
        notes: "Cobrir login, cadastro de aluno, pagamento, dashboards, templates, Admin Hub e temas."
      }
    ]
  }
]);

export {
  REPOSITORY_PENDING_IMPORT_TARGET_UID,
  REPOSITORY_PENDING_PROJECTS
};
