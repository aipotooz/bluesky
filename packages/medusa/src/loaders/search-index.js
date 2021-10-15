import ProductService from "../services/product"
import { indexTypes } from "medusa-core-utils"

async function loadProductsIntoSearchEngine(container) {
  const searchService = container.resolve("searchService")
  const productService = container.resolve("productService")

  const TAKE = 20
  const totalCount = await productService.count()
  let iterCount = 0
  let lastSeenId = ""

  while (iterCount < totalCount) {
    const products = await productService.list(
      { id: { gt: lastSeenId } },
      {
        select: [
          "id",
          "title",
          "subtitle",
          "description",
          "handle",
          "is_giftcard",
          "discountable",
          "thumbnail",
          "profile_id",
          "collection_id",
          "type_id",
          "origin_country",
          "created_at",
          "updated_at",
        ],
        relations: [
          "variants",
          "tags",
          "type",
          "collection",
          "variants.prices",
          "variants.options",
          "options",
        ],
        take: TAKE,
        order: { id: "ASC" },
      }
    )

    await searchService.addDocuments(
      ProductService.IndexName,
      products,
      indexTypes.products
    )

    iterCount += products.length
    lastSeenId = products[products.length - 1].id
  }
}

export default async ({ container }) => {
  const searchService = container.resolve("searchService")
  const logger = container.resolve("logger")
  if (searchService.isDefault) {
    logger.warn(
      "No search engine provider was found: make sure to include a search plugin to enable searching"
    )
    return
  }

  await loadProductsIntoSearchEngine(container)
}
