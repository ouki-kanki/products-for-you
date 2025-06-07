import { useState, useEffect } from "react";
import styles from "./productV2.module.scss";
import type { WidthType } from "../../UI/Card/Card";

import { useHover } from "../../hooks/useHover";
import { useNavigate } from "react-router-dom";

import { Card } from "../../UI/Card/Card";
import { Button } from "../../UI/Button/Button";
import { QuantityIndicator } from "../../UI/Indicators/QuantityIndicator";
import { FavoritesBtn } from "../Buttons/FavoritesBtn/FavoritesBtn";
import { Rating } from "../Rating/Rating";


import kdeImage from "../../assets/kd14_low_res.png";
import kdWhiteYellow from "../../assets/variations/kd14_yel_white.jpg";
import kdIce from "../../assets/variations/kd14_ice.jpg";
import kdDeepBlue from "../../assets/variations/kd14_deep_blue.jpg";

import { IProduct } from "../../api/types";

import { useLazyGetProductVariationPreviewQuery } from "../../api/productsApi";

const formatPrice = (strNum: string) => {
  const num = Number(strNum).toLocaleString();
  return `${num} €`;
};

const getDefaultImage = (images) => {
  const defaultImage = images.reduce((a, image) => image.isDefault && image.url, [''])
  if (defaultImage) {
    return defaultImage
  } else {
    // if there is no default flag pick the fist image in the list
    return images[0].url
  }
}


interface IProductV2Props extends IProduct {
  width?: WidthType;
  shadow?: boolean;
}

