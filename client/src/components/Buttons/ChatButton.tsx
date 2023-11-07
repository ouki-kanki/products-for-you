import styles from './chatButton.module.scss'
import chatIcon from '../../assets/svg_icons/chat.svg';


export const ChatButton = () => {
  return (
    <div className={styles.chatButtonContainer}>
      <div className="iconContainer">
        <img src={chatIcon} alt="chat icon of chat btn" />  
      </div>      
      <div>Chat with us!</div>
      </div>
  )
}
