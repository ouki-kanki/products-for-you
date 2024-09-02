import styles from './ProductPreviewV1.module.scss'
import { Link, useNavigate } from 'react-router-dom';

import { QuantityIndicator } from '../../../UI/Indicators/QuantityIndicator';

interface ProductPreviewProps {
  name: string;
  categories: string[];
  thumb: string;
  image: string;
  description: string;
  sku: string;
  upc: string;
  price: string;
  availability: string;
}

export const ProductPreview1 = (props: ProductPreviewProps) => {
  console.log(props)
  const navigate = useNavigate()
  const category = props.categories[props.categories.length -1]
  const { slug, name } = props

  const handleProductDetail = (categorySlug: string, productItemSlug: string) => {
    const constructedUrl = `${categorySlug}/${name}/`
    navigate(`/products/${encodeURIComponent(constructedUrl)}/${productItemSlug}`, {
      state: constructedUrl
    })
  }

  return (
    <div className={styles.containerProduct}>

      <div className={[styles.containerLeft, styles.container].join(' ')}>
        {/* TODO: fetch the image and not the thumb */}
        <a
          href={props.image}
          target='_blank'
          className={styles.imageContainer}>
          <img src={props.thumb} alt="" />
        </a>
      </div>

      {/* right panel */}
      <div className={[styles.container_right, styles.container].join(' ')}>
        <h2>{props.name}</h2>
        <div className={styles.container_right__middle}>
          {category && (
            <Link
              to={`/products/${category}`}
              className={styles.category}>{category}</Link>
          )}
          <p className={styles.description}>{props.description}</p>
          <div className={styles.priceContainer}>
            <div>Price: <span>{props.price}€</span></div>
          </div>
          <QuantityIndicator availability={props.availability}/>
        </div>

        <div className={styles.container_right__bottom}>
          <button
            onClick={() => handleProductDetail(category, slug)}
            className={styles.button}>details</button>
        </div>
      </div>

    </div>
  )
}
