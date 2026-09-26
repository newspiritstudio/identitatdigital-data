/** Estat d'una afirmació: sí, parcialment, no, desconegut, no aplica. */
export type EvidenceStatus = 'yes' | 'partial' | 'no' | 'unknown' | 'na'
/** Nivell d'evidència de la font que la sosté. */
export type EvidenceLevel = 'official' | 'regulator' | 'independent' | 'press' | 'editorial' | 'unknown'

/**
 * Tipus del dataset editorial.
 *
 * Les relacions s'escriuen per identificador llegible (`slug`) i el script de
 * càrrega les resol a identificadors de base de dades. Així el dataset es pot
 * llegir i revisar com un text, i discutir-lo en una petició de canvis com
 * qualsevol altre fitxer del repositori.
 */

export type FactSeed = {
  status: EvidenceStatus
  level: EvidenceLevel
  sources?: string[]
  detail?: string
  verifiedAt?: string
  [extra: string]: unknown
}

export type DataRowSeed = {
  type: string
  status: 'yes' | 'optional' | 'no' | 'unknown'
  linked?: 'yes' | 'no' | 'unknown'
  tracking?: 'yes' | 'no' | 'unknown'
  purposes?: string[]
  shared?: 'none' | 'group' | 'third-parties' | 'brokers' | 'unknown'
  level?: EvidenceLevel
  sources?: string[]
  note?: string
}

export type SourceSeed = {
  slug: string
  title: string
  url: string
  publisher: string
  type: string
  reliability: 'primary' | 'authority' | 'independent' | 'secondary'
  language?: string
  publishedAt?: string
  consultedAt?: string
  archiveUrl?: string
  excerpt?: string
  summary?: string
}

export type CompanySeed = {
  slug: string
  name: string
  legalName?: string
  parent?: string
  /** Nom del grup quan és filial d'un grup que encara no és al directori. */
  parentGroup?: string
  description?: string
  /** Codi ISO 3166-1 alfa-2. */
  headquartersCountry?: string
  euEstablishment?: string
  /** Codi de `src/lib/supervisory-authorities.ts` del projecte identitatdigital. */
  leadSupervisoryAuthority?: string
  supervisoryNote?: string
  ownership?: string
  foundedYear?: number
  primaryRevenueModel?: string
  website?: string
  /** Dominis de producte, sense protocol ni «www.». Lliguen les filtracions de HIBP amb el grup. */
  productDomains?: string[]
  privacyContact?: string
}

export type CategorySeed = {
  slug: string
  name: string
  functionalNeed: string
  description?: string
  privacyContext?: string
  parent?: string
}

export type DataTypeSeed = {
  slug: string
  name: string
  family: string
  sensitivity: number
  specialCategory?: boolean
  description: string
  whyItMatters?: string
  appleLabel?: string
}

export type PurposeSeed = {
  slug: string
  name: string
  privacyImpact: 'necessary' | 'neutral' | 'intrusive' | 'highly-intrusive'
  necessaryForService?: boolean
  description: string
  typicalLegalBasis?: string
}

export type IncidentSeed = {
  slug: string
  title: string
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  apps?: string[]
  company?: string
  occurredAt: string
  disclosedAt?: string
  description: string
  affectedPeople?: string
  regulatory?: {
    authority?: string
    fineAmountEur?: number
    legalBasis?: string
    status?: 'final' | 'appealed' | 'overturned' | 'ongoing'
  }
  sources: string[]
}

export type AlternativeSeed = {
  app: string
  comparability: 'equivalent' | 'partial' | 'complementary'
  rationale: string
  tradeOffs?: string
}

/**
 * Bloc de servei públic. Activa els indicadors que només s'apliquen a una
 * administració i desactiva els que el sector privat compleix d'una altra
 * manera. Vegeu `src/lib/scoring/methodology.ts` del projecte identitatdigital.
 */
export type PublicServiceSeed = {
  isPublicService: true
  administrationLevel?: 'european' | 'state' | 'regional' | 'local' | 'other'
  legalBasis: FactSeed
  processingRegistry: FactSeed
  dpia: FactSeed
  ensConformity: FactSeed
  dpo: FactSeed
  offlineAlternative: FactSeed
  accessibilityStatement: FactSeed
  mandatoryRetention: FactSeed
}

/**
 * Enllaços oficials que pot mostrar una fitxa. Es dibuixen només si hi són, i
 * els dos que hauria de tenir tothom són la política de privadesa i la via per
 * esborrar el compte.
 */
export type AppLinkKey =
  | 'website'
  | 'privacyPolicy'
  | 'terms'
  | 'privacyCenter'
  | 'appStore'
  | 'playStore'
  | 'deleteAccount'
  | 'dataExport'
  | 'rightsRequest'
  | 'adSettings'
  | 'subprocessors'
  | 'security'
  | 'transparencyReport'
  | 'statusOrChangelog'

export type AppSeed = {
  slug: string
  name: string
  company: string
  categories: string[]
  tagline: string
  summary: string
  platforms?: string[]
  businessModel?: string
  jurisdiction?: string
  userBase?: string
  serviceStatus?: 'active' | 'discontinued' | 'merged'
  /** Color identificatiu del servei, en hexadecimal de sis dígits. */
  brandColor?: string
  links?: Partial<Record<AppLinkKey, string>>
  accountRequired: FactSeed
  openSource: FactSeed
  publicService?: PublicServiceSeed
  dataSummary?: string
  dataCollection: DataRowSeed[]
  tracking: Record<string, FactSeed | unknown>
  dataUses: Record<string, FactSeed>
  sharing: Record<string, FactSeed>
  transparency: { policyClarity: string; transparencyReport: FactSeed }
  retention: {
    definedPeriods: FactSeed
    dataAfterDeletion: FactSeed
    periods?: { dataType?: string; period: string; sources?: string[] }[]
  }
  accountDeletion: {
    possible: FactSeed
    selfService: FactSeed
    directUrl?: string
    difficulty: 'easy' | 'medium' | 'hard' | 'impossible' | 'unknown'
    waitingPeriodDays?: number
    requiresSupportContact?: boolean
    steps?: string[]
    obstacles?: string
    dataRetained?: string
    sources?: string[]
  }
  userRights: {
    dataExport: FactSeed
    exportFormatQuality?: 'open' | 'mixed' | 'proprietary' | 'unknown'
    rightsExercise: FactSeed
  }
  controls: {
    adPersonalizationOptOut: FactSeed
    telemetryOptOut: FactSeed
    granularControls: FactSeed
    defaultPosture?: 'protective' | 'mixed' | 'permissive' | 'unknown'
    darkPatterns: FactSeed
    darkPatternList?: { type: string; severity: string; description: string; sources?: string[] }[]
  }
  security: {
    e2ee: FactSeed
    transportEncryption: FactSeed
    atRestEncryption: FactSeed
    mfa: FactSeed
    independentAudits: FactSeed
    bugBounty: FactSeed
    vulnerabilityDisclosure: FactSeed
  }
  alternatives?: AlternativeSeed[]
  /** Identificador de paquet a l'App Store, per obtenir-ne la icona vigent. */
  appStoreBundleId?: string
  review: {
    researchStatus: 'initial' | 'documented' | 'in-depth'
    lastReviewedAt: string
    incidentsReviewed: boolean
    editorialNotes?: string
    openQuestions?: string[]
  }
}
