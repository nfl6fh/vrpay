import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import { signIn, signOut, useSession } from "next-auth/react"
import { userInfo } from "os"
import { Router } from "next/router"
import Loading from "../components/Loading";

export default function Home() {
   const { data: session, status } = useSession()

   if (status === "loading") {
      return <Loading />;
   }

   if (session) {
      // user is logged in
      // check if user is treasurer or admin
      //    if true, show dashboard
      //    if false, show user page
      return (
         <div>
            <p>User Page</p>
            <a
               href={`/api/auth/signout`}
               onClick={(e) => {
                  e.preventDefault()
                  signOut({
                     callbackUrl: `${window.location.origin}`,
                  })
               }}
            >
               Sign Out
            </a>
         </div>
      )
   } else {
      // user is not logged in
      return (
         <div>
            <p>Homepage (Sign in page)</p>
            <button onClick={() => signIn("google")}>Sign in</button>
         </div>
      )
   }
}
