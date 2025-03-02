import styles from './ProductPreviewV1.module.scss'
import { Link, useNavigate } from 'react-router-dom';

import { QuantityIndicator } from '../../../UI/Indicators/QuantityIndicator';
import { useClassLister } from '../../../hooks/useClassLister';


interface ProductPreviewProps {
  name: string;
  slug: string;
  categories: string[];
  thumb: string;
  image: string;
  description: string;
  sku: string;
  upc: string;
  price: string;
  availability: string;
  layout: string
}

export const ProductPreview1 = (props: ProductPreviewProps) => {
  const { layout } = props
  const navigate = useNavigate()
  const classes = useClassLister(styles)
  const category = props.categories ? props.categories[props.categories?.length -1] : ''
  const { slug, name } = props

  // TODO: the same is used elsewhere . move to a common place (used in the orders component)
  const handleProductDetail = (categorySlug: string, productItemSlug: string) => {
    const constructedUrl = `${categorySlug}/${name}/`
    navigate(`/products/${encodeURIComponent(constructedUrl)}/${productItemSlug}`, {
      state: constructedUrl
    })
  }

  return (
    <div
      className={classes('containerProduct', `${layout}`)}>

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
          <div className={styles.container_right__middle__left}>
            {category && (
              <Link
                to={`/products/${category}`}
                className={styles.category}>{category}</Link>
            )}
            <p className={styles.description}>{props.description}</p>
            <div className={styles.priceContainer}>
              <div>Price: <span>{props.price}€</span></div>
            </div>
          </div>
          <div className={styles.availabilityContainer}>
            <QuantityIndicator availability={props.availability}/>
          </div>
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
