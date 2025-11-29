// Type definitions for Car Check components

export type OwnershipRecord = {
  _id: number;
  mispar_rechev: number;
  baalut_dt: number;
  baalut: string;
  rank_mispar_rechev: number;
};

export type Recall = {
  _id: number;
  RECALL_ID: number;
  SHNAT_RECALL: number;
  SUG_RECALL: string;
  SUG_TAKALA: string;
  TEUR_TAKALA: string;
  OFEN_TIKUN: string;
};

export type CarData = {
  _id: number;
  mispar_rechev: number;
  tozeret_cd?: number;
  sug_degem?: string;
  tozeret_nm?: string;
  degem_cd?: number;
  degem_nm?: string;
  ramat_gimur?: string;
  ramat_eivzur_betihuty?: number | null;
  kvutzat_zihum?: number;
  shnat_yitzur?: number;
  degem_manoa?: string;
  mivchan_acharon_dt?: string;
  tokef_dt?: string;
  baalut?: string;
  misgeret?: string;
  tzeva_cd?: number;
  tzeva_rechev?: string;
  zmig_kidmi?: string;
  zmig_ahori?: string;
  sug_delek_nm?: string;
  horaat_rishum?: number | null;
  moed_aliya_lakvish?: string;
  kinuy_mishari?: string;
  nefah_manoa?: number;
  koah_sus?: number;
  mispar_dlatot?: number;
  ownershipHistory?: OwnershipRecord[];
  history1?: unknown;
  gapam_ind?: number;
  kilometer_test_aharon?: number;
  mispar_manoa?: string;
  mkoriut_nm?: string;
  rank_mispar_rechev?: number;
  rishum_rishon_dt?: string;
  shinui_mivne_ind?: number;
  shinui_zmig_ind?: number;
  shnui_zeva_ind?: number;
  disabledPermit?: boolean | object;
  safetyRecalls?: Recall[];
  isImported?: boolean;
  isActive?: boolean;
  bitul_dt?: string | null | Date;
};

export type InfoItemProps = {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  priority?: boolean;
};
