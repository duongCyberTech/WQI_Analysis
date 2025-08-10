import React from "react";
import axios from "axios";
import HeaderRes from "../components/HeaderRes";
import { useState, useEffect } from "react";
import AIChatbot from "../components/AIChatbot";  
import { MeasurementLineChart, MyBarChart } from "../components/Chart";
import '../style/dashboard.css'
import { ClusterByBinaryFeature, ClusterByNumbericFeature } from "../utils/clusterData";
import {IndentifyDistrict, IdentifyProvince} from '../utils/identifyPlace'
import { lstCol, dv } from "../utils/dataFeatures";
import { Mean, Median, Variance } from "../utils/calculations";
import {useLocation} from "react-router-dom";

function Detail() {
        const location = useLocation();
        const [province, setProvince] = useState(location?.state?.province || "");
        const [filterProvinces, setFilterProvinces] = useState([]);
        const [district, setDistrict] = useState(location?.state?.district || "");
        const [filterDistricts, setFilterDistricts] = useState([]);
        const [Ob_point, setObPoint] = useState(location?.state?.Ob_point || "");
        const [filterObPoints, setFilterObPoints] = useState([]);
        const [wqiData, setWqiData] = useState([]);
        const [col, setCol] = useState("wqi");
        const [toggle, setToggle] = useState(false)

        useEffect(() => {
            const fetchMap = async () => {
                try {
                    const response = await axios.get("http://localhost:3002/analysis/map");
                    const data = response.data;
                    console.log(data.provinces);
                    console.log(data.districts);
                    console.log(data.ob_places);
                    setFilterProvinces(data.provinces);
                    setFilterDistricts(data.districts);
                    setFilterObPoints(data.ob_places);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };
            const fetchData = async () => {
                await fetchMap();
            }
            fetchData(); // Gọi hàm fetchData ngay lập tức
            const interval = setInterval(fetchData, 10000);

            // Cleanup khi component unmount
            return () => clearInterval(interval);
        }, [toggle]);


        useEffect(()=>{
            const fetchData = async() => {
                try {
                    const res = await axios.get("http://localhost:3002/analysis/feature",{
                        params: {
                            province: province,
                            district: district,
                            ob_place: Ob_point
                        }
                    })
                    setWqiData(res.data.observation)
                } catch (error) {
                    alert(error.message)
                }
            }
            fetchData();
        },[toggle])


        return (1  ? (
            <>
            <style>{`
                .content{
                    background-image: url("/assets/nbg.png");
                }
            `}</style>
            <HeaderRes />
            <div className="dashboard-container" >
                <div className="dashboard-content">
                    <div className="head-tag">
                        <span></span>
                        <h1><b>WATER QUALITY OVERVIEW</b></h1>
                    </div>
                    <div className="content">
                        <div className="sort-bar" style={{display: "flex", flexWrap: "wrap", gap: "20px", justifyItems:"center"}}>
                            <div className="province" style={{ padding: "8px", boxSizing: "border-box", borderRadius: "5px", border: "1px solid #ccc" }}>
                                <input
                                    type="text"
                                    value={province}
                                    onChange={(e) => setProvince(e.target.value)}
                                    list="province-options"  // <-- Phần này bị thiếu
                                    style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                                    placeholder="Nhập tên tỉnh..."
                                />
                                <datalist id="province-options">
                                    {filterProvinces
                                    .filter(item =>
                                        item.pname.toLowerCase().includes(province.toLowerCase())
                                    )
                                    .map((option, index) => (
                                        <option key={index} value={option.pname} />
                                    ))}
                                </datalist>
                            </div>
                            <div className="district" style={{ padding: "8px", boxSizing: "border-box", borderRadius: "5px", border: "1px solid #ccc" }}>    
                                <input
                                    type="text"
                                    value={district}
                                    onChange={(e) => setDistrict(e.target.value)}
                                    list="district-options"  // <-- Phần này bị thiếu
                                    style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                                    placeholder="Nhập tên huyện..."
                                />
                                <datalist id="district-options">
                                    {filterDistricts
                                    .filter(item => 
                                        item.pid === IdentifyProvince(province, filterProvinces) // Lọc theo tỉnh
                                    )
                                    .filter(item =>
                                        item.dname.toLowerCase().includes(district.toLowerCase())
                                    )
                                    .map((option, index) => (
                                        <option key={index} value={option.dname} />
                                    ))}
                                </datalist>
                            </div>
                            <div className="obPlace" style={{ padding: "8px", boxSizing: "border-box", borderRadius: "5px", border: "1px solid #ccc" }}>
                                <input
                                    type="text"
                                    value={Ob_point}
                                    onChange={(e) => setObPoint(e.target.value)}
                                    list="obplace-options"  // <-- Phần này bị thiếu
                                    style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                                    placeholder="Nhập tên địa điểm..."
                                />
                                <datalist id="obplace-options">
                                    {filterObPoints
                                    .filter(item => 
                                        item.wid === IndentifyDistrict(district, filterDistricts) // Lọc theo huyện
                                    )
                                    .filter(item =>
                                        item.opname.toLowerCase().includes(Ob_point.toLowerCase())
                                    )
                                    .map((option, index) => (
                                        <option key={index} value={option.opname} />
                                    ))}
                                </datalist>                              
                            </div>
                            <select
                                name="type"
                                id="type"
                                value={col}
                                placeholder="Chọn feature"
                                onChange={(e) => setCol(e.target.value)}
                            >
                                <option value="" disabled hidden>Chọn feature</option>
                                {lstCol.map((item) => (
                                    <option key={item} value={item}>
                                    {item}
                                    </option>
                                ))}
                            </select>
                            <button onClick={() => setToggle(!toggle)}>Search</button>  
                        </div>
                        <div className="chart" style={{ marginTop: "20px", width: "100%", display: "flex", alignItems: "center",justifyContent:"center", flexWrap:"wrap", gap: "40px" }}>
                                {wqiData && wqiData.length > 0 && col != "" ? (
                                    <>
                                    <div className="chart-mask" style={{padding:"15px", alignItems:"center", justifyItems: "center", display:"flex", gap:"20px", flexWrap: "wrap", width: "588px"}}>
                                        <div className="inner-mask">
                                            <h3>Giá trị cao nhất</h3>
                                            <div style={{alignItems: "center"}}>
                                                {Math.max(...wqiData.map(item => item[col])).toFixed(2)} {dv[lstCol.indexOf(col)] === "" ? "" :(" (" + dv[lstCol.indexOf(col)] +")")}
                                            </div>
                                        </div>
                                        <div className="inner-mask">
                                            <h3>Giá trị thấp nhất</h3>
                                            <div style={{alignItems: "center"}}>
                                                {Math.min(...wqiData.map(item => item[col])).toFixed(2)} {dv[lstCol.indexOf(col)] === "" ? "" :(" (" + dv[lstCol.indexOf(col)] +")")}
                                            </div>
                                        </div>
                                        <div className="inner-mask">
                                            <h3>Giá trị trung bình</h3>
                                            <div style={{alignItems: "center"}}>
                                                {Mean(wqiData.map(item => item[col])).toFixed(2)} {dv[lstCol.indexOf(col)] === "" ? "" :(" (" + dv[lstCol.indexOf(col)] +")")}
                                            </div>
                                        </div>
                                        <div className="inner-mask">
                                            <h3>Trung vị</h3>
                                            <div style={{alignItems: "center"}}>
                                                {Median(wqiData.map(item => item[col])).toFixed(2)} {dv[lstCol.indexOf(col)] === "" ? "" :(" (" + dv[lstCol.indexOf(col)] +")")}
                                            </div>
                                        </div>
                                        <div className="inner-mask">
                                            <h3>Phương sai</h3>
                                            <div style={{alignItems: "center"}}>
                                                {Variance(wqiData.map(item => item[col])).toFixed(2)} {dv[lstCol.indexOf(col)] === "" ? "" :(" (" + dv[lstCol.indexOf(col)] +")")}
                                            </div>
                                        </div>
                                        <div className="inner-mask">
                                            <h3>Độ lệch chuẩn</h3>
                                            <div style={{alignItems: "center"}}>
                                                {Math.sqrt(Variance(wqiData.map(item => item[col]))).toFixed(2)} {dv[lstCol.indexOf(col)] === "" ? "" :(" (" + dv[lstCol.indexOf(col)] +")")}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="chart-mask">
                                        <h2 style={{ textAlign: "center" }}>Thống kê chỉ số {col}</h2>
                                        {
                                            (col == "edwardsiella_ictaluri" || col == 'aeromonas_hydrophila')? 
                                            (
                                                null
                                            ):
                                            (
                                                <div style={{marginRight: "20px"}}>
                                                <MeasurementLineChart 
                                                    data={ClusterByNumbericFeature(col, wqiData)} 
                                                    feature={col + (dv[lstCol.indexOf(col)] === "" ? "" :(" (" + dv[lstCol.indexOf(col)] +")"))}
                                                />
                                                </div>
                                            )
                                        }   
                                        {
                                            (col == "edwardsiella_ictaluri" || col == 'aeromonas_hydrophila')? 
                                            (
                                                <MyBarChart
                                                    data={ClusterByBinaryFeature(col, wqiData)} 
                                                    feature={col + (dv[lstCol.indexOf(col)] === "" ? "" :(" (" + dv[lstCol.indexOf(col)] +")"))}
                                                />
                                            ):null
                                        }     
                                    </div>
                                    </>
                                ):null}
                        </div>
                    </div>
                </div>
            </div>
            <AIChatbot />
            </>):null
    );
}
export default Detail;