import { defaults } from './stateReducer';

export interface ScriptData {
  editor_type: 'gutenberg' | 'elementor'
}
export type UrlStatus = 'active' | 'pending' | 'error'

export type AppState = typeof defaults;
export type ReducerAction = {
  type : keyof typeof defaults,
  payload: string | number | GeneratedResult | Omit<UrlsListItem, 'id'> | string[] | SelectionData
}

export interface UrlsListItem {
  id: string
  url: string
  status: UrlStatus
}

export interface PromptTemplateListItem {
  id: number
  name: string
  promptTemplate: string
}

export type GeneratorAction = {
  type: 'fix_grammar' | 'make_longer' | 'make_shorter'
  text: string,
}

type GeneratedResult = {
  text: string
  loading: boolean,
  opened: boolean
}

export interface SelectionData {
  text: string
  selectionObject?: Selection | null,
  offset?: {
    start: number
    end: number
  }
}
