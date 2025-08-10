const AnalysisService = require('../service/analysis.service');

class AnalysisController {

    async nb_of_observation_points(req, res) {
        try {
        const result = await AnalysisService.nb_of_observation_points(req.query.province, req.query.district, req.query.ob_place);
        res.status(200).json({ nb_of_observation_points: result[0].length});
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
        }
    }

    async nb_of_observations(req, res) {
        try {
        const result = await AnalysisService.nb_of_observations(req.query.province, req.query.district, req.query.ob_place);
        res.status(200).json({ nb_of_observations: result[0][0].count });
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
        }
    }

    async valid_quality(req, res) {
        try {
        const result = await AnalysisService.valid_quality(req.query.province, req.query.district, req.query.ob_place);
        res.status(200).json({ valid_quality: result });
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
        }
    }

    async water_quality(req, res) {
        try {
        const result = await AnalysisService.water_quality(req.query.province, req.query.district, req.query.ob_place);
        res.status(200).json({ water_quality: result });
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
        }
    }

    async Place_data(req, res) {
        try {
        const result = await AnalysisService.Place_data();
        res.status(200).json({ provinces: result.provinces, districts: result.districts, ob_places: result.ob_places });
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
        }
    }  

    async getObservationAt(req, res) {
        try {
            const result = await AnalysisService.getObservationAt(req.query.province, req.query.district, req.query.ob_place);
            res.status(200).json({ observation: result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getDataSet(req, res){
        try{
            const result = await AnalysisService.getDataSet(req.query.limit, req.query.ub, req.query.lb, req.query.startDate, req.query.endDate, req.query.offset);
            res.status(200).json({data: result});
        }
        catch (e){
            res.status(500).json({message: e.message})
        }
    }

    async postNewRecord(req, res) {
        try {
            const result = await AnalysisService.postNewRecord(req.body);
            res.status(200).json({ message: 'Record added successfully', data: result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getClusterNumeric(req, res) {
        try{
            const result = await AnalysisService.getClusterNumeric(req.query.province, req.query.district, req.query.ob_place);
            res.status(200).json({ observation: result });
        }catch(err){
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = new AnalysisController();