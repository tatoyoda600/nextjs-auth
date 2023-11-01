import { useRef, useState } from 'react';
import classes from './auth-form.module.css';
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const emailInput = useRef();
  const passwordInput = useRef()
  const router = useRouter();

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  function submitHandler(event) {
    event.preventDefault();
    const email = emailInput.current.value
    const password = passwordInput.current.value

    if (isLogin) {
      signIn("credentials", { 
        redirect: false,
        email: email,
        password: password
      })
        .then((res) => {
          if (res.ok) {
            router.replace("/");
          }
          else {
            throw new Error(res.error || "Something went wrong!"); // May throw "Illegal arguments: string, object" if the password is wrong
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    else {
      fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          else {
            return res.json().then((data) => {
              throw new Error(data.message || "Something went wrong!");
            });
          }
        })
        .then((data) => {
          console.log(data);
          signIn("credentials", { 
            redirect: false,
            email: email,
            password: password
          })
            .then((res) => {
              if (res.ok) {
                router.replace("/");
              }
              else {
                throw new Error(res.error || "Something went wrong!"); // May throw "Illegal arguments: string, object" if the password is wrong
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInput} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInput} />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
