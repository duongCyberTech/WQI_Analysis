import { useState  } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function Register() {
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [confirmPassword, setConfirmPassword] = useState("");
        const navigate = useNavigate();
        const onSubmit = async(e) => {
            e.preventDefault();
            if (password !== confirmPassword) {
                alert("Mật khẩu không khớp!");
                return;
            }
            try {
                const response = await axios.post('http://localhost:3001/auth/register', {
                    email,
                    password
                });
        
                console.log("Đăng ký thành công:", response.data);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                console.log("User data saved to localStorage:", response.data.user);
                navigate("/verify", { state: { email } });
            } catch (err) {
                console.error("Error:", err);
                if (err.response) {
                    alert(err.response.data.message || "Đăng ký thất bại!");
                } else {
                    alert("Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại sau.");
                }
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
                    <h2>Đăng ký</h2>
                    <form>
                    <label htmlFor="username">Email</label>
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
                    <label htmlFor="confirm-password">Xác nhận mật khẩu</label>
                    <input
                        type="password"
                        id="confirm-password"
                        placeholder="Xác nhận mật khẩu"
                        required
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button type="submit" onClick={(e)=>onSubmit(e)}>Đăng ký</button>
                    </form>
                </div>
                </div>
            </> 
        );
}

export default Register;