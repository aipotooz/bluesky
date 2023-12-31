import {
  ProductVariantInventoryService,
  ProductVariantService,
} from "../../../../../services"

import { InventoryItemDTO } from "@medusajs/types"
import { ProductVariant } from "../../../../../models"

export type InventoryItemsWithVariants = Partial<InventoryItemDTO> & {
  variants?: ProductVariant[]
}

export const getVariantsByInventoryItemId = async (
  inventoryItems: InventoryItemDTO[],
  productVariantInventoryService: ProductVariantInventoryService,
  productVariantService: ProductVariantService
): Promise<Record<string, ProductVariant[]>> => {
  const variantInventory = await productVariantInventoryService.listByItem(
    inventoryItems.map((item) => item.id)
  )

  const variants = await productVariantService.list(
    {
      id: variantInventory.map((varInventory) => varInventory.variant_id),
    },
    {
      relations: ["product"],
    }
  )
  const variantMap = new Map(variants.map((variant) => [variant.id, variant]))

  return variantInventory.reduce((acc, cur) => {
    acc[cur.inventory_item_id] = acc[cur.inventory_item_id] ?? []
    acc[cur.inventory_item_id].push(variantMap.get(cur.variant_id))
    return acc
  }, {})
}

export const joinVariants = async (
  inventoryItems: InventoryItemDTO[],
  productVariantInventoryService: ProductVariantInventoryService,
  productVariantService: ProductVariantService
) => {
  const variantsByInventoryItemId = await getVariantsByInventoryItemId(
    inventoryItems,
    productVariantInventoryService,
    productVariantService
  )

  return inventoryItems.map((inventoryItem) => {
    return {
      ...inventoryItem,
      variants: variantsByInventoryItemId[inventoryItem.id] ?? [],
    }
  })
}
