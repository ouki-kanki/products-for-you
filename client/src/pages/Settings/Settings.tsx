import styles from './settings.module.scss'

import { Input } from '../../UI/Forms/Inputs'


const Settings = () => {
  return (
    <div>
      <h1>Settings</h1>
      <div className={styles.settingsContainer}>
        <Input hasLabel label='yoyo'/>
      </div>
    </div>
  )
}

export default Settings
