async function loadTenantDashboard() {
    try {
        // Fetch data from storage.js
        const data = await getKejaData();
        
        // Ensure tenants array exists
        const tenants = data?.tenants || [];
        
        if (tenants.length === 0) {
            console.error("No tenants found in the data source!");
            document.getElementById('welcome-name').textContent = "No Data Found";
            return;
        }

        // Try to identify the logged-in user
        let loggedInUserId = sessionStorage.getItem('loggedInUserId') || localStorage.getItem('loggedInUserId');
        
        // Find the specific tenant (converting both to strings to ensure they match)
        let currentTenant = tenants.find(t => String(t.id) === String(loggedInUserId));

        // FALLBACK: If nobody is logged in yet, just use the first tenant so the screen isn't blank
        if (!currentTenant) {
            console.warn("No specific tenant logged in. Falling back to the first tenant in the database for testing.");
            currentTenant = tenants[0]; 
        }

        // Populate the UI
        populateDashboardUI(currentTenant);
        initializeChart(currentTenant);

    } catch (error) {
        console.error("Critical error loading the dashboard:", error);
    }
}

// --- 2. Populate DOM Elements ---
function populateDashboardUI(tenant) {
    // Destructure with safe default values in case data is missing
    const { 
        name = "Valued Tenant", 
        unit = "--", 
        rentAmount = 0, 
        isPaid = false, 
        lastPaymentDate = "N/A", 
        nextDueDate = "N/A", 
        utilities = {}, 
        activities = [] 
    } = tenant;

    // Helper function to safely set text content
    const safeSetText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };

    // Set basic info
    safeSetText('welcome-name', `Welcome Back ${name}!`);
    safeSetText('tenant-unit', `Unit ${unit}`);

    // Set Rent Status
    const lastRentInfoEl = document.getElementById('last-rent-info');
    if (lastRentInfoEl) {
        lastRentInfoEl.textContent = isPaid 
            ? `Rent Paid: Ksh ${rentAmount.toLocaleString()} (${lastPaymentDate})` 
            : `Rent Due: Ksh ${rentAmount.toLocaleString()}`;
    }
    safeSetText('next-rent-due', `Next Rent Payment Due: ${nextDueDate}`);

    // Set Utilities
    const water = utilities.water || 0;
    const electricity = utilities.electricity || 0;
    
    safeSetText('water-bill', `Ksh ${water.toLocaleString()}`);
    safeSetText('electricity-bill', `Ksh ${electricity.toLocaleString()}`);
    safeSetText('water-reminder', `Water Amount: Ksh ${water.toLocaleString()}`);
    safeSetText('electricity-reminder', `Electricity : Ksh ${electricity.toLocaleString()}`);

    // Populate Recent Activities
    const activityContainer = document.getElementById('activity-container');
    if (activityContainer) {
        if (activities.length > 0) {
            activityContainer.innerHTML = activities.map(({ title, subtitle, completed }) => `
                <div class="flex items-start gap-3 text-sm">
                    <input type="checkbox" ${completed ? 'checked' : ''} disabled class="mt-1 w-4 h-4 lg:w-5 lg:h-5 text-blue-600 rounded" />
                    <div>
                        <p class="font-bold text-gray-800">${title}</p>
                        ${subtitle ? `<p class="text-xs text-gray-500">${subtitle}</p>` : ''}
                    </div>
                </div>
            `).join('');
        } else {
            activityContainer.innerHTML = `<p class="text-gray-500 text-sm italic">No recent activity.</p>`;
        }
    }
}

// --- 3. Initialize Chart.js ---
function initializeChart(tenant) {
    const ctx = document.getElementById('rentPaymentChart');
    if (!ctx) return;

    // A simple bar chart to show rent payment history
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Rent Payments (Ksh)',
                data: [
                    tenant.rentAmount, 
                    tenant.rentAmount, 
                    tenant.rentAmount, 
                    tenant.rentAmount, 
                    tenant.rentAmount, 
                    tenant.isPaid ? tenant.rentAmount : 0 // Last month reflects current payment status
                ],
                backgroundColor: '#93C5FD',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // Hides the legend to save space
                }
            }
        }
    });
}

// --- 4. Modal Interactions ---
function setupModal() {
    const modal = document.getElementById('maintenanceModal');
    const openBtn = document.getElementById('openModalBtn');
    const closeBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelModalBtn');
    const form = document.getElementById('maintenanceForm');

    if (!modal) return;

    const openModal = () => modal.classList.remove('hidden');
    const closeModal = () => {
        modal.classList.add('hidden');
        if (form) form.reset();
    };

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    // Handle form submission
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevents the page from refreshing
            alert("Your maintenance request has been submitted to the landlord.");
            closeModal();
        });
    }
}

// --- 5. Boot Up ---
// Wait for the HTML to fully load before running the scripts
document.addEventListener('DOMContentLoaded', () => {
    loadTenantDashboard();
    setupModal();
});