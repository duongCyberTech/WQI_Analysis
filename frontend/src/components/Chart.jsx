import {
  PieChart, Pie, Cell, 
  LineChart, Line,
  BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042','#FF00FF'];

export function MeasurementLineChart({ data, feature }) {
    //console.log("Line chart data: ", data);
    return (
        <ResponsiveContainer width={400} height={400}> {/* 👈 thêm height vào đây */}
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="label"
                    tickFormatter={(label, index) => {
                        const [year, month] = label.split('-');
                        // Chỉ hiển thị năm nếu là tháng 12 hoặc là điểm cuối cùng trong năm
                        return month === '12' ? year : '';
                    }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="avgWqi" stroke="#8884d8" name={feature} />
            </LineChart>
        </ResponsiveContainer>
    );
  }

export function ProvinceLineChart({ wqiData }) {
    return (
        <ResponsiveContainer width={400} height={400}> {/* 👈 thêm height vào đây */}
            <LineChart width={800} height={400} data={Object.values(wqiData).flat()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                
                {/* Duyệt qua tất cả các tỉnh và vẽ các đường */}
                {Object.keys(wqiData).map((province, index) => (
                    <Line 
                        key={province} 
                        type="monotone" 
                        dataKey="avgWqi" 
                        stroke={index % 2 === 0 ? "#8884d8" : "#82ca9d"} 
                        data={wqiData[province]} 
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
}

export function DonutChart({ data }) {
    const keys = ["Tệ", "Khá tệ", "Trung bình", "Khá tốt", "Tốt"];
    const newArr = data.map((item, index) => ({
        name: keys[index],
        value: item
      }));
    
    return (
      <PieChart width={400} height={400}>
        <Pie
          data={ newArr}
          cx="50%"    // tâm X
          cy="50%"    // tâm Y
          innerRadius={70}   // bán kính trong => tạo lỗ
          outerRadius={120}  // bán kính ngoài
          fill="#8884d8"
          paddingAngle={5}   // khoảng cách giữa các miếng
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {newArr.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    );
  }

export function MyBarChart({data}){
  console.log(data)
    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" 
          tickFormatter={(label, index) => {
              const [year, month] = label.split('-');
              // Chỉ hiển thị năm nếu là tháng 12 hoặc là điểm cuối cùng trong năm
              return month === '12' ? year : '';
          }}/>
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="pos" fill="#4CAF50" name="Dương tính" />
          <Bar dataKey="neg" fill="#F44336" name="Âm tính" />
        </BarChart>
      </ResponsiveContainer>
    );
  };