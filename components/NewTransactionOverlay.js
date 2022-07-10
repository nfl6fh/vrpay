import styles from "../styles/Overlays.module.css"
import { useEffect, useRef } from "react"

export default function NewTransactionOverlay(props) {

   return (
      <div className={styles.directionsOverlayContainer} onClick={() => console.log("clicked")}>
         <div className={styles.directionsContainer}>
            Hello world
            <button onClick={() => props.dismiss()}> Close </button>
         </div>
      </div>
   )
}