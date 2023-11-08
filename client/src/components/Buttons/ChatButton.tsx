import styles from './chatButton.module.scss'
import ChatIcon from '../../assets/svg_icons/chat.svg?react';


export const ChatButton = () => {
  return (
    <div className={styles.chatButtonContainer}>
        <ChatIcon 
          className={styles.chatIcon}/>
      <div>Chat with us!</div>
      </div>
  )
}