// TODO: getProductVariationPreview has to be moved from here. has to go to the parent
export const ProductV2 = ({
  name: title,
  price,
  features,
  slug,
  productImages,
  quantity,
  description,
  variations,
  availability,
  constructedUrl,
  handleFavorite,
  isFavorite,
  shadow = true,
  width = "fluid",
}: IProductV2Props) => {
  const { isTempHovered, activateHover, deactivateHover } = useHover(undefined, 300);
  const [currentImage, setCurrentImage] = useState<string>(kdeImage);
  const navigate = useNavigate();
  const [newQuantity, setNewQuantity] = useState<number | null>(null);
  const [variationPrice, setVariationPrice] = useState<string | null>(null);
  const [variationProductThumbnails, setVariationProductsThumbnails] = useState({});
  const [variationSlug, setVariationSlug] = useState<string>("");
  const [trigger, { data }, lastPromiseInfo] = useLazyGetProductVariationPreviewQuery();

  // removes the current variation from the list of other variations
  const [omitedVariationSlug, setOmitedVariationSlug] = useState(slug || null)

  const strProductImages = JSON.stringify(productImages);
  const strVariationResult = data && JSON.stringify(data);

  useEffect(() => {
    const productImages = JSON.parse(strProductImages)
    if (productImages.length > 0) {
      const defImage = getDefaultImage(productImages)
      setCurrentImage(defImage)
    }
  }, [strProductImages])

  useEffect(() => {
    if (strVariationResult) {
      const selectedVariation = JSON.parse(strVariationResult);
      console.log("the new variation", selectedVariation)
      setNewQuantity(selectedVariation.quantity);
      setVariationPrice(selectedVariation.price);
      setVariationProductsThumbnails(selectedVariation.productThumbnails);
      setVariationSlug(selectedVariation.slug);

      const defaultImage = getDefaultImage(selectedVariation.productThumbnails)
      setCurrentImage(defaultImage)
    }
  }, [strVariationResult]);

  useEffect(() => {
    // TODO: convert to reducer
    setNewQuantity(quantity);
    setVariationPrice(price);

    setVariationProductsThumbnails(JSON.parse(strProductImages));
    setVariationSlug(slug);
  }, [quantity, price, strProductImages, slug]);

  const handleVariationChange = (e: React.MouseEvent<HTMLDivElement>, slug: string) => {
    e.stopPropagation();

    // omit the new variation from the list of other variations
    setOmitedVariationSlug(slug)
    trigger(slug);
  };

  // TODO: repeated functionality on latest products. DRY this
  const handleProductDetail = () => {
    navigate(`/products/${encodeURIComponent(constructedUrl)}/${variationSlug}`, {
      state: constructedUrl,
    });
  };

  const handleSetMainImage = (e: React.MouseEvent<HTMLDivElement>, url: string) => {
    e.stopPropagation();
    setCurrentImage(url);
  };

  // render the variation images on the right of the panel
  const renderVariations = () => {
    if (variations && variations.length > 0) {
      return (
        <div className={styles.variationsContainer}>
          {variations
            .filter(variation => variation.slug !== omitedVariationSlug)
            .slice(0, 3)
            .map((variation, index) => (
            <div
              className={styles.varImageContainer}
              onClick={(e) => handleVariationChange(e, variation.slug)}
              key={index}
            >
              <img src={variation.thumb} alt="variation image" />
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div>could not load variations</div>
      )

      // TODO: fallback, this was used for testing
      return (
        <div className={styles.variationsContainer}>
          <div className={styles.varImageContainer}>
            <img src={kdDeepBlue} alt="variation image" />
          </div>
          <div className={styles.varImageContainer}>
            <img src={kdIce} alt="variation image" />
          </div>
          <div className={styles.varImageContainer}>
            <img src={kdWhiteYellow} alt="variation image" />
          </div>
        </div>
      );
    }
  };

  return (
    <Card
      onMouseEnter={activateHover}
      onMouseLeave={deactivateHover}
      width={width}
      shadow={shadow}
      image={currentImage}>
      <div className={styles.mainContainer}>
        <FavoritesBtn handleFavorite={handleFavorite} isFavorite={isFavorite} />
        <div className={styles.clipContainer}>
          <svg>
            <defs>
              <filter id="shadow_filter" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="rgba(0, 0, 0, 0.3)" />
              </filter>
            </defs>

            <clipPath id="wave_featured_product" clipPathUnits="objectBoundingBox">
              <path className="st0" d="M0,0.5 C0.2,0.5,0.6,0.7,0.5,1 L1,1 V0 H0 Z" />
            </clipPath>
          </svg>
        </div>

        <div className={styles.productContainer} onClick={handleProductDetail}>
          <div className={styles.topRegion}>
            <h2>{title}</h2>
          </div>
          <div className={`${styles.medRegion} ${width === "wide" && styles.wide}`}>
            <div className={styles.ml}>
              <div className={styles.imageContainer}>
                <img
                  src={currentImage}
                  className={`${styles.imageMain} ${isTempHovered && styles.imageHovered}`}
                  alt="shoe image"
                />
              </div>
            </div>
            {width === "wide" && (
              <div className={styles.mm}>
                <div>{description}</div>
              </div>
            )}

            <div className={styles.mr}>
              <div className={styles.mrFirst}>
                <h3 className={styles.priceContainer}>
                  price: {formatPrice(variationPrice as string)}
                </h3>

                <Rating/>
                <div className={styles.availabilityContainer}>
                  <QuantityIndicator availability={availability}/>
                </div>
              </div>

              {/* VARIATIONS */}
              {renderVariations()}

              <div className={styles.featuresContainer}>
                <h3>features</h3>
                <ul>{features && features.map((feature, id) => <li key={id}>{feature}</li>)}</ul>
              </div>
            </div>
          </div>

          {/* Product other images */}
          <div className={styles.bottomRegion}>
            {variationProductThumbnails && variationProductThumbnails.length > 0 && (
              variationProductThumbnails
              .slice(0, 3)
              .map((thumb, index) => (
                <div onClick={(e) => handleSetMainImage(e, thumb.url)} key={index}>
                  <img src={thumb.url} alt="top view of the product" />
                </div>
              ))
            )}
          </div>
          <div className={styles.actionContainer}>
            <Button>buy now</Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
