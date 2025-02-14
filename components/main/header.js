import styles from './header.module.css';
import Head from 'next/head';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';

const Header = () => {
  const { t } = useTranslation('common');  // 'common' - это namespace
 

  return (
    <div>
      <Head>
        
        <title>Welcome to Tic-Tac-Toe!</title>
        
      </Head>

      <header className={styles.header}>
        
       <div className={styles.headerContent}>
          <h1 className={styles.h1}>{t("header")}</h1>
          {/* <div className={styles.imageContainer}> */}
          <Image className={styles.img} src="/header.png" width={100} height={100} alt="Game Image" />
          
          {/* </div> */}


       </div> 
      </header>
    </div>
  );
};

export default Header;
