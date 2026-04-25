declare module 'pagedjs' {
  export interface PreviewFlow {
    total?: number
    performance?: number
  }

  export class Previewer {
    chunker?: {
      destroy?: () => void
    }

    polisher?: {
      destroy?: () => void
    }

    preview(
      content: string | Node,
      stylesheets?: Array<string | Record<string, string>>,
      renderTo?: HTMLElement,
    ): Promise<PreviewFlow>
  }
}
