import { useState } from "react"
import HeaderRes from "../components/HeaderRes"
import axios from "axios"
import '../style/pass.css'

export default function ChangePassword(){
    const [oldPass, setOld] = useState("")
    const [newPass, setNew] = useState("")
    const [conPass, setCon] = useState("")
    const handleChangePassword = async() => {
        //alert(JSON.parse(localStorage.getItem("user")).email);
        if (newPass !== conPass){
            alert("Xác thực mật khẩu mới không chính xác")
            return;
        }

        if (newPass === "" || oldPass === "" || conPass === ""){
            alert("Vui lòng nhập đây đủ thông tin")
            return;
        }
        try {
            const res = await axios.post("http://localhost:3001/auth/change-password",{
                params:{
                    email: JSON.parse(localStorage.getItem("user")).email,
                    oldPassword: oldPass,
                    newPassword: newPass,
                }
            })
            alert("Đổi mật khẩu thành công")
        } catch (error) {
            alert("Đổi mật khẩu thất bại")
        }
    }


    return(
        <>
        <style>
            {`
                .change-password-form{
                    background-image: url("/assets/nbg.png);
                }
            `}
        </style>
        <HeaderRes />
        <div className="change-password-form">
            <label htmlFor="old">Mật khẩu hiện tại</label>
            <input required type="password" id="old" value={oldPass} onChange={(e) => setOld(e.target.value)} />

            <label htmlFor="new">Mật khẩu mới</label>
            <input required type="password" id="new" value={newPass} onChange={(e) => setNew(e.target.value)} />

            <label htmlFor="con">Xác nhận mật khẩu mới</label>
            <input required type="password" id="con" value={conPass} onChange={(e) => setCon(e.target.value)} />

            <button onClick={handleChangePassword}>Lưu thay đổi</button>
        </div>
        </>
    )
}