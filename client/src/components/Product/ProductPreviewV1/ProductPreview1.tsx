import styles from './ProductPreviewV1.module.scss'
import { Link, useNavigate } from 'react-router-dom';

import { QuantityIndicator } from '../../../UI/Indicators/QuantityIndicator';
import { useClassLister } from '../../../hooks/useClassLister';


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
      <div className={classes('container_right', `${layout}`)}>
        <div className={styles.titleContainer}>
          <h2>{props.name}</h2>
        </div>

        <div className={styles.priceAndQntContainer}>
          <div className={styles.priceContainer}>
            <span>Price: </span>
            <span>€{props.price}</span>
          </div>

          <div className={styles.availabilityContainer}>
            <QuantityIndicator availability={props.availability}/>
          </div>
        </div>

        <div className={styles.descriptionContainer}>
          {props.description}
        </div>

        <div className={styles.btnContainer}>
          <button
            onClick={() => handleProductDetail(category, slug)}
            className={styles.button}>details</button>
        </div>

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
      {/* <div className={classes('container_right', 'container', `${layout}`)}>
        <div className={styles.container_right__middle}>
          <div className={styles.container_right__middle__left}>
            <h2>{props.name}</h2>
            {category && (
              <Link
                to={`/search?categories=${category}`}
                className={styles.category}>{category}</Link>
            )}
            {brand && (
              <Link
                to={`/search?brand=${brand}`}
                className={styles.category}>{brand}</Link>
            )}

            <div className={styles.tagsContainer}>
              {tags?.map(tag => (
                <Link to={`/search?tags=${tag}`}>#{tag}</Link>
              ))}
            </div>
            <p className={styles.description}>{props.description}</p>
          </div>

          <div className={styles.priceAndQntContainer}>
            <div className={styles.priceContainer}>
              <div>Price: <span>{props.price}€</span></div>
            </div>
            <div className={styles.availabilityContainer}>
              <QuantityIndicator availability={props.availability}/>
            </div>
          </div>
        </div>

        <div className={styles.container_right__bottom}>
          <button
            onClick={() => handleProductDetail(category, slug)}
            className={styles.button}>details</button>
        </div>
      </div> */}

    </div>
  )
}
