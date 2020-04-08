import mongoose from "mongoose"
import getProduct from "../get-product"
import { request } from "../../../../../helpers/test-request"
import { IdMap } from "medusa-test-utils"
import { ProductServiceMock } from "../../../../../services/__mocks__/product"

describe("Get product by id", () => {
  describe("get product by id successfull", () => {
    let subject
    beforeAll(async () => {
      subject = await request(
        "GET",
        `/admin/products/${IdMap.getId("product1")}`,
        {
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          },
        }
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls get product from productSerice", () => {
      expect(ProductServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(ProductServiceMock.retrieve).toHaveBeenCalledWith(
        IdMap.getId("product1")
      )
    })

    it("returns product decorated", () => {
      expect(subject.body._id).toEqual(IdMap.getId("product1"))
      expect(subject.body.decorated).toEqual(true)
    })
  })
})
