
const STORAGE_KEY = 'kejahub_data';

const defaultData = {
    landlord: {
        name: "Landlord"
    },
    allUnits: ["C5", "A3", "A1", "C4", "C3", "C1", "A4"],
    tenants: [
        {
            id: "1",
            name: "Alex Johnson",
            email: "alex@example.com",
            unit: "4B",
            rentAmount: 25000,
            isPaid: true,
            lastPaymentDate: "Aug 1st, 2026",
            nextDueDate: "Sept 1st, 2026",
            utilities: { 
                water: 1500, 
                electricity: 3200 
            },
            activities: [
                { title: "Rent Payment Received", subtitle: "August", completed: true },
                { title: "Maintenance: Leaky Faucet", subtitle: "Resolved", completed: true }
            ]
        }
    ]
};

async function getKejaData() {
    try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (!storedData) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
            return defaultData;
        }
        return JSON.parse(storedData);
    } catch (error) {
        console.error("Error reading from localStorage:", error);
        return defaultData;
    }
}
async function saveKejaData(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        console.log("KejaHub data successfully saved to localStorage!");
    } catch (error) {
        console.error("Error writing to localStorage:", error);
    }
}