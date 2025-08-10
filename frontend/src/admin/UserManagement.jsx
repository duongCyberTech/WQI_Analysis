import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";

export default function UserManagement() {
    const [dataset, setDataset] = useState([]);
    const [toggle, setToggle] = useState(false);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:3002/users/users");
                setDataset(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }
        fetchUsers();
    }
    , [toggle]);
    const DateFormat = (dateString) => {
        const date = new Date(dateString);
    
        const padZero = (num) => String(num).padStart(2, '0');
    
        const hours = padZero(date.getHours());
        const minutes = padZero(date.getMinutes());
        const seconds = padZero(date.getSeconds());
    
        const day = padZero(date.getDate());
        const month = padZero(date.getMonth() + 1);
        const year = date.getFullYear();
    
        return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3002/users/users/${id}`);
            setDataset(dataset.filter(item => item.id !== id));
            setToggle(!toggle)
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    }

    const handleVerify = async (email, id) => {
        try {
            await axios.post(`http://localhost:3002/users/users/verify`, { email: email });
            setDataset(dataset.map(item => item.id === id ? { ...item, verified: true } : item));
            setToggle(!toggle)
        } catch (error) {
            alert("Error verifying user:", error);
        }
    }
    
    return (
        <>
            <Header />
            <div className="filter" style={{marginTop: "150px"}}>
                <h1 style={{alignItems: "center", fontSize: "40px", fontWeight: "bold", justifyItems: "center", justifyContent: "center", textAlign: "center"}}>User Management Center</h1>
                <style>
                    {`
                    input[type="date"] {
                        appearance: none;
                        -webkit-appearance: none;
                        -moz-appearance: none;

                        padding: 10px 15px;
                        font-size: 16px;
                        border: 1px solid #ccc;
                        border-radius: 8px;
                        background-color: #fff;
                        color: #333;

                        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                        transition: border-color 0.3s, box-shadow 0.3s;
                        height: 10px;
                        width: 115px;
                    }

                    input[type="date"]:hover {
                        border-color: #4CAF50;
                    }

                    input[type="date"]:focus {
                        border-color: #4CAF50;
                        outline: none;
                        box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
                    }

                    input[type="text"] {
                        appearance: none;
                        -webkit-appearance: none;
                        -moz-appearance: none;

                        padding: 10px 15px;
                        font-size: 16px;
                        border: 1px solid #ccc;
                        border-radius: 8px;
                        background-color: #fff;
                        color: #333;

                        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                        transition: border-color 0.3s, box-shadow 0.3s;
                        height: 10px;
                        width: 25px;
                    }

                    input[type="text"]:hover {
                        border-color: #4CAF50;
                    }

                    input[type="text"]:focus {
                        border-color: #4CAF50;
                        outline: none;
                        box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
                    }
                    `}
                </style>
            </div>        
            <div style={{marginTop: '30px', display: "flex", flexWWrap: "wrap", gap:"20px" }}>
                <div style={{width: "100%", height: "1000px", alignItems: "center", justifyContent: "center", display: "flex", flexDirection: "column"}}>
                    <table style={{borderCollapse: 'collapse', marginTop: "-200px" }}>
                        <thead>
                            <tr>
                                <th style={{border: '1px solid #ccc', padding: '8px', backgroundColor: '#f2f2f2',}}>STT</th>
                                <th style={{border: '1px solid #ccc', padding: '8px', backgroundColor: '#f2f2f2',}}>Email</th>
                                <th style={{border: '1px solid #ccc', padding: '8px', backgroundColor: '#f2f2f2',}}>Role</th>
                                <th style={{border: '1px solid #ccc', padding: '8px', backgroundColor: '#f2f2f2',}}>Verified</th>
                                <th style={{border: '1px solid #ccc', padding: '8px', backgroundColor: '#f2f2f2',}}>Create Time</th>
                                <th style={{border: '1px solid #ccc', padding: '8px', backgroundColor: '#f2f2f2',}}>Update Time</th>
                                <th style={{border: '1px solid #ccc', padding: '8px', backgroundColor: '#f2f2f2',}}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataset.map((item, id) => (
                                <tr key={id}>
                                    <td style={{border: '1px solid #ccc', padding: '8px', textAlign: 'center',}}>{item.id}</td>
                                    <td style={{border: '1px solid #ccc', padding: '8px', textAlign: 'center',}}>{item.email}</td>
                                    <td style={{border: '1px solid #ccc', padding: '8px', textAlign: 'center',}}>{item.role}</td>
                                    <td style={{border: '1px solid #ccc', padding: '8px', textAlign: 'center',}}>{item.verified}</td>
                                    <td style={{border: '1px solid #ccc', padding: '8px', textAlign: 'center',}}>{DateFormat(item.created_at)}</td>
                                    <td style={{border: '1px solid #ccc', padding: '8px', textAlign: 'center',}}>{DateFormat(item.updated_at)}</td>
                                    <td style={{border: '1px solid #ccc', padding: '8px', textAlign: 'center', display:"flex", flexWrap:"wrap", gap:"5px"}}>
                                        <button style={{backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer'}} onClick={() => handleVerify(item.email, item.id)}>Verify</button>
                                        <button style={{backgroundColor: '#f44336', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer'}} onClick={() => handleDelete(item.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

