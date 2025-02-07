import { fetchAndSeedDatabase,  getStatistics, getBarChartData, getTransactionsDetails } from '../services/transactionServices.js';

export const initializeDatabase = async (req, res) => {
    try {
        const response = await fetchAndSeedDatabase();
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const listTransactions = async (req, res) => {
    const { search, page = 1, perPage = 10, month , year } = req.query;
    try {
        const transactions = await getTransactionsDetails(search, page, perPage, month , year);
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getStats = async (req, res) => {
    const { month, year } = req.query;

    
    const currentYear = year ? Number(year) : new Date().getFullYear();

    if (!month) {
        return res.status(400).json({ error: 'Month is required' });
    }

    try {
        
        const stats = await getStatistics(month, currentYear);
        res.json(stats);
    } catch (error) {
        
        res.status(500).json({ error: error.message });
    }
};


export const getBarChart = async (req, res) => {
    const { month, year } = req.query;


    const currentYear = year ? Number(year) : new Date().getFullYear();

    
    if (!month) {
        return res.status(400).json({ error: 'Month is required' });
    }

    try {
        
        const chartData = await getBarChartData(month, currentYear);
        res.json(chartData);
    } catch (error) {
    
        res.status(500).json({ error: error.message });
    }
};

