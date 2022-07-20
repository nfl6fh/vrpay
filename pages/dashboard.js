import { useSession } from "next-auth/react";
import { prisma } from "../lib/prisma.js";
import styles from "../styles/Admin.module.css";
import Loading from "../components/Loading";
import { useState } from "react";

export const getServerSideProps = async () => {
  var users = await prisma.user.findMany({ where: { is_verified: false } });

  users.map((user) => {
    if (user.createdAt !== null) {
      user.createdAt = user.createdAt.toString();
    }
    if (user.updatedAt !== null) {
      user.updatedAt = user.updatedAt.toString();
    }
  });

  users = users?.sort((a, b) => a.createdAt.localeCompare(b.grad_year));

  return { props: { users } };
};

export default function Admin(props) {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  if (status === "loading") {
    return <Loading />;
  }

  function isValidGradYear(grad_year) {
    if (grad_year && grad_year.match(/^[12][0-9]{3}$/)) {
      return true;
    }
    return false;
  }

  function getDateFormatting(isoDate) {
    var date = new Date(isoDate);
    var year = date.getFullYear();
    var day = date.getDate();
    var month = date.getMonth() + 1;

    return month + "/" + day + "/" + year;
  }

  const verifyUser = async (user_id) => {
    const body = { user_id }

    try {
      console.log(user_id)
      setIsLoading(true);
      setSuccess(false);
      setError(false);
      await fetch("/api/verify_user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setIsLoading(false);
      setSuccess(true);
      setError(false);
    } catch (error) {
      console.error(error);
      setError(true);
      setSuccess(false);
      setIsLoading(false);
    }
  }

  if (session?.is_verified && session.role == "admin") {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Admin</h1>
        <div className={styles.unverifiedUsersContainer}>
          <h2 className={styles.sectionHeading}>Unverified Users</h2>
          {isLoading && <div>Working...</div>}
          {success && <div>Successfully verified</div>}
          {error && <div>Error while verifying</div>}
          {!error && !success && !isLoading && <div>Status</div>}
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th className={styles.createdSection}>Created</th>
                <th className={styles.verifySection}></th>
              </tr>
            </thead>
            <tbody>
              {props.users.map((user) => (
                <tr>
                  <td>
                    <div className={styles.nameSection}>
                      <p className={styles.tableName}>
                        {user.name && user.name !== ""
                          ? user.name +
                            (isValidGradYear(user.grad_year)
                              ? " ('" + user.grad_year.slice(-2) + ")"
                              : "")
                          : "None"}
                      </p>
                    </div>
                  </td>
                  <td>{getDateFormatting(user.createdAt)}</td>
                  <td className={styles.verifyTD}>
                    {user.is_verified ? <p>Verified</p> : <p onClick={() => verifyUser(user.id)} className={styles.verifyButton}>Verify</p>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  } else {
    return <Loading />;
  }
}