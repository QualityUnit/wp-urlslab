export interface ScriptData {
  editor_type: 'gutenberg' | 'elementor'
}

export interface UrlsListItem {
  id: string
  url: string
  status: 'active' | 'pending'
}

export type UrlsList = UrlsListItem[]

export type GeneratorAction = {
  type: 'fix_grammar' | 'make_longer' | 'make_shorter'
  text: string,
}
