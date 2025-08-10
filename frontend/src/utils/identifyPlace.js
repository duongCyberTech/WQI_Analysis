export const IdentifyProvince = (province, filterProvinces) => {
    const selectedProvince = filterProvinces?.find(item => item.pname === province);
    if (selectedProvince) {
        return selectedProvince.pid;
    }
    return null;
}

export const IndentifyDistrict = (district, filterDistricts) => {
    const selectedDistrict = filterDistricts?.find(item => item.dname === district);
    if (selectedDistrict) {
        return selectedDistrict.w_id;
    }
    return null;
}

export const Coordinate = (str) => {
    const coordinates = str.split("-").map(coord => parseFloat(coord.trim()));
    if (coordinates.length === 2) {
        return coordinates;
    } else {
        return [0, 0]; // Hoặc giá trị mặc định khác nếu không thể phân tích cú pháp
    }
}

