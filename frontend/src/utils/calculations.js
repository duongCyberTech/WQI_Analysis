// Giá trị trung bình
export function Mean(arr) { 
    return arr.map(item => Number(item)).reduce((a, b) => a + b, 0) / arr.length;
}

// Trung vị
export function Median(arr){
    //console.log(arr)
    const sorted = [...arr].map(item => Number(item)).sort((a, b) => a - b);
    return (sorted.length % 2 === 0)
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)];
}

// Phương sai
export function Variance(arr){
    //console.log(arr)
    const mean = Mean(arr)
    return arr.map(item => Number(item)).reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / arr.length;
}