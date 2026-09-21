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
      clauses: [
        { title: 'Penalidade por Atraso', level: 'MÉDIO', simple: 'Se a empresa atrasar a entrega, paga multa de 0,5% por dia sobre o valor total do contrato. O máximo da multa é 10% do total.', original: 'A CONTRATADA estará sujeita à multa moratória de 0,5% (meio por cento) ao dia sobre o valor total do contrato, limitada a 10% (dez por cento), em caso de atraso na entrega dos serviços ou produtos previstos no Anexo I deste instrumento.' },
        { title: 'Exclusividade', level: 'ALTO', simple: 'Durante a vigência do contrato, a empresa não pode prestar os mesmos serviços para concorrentes diretos.', original: 'A CONTRATADA obriga-se a manter exclusividade na prestação dos serviços objeto deste contrato, abstendo-se de atender empresas concorrentes da CONTRATANTE durante sua vigência.' },
        { title: 'Sigilo e Confidencialidade', level: 'BAIXO', simple: 'Todas as informações compartilhadas entre as empresas devem permanecer confidenciais, mesmo depois do fim do contrato.', original: 'As partes obrigam-se a manter o mais absoluto sigilo sobre quaisquer dados, informações e documentos a que tenham acesso em razão deste instrumento.' },
        { title: 'Tratamento de Dados Pessoais', level: 'ALTO', lgpd: true, simple: 'Os dados pessoais só podem ser usados para executar este contrato e devem ser protegidos contra acessos indevidos.', original: 'O tratamento de dados pessoais deverá observar a Lei Geral de Proteção de Dados e limitar-se às finalidades necessárias à execução dos serviços contratados.' },
        { title: 'Rescisão Antecipada', level: 'ALTO', simple: 'Qualquer empresa pode encerrar o contrato se a outra descumprir uma obrigação importante e não corrigir o problema.', original: 'O presente contrato poderá ser rescindido de pleno direito em caso de inadimplemento de qualquer obrigação contratual, observado o prazo para saneamento da irregularidade.' },
      ],
    },
    { title: 'Contrato de Locação Comercial', company: 'Imobiliária Pinheiro & Associados', state: 'A VENCER', date: '28 de fev. de 2026', value: 'R$ 96.000', start: '28 de fevereiro de 2025', end: '28 de fevereiro de 2026', remainingDays: 45, summary: 'Locação comercial de espaço para operações administrativas.', alerts: [], clauses: [] },
    { title: 'Acordo de Nível de Serviço – Cloud', company: 'Amazon Web Services Brasil', state: 'ATIVO', date: '30 de jun. de 2027', value: 'R$ 210.000', start: '30 de junho de 2025', end: '30 de junho de 2027', remainingDays: 280, summary: 'Acordo de disponibilidade e suporte para serviços em nuvem.', alerts: [], clauses: [] },
    { title: 'Contrato de Distribuição Exclusiva', company: 'Distribuidora Nacional Ltda.', state: 'ATIVO', date: '31 de dez. de 2026', value: 'R$ 750.000', start: '31 de dezembro de 2024', end: '31 de dezembro de 2026', remainingDays: 160, summary: 'Distribuição exclusiva de produtos para o território nacional.', alerts: [], clauses: [] },
    { title: 'Proposta de Parceria – Software ERP', company: 'TOTVS S.A.', state: 'RASCUNHO', date: '—', value: '—', start: '—', end: '—', remainingDays: null, summary: 'Proposta em análise pela equipe responsável.', alerts: [], clauses: [] },
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
    this.expandedClause = 0;
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
