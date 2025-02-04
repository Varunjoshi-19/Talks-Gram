import React, { useState, useEffect } from "react";
import styles from "../Styling/Login.module.css";
import { useNavigate } from "react-router-dom";
import { useUserAuthContext } from "../Context/UserContext"
 

interface Info {

    id: string,
    username: string,
    email: string

}




function Login() {
    const [text, setText] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
   



    const URL = 'http://localhost:3000/accounts/login';
    const navigate = useNavigate();
    const { dispatch }  = useUserAuthContext();

    useEffect(() => {

        if (text.includes("@gmail.com")) {
            setEmail(text);
        }
        else {
            setUsername(text);
        }


        function clearUi() {


            setTimeout(() => {

                setError(null);
                setMessage(null);
            }, 1500)
        }

        clearUi();

    }, [text, error, message]);


    async function handleOnLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const accountInfo = {
            username,
            email,
            password
        };

        const response = await fetch(URL, {

            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(accountInfo)

        });

        const result = await response.json();

        if (response.ok) {

            const info: Info = {
                id: result.UserData.id,
                username: result.UserData.username,
                email: result.UserData.email
            }

            localStorage.setItem("user-token", JSON.stringify(info));
            dispatch({ type : "set"  , payload : result.UserData});

            setError(null);
            setMessage(result.message);
            navigate("/");


        }
        if (!response.ok) {
            setMessage(null);
            setError(result.error);

        }


    }

    return (
        <>
            <div className={styles.container}>
                {/* Login Information */}
                <div className={styles.loginInfo}>
                    <h1 className={styles.logo}>TalksGram</h1>
                    <form onSubmit={handleOnLogin}>
                        <input
                            type="text"
                            placeholder="Phone number, username, or email"
                            className={styles.input}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className={styles.input}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit" className={styles.loginButton}>
                            Log in
                        </button>

                        {<div style={{ display: "flex", justifyContent: "center", color: "red" }}>{message || error}</div>}
                    </form>
                    <div className={styles.orDivider}>
                        <div className={styles.line}></div>
                        <span>OR</span>
                        <div className={styles.line}></div>
                    </div>
                    <button className={styles.facebookLogin}>
                        Log in with Facebook
                    </button>
                    <a href="/accounts/password/reset" className={styles.forgotPassword}>
                        Forgot password?
                    </a>
                </div>

                {/* No Account? Sign Up */}
                <div className={styles.noAccountSignUp}>
                    <p>
                        Don't have an account?{" "}
                        <a href="/accounts/signup" className={styles.signUpLink}>
                            Sign up
                        </a>
                    </p>
                </div>

                {/* Links to App Store and Play Store */}
                <div className={styles.linkToDownload}>
                    <p>Get the app.</p>
                    <div className={styles.downloadLinks}>
                        <img

                            alt="Download from App Store"
                        />
                        <img

                            alt="Download from Google Play"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <p>© 2024 TalksGram By Varun Joshi</p>
                </div>
            </div>
        </>
    );
}

export default Login;
