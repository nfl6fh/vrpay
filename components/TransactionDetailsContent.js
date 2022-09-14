import styles from "../styles/Overlays.module.css"
import { useEffect, useRef, useState } from "react"
import { Input, Button, Modal, Select } from "@geist-ui/core"
import { createTransactionForUser } from "../utils"

var formatter = new Intl.NumberFormat("en-US", {
   style: "currency",
   currency: "USD",

   // These options are needed to round to whole numbers if that's what you want.
   //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
   //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
})

export default function NewTransactionContent(props) {
   return (
      <div className={styles.container} onClick={() => console.log("props", props)}>
         <div className={styles.container}>
         <Modal.Title style={{ textTransform: "None" }}>
            Viewing Transaction {props.name ? "for " + props.name : ""}
         </Modal.Title>
         <div className={styles.inputSection}>
            <div className={styles.inputGroup}>
               <b>Amount</b>
               <p>{formatter.format(props?.transaction?.amount)}</p>
            </div>
            <div className={styles.inputGroup}>
               <label>
                  <b className={styles.type}>Type</b>
               </label>
                  <p>{props?.transaction?.type}</p>
            </div>
         </div>
         <div className={styles.inputSection}>
               <b className={styles.desc}>Description</b>
               <p>{props?.transaction?.description}</p>
         </div>
         {props.transaction.status === "pending" && 
            <div>
               <Button>Approve</Button>
               <Button>Deny</Button>
               <Button>Delete</Button>
            </div>
         }

         </div>
      </div>
   )
}
