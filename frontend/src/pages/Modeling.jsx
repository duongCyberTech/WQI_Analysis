import { useState, useEffect } from "react";
import axios from "axios";
import HeaderRes from "../components/HeaderRes";
import AIChatbot from "../components/AIChatbot";
import { useRef } from "react";
import '../style/model.css'
import { lstCol, dv } from "../utils/dataFeatures";
import StickyHeadTable from "../components/DataTable"

export default function Modeling() {

    const [placeNo, setPlaceNo] = useState("")
    const [temp, setTemp] = useState("")
    const [pH, setpH] = useState("")
    const [DO, setDO] = useState("")
    const [con, setCon] = useState("")
    const [alkan, setAlkan] = useState("")
    const [no2, setNO2] = useState("")
    const [po4, setPO4] = useState("")
    const [nh4, setNH4] = useState("")
    const [h2s, setH2S] = useState("")
    const [tss, setTSS] = useState("")
    const [cod, setCOD] = useState("")
    const [totalAe, setTotalAe] = useState("")
    const [edward, setEdward] = useState("Positive")
    const [aero, setAero] = useState("Positive")
    const [coliform, setColiform] = useState("")
    const [limitRecord, setLimitRecord] = useState(10);
    const [startIdx, setStartIdx] = useState(0);

    const colums = [
        {
            id: 'model',
            label: 'Model',
        },
        {
            id: 'value',
            label: 'Predicted Value',
            format: (value) => value.toFixed(2)
        },
        {
            id: 'rate',
            label: 'Water Quality Rate',
        },
        {
            id: 'recommend',
            label: 'Recommendation',
        }
    ]

    const [rows, setRows] = useState([])

    const handlePrediction = async () => {
        try {
            const params = {
                    place: { "location1": Number(placeNo) },
                    temperature: { "location1": Number(temp) },
                    pH: { "location1": Number(pH) },
                    DO: { "location1": Number(DO) },
                    conductivity: { "location1": Number(con) },
                    alkalinity: { "location1": Number(alkan) },
                    no2: { "location1": Number(no2) },
                    nh4: { "location1": Number(nh4) },
                    po4: { "location1": Number(po4) },
                    h2s: { "location1": Number(h2s) },
                    tss: { "location1": Number(tss) },
                    cod: { "location1": Number(cod) },
                    aeromonas_total: { "location1": Number(totalAe) },
                    edwardsiella_ictaluri: { "location1": Number(edward == "Positive" ? 1 : 0) },
                    aeromonas_hydrophila: { "location1": Number(aero == "Positive" ? 1 : 0) },
                    coliform: { "location1": Number(coliform) }
                }
            const xgb = await axios.post("http://localhost:8000/test",
                params,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            const params2 = {
                    temperature: { "location1": Number(temp) },
                    pH: { "location1": Number(pH) },
                    DO: { "location1": Number(DO) },
                    conductivity: { "location1": Number(con) },
                    alkalinity: { "location1": Number(alkan) },
                    no2: { "location1": Number(no2) },
                    nh4: { "location1": Number(nh4) },
                    po4: { "location1": Number(po4) },
                    h2s: { "location1": Number(h2s) },
                    tss: { "location1": Number(tss) },
                    cod: { "location1": Number(cod) },
                    aeromonas_total: { "location1": Number(totalAe) },
                    edwardsiella_ictaluri: { "location1": Number(edward == "Positive" ? 1 : 0) },
                    aeromonas_hydrophila: { "location1": Number(aero == "Positive" ? 1 : 0) },
                    coliform: { "location1": Number(coliform) }
                }
            const cb = await axios.post("http://localhost:8000/cb",
                params2,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            const et = await axios.post("http://localhost:8000/et",
                params2,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            const rf = await axios.post("http://localhost:8000/rf",
                params2,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            setRows([
                {
                    model: 'XGBoost',
                    value: xgb.data.prediction[0],
                    rate: xgb.data.prediction[0] < 26 ? "Rất tệ" : 
                    (xgb.data.prediction[0] < 51 ? "Kém" : 
                    (xgb.data.prediction[0] < 71 ? 
                    "Trung bình": 
                    (xgb.data.prediction[0] < 91? "Tốt" : "Rất tốt"))),
                    recommend: xgb.data.prediction[0] < 26 ? "Ô nhiễm nghiêm trọng, không dùng cho bất kỳ mục đích nào" :
                    (xgb.data.prediction[0] < 51 ? "Hạn chế sử dụng; cần xử lý trước khi dùng" :
                    (xgb.data.prediction[0] < 71 ? "Dùng cho tưới tiêu, giao thông thủy, sau xử lý có thể dùng cho sinh hoạt" :
                    (xgb.data.prediction[0] < 91 ? "Dùng cho cấp nước sinh hoạt sau xử lý đơn giản, nuôi trồng thủy sản" : "Có thể sử dụng cho sinh hoạt mà không cần xử lý nhiều"))),
                },
                {
                    model: 'CatBoost',
                    value: cb.data.prediction[0],
                    rate: cb.data.prediction[0] < 26 ? "Rất tệ" : 
                    (cb.data.prediction[0] < 51 ? "Kém" : 
                    (cb.data.prediction[0] < 71 ? "Trung bình": 
                    (cb.data.prediction[0] < 91 ? "Tốt" : "Rất tốt"))),
                    recommend: cb.data.prediction[0] < 26 ? "Ô nhiễm nghiêm trọng, không dùng cho bất kỳ mục đích nào" :
                    (cb.data.prediction[0] < 51 ? "Hạn chế sử dụng; cần xử lý trước khi dùng" :
                    (cb.data.prediction[0] < 71 ? "Dùng cho tưới tiêu, giao thông thủy, sau xử lý có thể dùng cho sinh hoạt" :
                    (cb.data.prediction[0] < 91 ? "Dùng cho cấp nước sinh hoạt sau xử lý đơn giản, nuôi trồng thủy sản" : "Có thể sử dụng cho sinh hoạt mà không cần xử lý nhiều"))),
                },
                {
                    model: 'Extra\u00a0Trees',
                    value: et.data.prediction[0],
                    rate: et.data.prediction[0] < 26 ? "Rất tệ" : 
                    (et.data.prediction[0] < 51 ? "Kém" : 
                    (et.data.prediction[0] < 71 ? 
                    "Trung bình": 
                    (et.data.prediction[0] < 91 ? "Tốt" : "Rất tốt"))),
                    recommend: et.data.prediction[0] < 26 ? "Ô nhiễm nghiêm trọng, không dùng cho bất kỳ mục đích nào" :
                    (et.data.prediction[0] < 51 ? "Hạn chế sử dụng; cần xử lý trước khi dùng" :
                    (et.data.prediction[0] < 71 ? "Dùng cho tưới tiêu, giao thông thủy, sau xử lý có thể dùng cho sinh hoạt" :
                    (et.data.prediction[0] < 91 ? "Dùng cho cấp nước sinh hoạt sau xử lý đơn giản, nuôi trồng thủy sản" : "Có thể sử dụng cho sinh hoạt mà không cần xử lý nhiều"))),
                },
                {
                    model: 'Random Forest',
                    value: rf.data.prediction[0],
                    rate: rf.data.prediction[0] < 26 ? "Rất tệ" : 
                    (rf.data.prediction[0] < 51 ? "Kém" : 
                    (rf.data.prediction[0] < 71 ? 
                    "Trung bình": 
                    (rf.data.prediction[0] < 91 ? "Tốt" : "Rất tốt"))),
                    recommend: rf.data.prediction[0] < 26 ? "Ô nhiễm nghiêm trọng, không dùng cho bất kỳ mục đích nào" :
                    (rf.data.prediction[0] < 51 ? "Hạn chế sử dụng; cần xử lý trước khi dùng" :
                    (rf.data.prediction[0] < 71 ? "Dùng cho tưới tiêu, giao thông thủy, sau xử lý có thể dùng cho sinh hoạt" :
                    (rf.data.prediction[0] < 91 ? "Dùng cho cấp nước sinh hoạt sau xử lý đơn giản, nuôi trồng thủy sản" : "Có thể sử dụng cho sinh hoạt mà không cần xử lý nhiều"))),
                }
            ])
        } catch (error) {
            console.error(error.response?.data || error.message);
            alert("Lỗi khi gọi API: " + error.message);
        }
    };
    
    const refA = useRef(null);
    const refB = useRef(null);

    useEffect(() => {
        if (refA.current && refB.current) {
        refB.current.style.height = `${refA.current.offsetHeight}px`;
        }
    }, []);

    return (
        <>
            <HeaderRes />   
            <style>{`
                .content{
                    background-image: url("/assets/nbg.png");
                }
            `} 
            </style>
            <div className="head-tag">
                <span></span>
                <h1><b>WQI PREDICTION</b></h1>
            </div>
            <div style={{marginTop: '30px', display: "flex", flexWWrap: "wrap", gap:"20px" }}>
            <div className="content">
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

                    input[type="number"] {
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
                        width: 40px;
                    }

                    input[type="number"]:hover {
                        border-color: #4CAF50;
                    }

                    input[type="number"]:focus {
                        border-color: #4CAF50;
                        outline: none;
                        box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
                    }
                    select {
                        padding: 10px 15px;
                        font-size: 16px;
                        border: 2px solid #ccc;
                        border-radius: 8px;
                        background-color: white;
                        color: #333;
                        outline: none;
                        transition: border-color 0.3s ease, box-shadow 0.3s ease;
                        box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
                    }

                    select:focus {
                        border-color: #4A90E2;
                        box-shadow: 0 0 5px rgba(74, 144, 226, 0.5);
                    }
                    `}
            </style>
                <div style={{display:"flex", gap: "20px", width: "100%", alignItems:"center"}} ref={refA}>
                    <div style={{overflowX: "scroll", scrollbarWidth: 'none',}}>
                    <div className="chart-mask" style={{ height: "auto", overflowX: "scroll", alignItems: "center", padding: "10px",scrollbarWidth: 'none',}}>
                        <div style={{
                            alignItems: "center", marginTop: "20px",
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr 1fr',
                            gap: '20px', overflowX:"scroll",
                            WebkitOverflowScrolling: 'hidden',
                            scrollbarWidth: 'none',
                        }}>
                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                <label style={{fontSize: "20px"}}>Place No:</label>
                                <input type="number" value={placeNo} onChange={(e) => setPlaceNo(e.target.value)} placeholder="Nhập mã vị trí" />
                            </div>
                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                <label style={{fontSize: "20px"}}>Temperature:</label>
                                <input type="number" value={temp} onChange={(e) => setTemp(e.target.value)} placeholder="Nhập nhiệt độ" />
                                <span>({dv[lstCol.indexOf("temperature")]})</span>
                            </div>
                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                <label style={{fontSize: "20px"}}>pH:</label>
                                <input type="number" value={pH} onChange={(e) => setpH(e.target.value)} placeholder="Nhập pH" />
                            </div>
                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                <label style={{ fontSize: "20px" }}>Coliform:</label>
                                <input
                                type="number"
                                value={coliform}
                                onChange={(e) => setColiform(e.target.value)}
                                placeholder="Nhập Coliform"
                                />
                                <span>({dv[lstCol.indexOf("coliform")]})</span>
                            </div>
                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                <label style={{ fontSize: "20px" }}>DO:</label>
                                <input
                                type="number"
                                value={DO}
                                onChange={(e) => setDO(e.target.value)}
                                placeholder="Nhập DO"
                                />
                                <span>({dv[lstCol.indexOf("DO")]})</span>
                            </div>

                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                <label style={{ fontSize: "20px" }}>Conductivity:</label>
                                <input
                                type="number"
                                value={con}
                                onChange={(e) => setCon(e.target.value)}
                                placeholder="Nhập độ dẫn điện"
                                />
                                <span>({dv[lstCol.indexOf("conductivity")]})</span>
                            </div>

                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                <label style={{ fontSize: "20px" }}>Alkalinity:</label>
                                <input
                                type="number"
                                value={alkan}
                                onChange={(e) => setAlkan(e.target.value)}
                                placeholder="Nhập độ kiềm"
                                />
                                <span>({dv[lstCol.indexOf("alkalinity")]})</span>
                            </div>

                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                <label style={{ fontSize: "20px" }}>Aeromonas Hydrophila:</label>
                                <select
                                value={aero}
                                onChange={(e) => setAero(e.target.value)}
                                style={{ fontSize: "16px", padding: "5px" }}
                                >
                                <option value="Positive">Positive</option>
                                <option value="Negative">Negative</option>
                                </select>
                            </div>
                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                <label style={{ fontSize: "20px" }}>NO₂:</label>
                                <input
                                type="number"
                                value={no2}
                                onChange={(e) => setNO2(e.target.value)}
                                placeholder="Nhập NO2"
                                />
                                <span>({dv[lstCol.indexOf("no2")]})</span>
                            </div>

                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                <label style={{ fontSize: "20px" }}>NH₄:</label>
                                <input
                                type="number"
                                value={nh4}
                                onChange={(e) => setNH4(e.target.value)}
                                placeholder="Nhập NH4"
                                />
                                <span>({dv[lstCol.indexOf("nh4")]})</span>
                            </div>

                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                <label style={{ fontSize: "20px" }}>PO₄:</label>
                                <input
                                type="number"
                                value={po4}
                                onChange={(e) => setPO4(e.target.value)}
                                placeholder="Nhập PO4"
                                />
                                <span>({dv[lstCol.indexOf("po4")]})</span>
                            </div>

                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                <label style={{ fontSize: "20px" }}>Edwardsiella Ictaluri:</label>
                                <select
                                value={edward}
                                onChange={(e) => setEdward(e.target.value)}
                                style={{ fontSize: "16px", padding: "5px" }}
                                >
                                <option value="Positive">Positive</option>
                                <option value="Negative">Negative</option>
                                </select>
                            </div>
                                                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                <label style={{ fontSize: "20px" }}>H₂S:</label>
                                <input
                                type="number"
                                value={h2s}
                                onChange={(e) => setH2S(e.target.value)}
                                placeholder="Nhập H2S"
                                />
                                <span>({dv[lstCol.indexOf("h2s")]})</span>
                            </div>

                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                <label style={{ fontSize: "20px" }}>TSS:</label>
                                <input
                                type="number"
                                value={tss}
                                onChange={(e) => setTSS(e.target.value)}
                                placeholder="Nhập TSS"
                                />
                                <span>({dv[lstCol.indexOf("tss")]})</span>
                            </div>

                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                <label style={{ fontSize: "20px" }}>COD:</label>
                                <input
                                type="number"
                                value={cod}
                                onChange={(e) => setCOD(e.target.value)}
                                placeholder="Nhập COD"
                                />
                                <span>({dv[lstCol.indexOf("cod")]})</span>
                            </div>

                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                <label style={{ fontSize: "20px" }}>Aeromonas Total:</label>
                                <input
                                type="number"
                                value={totalAe}
                                onChange={(e) => setTotalAe(e.target.value)}
                                placeholder="Nhập Aeromonas Total"
                                />
                                <span>({dv[lstCol.indexOf("aeromonas_total")]})</span>
                            </div>
                            </div>
                        <div style={{
                            alignItems: "center", marginTop: "20px",
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr 1fr',
                            gap: '20px', overflowX:"scroll",
                            WebkitOverflowScrolling: 'hidden',
                            scrollbarWidth: 'none',
                        }}>

                        </div>
                        <div style={{
                            alignItems: "center", marginTop: "20px",
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr 1fr',
                            gap: '20px', overflowX:"scroll",
                            WebkitOverflowScrolling: 'hidden',
                            scrollbarWidth: 'none',
                        }}>

                        </div>
                        <div style={{
                            alignItems: "center", marginTop: "20px",
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr 1fr',
                            gap: '20px', overflowX:"scroll",
                            WebkitOverflowScrolling: 'hidden',
                            scrollbarWidth: 'none',
                        }}>

                        </div>
                    </div>
                    </div>

                    <div style={{width: "4px", height: "140px", backgroundColor: "#ccc"}} ref={refB}></div>
                    <div ref={refB}>
                        <StickyHeadTable rows = {rows} columns={colums} page={startIdx} setPage={setStartIdx} rowsPerPage={limitRecord} setRowsPerPage={setLimitRecord} />
                    </div>
                    <style>
                    {`
                        .btn {
                            display: flex;               
                            align-items: center;        
                            justify-content: center;     
                            width: 160px;
                            height: 40px;
                            border: 2px solid #040403;
                            border-radius: 10px;
                            background-color: #C0C0C0;
                            color: #040403;
                            font-size: 18px;
                            font-weight: bold;
                            margin-top: 30px;
                        }
                        .btn:hover {
                            background-color: #40AAB9;
                            color: #F2E394;
                            cursor: pointer;
                        }
                    `}
                </style>
                </div>

            <div className="btn" onClick={() => handlePrediction()}>Generating Model</div>
            <AIChatbot />
            </div>
            </div>
            
        </>
    );
}
