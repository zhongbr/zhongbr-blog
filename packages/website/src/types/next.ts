export type AppConfig = {
    revalidate?: number | false
    dynamicParams?: true | false
    dynamic?: 'auto' | 'error' | 'force-static' | 'force-dynamic'
    fetchCache?: 'force-cache' | 'only-cache'
    preferredRegion?: string
}
