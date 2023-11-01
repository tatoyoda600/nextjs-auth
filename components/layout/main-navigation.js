import Link from 'next/link';
import { useSession, signOut } from "next-auth/react"

import classes from './main-navigation.module.css';

function MainNavigation() {
  const { data: session, status } = useSession();

  function logout() {
    signOut();
  }

  return (
    <header className={classes.header}>
      <Link href="/">
        <div className={classes.logo}>Next Auth</div>
      </Link>
      <nav>
        <ul>
          { (status !== "authenticated" || !session) && (
            <li>
              <Link href="/auth">Login</Link>
            </li>
          )}
          { status === "authenticated" && session && (
            <li>
              <Link href="/profile">Profile</Link>
            </li>
          )}
          { status === "authenticated" && session && (
            <li>
              <button onClick={logout}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
