import React from "react";
import HeaderRes from "../components/HeaderRes";
import '../style/home.css'

class Home extends React.Component{
    render(){
        return(
            <>
            <HeaderRes />
            <div style={{ textAlign: "center", marginTop: "0px" }}>
                <img src="/assets/wbg.png" alt="Logo" style={{ width: "100%", height: "100%" }} />
            </div>
            </>
        )
    }
}

export default Home;