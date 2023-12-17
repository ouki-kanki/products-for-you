import { useGetLatestProductsQuery } from "../../../api/productsApi"
import { ProductV2 } from "../../Product.tsx/ProductV2"

import { Grid } from "../../../UI/Layout/Grid/Grid";

// TODO : move from here
interface IVariationItem {
  variationName: string;
  value: string;
}

interface IVariation {
  id: number;
  quantity: number;
  price: string;
  productThumbnails: string[];
  variationDetails: IVariationItem[]; 
}

interface IProduct  {
  name: string;
  description: string;
  features: string[];
  category: string[];
  brand: string;
  icon: string;
  selectedVariation: IVariation;
  variations: {
    url: string,
    thumb: string
  }[]
}


export const LandingPage = () => {
  const { data, isLoading } = useGetLatestProductsQuery('10')

  if (data) {
    console.log("the data", data[1])
    // console.log(data[0].selected_variation.id)
  }

  return (
    <div>
      <Grid>
        {data && data.map(({ name, features, id, price}) => (
          <ProductV2 
            name={name}
            price={price}
            features={features}
            id={id}
            key={id}/> 
        ))}
      </Grid>
    </div>
  )
}
