import { useState, useEffect, React } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../style/header.css'
import {
    AccountCircle, Home, AutoGraph, 
    CodeTwoTone, Report, ManageAccountsTwoTone, LogoutTwoTone
} from '@mui/icons-material';


export default function HeaderRes() {
    const navigate = useNavigate();
    const [user, setUser] = useState(localStorage.getItem("user") !== "undefined" ? JSON.parse(localStorage.getItem("user")) : null);
    const [showSidebar, setShowSidebar] = useState(false);
    const [bar, setBar] = useState(false)
    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const Logout =() =>{
        localStorage.removeItem("user");
        setUser(null)
    }

    const toggleDropDown = () =>{
        setBar(!bar)
    }   
    return(user == null?
        <>
        <header className="header">
            <h1 onClick={() => navigate("/home")}><img src="/assets/plogo.png" style={{ width: "30px", height: "30px", marginRight: "10px", marginTop: "-4px" }} />WQR LAB</h1>
            <div className="sidebar-toggle" onClick={toggleSidebar}>☰</div>
            <nav className="navbar">
                <a href="/home">Home</a>
                <a href="/">Dashboard</a>
                <a href="/">AI Model</a>
                <a href="/">Report</a>
                <a href="/">Login</a>
            </nav>
        </header>

        {showSidebar && (
            <div className="sidebar">
                <a href="/home" onClick={toggleSidebar}>Home</a>
                <a href="/" onClick={toggleSidebar}>Dashboard</a>
                <a href="/" onClick={toggleSidebar}>AI Model</a>
                <a href="/" onClick={toggleSidebar}>Report</a>
                <a href="/" onClick={toggleSidebar}>Login</a>
            </div>
        )}
        </>:(user.role == "admin" ?(
            <>
            <header className="header">
                <h1 onClick={() => navigate("/home")}><img src="/assets/plogo.png" style={{ width: "30px", height: "30px", marginRight: "10px", marginTop: "-4px" }} />WQR LAB</h1>
                <div className="sidebar-toggle" onClick={toggleSidebar}>☰</div>
                <nav className="navbar">
                    <a href="/home">Home</a>
                    <a href="/dashboard">Dashboard</a>
                    <a href="/model">AI Model</a>
                    <a href="/report">Report</a>
                    <a href="/admin/user-management">Users Management</a>
                </nav>
            </header>

            {showSidebar && (
                <div className="sidebar">
                    <a href="/home" onClick={toggleSidebar}>Home</a>
                    <a href="/dashboard" onClick={toggleSidebar}>Dashboard</a>
                    <a href="/model" onClick={toggleSidebar}>AI Model</a>
                    <a href="/report" onClick={toggleSidebar}>Report</a>
                    <a href="/admin/user-management">Users Management</a>
                </div>
            )}
            </>
        ):(
        <>
        <header className="header">
            <h1 onClick={() => navigate("/home")}>
                <div className="sidebar-toggle" onClick={toggleSidebar}>☰</div>
                <img src="/assets/plogo.png" style={{ width: "30px", height: "30px" }} />
                WQR LAB
            </h1>
            <nav className="navbar">
                <a href="/home">Home</a>
                <a href="/dashboard">Dashboard</a>
                <a href="/model">AI Model</a>
                <a href="/report">Report</a>
                <a href="#" onClick={(e) => {e.preventDefault(); toggleDropDown()}}>Account</a>
            </nav>
            {bar ? 
                (
                <nav className="side-nav">
                    <a href="/pass">Đổi mật khẩu</a>
                    <br />
                    <a href="#" onClick={(e) => {e.preventDefault(); Logout() ;navigate("/home")}}>Đăng xuất</a>
                </nav>
                ):null
            }
        </header>
        {showSidebar && (
            <>
            <div className="sidebar">
                <div style={{alignItems: "center", display: "flex", gap: "0px"}}>
                    <AccountCircle sx={{fontSize: 30, color: '#fff'}} /> 
                    <a href="#" onClick={(e) => {e.preventDefault(); toggleDropDown()}}>Account</a>                
                </div>
                <div style={{alignItems: "center", display: "flex", gap: "0px"}}>
                    <Home sx={{fontSize: 30, color: '#fff'}} /> 
                    <a href="/home" onClick={toggleSidebar}>Home</a>             
                </div>
                <div style={{alignItems: "center", display: "flex", gap: "0px"}}>
                    <AutoGraph sx={{fontSize: 30, color: '#fff'}} /> 
                    <a href="/dashboard" onClick={toggleSidebar}>Dashboard</a>             
                </div>
                <div style={{alignItems: "center", display: "flex", gap: "0px"}}>
                    <CodeTwoTone sx={{fontSize: 30, color: '#fff'}} /> 
                    <a href="/model" onClick={toggleSidebar}>AI Model</a>             
                </div>
                <div style={{alignItems: "center", display: "flex", gap: "0px"}}>
                    <Report sx={{fontSize: 30, color: '#fff'}} /> 
                    <a href="/report" onClick={toggleSidebar}>Report</a>             
                </div>
                <div style={{alignItems: "center", display: "flex", gap: "0px"}}>
                    <LogoutTwoTone sx={{fontSize: 30, color: '#fff'}} /> 
                    <a href="#" onClick={(e) => {e.preventDefault(); Logout() ;navigate("/home")}}>Đăng xuất</a>             
                </div>
            </div>
            </>
            
        )}
        </>
        ))
        
    )
}