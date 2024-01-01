export const IS_DB_OPENED = '__IS_DB_OPENED__'

export const isServer = typeof window === 'undefined'

export const isProd = process.env.NODE_ENV === 'production'

export const PENX_SESSION_USER = 'PENX_SESSION_USER'

export const PENX_101 = 'penx-101'

export const PENX_101_CLOUD_NAME = 'penx-101-cloud'

export const PLATFORM =
  process.env.NEXT_PUBLIC_PLATFORM || process.env.PLASMO_PUBLIC_PLATFORM

export const BASE_URL =
  process.env.NEXT_PUBLIC_NEXTAUTH_URL || process.env.PLASMO_PUBLIC_BASE_URL

export const isExtension = PLATFORM === 'EXTENSION'

export enum SyncScope {
  CURRENT_DOC,
  ALL_CHANGES,
}

export enum SyncStrategy {
  MERGE,
  PR,
}

export enum WorkerEvents {
  START_POLLING,

  UPDATE_SESSION,

  START_PUSH,
  PUSH_SUCCEEDED,
  PUSH_FAILED,

  START_PULL,
  PULL_SUCCEEDED,
  PULL_FAILED,

  SYNC_101_SUCCEEDED,
}

export enum SyncStatus {
  NORMAL,

  PUSHING,
  PUSH_SUCCEEDED,
  PUSH_FAILED,

  PULLING,
  PULL_SUCCEEDED,
  PULL_FAILED,
}

export enum SettingsType {
  APPEARANCE = 'appearance',
  PREFERENCES = 'preferences',
  HOTKEYS = 'hotkeys',
  ABOUT = 'about',
  EXTENSIONS = 'extensions',
}

export const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN as string

export enum ModalNames {
  DELETE_NODE,
  DELETE_COLUMN,
  CREATE_SPACE,
  RESTORE_FROM_GITHUB,
  IMPORT_SPACE,
  DELETE_SPACE,
  LOGIN_SUCCESS,
  SYNC_DETECTOR,
}
