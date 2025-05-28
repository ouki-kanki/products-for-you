import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import styles from './cart.module.scss';
import type { RootState } from '../../app/store/store';
import { removeItem, addQuantity, subtractQuantity, clearCart, checkout } from '../../features/cart/cartSlice';

import { ModalCentered } from '../../components/Modal/ModalCentered/ModalCentered';
import RemoveIcon from '../../assets/svg_icons/remove.svg?react'
import AddIcon from '../../assets/svg_icons/add_filled.svg?react'
import SubtractIcon from '../../assets/svg_icons/subtract_filled.svg?react'
import { BaseButton } from '../../components/Buttons/baseButton/BaseButton';
import { isEmpty } from '../../utils/objUtils';

import { useGetItemQuantitiesMutation } from '../../api/productsApi';
import { showNotification } from '../../components/Notifications/showNotification';


export const Cart = () => {
  const [isClearModalOpen, setIsClearModalOpen] = useState(false)
  const dispatch = useDispatch()
  const cart = useSelector((state: RootState) => state.cart)
  const total = cart.total
  const navigate = useNavigate()
  const [getItemQuantities, { data: itemQuantities, isError: isItemQntiesError, isItemQtiesLoading, }] = useGetItemQuantitiesMutation()

  const uuidsString = JSON.stringify(cart?.items.map(item => item.productId))

  useEffect(() => {
    if (uuidsString.length > 0) {
      const uuids = JSON.parse(uuidsString)
      getItemQuantities(uuids)
    }

  }, [uuidsString, getItemQuantities])

  const handleNavigateToProduct = (constructedUrl: string, slug: string) => {
    // TODO: dry this is the same in the ProductV2
    navigate(`/products/${encodeURIComponent(constructedUrl)}/${slug}`)
  }

  const handleAddQty = (id: string) => {
    if (isItemQntiesError) {
      return
    }

    if (!itemQuantities?.items || itemQuantities.items.length === 0) {
      return;
    }

    //  db qunatity
    const { quantity } = itemQuantities.items.find(item => item.uuid === id)

    // cart quantity
    const { quantity: cartQuantity } = cart.items.find(item => item.productId === id)


    if (cartQuantity >= quantity) {
      showNotification({
        message: 'no more items are available',
        type: 'caution'
      })
      return
    }
    // TODO: compare with the qunatity from the db and not allow to add more
    console.log("the productId", id)
    dispatch(addQuantity({ productId: id }))
  }

  const handleSubtractQty = (id: number) => {
    dispatch(subtractQuantity({ productId: id }))
  }

  const handleGotoCheckout = () => {
    // cart middleware will handle saving the cart to database
    dispatch(checkout())
    navigate('/checkout')

  }

  const handleClearBtnClick = () => {
    setIsClearModalOpen(true)
  }

  const handleCloseclearModal = () => {
    setIsClearModalOpen(false)
  }

  const handleClearCart = () => {
    dispatch(clearCart())
    setIsClearModalOpen(false)
    // TOOD: clear the cart from database if the user is looged in
  }

  if (isEmpty(cart)) {
    return (
      <div>there are no items in your cart</div>
    )
  }

  return (
    <div className={styles.container}>
      <h2>Your Items</h2>
      <div className={styles.cartContainer}>
        <div className={`${styles.row} ${styles.tableHeader}`}>
          <div>icon</div>
          <div>title</div>
          <div>price</div>
          <div>quantity</div>
          <div>Total</div>
          <div></div>
        </div>
        {cart && cart?.items.map(({ productIcon, price, quantity, variationName, productId, constructedUrl, slug }) => (
          <div className={styles.row} key={productId}>
            <div>
              <div className={styles.iconContainer} onClick={() => handleNavigateToProduct(constructedUrl, slug)}>
                <img src={productIcon} alt='procuct icon' />
              </div>
            </div>
            <div>{variationName}</div>
            <div>{price}</div>
            <div className={styles.quantityContainer}>
              <div>
                {quantity}
              </div>
              <div
                className={styles.quantityIconContainer}
                onClick={() => handleAddQty(productId)}>
                <AddIcon className={styles.quantityIcon}/>
              </div>
              <div
                className={styles.quantityIconContainer} onClick={() => handleSubtractQty(productId)}>
                <SubtractIcon className={styles.quantityIcon}/>
              </div>
            </div>
            <div className={styles.total}>{price * quantity}</div>
            <div
              className={styles.removeContainer}
              onClick={() => dispatch(removeItem(productId))}
              >
              <RemoveIcon className={styles.removeIcon}/>
            </div>
          </div>
        ))}

        <div className={styles.actionContainer}>
          <div className={styles.finalPriceContainer}>
            <div className={styles.actionRow}>
              <div>SubTotal</div>
              <div>{total}</div>
            </div>
            <div className={styles.actionRow}>
              <div>Tax</div>
              <div>24%</div>
            </div>
            <div className={styles.actionRow}>
              <div>Discount</div>
              <div>0</div>
            </div>
            <div className={styles.totalFinal}>
              <div>Total: </div>
              <div>{cart.total}<span>€</span></div>
            </div>
            <div className={styles.BtnContainer}>
              <button
                onClick={handleClearBtnClick}
                className={styles.clearBtn}>clear</button>
              <div
                className={styles.orderBtn}
                onClick={handleGotoCheckout}
                >Go to checkout</div>
            </div>
          </div>
        </div>
      </div>
      <ModalCentered
        isOpen={isClearModalOpen}
        onClose={handleCloseclearModal}
      >
        <div className={styles.clearModalContainer}>
          <h3>Are you sure you want to clear the cart?</h3>
          <div className={styles.btnContainer}>
            <BaseButton
              type='danger'
              size='sm'
              onClick={handleCloseclearModal}
              >No</BaseButton>
            <BaseButton
              onClick={handleClearCart}
              size='sm'>Yes</BaseButton>
          </div>
        </div>
      </ModalCentered>
    </div>
  )
}
