import styles from "../styles/Overlays.module.css"
import { useEffect, useRef, useState } from "react"
import { Input, Button, Modal, Select } from "@geist-ui/core"
import { createTransactionForUser } from "../utils"

export default function NewTransactionContent(props) {
   const [amount, setAmount] = useState()
   const [type, setType] = useState()
   const [description, setDescription] = useState()

   const handler = val => console.log(val)

   return (
      <div className={styles.container}>
         <Modal.Title style={{ textTransform: "None" }}>
            New Transaction {props.name ? "for " + props.name : ""}
         </Modal.Title>
         <div className={styles.inputSection}>
            <div className={styles.inputGroup}>
               <Input
                  className={styles.formInput}
                  onChange={(e) => setAmount(e.target.value)}
                  width={"100%"}
               >
                  <b>Amount</b>
               </Input>
            </div>
            <div className={styles.inputGroup}>
               <Input
                  className={styles.formInput}
                  onChange={(e) => setType(e.target.value)}
                  width={"100%"}
               >
                  <b>Type</b>
               </Input>
            </div>
         </div>
         <div className={styles.inputSection}>
            <Input
               className={styles.formInput}
               onChange={(e) => setDescription(e.target.value)}
               width={"100%"}
            >
               <b className={styles.desc}>Description</b>
            </Input>
         </div>
         {!props.uid && (
            <div className={styles.inputSection}>
               <Select placeholder="Choose one" onChange={handler} width={"100%"}>
                  <Select.Option value="1">Apply transaction to all users</Select.Option>
                  <Select.Option value="2">Apply transaction to all rookies</Select.Option>
               </Select>
            </div>
         )}

         <div className={styles.actions}>
            <Button
               passive
               onClick={() => props.setVisible(false)}
               auto
               type="abort"
            >
               Cancel
            </Button>
            <Button
               auto
               type="success"
               onClick={() => {
                  createTransactionForUser(
                     props.uid,
                     parseInt(amount),
                     type,
                     description
                  )
               }}
            >
               Submit
            </Button>
         </div>
      </div>
   )
}
