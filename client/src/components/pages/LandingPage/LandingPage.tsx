import { useGetLatestProductsQuery } from "../../../api/productsApi"
import { ProductV2 } from "../../Product.tsx/ProductV2"

export const LandingPage = () => {
  const { data, isLoading } = useGetLatestProductsQuery('10')

  if (data) {
    console.log(data[0].features)
  }

  return (
    <div>
      {data && data.map(({ name, price, features }) => (
        // TODO: change key to use id - have to update the serializer
        <ProductV2 
          name={name}
          price={price}
          features={features}  
          key={name}/>
      ))}
    </div>
  )
}
