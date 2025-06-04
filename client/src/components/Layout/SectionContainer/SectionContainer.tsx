import React from 'react'
import styles from './sectionContainer.module.scss'
import { Link } from 'react-router-dom';


interface SectionContainerBaseProps {
  title: string;
  children: React.ReactNode;
}

interface SectionWithLink extends SectionContainerBaseProps {
  noLink?: false;
  linkPath: string;
  linkTitle: string;
}

interface SectionWithoutLink extends SectionContainerBaseProps {
  noLink: true;
  linkPath?: never;
  linkTitle?: never;
}

export const SectionContainer = ({ title, linkPath, linkTitle, noLink=false, children }: SectionWithLink | SectionWithoutLink) => {
  return (
    <div className={styles.container}>
      <h2>{title}</h2>
      {children}
      {!noLink && (
        <Link className={styles.link} to={linkPath}>{linkTitle}</Link>
      )}
    </div>
  )
}
