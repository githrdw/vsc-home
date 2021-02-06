declare module "*.html"

interface AssetBuffer extends Array<Promise<AssetContainer>> { }

interface AssetMeta {
  length: number,
  index: number | undefined
}

interface AssetContainer extends AssetMeta {
  url: string
}