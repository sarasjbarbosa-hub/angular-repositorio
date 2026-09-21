import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

type Contract = {
  title: string;
  company: string;
  state: string;
  date: string;
  value: string;
  start: string;
  end: string;
  remainingDays: number | null;
  summary: string;
  alerts: { title: string; text: string }[];
  clauses: Clause[];
  risk: { high: number; medium: number; low: number };
};

type Clause = {
  title: string;
  level: 'ALTO' | 'MÉDIO' | 'BAIXO';
  lgpd?: boolean;
  simple: string;
  original: string;
};

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  search = '';
  selectedContract = 0;
  activeTab: 'overview' | 'clauses' = 'overview';
  activeSection: 'contracts' | 'privacy' = 'contracts';
  contractFilter: 'all' | 'due' | 'drafts' = 'all';
  privacyTab: 'rights' | 'map' | 'dpo' = 'rights';
  expandedClause = 0;
  showPrivacy = true;

  contracts: Contract[] = [
    {
      title: 'Contrato de Prestação de Serviços de TI',
      company: 'Accenture Brasil Ltda.',
      state: 'ATIVO',
      date: '14 de jan. de 2026',
      value: 'R$ 480.000',
      start: '15 de janeiro de 2025',
      end: '14 de janeiro de 2027',
      remainingDays: 120,
      summary: 'Contrato de serviços de desenvolvimento e manutenção de sistemas. Inclui SLAs rigorosos com penalidades por descumprimento e cláusula de exclusividade parcial. Envolve tratamento de dados pessoais de colaboradores, sujeito à LGPD.',
      alerts: [
        { title: 'Exclusividade', text: 'A empresa não pode prestar os mesmos serviços para concorrentes durante o contrato. Se descumprir, o contrato é rescindido e deve pagar 20% do valor total como indenização.' },
        { title: 'Tratamento de Dados Pessoais', text: 'A empresa contratada só pode usar os dados pessoais dos colaboradores para a execução dos serviços previstos neste contrato.' },
      ],
      risk: { high: 2, medium: 2, low: 1 },
      clauses: [
        { title: 'Penalidade por Atraso', level: 'MÉDIO', simple: 'Se a empresa atrasar a entrega, paga multa de 0,5% por dia sobre o valor total do contrato. O máximo da multa é 10% do total.', original: 'A CONTRATADA estará sujeita à multa moratória de 0,5% (meio por cento) ao dia sobre o valor total do contrato, limitada a 10% (dez por cento), em caso de atraso na entrega dos serviços ou produtos previstos no Anexo I deste instrumento.' },
        { title: 'Exclusividade', level: 'ALTO', simple: 'Durante a vigência do contrato, a empresa não pode prestar os mesmos serviços para concorrentes diretos.', original: 'A CONTRATADA obriga-se a manter exclusividade na prestação dos serviços objeto deste contrato, abstendo-se de atender empresas concorrentes da CONTRATANTE durante sua vigência.' },
        { title: 'Sigilo e Confidencialidade', level: 'BAIXO', simple: 'Todas as informações compartilhadas entre as empresas devem permanecer confidenciais, mesmo depois do fim do contrato.', original: 'As partes obrigam-se a manter o mais absoluto sigilo sobre quaisquer dados, informações e documentos a que tenham acesso em razão deste instrumento.' },
        { title: 'Tratamento de Dados Pessoais', level: 'ALTO', lgpd: true, simple: 'Os dados pessoais só podem ser usados para executar este contrato e devem ser protegidos contra acessos indevidos.', original: 'O tratamento de dados pessoais deverá observar a Lei Geral de Proteção de Dados e limitar-se às finalidades necessárias à execução dos serviços contratados.' },
        { title: 'Rescisão Antecipada', level: 'ALTO', simple: 'Qualquer empresa pode encerrar o contrato se a outra descumprir uma obrigação importante e não corrigir o problema.', original: 'O presente contrato poderá ser rescindido de pleno direito em caso de inadimplemento de qualquer obrigação contratual, observado o prazo para saneamento da irregularidade.' },
      ],
    },
    {
      title: 'Contrato de Locação Comercial',
      company: 'Imobiliária Pinheiro & Associados',
      state: 'A VENCER',
      date: '28 de fev. de 2026',
      value: 'R$ 96.000',
      start: '28 de fevereiro de 2025',
      end: '28 de fevereiro de 2026',
      remainingDays: 45,
      summary: 'Locação do espaço comercial na Av. Paulista. Contrato próximo do vencimento — renovação deve ser negociada até dezembro. Reajuste anual pelo IGP-M.',
      alerts: [
        { title: 'Benfeitorias', text: 'Qualquer reforma que você fizer no imóvel fica para o dono quando você sair, sem receber nada de volta, a menos que haja acordo escrito separado.' },
      ],
      risk: { high: 1, medium: 2, low: 0 },
      clauses: [
        { title: 'Reajuste Anual', level: 'MÉDIO', simple: 'O valor do aluguel é atualizado uma vez por ano de acordo com a variação do IGP-M.', original: 'O valor locatício será reajustado anualmente pela variação acumulada do Índice Geral de Preços do Mercado (IGP-M), ou por outro índice que venha a substituí-lo.' },
        { title: 'Multa por Saída Antecipada', level: 'MÉDIO', simple: 'Se o locatário sair antes do fim do contrato sem uma justificativa prevista em lei, deverá pagar multa proporcional ao tempo restante.', original: 'A rescisão antecipada pelo LOCATÁRIO sujeitará este ao pagamento de multa compensatória proporcional ao período de cumprimento restante do contrato.' },
        { title: 'Benfeitorias', level: 'ALTO', simple: 'Qualquer reforma feita no imóvel fica para o proprietário quando o contrato terminar, sem reembolso, salvo acordo escrito em contrário.', original: 'Todas as benfeitorias realizadas pelo locatário no imóvel, sejam necessárias, úteis ou voluntárias, incorporar-se-ão ao imóvel sem direito a indenização ou retenção, salvo autorização expressa e prévia do locador consignada em instrumento apartado.' },
      ],
    },
    {
      title: 'Acordo de Nível de Serviço – Cloud',
      company: 'Amazon Web Services Brasil',
      state: 'ATIVO',
      date: '30 de jun. de 2027',
      value: 'R$ 96.000',
      start: '01 de julho de 2024',
      end: '30 de junho de 2027',
      remainingDays: 282,
      summary: 'SLA para infraestrutura cloud. Garante 99,9% de uptime com créditos automáticos em caso de falha. Dados de usuários são armazenados em servidores da AWS — exige DPA (Data Processing Agreement) conforme LGPD.',
      alerts: [
        { title: 'Limitação de Responsabilidade', text: 'Se algo der muito errado, o máximo que você pode receber de indenização é o equivalente a 1 mês de pagamento. Perdas maiores não são cobertas.' },
        { title: 'Transferência Internacional de Dados', text: 'Seus dados podem ser armazenados em servidores nos EUA ou outros países. A AWS garante que essas transferências seguem as regras da LGPD e as normas da ANPD.' },
      ],
      clauses: [
        { title: 'Garantia de Disponibilidade', level: 'BAIXO', simple: 'A AWS garante que os serviços ficarão disponíveis em pelo menos 99,9% do tempo. Se houver falhas, você recebe créditos na fatura.', original: 'O prestador garantirá disponibilidade mensal mínima de 99,9% dos serviços contratados, aplicando créditos de serviço conforme os níveis de indisponibilidade apurados.' },
        { title: 'Limitação de Responsabilidade', level: 'ALTO', simple: 'A indenização máxima por problemas nos serviços equivale ao valor pago nos últimos 12 meses, sem cobrir perdas indiretas.', original: 'A responsabilidade total do prestador, por quaisquer danos decorrentes deste acordo, ficará limitada aos valores pagos pelo cliente nos doze meses anteriores ao evento.' },
        { title: 'Transferência Internacional de Dados', level: 'ALTO', lgpd: true, simple: 'Seus dados podem ser armazenados em servidores nos EUA ou outros países. A AWS garante que essas transferências seguem as regras da LGPD e as normas da ANPD.', original: 'O PRESTADOR poderá transferir dados pessoais para servidores localizados fora do território nacional, incluindo os Estados Unidos da América, garantindo que tais transferências observem os mecanismos de adequação previstos nos arts. 33 a 36 da Lei 13.709/2018 (LGPD) e nas regulamentações editadas pela Autoridade Nacional de Proteção de Dados (ANPD).' },
        { title: 'Créditos por Indisponibilidade', level: 'BAIXO', simple: 'Quando a disponibilidade ficar abaixo do combinado, o cliente pode receber créditos proporcionais na próxima fatura.', original: 'Em caso de indisponibilidade dos serviços acima dos limites contratados, o cliente fará jus a créditos de serviço, calculados conforme a tabela de compensações deste acordo.' },
      ],
      risk: { high: 2, medium: 0, low: 2 },
    },
    {
      title: 'Contrato de Distribuição Exclusiva',
      company: 'Distribuidora Nacional Ltda.',
      state: 'ATIVO',
      date: '31 de dez. de 2026',
      value: 'R$ 1.200.000',
      start: '01 de janeiro de 2024',
      end: '31 de dezembro de 2026',
      remainingDays: 101,
      summary: 'Acordo de distribuição exclusiva para a região Sul e Sudeste. Alto valor — requer atenção às metas mínimas de compra e cláusulas de exclusividade.',
      alerts: [
        { title: 'Território Exclusivo', text: 'Você não pode vender seus produtos na região Sul e Sudeste por conta própria ou por outras empresas. Toda venda nessa área precisa passar pela distribuidora.' },
      ],
      clauses: [
        { title: 'Meta Mínima de Compra', level: 'MÉDIO', simple: 'A empresa precisa comprar uma quantidade mínima de produtos por período para manter a exclusividade da distribuição.', original: 'A DISTRIBUIDORA compromete-se a adquirir os volumes mínimos de produtos estabelecidos no Anexo II, sob pena de revisão das condições de exclusividade.' },
        { title: 'Território Exclusivo', level: 'ALTO', simple: 'Você não pode vender seus produtos na região Sul e Sudeste por conta própria ou por outras empresas. Toda venda nessa área precisa passar pela distribuidora.', original: 'Durante a vigência deste contrato, a FORNECEDORA compromete-se a não comercializar, direta ou indiretamente, os produtos listados no Anexo A nos estados do Rio Grande do Sul, Santa Catarina, Paraná, São Paulo, Rio de Janeiro, Espírito Santo e Minas Gerais, salvo por meio da DISTRIBUIDORA.' },
      ],
      risk: { high: 1, medium: 1, low: 0 },
    },
    {
      title: 'Proposta de Parceria – Software ERP',
      company: 'TOTVS S.A.',
      state: 'RASCUNHO',
      date: '—',
      value: 'R$ 240.000',
      start: '—',
      end: '—',
      remainingDays: null,
      summary: 'Rascunho inicial de contrato de licenciamento ERP. Ainda em negociação — cláusulas de suporte, reajuste e proteção de dados pessoais precisam de revisão antes da assinatura.',
      alerts: [],
      clauses: [
        { title: 'Licença de Uso', level: 'BAIXO', simple: 'A empresa poderá usar o software durante a parceria, dentro dos limites e condições definidos no contrato.', original: 'A LICENCIANTE concede à PARCEIRA licença de uso não exclusiva e intransferível do software ERP, conforme os módulos e limites descritos no instrumento.' },
        { title: 'Suporte Técnico', level: 'MÉDIO', simple: 'A fornecedora deverá oferecer atendimento técnico para ajudar na implantação e resolver problemas do sistema.', original: 'A LICENCIANTE prestará serviços de suporte técnico, manutenção corretiva e orientação operacional durante a vigência da parceria, conforme níveis de atendimento a definir.' },
        { title: 'Compartilhamento de Dados com Terceiros', level: 'MÉDIO', lgpd: true, simple: 'Os dados pessoais só poderão ser compartilhados com outros fornecedores quando isso for necessário e estiver de acordo com a LGPD.', original: 'O compartilhamento de dados pessoais com terceiros dependerá de autorização prévia, finalidade específica e adoção das medidas de segurança exigidas pela Lei 13.709/2018 (LGPD).' },
      ],
      risk: { high: 0, medium: 2, low: 1 },
    },
  ];

  constructor(private auth: Auth, private router: Router) {}

  get filteredContracts(): Contract[] {
    const query = this.search.toLowerCase().trim();
    return this.contracts.filter((contract) =>
      (this.contractFilter === 'all' ||
        (this.contractFilter === 'due' && contract.state === 'A VENCER') ||
        (this.contractFilter === 'drafts' && contract.state === 'RASCUNHO')) &&
      (!query || `${contract.title} ${contract.company}`.toLowerCase().includes(query)),
    );
  }

  get currentContract(): Contract {
    return this.contracts[this.selectedContract];
  }

  selectContract(contract: Contract): void {
    this.selectedContract = this.contracts.indexOf(contract);
    this.activeTab = 'overview';
    this.expandedClause = contract.title.includes('Locação') ? 2 : contract.title.includes('Distribuição') ? 1 : contract.title.includes('Cloud') ? 2 : contract.title.includes('Proposta') ? -1 : 0;
  }

  setTab(tab: 'overview' | 'clauses'): void {
    this.activeTab = tab;
  }

  setSection(section: 'contracts' | 'privacy'): void {
    this.activeSection = section;
  }

  setContractFilter(filter: 'all' | 'due' | 'drafts'): void {
    this.activeSection = 'contracts';
    this.contractFilter = filter;
    const firstMatch = this.filteredContracts[0];
    if (firstMatch) {
      this.selectedContract = this.contracts.indexOf(firstMatch);
    }
  }

  setPrivacyTab(tab: 'rights' | 'map' | 'dpo'): void {
    this.privacyTab = tab;
  }

  toggleClause(index: number): void {
    this.expandedClause = this.expandedClause === index ? -1 : index;
  }

  logout(): void {
    this.auth.logout();
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
