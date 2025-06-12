import styles from './ProductPreviewV1.module.scss'
import { Link, useNavigate } from 'react-router-dom';

import { BtnCard } from '../../Buttons/BtnCard/BtnCard';
import { QuantityIndicator } from '../../../UI/Indicators/QuantityIndicator';
import { useClassLister } from '../../../hooks/useClassLister';
import { Rating } from '../../Rating/Rating';

// TODO: move this interface
interface ProductPreviewProps {
  name: string;
  brand: string;
  slug: string;
  categories: string[];
  thumb: string;
  image: string;
  description: string;
  sku: string;
  upc: string;
  price: string;
  availability: string;
  layout?: 'listLayout' | null
}

export const ProductPreview1 = (props: ProductPreviewProps) => {
  const { layout } = props
  const navigate = useNavigate()
  const classes = useClassLister(styles)

  // selects the last child of the categories
  const category = props.categories ? props.categories[props.categories?.length -1] : ''
  const { slug, name, brand, tags } = props

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

      <div className={styles.containerLeft}>
        {/* TODO: fetch the image and not the thumb */}
        <a
          href={props.image}
          target='_blank'
          className={styles.imageContainer}>
          <img src={props.thumb} alt="" />
        </a>
      </div>

      {/* right panel */}
      <div className={classes('container_right', `${layout}`)}>

        <div className={styles.titleContainer}>
          <h2>{props.name}</h2>
        </div>

        <div className={styles.priceContainer}>
          <span>Price: </span>
          <span>€{props.price}</span>
        </div>

        <div className={styles.availabilityContainer}>
          <QuantityIndicator availability={props.availability}/>
        </div>

        <div className={styles.descriptionContainer}>
          {props.description}
        </div>

        <div className={styles.btnContainer}>
          <BtnCard handleClick={() => handleProductDetail(category, slug)}/>
        </div>

        {/* category - brand - tags */}
        <div className={styles.tagsContainer}>
            {category && (
              <Link
                to={`/search?categories=${category}`}>{category}</Link>
            )}

            {brand && (
              <Link
                to={`/search?brand=${brand}`}
                className={styles.category}>{brand}</Link>
            )}

            <div className={styles.tagsContainer}>
              {tags?.map((tag: string) => (
                <Link to={`/search?tags=${tag}`}>#{tag}</Link>
              ))}
            </div>
        </div>
      </div>
    </div>
  )
}
