import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

class AdminHome extends React.Component{
    render(){
        return(
            <>
            <style>
                {`
                body {
                    background-color: #f0f0f0;
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-image: url('https://www.labnetinternational.com/sites/www.labnetinternational.com/files/blogsies/header-images/iStock-949946968.jpg');
                }
                h1 {
                    text-align: center;
                    margin-top: 20px;
                    font-size: 40px;
                    color: white;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
                }
                `}
            </style>
            <Header />
            <div style={{ textAlign: "center", marginTop: "190px" }}>
                <h1>WELCOME TO WATER RESEARCHING LABORATORY</h1>
            </div>
            </>
        )
    }
}

export default AdminHome;