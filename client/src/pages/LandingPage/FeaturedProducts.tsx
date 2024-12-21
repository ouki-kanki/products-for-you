import { ProductCardV3 } from '../../../components/Product/ProductCardV3';
import { Iproduct } from '../../../types';
import { ICarouselContainerProps } from '../../../hooks/useCarousel/carouselTypes';
import { SwiperCarouselV2 } from '../../../components/Carousels/SwiperCarouselV2';


export const FeaturedProducts = ({ data }) => {
  console.log("the featured", data)

  return (
    <div>
      <h2>Featured Products</h2>
    </div>
  )
}
