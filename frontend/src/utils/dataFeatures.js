export const lstCol = [
    "temperature", "pH", "DO", "conductivity",  "alkalinity", 
    "no2", "nh4", "po4", "h2s", "tss", 
    "cod", "aeromonas_total", "edwardsiella_ictaluri", "aeromonas_hydrophila", 
    "coliform", "wqi", "water_quality"]

export const dv = ["℃", "", "mg/l", "pS/cm", "mg/l", 
    "mg/l", "mg/l", "mg/l", "mg/l", "mg/l", 
    "mg/l", "CFU/ml", "", "", "MPN/100ml", "", ""]

export const DateFormat = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};