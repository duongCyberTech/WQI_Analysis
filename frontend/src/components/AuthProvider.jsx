import { useContext, createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export default function AuthProvider({children}) {
    // const [isLogged, setIsLogged] = useState(false);
    // useState(() => {
    //     const check = localStorage.getItem("isLogged");
    //     if(check == "true") {
    //         setIsLogged(true);
    //     }
    // })
    // function login() {
    //     setIsLogged(true);
    // }
    // function logout(username) {
    //     if(username) {
    //         axios.post("https://localhost:5000/logout", {username})
    //             .then((result) => {
    //                 if(result.status == 200) {
    //                     console.log("Logout success");
    //                 } else {
    //                     console.log(result.data("message"));
    //                 }
    //             })
    //     }
    //     setIsLogged(false);
    // }
    const [user, setUser] = useState(null); 

    return <AuthContext.Provider value={user} >{children}</AuthContext.Provider>
}

export const useAuth = () => {
    return useContext(AuthContext);
}