        export function ClusterByNumbericFeature(feature, rawData = []){
            //console.log(rawData)
            const processedData = rawData.map(item => {
                const date = new Date(item.date);
                return {
                    year: date.getFullYear(),
                    month: date.getMonth() + 1, // Lấy tháng, bắt đầu từ 0, vì vậy cộng thêm 1
                    [feature]: Number(item[feature]),
                    province: item.province,
                    district: item.district,
                    observation_point: item.observation_point,
                };
            });
            const yearMonthMap = {};

            processedData.forEach(item => {
                const key = `${item.year}-${item.month}`; // Tạo key theo năm và tháng
                if (!yearMonthMap[key]) {
                    yearMonthMap[key] = {
                        total: 0,
                        count: 0,
                        province: item.province, // Lưu province
                        district: item.district, // Lưu district
                        observation_point: item.observation_point, // Lưu observation_point
                    };
                }
                yearMonthMap[key].total += Number(item[feature]);
                yearMonthMap[key].count += 1;
            });

            // Chuyển đổi thành mảng dữ liệu đã xử lý
            const finalData = Object.entries(yearMonthMap).map(([key, { total, count, province, district, observation_point, lat, lng }]) => {
                const [year, month] = key.split('-');
                return {
                    year: parseInt(year),
                    month: parseInt(month),
                    label: `${year}-${String(month).padStart(2, '0')}`,
                    avgWqi: parseFloat((total / count).toFixed(2)),
                    province: province,
                    district: district,
                    observation_point: observation_point,
                };
            });
            const sortedData = finalData.sort((a, b) => {
                if (a.year === b.year) {
                    return a.month - b.month; // So sánh tháng nếu năm giống nhau
                }
                return a.year - b.year; // So sánh năm
            });
            console.log(sortedData)
            return sortedData;
        }

        export function ClusterByBinaryFeature(feature, rawData =[]){
            const processedData = rawData.map(item => {
                const date = new Date(item.date);
                return {
                    year: date.getFullYear(),
                    month: date.getMonth() + 1, // Lấy tháng, bắt đầu từ 0, vì vậy cộng thêm 1
                    [feature]: item[feature],
                    province: item.province,
                    district: item.district,
                    observation_point: item.observation_point,
                };
            });
            const yearMonthMap = {};

            processedData.forEach(item => {
                const key = `${item.year}-${item.month}`; // Tạo key theo năm và tháng
                if (!yearMonthMap[key]) {
                    yearMonthMap[key] = {
                        count0: 0,
                        count1: 0,
                        province: item.province, // Lưu province
                        district: item.district, // Lưu district
                        observation_point: item.observation_point, // Lưu observation_point
                    };
                }
                yearMonthMap[key].count0 += (item[feature] == 0 ? 1 : 0);
                yearMonthMap[key].count1 += (item[feature] == 1 ? 1 : 0);
            });

            // Chuyển đổi thành mảng dữ liệu đã xử lý
            const finalData = Object.entries(yearMonthMap).map(([key, { count0, count1, province, district, observation_point, lat, lng }]) => {
                const [year, month] = key.split('-');
                return {
                    year: parseInt(year),
                    month: parseInt(month),
                    label: `${year}-${String(month).padStart(2, '0')}`,
                    pos: Number(count1),
                    neg: Number(count0),
                    province: province,
                    district: district,
                    observation_point: observation_point,
                };
            });
            const sortedData = finalData.sort((a, b) => {
                if (a.year === b.year) {
                    return a.month - b.month; // So sánh tháng nếu năm giống nhau
                }
                return a.year - b.year; // So sánh năm
            });
            return sortedData;
        }
