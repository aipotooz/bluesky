/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { StockLocationExpandedDTO } from "./StockLocationExpandedDTO"

export interface AdminStockLocationsListRes {
  stock_locations: Array<StockLocationExpandedDTO>
  /**
   * The total number of items available
   */
  count: number
  /**
   * The number of stock locations skipped when retrieving the stock locations.
   */
  offset: number
  /**
   * The number of items per page
   */
  limit: number
}
