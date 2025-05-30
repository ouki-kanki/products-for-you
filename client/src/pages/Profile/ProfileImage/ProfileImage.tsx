import React, { useState, useRef } from 'react'
import { ModalCentered } from '../../../components/Modal/ModalCentered/ModalCentered'
import styles from './profileImage.module.scss'
import { BaseButton } from '../../../components/Buttons/baseButton/BaseButton'


interface ProfileImageProps {
  imageUrl: string;
  handleImageUpLoad: (formData) => void;
}

type FilePreviewState = {
  file: File | null;
  url: string;
}

export const ProfileImage = ({ imageUrl, handleImageUpLoad }: ProfileImageProps) => {
  const [previewImage, setPreviewImage] = useState<FilePreviewState>({ file: null, url: ''})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // console.log(e.target.files[0])
      const file = e.target.files[0]
      const imageUrl = URL.createObjectURL(file)
      console.log(imageUrl)
      setPreviewImage({
        file,
        url: imageUrl
      })
      setIsModalOpen(true)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setPreviewImage({file: null, url: ''})
    if (imageInputRef?.current?.value) {
      imageInputRef.current.value = ''
    }
  }

  const handleImageUploadSubmit = () => {
    if (!previewImage.file) {
      return
    }

    const formData = new FormData()
    formData.append('image', previewImage.file)
    handleImageUpLoad(formData)
    handleCloseModal()
  }

  return (
    <div>
      <div
        className={styles.imageContainer}
        onClick={() => imageInputRef?.current?.click()}
        >
        <img src={imageUrl} alt='profile image'/>
      </div>
      <label className={styles.customImageUploadBtn}>
        upload image
        <input
          className={styles.fileInput}
          type="file"
          accept='image/*'
          onChange={handleImageUpload}
          ref={imageInputRef}
        />
      </label>
      <ModalCentered
        onClose={handleCloseModal}
        isOpen={isModalOpen}
        >
        <div style={{
          'width': '300px',
          'height': '200px'
        }}>
          <img
            style={{
              'maxWidth': '100%',
              'maxHeight': '100%'
            }}
            src={previewImage.url || ''} alt="prev of image" />
        </div>
        <div className={styles.actionContainer}>
          <BaseButton
            size='sm'
            color='secondary'
            rounded
            onClick={handleCloseModal}>back</BaseButton>
          <BaseButton
            size='sm'
            rounded
            onClick={handleImageUploadSubmit}>submit</BaseButton>
        </div>
      </ModalCentered>
    </div>
  )
}
