import axios from 'axios';
import Transaction from '../models/transaction.js';

const fetchAndSeedDatabase = async () => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data;

        await Transaction.insertMany(transactions);

        return { message: 'Database initialized successfully' };
    } catch (error) {
        throw new Error('Error fetching or inserting data: ' + error.message);
    }
};

const getTransactionsDetails = async (search, page = 1, perPage = 10, month) => {
    const query = {};

    if (search) {
        query.$or = [
            { category: new RegExp(search, 'i') },
            { title: new RegExp(search, 'i') },
            { description: new RegExp(search, 'i') },
            { price: parseFloat(search) || 0 }
        ];
    }

    if (month) {
        const numericMonth = parseInt(month, 10); // Convert to number

        query.dateOfSale = {
            $gte: new Date(`2021-${numericMonth.toString().padStart(2, '0')}-01`),
            $lt: new Date(`2021-${(numericMonth + 1).toString().padStart(2, '0')}-01`)
        };
    }

    const transactions = await Transaction.find(query)
        .skip((page - 1) * perPage)
        .limit(perPage);

    return transactions;
};




const getStatistics = async (month, year = new Date().getFullYear()) => {

    const monthNumber = parseInt(month, 10); 
    
    if (monthNumber < 1 || monthNumber > 12) {
        throw new Error("Invalid month. Please provide a value between 1 and 12.");
    }

   
    const currentYear = year ? Number(year) : new Date().getFullYear();

    
    const startDate = new Date(currentYear, monthNumber - 1, 1); 
    const endDate = new Date(currentYear, monthNumber, 1); 

    const query = {
        dateOfSale: {
            $gte: startDate,
            $lt: endDate
        }
    };

    
    const totalSaleAmount = await Transaction.aggregate([
        { $match: query },
        { $group: { _id: null, totalSales: { $sum: "$price" } } }
    ]);


    const soldItems = await Transaction.countDocuments({ ...query, sold: true });
    const notSoldItems = await Transaction.countDocuments({ ...query, sold: false });

    return {
        totalSaleAmount: totalSaleAmount[0]?.totalSales || 0,
        totalSoldItems: soldItems,
        totalNotSoldItems: notSoldItems
    };
};


const getBarChartData = async (month, year = new Date().getFullYear()) => {
    
    const monthNumber = parseInt(month, 10);
    if (monthNumber < 1 || monthNumber > 12) {
        throw new Error("Invalid month. Please provide a value between 1 and 12.");
    }


    const currentYear = year ? Number(year) : new Date().getFullYear();

    const startDate = new Date(currentYear, monthNumber - 1, 1); 
    const endDate = new Date(currentYear, monthNumber, 1); 

    const query = {
        dateOfSale: {
            $gte: startDate,
            $lt: endDate
        }
    };


    const priceRanges = [
        { range: "0-100", min: 0, max: 100 },
        { range: "101-200", min: 101, max: 200 },
        { range: "201-300", min: 201, max: 300 },
        { range: "301-400", min: 301, max: 400 },
        { range: "401-500", min: 401, max: 500 },
        { range: "501-600", min: 501, max: 600 },
        { range: "601-700", min: 601, max: 700 },
        { range: "701-800", min: 701, max: 800 },
        { range: "801-900", min: 801, max: 900 },
        { range: "901+", min: 901, max: Infinity }
    ];

    
    const data = await Promise.all(priceRanges.map(async ({ range, min, max }) => {
        const count = await Transaction.countDocuments({ ...query, price: { $gte: min, $lt: max } });
        return { range, count };
    }));

    return data;
};


export { fetchAndSeedDatabase, getTransactionsDetails , getStatistics, getBarChartData };
