import { useState, useEffect } from "react";
import axios from "axios";
import HeaderRes from "../components/HeaderRes";
import StickyHeadTable from "../components/DataTable";
import { Button, ButtonGroup } from "@mui/material";
import {dv, lstCol, DateFormat} from '../utils/dataFeatures'

export default function Report() {
    const [limitRecord, setLimitRecord] = useState(10);
    const [dataset, setDataset] = useState([]);
    const [startIdx, setStartIdx] = useState(0);
    const [lb, setLb] = useState(0);
    const [ub, setUb] = useState(100);
    const [startDate, setStartDate] = useState("2022/01/01");
    const [endDate, setEndDate] = useState("2025/01/01");
    const columns = [
        { id: 'province', label: 'Province', minWidth: 100 },
        {
            id: 'district',
            label: 'District',
            minWidth: 170
        },
        {
            id: 'observation_point',
            label: 'Observed\u00a0Place',
            minWidth: 170
        },
        {
            id: 'place',
            label: 'Place\u00a0No.',
            minWidth: 80,
            align: 'center',
            format: (value) => value.toFixed(0),
        },
        {
            id: 'coordinate',
            label: 'Co-ordinate',
            minWidth: 140,
        },
        {
            id: 'date',
            label: 'Date',
            minWidth: 150,
            format: (value) => DateFormat(value)
        },
        {
            id: 'temperature',
            label: `Temperature\u00a0(${dv[lstCol.indexOf('temperature')]})`,
            minWidth: 100,
            format: (value) => Number(value).toFixed(1)
        },
        {
            id: 'pH',
            label: 'pH',
            minWidth: 80,
            format: (value) => Number(value).toFixed(1)
        },
        {
            id: 'DO',
            label: `Disolved\u00a0Oxygen\u00a0(${dv[lstCol.indexOf('DO')]})`,
            minWidth: 100
        },
        {
            id: 'conductivity',
            label: `Conductivity\u00a0${dv[lstCol.indexOf('conductivity')]}`,
            minWidth: 120,
            format: (value) => value.toFixed(1),
        },
        {
            id: 'alkalinity',
            label: `Alkalinity\u00a0(${dv[lstCol.indexOf('alkalinity')]})`,
            minWidth: 120,
            format: (value) => value.toFixed(1)
        },
        {
            id: 'no2',
            label: `N-NO2\u00a0(${dv[lstCol.indexOf('no2')]})`,
            minWidth: 100,
            format: (value) => value.toFixed(3)
        },
        {
            id: 'po4',
            label: `P-PO4\u00a0(${dv[lstCol.indexOf('po4')]})`,
            minWidth: 100,
            format: (value) => value.toFixed(3)
        },
        {
            id: 'no2',
            label: `N-NH4\u00a0(${dv[lstCol.indexOf('nh4')]})`,
            minWidth: 100,
            format: (value) => value.toFixed(3)
        },
        {
            id: 'h2s',
            label: `H2S\u00a0(${dv[lstCol.indexOf('h2s')]})`,
            minWidth: 100,
            format: (value) => value.toFixed(3)
        },
        {
            id: 'tss',
            label: `Total\u00a0suspended\u00a0solids\u00a0(${dv[lstCol.indexOf('tss')]})`,
            minWidth: 100,
            format: (value) => value.toFixed(1)
        },
        {
            id: 'cod',
            label: `Chemical\u00a0Oxygen\u00a0Demand\u00a0(${dv[lstCol.indexOf('cod')]})`,
            minWidth: 100,
            format: (value) => value.toFixed(1)
        },
        {
            id: 'aeromonas_total',
            label: `Aeromonas\u00a0Total\u00a0(${dv[lstCol.indexOf('aeromonas_total')]})`,
            minWidth: 100,
            format: (value) => value.toFixed(0)
        },
        {
            id: 'edwardsiella_ictaluri',
            label: `Edwardsiella\u00a0ictaluri`,
            minWidth: 150,
            format: (value) => (value === 1 ? "Dương tính" : "Âm tính")
        },
        {
            id: 'aeromonas_hydrophila',
            label: `Aeromonas\u00a0hydrophila`,
            minWidth: 150,
            format: (value) => (value === 1 ? "Dương tính" : "Âm tính")
        },
        {
            id: 'coliform',
            label: `Coliform\u00a0(${dv[lstCol.indexOf('coliform')]})`,
            minWidth: 120,
            format: (value) => value.toFixed(0)
        },
        {
            id: 'wqi',
            label: `Water\u00a0Quality\u00a0Index`,
            minWidth: 100,
            format: (value) => value.toFixed(0)
        },
        {
            id: 'water_quality',
            label: `Water\u00a0Quality\u00a0Rate`,
            minWidth: 120,
            format: (value) => (value == 0?"Rất tệ":
                (value == 1 ? "Tệ" : 
                (value == 2 ? "Trung bình" : 
                (value == 3 ? "Khá tốt" : 
                (value == 4 ? 
                "Tốt" : "Xuất sắc")))))
        },
    ];

    useEffect(()=>{
        const fetchData = async() => {
            try {
                const res = await axios.get("http://localhost:3002/analysis/fetch",{
                    params: {
                        limit: 2000,
                        ub: ub || 100,
                        lb: lb || 0,
                        startDate: startDate || "2022/01/01",
                        endDate: endDate || "2025/01/01",
                        offset: startIdx || 0
                    }
                })
                setDataset(res.data.data)
            } catch (error) {
                alert(error.message)
            }
        }
        fetchData();
    },[limitRecord, ub, lb, startDate, endDate, startIdx])

    const DateFormat = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return date.toLocaleDateString('en-GB', options);
    }

    async function downloadExcel() {
        try {
            const res = await axios.post(
                'http://localhost:3002/report/generate-excel',
                {}, // nếu gửi body rỗng
                {
                    params: {
                        startDate: startDate || '01/01/2022',
                        endDate: endDate || '01/01/2026'
                    },
                    responseType: 'blob'
                }
            );
    
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'bao_cao_chat_luong_nuoc.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.log(error);
            alert("Không thể tải Excel: " + error.message);
        }
    }    

    async function downloadPDF() {
        try {
            const res = await axios.post(
                'http://localhost:3002/report/generate-pdf',
                {},
                {
                    params: {
                        startDate: startDate || '01/01/2022',
                        endDate: endDate || '01/01/2026'
                    },
                    responseType: 'blob'
                }
            );
    
            const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'bao_cao_chat_luong_nuoc.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.log(error);
            alert("Không thể tải PDF: " + error.message);
        }
    }
    

    return (
        <>
            <HeaderRes />
            <div className="filter" style={{marginTop: "150px", marginLeft: "20px"}}>
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
                <div style={{display: "flex", flexWrap: "wrap", gap: "20px"}}>
                    <div style={{display: "flex"}}>
                        <div style={{marginRight: "10px", fontSize: "18px", fontWeight: "bold", marginTop: "5px"}}>Ngày bắt đầu</div>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <div style={{height: "30px", width: "4px", backgroundColor: "#000", marginLeft: "20px"}}></div>
                    </div>
                    <div style={{display: "flex"}}>
                        <div style={{marginRight: "10px", fontSize: "18px", fontWeight: "bold", marginTop: "5px"}}>Ngày kết thúc</div>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                        <div style={{height: "30px", width: "4px", backgroundColor: "#000", marginLeft: "20px"}}></div>
                    </div>
                    <div style={{display: "flex"}}>
                        <div style={{marginRight: "10px", fontSize: "18px", fontWeight: "bold", marginTop: "5px"}}>Cận dưới WQI</div>
                        <input
                            type="text"
                            value={lb}
                            onChange={(e) => setLb(e.target.value)}
                        />
                        <div style={{height: "30px", width: "4px", backgroundColor: "#000", marginLeft: "20px"}}></div>
                    </div>
                    <div style={{display: "flex"}}>
                        <div style={{marginRight: "10px", fontSize: "18px", fontWeight: "bold", marginTop: "5px"}}>Cận trên WQI</div>
                        <input
                            type="text"
                            value={ub}
                            onChange={(e) => setUb(e.target.value)}
                        />
                        <div style={{height: "30px", width: "4px", backgroundColor: "#000", marginLeft: "10px", marginRight: "10px"}}></div>
                    </div>
                    
                </div>
                
            </div>        
            <div style={{ display: "flex", flexWWrap: "wrap", gap:"20px", margin: "20px"}}>
                <StickyHeadTable rows = {dataset} columns={columns} page={startIdx} setPage={setStartIdx} rowsPerPage={limitRecord} setRowsPerPage={setLimitRecord} />
                <div style={{width: "2px", height: "500px", backgroundColor: "#000"}}></div>
                <ButtonGroup variant="outlined" aria-label="Loading button group" sx={{height: 40}}>
                    <Button onClick={() => downloadPDF()} sx={{'&:hover': {
                        color: '#fff',
                        backgroundColor: '#D41545' // màu khi hover
                        }}}>PDF</Button>
                    <Button onClick={() => downloadExcel()} sx={{'&:hover': {
                        color: '#fff',
                        backgroundColor: '#7FFF00' // màu khi hover
                        }}}>Excel</Button>
                </ButtonGroup>
            </div>
        </>
    );
}
