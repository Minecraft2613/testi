document.addEventListener('DOMContentLoaded', () => {

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    // ~~~~~~~~ DOM SELECTORS ~~~~~~~~~~~ //
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    const authContainer = document.getElementById('auth-container');
    const appContainer = document.getElementById('app-container');

    // --- Auth Views ---
    const loginView = document.getElementById('login-view');
    const signupView = document.getElementById('signup-view');
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');

    // --- Login Form ---
    const loginIdentifier = document.getElementById('login-identifier');
    const loginEditionSelector = document.getElementById('login-edition-selector');
    const loginPassword = document.getElementById('login-password');
    const loginBtn = document.getElementById('login-btn');

    // --- Signup Form ---
    const signupBankName = document.getElementById('signup-bank-name');
    const signupEditionJava = document.getElementById('signup-java');
    const signupEditionBedrock = document.getElementById('signup-bedrock');
    const mcUsernameInputs = document.getElementById('mc-username-inputs');
    const signupPassword = document.getElementById('signup-password');
    const generatedBankIdContainer = document.getElementById('generated-bank-id-container');
    const generatedBankIdInput = document.getElementById('generated-bank-id');
    const copyBankIdBtn = document.getElementById('copy-bank-id-btn');
    const signupBtn = document.getElementById('signup-btn');

    // --- App Shell ---
    const sidebar = document.getElementById('sidebar');
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const mainContent = document.getElementById('main-content');
    const profilePic = document.getElementById('profile-pic');
    const usernameDisplay = document.getElementById('username-display');
    const logoutBtn = document.getElementById('logout-btn');

    // --- Main Navigation ---
    const mainNavButtons = document.querySelectorAll('.main-nav-buttons .nav-btn');
    const pages = document.querySelectorAll('.page');

    // --- Bank Status Page ---
    const statusBankName = document.getElementById('status-bank-name');
    const statusBankBalance = document.getElementById('status-bank-balance');
    const statusBankId = document.getElementById('status-bank-id');

    // --- Tax Page ---
    const taxProfilePic = document.getElementById('tax-profile-pic');
    const taxBankName = document.getElementById('tax-bank-name');
    const taxMcName = document.getElementById('tax-mc-name');
    const taxChartCanvas = document.getElementById('tax-chart').getContext('2d');

    // --- Loan Page ---
    const loanAmount = document.getElementById('loan-amount');
    const loanType = document.getElementById('loan-type');
    const loanDuration = document.getElementById('loan-duration');
    const loanFieldsContainer = document.getElementById('loan-fields-container');
    const loanInterestRate = document.getElementById('loan-interest-rate');
    const loanPerDay = document.getElementById('loan-per-day');
    const loanTotalRepayment = document.getElementById('loan-total-repayment');

    let taxChart;

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    // ~~~~~~~~ STATE MANAGEMENT ~~~~~~~~ //
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    let currentUser = null;

    const db = {
        getUsers: () => JSON.parse(localStorage.getItem('minebank_users')) || {},
        saveUsers: (users) => localStorage.setItem('minebank_users', JSON.stringify(users)),
        getCurrentUser: () => JSON.parse(sessionStorage.getItem('minebank_user')),
        setCurrentUser: (user) => sessionStorage.setItem('minebank_user', JSON.stringify(user)),
        logoutUser: () => sessionStorage.removeItem('minebank_user')
    };

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    // ~~~~~~~~ INITIALIZATION ~~~~~~~~~~ //
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    function init() {
        // Check for a logged-in user
        const loggedInUser = db.getCurrentUser();
        if (loggedInUser) {
            currentUser = loggedInUser;
            showApp();
        } else {
            showAuth();
        }

        // Setup initial form states
        updateUsernameInput('java');
        setupEventListeners();
        createDummyData(); // For testing
    }

    function createDummyData() {
        const users = db.getUsers();
        if (!users['BANK006443']) {
            users['BANK006443'] = {
                bankId: 'BANK006443',
                password: '26',
                bankName: 'Test Bank',
                mcUsername: 'TestUser',
                mcEdition: 'java',
                balance: 1250.75,
                tax: {
                    selling: 12.50,
                    buying: 25.00,
                    paid: 0,
                    history: [2, 5, 3, 6, 4, 8, 5] // last 7 days tax charges
                }
            };
            db.saveUsers(users);
        }
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    // ~~~~~~~~ UI TOGGLING ~~~~~~~~~~~~~ //
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    function showAuth() {
        authContainer.classList.remove('hidden');
        appContainer.classList.add('hidden');
    }

    function showApp() {
        authContainer.classList.add('hidden');
        appContainer.classList.remove('hidden');
        sidebar.classList.remove('open'); // Ensure sidebar is closed on load
        mainContent.classList.remove('sidebar-open');
        updateAppUI();
    }

    showSignup.addEventListener('click', (e) => {
        e.preventDefault();
        loginView.classList.add('hidden');
        signupView.classList.remove('hidden');
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        signupView.classList.add('hidden');
        loginView.classList.remove('hidden');
    });

    menuToggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        mainContent.classList.toggle('sidebar-open');
    });

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    // ~~~~~~ AUTHENTICATION LOGIC ~~~~~~ //
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    function updateUsernameInput(edition) {
        mcUsernameInputs.innerHTML = '';
        if (edition === 'java') {
            mcUsernameInputs.innerHTML = `<input type="text" id="signup-mc-username" placeholder="Enter Java username">`;
        } else {
            mcUsernameInputs.innerHTML = `
                <input type="text" class="bedrock-prefix" value="." readonly>
                <input type="text" id="signup-mc-username" class="bedrock-main" placeholder="Enter Bedrock username">
            `;
        }
    }

    signupEditionJava.addEventListener('change', () => updateUsernameInput('java'));
    signupEditionBedrock.addEventListener('change', () => updateUsernameInput('bedrock'));

    signupBtn.addEventListener('click', () => {
        const bankName = signupBankName.value.trim();
        const password = signupPassword.value;
        const edition = document.querySelector('input[name="signup-edition"]:checked').value;
        const mcUserInput = document.getElementById('signup-mc-username').value.trim();

        if (!bankName || !password || !mcUserInput) {
            alert('Please fill all fields.');
            return;
        }

        const mcUsername = edition === 'bedrock' ? `.${mcUserInput}` : mcUserInput;

        const users = db.getUsers();

        // Check if username exists
        if (Object.values(users).some(u => u.mcUsername.toLowerCase() === mcUsername.toLowerCase())) {
            alert('Minecraft username already registered.');
            return;
        }

        // Generate unique Bank ID
        let newBankId;
        do {
            newBankId = `BANK${String(Math.floor(Math.random() * 900000) + 100000)}`;
        } while (users[newBankId]);

        const newUser = {
            bankId: newBankId,
            password: password, // In a real app, HASH THIS!
            bankName: bankName,
            mcUsername: mcUsername,
            mcEdition: edition,
            balance: 0,
            tax: { selling: 0, buying: 0, paid: 0, history: [0,0,0,0,0,0,0] }
        };

        users[newBankId] = newUser;
        db.saveUsers(users);

        generatedBankIdInput.value = newBankId;
        generatedBankIdContainer.classList.remove('hidden');
        signupBtn.disabled = true;
        alert('Account created successfully! Your Bank ID is shown below. Please copy it for login.');
    });

    copyBankIdBtn.addEventListener('click', () => {
        generatedBankIdInput.select();
        document.execCommand('copy');
        alert('Bank ID copied to clipboard!');
    });

    loginIdentifier.addEventListener('input', () => {
        if (!loginIdentifier.value.toUpperCase().startsWith('BANK')) {
            loginEditionSelector.classList.remove('hidden');
        } else {
            loginEditionSelector.classList.add('hidden');
        }
    });

    loginBtn.addEventListener('click', () => {
        const identifier = loginIdentifier.value.trim();
        const password = loginPassword.value;
        const users = db.getUsers();
        let user = null;

        if (identifier.toUpperCase().startsWith('BANK')) {
            user = users[identifier.toUpperCase()];
        } else {
            const edition = document.querySelector('input[name="login-edition"]:checked').value;
            const usernameToFind = edition === 'bedrock' ? `.${identifier}` : identifier;
            user = Object.values(users).find(u => u.mcUsername.toLowerCase() === usernameToFind.toLowerCase() && u.mcEdition === edition);
        }

        if (user && user.password === password) {
            currentUser = user;
            db.setCurrentUser(user);
            showApp();
        } else {
            alert('Invalid credentials. Please try again.');
        }
    });

    logoutBtn.addEventListener('click', () => {
        currentUser = null;
        db.logoutUser();
        showAuth();
    });

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    // ~~~~~~ APP UI & LOGIC ~~~~~~~~~~~~ //
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    function updateAppUI() {
        if (!currentUser) return;

        // --- Header ---
        const profileChar = currentUser.mcUsername.replace('.', '').charAt(0).toUpperCase();
        profilePic.textContent = profileChar;
        usernameDisplay.textContent = currentUser.mcUsername;

        // --- Bank Status Page ---
        statusBankName.textContent = currentUser.bankName;
        statusBankBalance.textContent = `$ ${currentUser.balance.toFixed(2)}`;
        statusBankId.textContent = currentUser.bankId;

        // --- Tax Page ---
        taxProfilePic.querySelector('span').textContent = profileChar;
        taxBankName.textContent = currentUser.bankName;
        taxMcName.textContent = currentUser.mcUsername;
        document.getElementById('tax-selling').textContent = `$ ${currentUser.tax.selling.toFixed(2)}`;
        document.getElementById('tax-buying').textContent = `$ ${currentUser.tax.buying.toFixed(2)}`;
        const totalTax = currentUser.tax.selling + currentUser.tax.buying;
        document.getElementById('tax-total').textContent = `$ ${totalTax.toFixed(2)}`;
        document.getElementById('tax-paid').textContent = `$ ${currentUser.tax.paid.toFixed(2)}`;

        renderTaxChart();
        updateLoanUI();
    }

    function renderTaxChart() {
        if (taxChart) {
            taxChart.destroy();
        }
        taxChart = new Chart(taxChartCanvas, {
            type: 'line',
            data: {
                labels: ['6 days ago', '5 days ago', '4 days ago', '3 days ago', '2 days ago', 'Yesterday', 'Today'],
                datasets: [{
                    label: 'Daily Tax Charges',
                    data: currentUser.tax.history,
                    borderColor: '#50e3c2',
                    backgroundColor: 'rgba(80, 227, 194, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#50e3c2',
                    pointBorderColor: '#fff',
                    pointHoverRadius: 7,
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#50e3c2'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#a0a0a0'
                        },
                        grid: {
                            color: '#3a4b5c'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#a0a0a0'
                        },
                        grid: {
                            color: '#3a4b5c'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // --- Page Navigation ---
    mainNavButtons.forEach(button => {
        button.addEventListener('click', () => {
            mainNavButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const pageId = `${button.dataset.page}-page`;
            pages.forEach(page => {
                if (page.id === pageId) {
                    page.classList.add('active');
                } else {
                    page.classList.remove('active');
                }
            });
        });
    });

    // --- Loan Logic ---
    const loanInterestRates = {
        personal: [6, 7, 9, 13, 16],
        home: [2, 3, 4, 5, 6.5],
        business: [5, 7, 8, 10.5, 13],
        business_startup: [3, 4, 6, 7, 9],
        home_startup: [2, 3, 5, 7, 8]
    };

    function updateLoanUI() {
        const type = loanType.value;
        loanFieldsContainer.innerHTML = ''; // Clear previous fields

        const createField = (label, type, id, placeholder) => {
            return `<div class="input-group">
                        <label for="${id}">${label}</label>
                        <input type="${type}" id="${id}" placeholder="${placeholder}">
                    </div>`;
        };

        const createUploadField = (label, id) => {
            return `<div class="input-group">
                        <label for="${id}">${label}</label>
                        <input type="file" id="${id}">
                    </div>`;
        }

        switch (type) {
            case 'personal':
                loanFieldsContainer.innerHTML += createField('Your Name', 'text', 'loan-name', 'Enter your full name');
                loanFieldsContainer.innerHTML += createField('Job / Income Source', 'text', 'loan-job', 'e.g., Diamond Miner');
                loanFieldsContainer.innerHTML += createField('Per Day Income', 'number', 'loan-income', 'e.g., 50');
                break;
            case 'home':
            case 'business':
                loanFieldsContainer.innerHTML += createUploadField('Upload Property Picture', 'loan-pic');
                loanFieldsContainer.innerHTML += createField('Start Coordinates (X, Y, Z)', 'text', 'loan-coords1', '100, 64, -250');
                loanFieldsContainer.innerHTML += createField('End Coordinates (X, Y, Z)', 'text', 'loan-coords2', '150, 90, -200');
                break;
            case 'home_startup':
            case 'business_startup':
                loanFieldsContainer.innerHTML += createField('Job / Income Source', 'text', 'loan-job', 'e.g., Farmer');
                loanFieldsContainer.innerHTML += createField('Per Day Income', 'number', 'loan-income', 'e.g., 20');
                break;
        }
        updateLoanSummary();
    }

    function updateLoanSummary() {
        const type = loanType.value;
        const durationIndex = loanDuration.value - 1;
        const rate = loanInterestRates[type][durationIndex];
        const principal = parseFloat(loanAmount.value) || 0;

        loanInterestRate.textContent = `${rate}%`;

        if (principal > 0) {
            const total = principal * (1 + rate / 100);
            const perDay = total / (loanDuration.value * 7);
            loanPerDay.textContent = `$ ${perDay.toFixed(2)}`;
            loanTotalRepayment.textContent = `$ ${total.toFixed(2)}`;
        } else {
            loanPerDay.textContent = '---';
            loanTotalRepayment.textContent = '---';
        }
    }

    function setupEventListeners() {
        loanType.addEventListener('change', updateLoanUI);
        loanDuration.addEventListener('change', updateLoanSummary);
        loanAmount.addEventListener('input', updateLoanSummary);
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    // ~~~~~~~~ KICKSTART ~~~~~~~~~~~~~~~ //
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    init();
});
