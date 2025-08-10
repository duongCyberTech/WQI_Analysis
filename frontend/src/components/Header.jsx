import { useState, useEffect, React } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Header() {
    const navigate = useNavigate();
    const [user, setUser] = useState(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null);

    return(user == null?
        <>
        <style>
            {`
            header {
                background-color: #333;
                color: white;
                display: inline-flex;
                width: 100%;
                height: 80px;
                align-items: center;
                position: fixed;
                margin: 0;
                margin-top: -20px;
                margin-left: -10px;
                padding: 10px 20px;
                z-index: 1000;
            }
            .header h1 {
                font-size: 24px;
                margin-right: 0px;
            }
            .navbar {
                display: flex;
                width: 80%;
                padding: 20px;
            }
            .navbar a {
                color: white;
                text-decoration: none;
                padding: 14px 20px;
                text-align: center;
                flex-grow: 1;
                font-size: 20px;
            }
            .navbar a:hover {
                background-color: #575757;
                color: white;
            }
            `}
        </style>
        <header className="header">
            <h1>WQR LAB</h1>
            <nav className="navbar">
                <a href="/home">Home</a>
                <a href="/dashboard">Dashboard</a>
                <a href="/model">AI Model</a>
                <a href="/report">Report</a>
                <a href="/login">Login</a>
            </nav>
        </header>
        </>:(user.role == "admin" ?(
            <>
            <style>
                {`
                header {
                    background-color: #333;
                    color: white;
                    display: inline-flex;
                    width: 100%;
                    height: 80px;
                    align-items: center;
                    position: fixed;
                    top: 0;              /* thêm top: 0 để ghim lên đầu */
                    left: 0;             /* thêm left: 0 để không lệch */
                    padding: 10px 20px;
                    z-index: 1000;
                }
    
                .header h1 {
                    font-size: 24px;
                    margin-right: 0px;
                }
                .navbar {
                    display: flex;
                    width: 80%;
                    padding: 20px;
                }
                .navbar a {
                    color: white;
                    text-decoration: none;
                    padding: 14px 20px;
                    text-align: center;
                    flex-grow: 1;
                    font-size: 20px;
                    width: 80%;
                }
                .navbar a:hover {
                    background-color: #575757;
                    color: white;
                }
                `}
            </style>
            <header className="header">
                <h1>WQR LAB</h1>
                <nav className="navbar">
                    <a href="/home">Home</a>
                    <a href="/dashboard">Dashboard</a>
                    <a href="/model">AI Model</a>
                    <a href="/report">Report</a>
                    <a href="/admin/user-management">User's Manager</a>
                    <div>{user.uid}</div>
                </nav>
            </header>
            </>
        ):(
            <>
        <style>
            {`
            header {
                background-color: #333;
                color: white;
                display: inline-flex;
                width: 100%;
                height: 80px;
                align-items: center;
                position: fixed;
                top: 0;              /* thêm top: 0 để ghim lên đầu */
                left: 0;             /* thêm left: 0 để không lệch */
                padding: 10px 20px;
                z-index: 1000;
            }

            .header h1 {
                font-size: 24px;
                margin-right: 0px;
            }
            .navbar {
                display: flex;
                width: 80%;
                padding: 20px;
            }
            .navbar a {
                color: white;
                text-decoration: none;
                padding: 14px 20px;
                text-align: center;
                flex-grow: 1;
                font-size: 20px;
                width: 80%;
            }
            .navbar a:hover {
                background-color: #575757;
                color: white;
            }
            `}
        </style>
        <header className="header">
            <h1 onClick={()=>navigate("/home")} style={{display: "flex", gap: "10px", cursor: "pointer"}}><img src="/assets/plogo.png" style={{width: "30px", height: "30px", marginTop: "-2px"}}/>WQR LAB</h1>
            <nav className="navbar">
                <a href="/home">Home</a>
                <a href="/dashboard">Dashboard</a>
                <a href="/model">AI Model</a>
                <a href="/report">Report</a>
                <a href="#" style={{color: "white"}}>Thông tin cá nhân</a>
            </nav>
        </header>
        </>
        ))
        
    )
}