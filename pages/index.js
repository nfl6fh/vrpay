import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import { signIn, signOut, useSession } from "next-auth/react"
import { userInfo } from "os"
import Loading from "../components/Loading"
import Router from "next/router"
import { useEffect } from "react"

import { Button, Text } from "@geist-ui/core"

export default function Home() {
   const { data: session, status } = useSession()

   useEffect(() => {
      console.log("session:", session)
   }, [session])

   if (status === "loading") {
      return <Loading />
   }

   if (session) {
      if (session.is_verified) {
         if (session.role && session.role !== "") {
            Router.push("/dashboard")
            return <>User is admin/treasurer</>
         } else {
            Router.push("/u/[id]", `/u/${session.uid}`)
            return <></>
         }
      } else {
         // pending page
         return <>Account pending. user is not verified</>
      }
   } else {
      // user is not logged in
      return (
         <div className={styles.hasBackground}>
            <main className={styles.main}>
               <Text h1 className={styles.title}>VRPay</Text>
               <Text h4 className={styles.subtitle}>Cool name, huh?</Text>
               <br />
               <Button
                  className={styles.signInButton}
                  onClick={() => signIn("google")}
               >
                  Sign in with Google
               </Button>
            </main>
         </div>
      )
   }
}
