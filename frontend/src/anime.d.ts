declare module 'animejs' {
  interface AnimeInstance {
    pause: () => void
    play: () => void
    restart: () => void
    finished: Promise<void>
  }

  interface AnimeParams {
    targets: unknown
    duration?: number
    easing?: string
    update?: () => void
    complete?: () => void
    [key: string]: unknown
  }

  function anime(params: AnimeParams): AnimeInstance
  export = anime
}
