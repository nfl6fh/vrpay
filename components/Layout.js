import CustomNavbar from "./CustomNavbar"
import NewTransactionOverlay from "./NewTransactionOverlay.js"
import { useState, Children, cloneElement } from "react"

export default function Layout({ children }) {
   const [newTransactionOverlayVisible, setNewTransactionOverlayVisible] =
      useState(false)
   const [overlayVisible, setOverlayVisible] = useState(false)
   const [newTransactionForUID, setNewTransactionForUID] = useState('')
   const [newTransactionForName, setNewTransactionForName] = useState('')

   function handleNewTransactionClick(uid, name) {
      setOverlayVisible(true)
      setNewTransactionOverlayVisible(true)
      setNewTransactionForUID(uid)
      setNewTransactionForName(name)
   }

   function dismissNewTransactionOverlay() {
      setOverlayVisible(false)
      setNewTransactionOverlayVisible(false)
   }

   const childrenWithProps = Children.map(children, (child) =>
      cloneElement(child, {
         handleNewTransactionClick: handleNewTransactionClick,
      })
   )

   return (
      <>
         {overlayVisible && (
            <div>
               {newTransactionOverlayVisible && <NewTransactionOverlay uid={newTransactionForUID} name={newTransactionForName} dismiss={dismissNewTransactionOverlay}/>}
            </div>
         )}
         <CustomNavbar />
         <main>{childrenWithProps}</main>
         {/* <Footer /> */}
      </>
   )
}
