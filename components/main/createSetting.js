import { useState } from 'react';
import styles from '../../styles/Home.module.css';
import Input from './input';

const GameSettings = ({ onSettingsChange, warningMessage, MIN_ROWS_COLUMNS, MAX_ROWS_COLUMNS, setWarningMessage }) => {


  const [numRows, setNumRows] = useState(15); // Значение по умолчанию
  const [numColumns, setNumColumns] = useState(15); // Значение по умолчанию
  const [playersCount, setPlayersCount] = useState(2);
  const [clickedCard, setClickedCard] = useState('diamond');

  const cards = [
    { id: 'square', label: 'Square', previewStyle: styles.square },
    { id: 'diamond', label: 'Diamond', previewStyle: styles.diamond },
  ];

  const cardHandler=(id)=>{
    setClickedCard(id);
  };

  // const handleRowChange = (e) => {
  //   const value = parseInt(e.target.value, 10);
  //   setNumRows(value);
  //   onSettingsChange({ numRows: value, numColumns, playersCount, clickedCard });

  //   if (!isNaN(value) && value >= MIN_ROWS_COLUMNS && value <= MAX_ROWS_COLUMNS) {
  //     setWarningMessage(false)
  //   }
  //   else{
  //     setWarningMessage(true)      
  //   }
  // };
  // const handleColumnChange = (e) => {
  //   const value = parseInt(e.target.value, 10);
  //   setNumColumns(value);
  //   onSettingsChange({ numRows, numColumns: value, playersCount, clickedCard });
  //   if (!isNaN(value) && value >= MIN_ROWS_COLUMNS && value <= MAX_ROWS_COLUMNS) {
  //     setWarningMessage(false)
  //   }
  //   else{
  //     setWarningMessage(true)      
  //   }
  // };
  //
  
  const handleRowChange = (e) => {
    const value = e.target.value;

    if (!isNaN( value)) {
      setNumRows(value);
      onSettingsChange({ numRows: value, numColumns, playersCount, clickedCard });

      if (value >= MIN_ROWS_COLUMNS && value <= MAX_ROWS_COLUMNS) {
        setWarningMessage(false);
      } else {
        setWarningMessage(true);
      }
    } else {
      setNumRows(value); // Сохраняем введённое значение, даже если это не число
      setWarningMessage(true);
    }
  };

  const handleColumnChange = (e) => {
    const value = e.target.value;

    if (!isNaN(value)) {
      setNumColumns(value);
      onSettingsChange({ numRows, numColumns: value, playersCount, clickedCard });

      if (value >= MIN_ROWS_COLUMNS && value <= MAX_ROWS_COLUMNS) {
        setWarningMessage(false);
      } else {
        setWarningMessage(true);
      }
    } else {
      setNumColumns(value); // Сохраняем введённое значение, даже если это не число
      setWarningMessage(true);
    }
  };


  return (
    
    <div className={styles.settings}>

        <label>
              count of players:
              <select
                value={playersCount}
                onChange={(e) => {setPlayersCount(parseInt(e.target.value, 10));onSettingsChange({ numRows, numColumns, playersCount:parseInt(e.target.value, 10), clickedCard });}}
              >
              <option value={2}>2 players</option>
              <option value={3}>3 players</option>
              <option value={4}>4 players</option>
              </select>
              
        </label>
        <div className={styles.nav}>
      <label>
        Rows (4 to 15): 
        <Input
          type="number"
          inputmode="numeric"
          value={numRows}

          onChange={handleRowChange}
          
        />
      </label>
      {clickedCard == 'square'?
      <label >
        Columns (4 to 15): 
        <Input
          type="number"
          inputmode="numeric"
          value={numColumns}
         
          onChange={handleColumnChange}
   
        />
      </label>:""
      }
      </div>
      {warningMessage ? <p style ={{color: 'red'}}>number must be between 4 and 15</p> : ""}

      <div className={styles.mapSelection}>
            <h2 className={styles.text}>Choose Your Map Layout</h2>
            <div className={styles.mapOptions}>
              {cards.map((card) => (
              <div
                key={card.id}
                className={`${styles.mapCard} ${
                  clickedCard === card.id ? styles.activeCard : ''
                }`}
                onClick={() =>{ cardHandler(card.id); onSettingsChange({ numRows, numColumns, playersCount, clickedCard: card.id })}}
              >
              <div className={`${styles.mapPreview} ${card.previewStyle}`}></div>
              </div>
              ))}
            </div>
          
          </div>
    </div>
  );
};

export default GameSettings;
