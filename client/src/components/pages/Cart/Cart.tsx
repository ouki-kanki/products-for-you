import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ModalCentered } from '../../Modal/ModalCentered/ModalCentered'
import { RootState } from '../../../app/store'
import { hideModal } from '../../../features/UiFeatures/UiFeaturesSlice' 
import styles from './cart.module.scss'

export const Cart = () => {
  const dispatch = useDispatch()
  const isModalOpen = useSelector((state: RootState) => state.ui.isModalOpen)

  const handleCloseModal = () => {
    dispatch(hideModal())
  }


  return (
    <ModalCentered onClose={handleCloseModal} isOpen={isModalOpen}>
      <div className={styles.container}>
        <h2>Your Items</h2>
        <table className={styles.cartTable}>
          <thead className={styles.header}>
            <tr>
              <th>Item</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>jordan 36</td>
              <td>35$</td>
              <td>
                <span>3</span>
                <div className={styles.operators}>
                  <div>-</div>
                  <div>+</div>
                </div>
              </td>
              <td>67$</td>
            </tr>
            <tr>
              <td>jordan 36</td>
              <td>35$</td>
              <td>3</td>
              <td>67$</td>
            </tr>
          </tbody>
        </table>
        <div className={styles.actionContainer}>
          <div className={styles.leftActionContainer}></div>
          <div className={styles.rightActionContainer}>
            {/* TODO: map these */}
            <div className={styles.totalCalculatorContainer}>
              <div className={styles.label}>Subtotal</div>
              <div className={styles.value}>$ 234</div>
            </div>

            <div className={styles.totalCalculatorContainer}>
              <div className={styles.label}>Tax</div>
              <div className={styles.value}>24 %</div>
            </div>

            <div className={styles.totalCalculatorContainer}>
              <div className={styles.label}>Discount</div>
              <div className={styles.value}>0</div>
            </div>
            <div className={`${styles.totalCalculatorContainer} ${styles.totalContainer}`}>
              <div className={`${styles.total}`}>Total</div>
              <div className={styles.value}>0</div>
            </div>
            <div className={styles.buyBtnContainer}>
              <div className={styles.buyBtn}>Buy now</div>
            </div>
          </div>

        </div>
      </div>
    </ModalCentered>
    )
}
