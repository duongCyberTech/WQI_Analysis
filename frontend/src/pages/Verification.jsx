import { useState  } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
function Verification() {
        const location = useLocation();
        const email = location.state.email;
        const [code, setCode] = useState("");
        const navigate = useNavigate();
        const onSubmit = async(e) => {
            e.preventDefault();
            try {
                const response = await axios.post('http://localhost:3001/auth/verify', {
                    email,
                    code
                });
                console.log("Xác thực thành công:", response.data);
                navigate("/home");
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
                    <h2>Xác thực tài khoản</h2>
                    <form>

                    <label htmlFor="code">Mã xác thực</label>
                    <input
                        type="text"
                        id="code"
                        placeholder="Mã xác thực"
                        required
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <button type="submit" onClick={(e)=>onSubmit(e)}>Xác thực</button>
                    </form>
                </div>
                </div>
            </> 
        );
}

export default Verification;