const pool = require("../config/db.js");

class AnalysisService {
  async nb_of_observation_points(province, district, ob_place) {
    const rows = await pool.query(
      `SELECT DISTINCT observation_point 
       FROM alldata 
       WHERE province LIKE ? AND district LIKE ? AND observation_point LIKE ?`,
      [`%${province || ""}%`, `%${district || ""}%`, `%${ob_place || ""}%`]
    );
    return rows;
  }

  async nb_of_observations(province, district, ob_place) {
    const count = await pool.query(
      `SELECT COUNT(*) AS count
       FROM alldata 
       WHERE province LIKE ? AND district LIKE ? AND observation_point LIKE ?`,
      [`%${province || ""}%`, `%${district || ""}%`, `%${ob_place || ""}%`]
    );
    return count;
  }

  async valid_quality(province, district, ob_place) {
    const count = await pool.query(
      `SELECT COUNT(*) AS count
       FROM alldata 
       WHERE province LIKE ? AND district LIKE ? AND observation_point LIKE ? AND water_quality > 3`,
      [`%${province || ""}%`, `%${district || ""}%`, `%${ob_place || ""}%`]
    );
    return count[0][0].count;
  }

  async water_quality(province, district, ob_place) {
    const w0 = await pool.query(
      `SELECT COUNT(*) AS count
       FROM alldata 
       WHERE province LIKE ? AND district LIKE ? AND observation_point LIKE ? AND water_quality = 0`,
      [`%${province || ""}%`, `%${district || ""}%`, `%${ob_place || ""}%`]
    );
    const w1 = await pool.query(
      `SELECT COUNT(*) AS count
       FROM alldata 
       WHERE province LIKE ? AND district LIKE ? AND observation_point LIKE ? AND water_quality = 1`,
      [`%${province || ""}%`, `%${district || ""}%`, `%${ob_place || ""}%`]
    );
    const w2 = await pool.query(
      `SELECT COUNT(*) AS count
       FROM alldata 
       WHERE province LIKE ? AND district LIKE ? AND observation_point LIKE ? AND water_quality = 2`,
      [`%${province || ""}%`, `%${district || ""}%`, `%${ob_place || ""}%`]
    );
    const w3 = await pool.query(
      `SELECT COUNT(*) AS count
       FROM alldata 
       WHERE province LIKE ? AND district LIKE ? AND observation_point LIKE ? AND water_quality = 3`,
      [`%${province || ""}%`, `%${district || ""}%`, `%${ob_place || ""}%`]
    );
    const w4 = await pool.query(
      `SELECT COUNT(*) AS count
       FROM alldata 
       WHERE province LIKE ? AND district LIKE ? AND observation_point LIKE ? AND water_quality = 4`,
      [`%${province || ""}%`, `%${district || ""}%`, `%${ob_place || ""}%`]
    );
    return [w0[0][0].count, w1[0][0].count, w2[0][0].count, w3[0][0].count, w4[0][0].count];
  }

  async Place_data() {
    const provinces = await pool.query("SELECT * FROM province");
    const districts = await pool.query("SELECT * FROM district");
    const ob_places = await pool.query("SELECT * FROM observe_place");
    return {provinces: provinces[0], districts: districts[0], ob_places: ob_places[0]};
  }

  async getObservationAt(province, district, ob_place) {
    let query = "";
    let parameters = [];
    if (province && district && ob_place) {
      query = `SELECT wqi, date, province, district, observation_point, coordinate FROM alldata WHERE province = ? AND district = ? AND observation_point = ?`;
      parameters = [province, district, ob_place];
    }
    else if (province && district) {
      query = `SELECT wqi, date, province, district, observation_point, coordinate FROM alldata WHERE province = ? AND district = ?`;
      parameters = [province, district];
    } else if (province) {
      query = `SELECT wqi, date, province, district, observation_point, coordinate FROM alldata WHERE province = ?`;
      parameters = [province];
    } else {
      query = `SELECT wqi, date, province, district, observation_point, coordinate FROM alldata`;
    }
    const rows = await pool.query(query, parameters);
    return rows[0];
  }
  
  async getDataSet(limit, ub, lb, startDate, endDate, i){
    console.log(limit);
    
    let query = "SELECT * FROM alldata WHERE wqi <= ? AND wqi >= ? AND date BETWEEN ? AND ? LIMIT ? OFFSET ?";
    let params = [ub || 100, lb || 0, startDate || "2022/01/01", endDate || "2025/01/01", Number(limit) || 10, Number(i) || 0];
    const rows = await pool.query(query,params);
    return rows[0];
  }

  async postNewRecord(data) {
    const {place, temperature, pH, DO, conduct, alkan, no2, nh4, po4, h2s, tss, cod, aero_total,edward, aero_hydro, coliform, wqi} = data;
    const date = new Date().toISOString().slice(0, 10);
    await pool.query("CREATE TABLE IF NOT EXISTS model (id INT AUTO_INCREMENT PRIMARY KEY, place INT, date DATE, temperature FLOAT, pH FLOAT, DO FLOAT, conduct FLOAT, alkan FLOAT, no2 FLOAT, nh4 FLOAT, po4 FLOAT, h2s FLOAT, tss FLOAT, cod FLOAT, aero_total FLOAT, edward FLOAT, aero_hydro FLOAT, coliform FLOAT, wqi FLOAT)");
    await pool.query("INSERT INTO model (place, date, temperature, pH, DO, conduct, alkan, no2, nh4, po4, h2s, tss, cod, aero_total, edward, aero_hydro, coliform, wqi) VALUES (?,?, ?, ?,?,?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
       [place,date, temperature, pH, DO, conduct, alkan, no2, nh4, po4, h2s, tss, cod, aero_total, edward, aero_hydro, coliform, wqi]);
    return data;
  }

  async getClusterNumeric(province, district, ob_place) {
    let query = "";
    let parameters = [];
    if (province && district && ob_place) {
      query = `SELECT * FROM alldata WHERE province = ? AND district = ? AND observation_point = ?`;
      parameters = [province, district, ob_place];
    }
    else if (province && district) {
      query = `SELECT * FROM alldata WHERE province = ? AND district = ?`;
      parameters = [province, district];
    } else if (province) {
      query = `SELECT * FROM alldata WHERE province = ?`;
      parameters = [province];
    } else {
      query = `SELECT * FROM alldata`;
    }
    const rows = await pool.query(query, parameters);
    return rows[0];
  }

}

module.exports = new AnalysisService();