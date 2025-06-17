import { useNavigate } from "react-router-dom";

export const useProductNavigation = () => {
  const navigate = useNavigate()

/**
   * navigate to product-detail for an product
   * @param categorySlug
   * @param productItemSlug
   */
  const goToProductDetail = (categorySlug: string, productItemSlug: string) => {
    const constructedUrl = `${categorySlug}/${name}/`
    navigate(`/products/${encodeURIComponent(constructedUrl)}/${productItemSlug}`, {
      state: constructedUrl
    })
  }

  /**
   * accepts the contructedurl from the server as an input (category/name)
   * @param path
   * @param slug
   */
  const goToProductDetailWithConstructedInput = (path: string, slug: string) => {
    navigate(`/products/${encodeURIComponent(path)}/${slug}`, {
      state: path
    })
  }

  return {
    goToProductDetail,
    goToProductDetailWithConstructedInput
  }
}
