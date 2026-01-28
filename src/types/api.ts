export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  sizePage: number;
}

export interface PoliticianDto {
  id: number;
  name: string;
  party: string;
  partyUri: string;
  state: string;
  legislatureId: number;
  email: string;
  uri: string;
  photoUrl: string;
  expenseTotal: number;
  propositionsTotal: number;
  isFollowed: boolean;
}

export interface ExpenseDto {
  id: number;
  politicianId: number;
  year: number;
  month: number;
  expenseType: string;
  supplier: string;
  documentValue: string;
  netValue: string;
  glosaValue: string;
  documentDate: string;
  documentUrl: string;
}

export interface ExpenseResponseDTO extends PaginationResponse<ExpenseDto> {
  detail: {
    year: number;
    month: number;
    totalExpenses: string;
  };
}

export interface VoteDto {
  id: string;
  date: string;
  description: string;
  summary: string;
}

export interface PoliticianVoteDto {
  id: number;
  voteId: string;
  politicianId: number;
  voteOption: string;
  vote: VoteDto;
}

export interface SpeechDto {
  startDateTime: string;
  endDateTime: string;
  titleEvent: string;
  endDateTimeEvent: string;
  startDateTimeEvent: string;
  summary: string;
  speechType: string;
  transcription: string;
  eventUri: string;
  audioUrl: string;
  textUrl: string;
  videoUrl: string;
}

export interface PropositionDto {
  id: number;
  uri: string;
  type: string;
  codeType: string;
  number: number;
  year: number;
  summary: string;
  detailedSummary: string;
  presentationDate: string;
  statusDateTime: string;
  statusLastReporterUri: string;
  statusTramitationDescription: string;
  statusTramitationTypeCode: string;
  statusSituationDescription: string;
  statusSituationCode: string;
  statusDispatch: string;
  statusUrl: string;
  statusScope: string;
  statusAppreciation: string;
  uriOrgaoNumerador: string;
  uriAutores: string;
  typeDescription: string;
  keywords: string;
  uriPropPrincipal: string;
  uriPropAnterior: string;
  uriPropPosterior: string;
  urlInteiroTeor: string;
  urnFinal: string;
  text: string;
  justification: string;
  createdAt: string;
  updatedAt: string;
  status: Record<string, unknown>;
  politicians: PoliticianDto[];
}

export interface PresenceDto {
  id: number;
  politicianId: number;
  date: string;
  description: string;
  status: string;
}

export interface PoliticianVoteWithPropositionDTO {
  id: number;
  politicianId: number;
  vote: string;
  voteId: string;
  voteDate: string;
  votingDescription: string;
  propositionSummary: string;
  propositionYear: number;
  propositionDetailedSummary: string;
}

export interface PoliticianVoteSummaryDTO {
  politicianId: number;
  politicianName: string;
  voteType: string;
}

export interface VotingWithVotesDTO {
  id: string;
  date: string;
  description: string;
  organAcronym: string;
  votes: PoliticianVoteSummaryDTO[];
}

export interface DeviceRequest {
  fcmToken: string;
}

export interface SyncResponse {
  message: string;
  status: string;
}

export interface PartyDto {
  id: number;
  acronym: string;
  name: string;
  electoralNumber: number;
}

export interface DashboardStatsDto {
  totalPropositions: number;
  totalExpenses: number;
  totalVotes: number;
  totalPoliticians: number;
  totalFollowing: number;
}

export interface MetricData {
  key: string;
  value: string | number;
}
