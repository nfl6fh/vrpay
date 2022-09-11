import styles from "../styles/Overlays.module.css"
import { useEffect, useRef, useState } from "react"
import { Input, Button, Modal, Select } from "@geist-ui/core"
import { createTransactionForUser } from "../utils"

export default function NewTransactionContent(props) {
   return (
      <div className={styles.container} onClick={() => console.log("props", props)}>
         {props?.transaction?.amount}
         {props?.transaction?.description}
         {props?.transaction?.type}
         <Button>Approve</Button>
         <Button>Deny</Button>
         <Button>Delete</Button>
      </div>
   )
}
