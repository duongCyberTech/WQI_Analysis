import {useState  } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";

function decodeJwtPayload(token) {
    // Tách token thành 3 phần
    const parts = token.split('.');
    if (parts.length !== 3) {
        throw new Error('Invalid JWT token');
    }

    const payload = parts[1];

    // Thêm padding nếu thiếu
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');

    // Decode base64 -> JSON string -> Object
    const decoded = atob(padded);
    return JSON.parse(decoded);
}

function Login() {
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const navigate = useNavigate();
        const onSubmit = async(e) => {
            e.preventDefault();
            const data = { email, password };
            const response = await fetch("http://localhost:3001/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (response.ok) {
                console.log("Login successful:", result);
                const user = decodeJwtPayload(result.token);
                console.log("Decoded user data:", user);
                localStorage.setItem("user", JSON.stringify(user));
                console.log("User data saved to localStorage:", user);
                if (user.role === "admin") {
                    navigate("/admin");
                } else if (user.role === "user") {
                    navigate("/home");
                }
            } else {
                console.error("Login failed:", result.message);
                alert(result.message);
            }
        }
        return (
            <>
            <style>
                {`
                    body {
                        margin: 0;
                        padding: 0;
                        font-family: Arial, sans-serif;
                        background-image: url("/assets/nbg.png");
                        height: 100vh;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    
                    .login-container {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 100%;
                    }
                    
                    .login-box {
                        background-color: white;
                        padding: 40px 30px;
                        border-radius: 20px;
                        box-shadow: 0 0 10px rgba(0,0,0,0.2);
                        width: 300px;
                    }
                    
                    .login-box h2 {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    
                    .login-box form {
                        display: flex;
                        flex-direction: column;
                    }
                    
                    .login-box input[type="text"],
                    .login-box input[type="password"] {
                        padding: 10px;
                        margin-bottom: 15px;
                        border: 2px solid #333;
                        border-radius: 5px;
                    }
                    
                    .checkbox-remember {
                        display: flex;
                        align-items: center;
                        margin-bottom: 15px;
                    }
                    
                    .checkbox-remember input {
                        margin-right: 8px;
                    }
                    
                    .login-box button {
                        padding: 10px;
                        background-color: black;
                        color: white;
                        border: none;
                        border-radius: 7px;
                        cursor: pointer;
                        font-weight: bold;
                        margin-bottom: 10px;
                    }
                    
                    .login-box .forgot-password {
                        text-align: center;
                        font-size: 0.9em;
                        color: black;
                        text-decoration: none;
                    }
                    .reg{
                        margin-top: 10px;
                        text-align: center;
                        font-size: 0.9em;
                        color: black;
                        text-decoration: none;
                    }
                    .reg a{
                        margin-top: 10px;
                        color: black;
                        font-weight: bold;
                    }
                `}
            </style>
            <div className="login-container">
                <div className="login-box">
                    <h2>Đăng nhập</h2>
                    <form>
                    <label htmlFor="username">Email/Tên đăng nhập</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Email/Tên đăng nhập"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label htmlFor="password">Mật khẩu</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Mật khẩu"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" onClick={(e)=>onSubmit(e)}>Đăng nhập</button>
                    <a href="#" className="forgot-password">Quên mật khẩu?</a>
                    </form>
                    <div className="reg">Bạn chưa có tài khoản? <a href="/register">Đăng ký</a></div>
                </div>
                </div>
            </> 
        );
}

export default Login;