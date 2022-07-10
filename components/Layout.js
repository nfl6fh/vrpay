import CustomNavbar from "./CustomNavbar"
import NewTransactionOverlay from "./NewTransactionOverlay.js"
import { useState, Children, cloneElement } from "react"

export default function Layout({ children }) {
   const [newTransactionOverlayVisible, setNewTransactionOverlayVisible] =
      useState(false)
   const [overlayVisible, setOverlayVisible] = useState(false)

   function handleNewTransactionClick() {
      setOverlayVisible(true)
      setNewTransactionOverlayVisible(true)
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
               {newTransactionOverlayVisible && <NewTransactionOverlay dismiss={dismissNewTransactionOverlay}/>}
            </div>
         )}
         <CustomNavbar />
         <main>{childrenWithProps}</main>
         {/* <Footer /> */}
      </>
   )
}
