document.addEventListener('DOMContentLoaded', () => {
    // Page selectors
    const loginPage = document.getElementById('login-page');
    const registerPage = document.getElementById('register-page');
    const mainApp = document.getElementById('main-app');
    const pages = {
        'login': loginPage,
        'register': registerPage,
        'main': mainApp
    };

    // Auth form elements
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');

    // Login fields
    const loginIdType = document.getElementById('login-id-type');
    const loginBankIdGroup = document.getElementById('login-bank-id-group');
    const loginMinecraftGroup = document.getElementById('login-minecraft-group');
    const loginMinecraftEdition = document.getElementById('login-minecraft-edition');
    const loginJavaUsernameGroup = document.getElementById('login-minecraft-username-group');
    const loginBedrockUsernameGroup = document.getElementById('login-bedrock-username-group');
    const loginBankIdInput = document.getElementById('login-bank-id');
    const loginMinecraftUsernameInput = document.getElementById('login-minecraft-username');
    const loginBedrockUsernameInput = document.getElementById('login-bedrock-username-input');
    const loginPasswordInput = document.getElementById('login-password');

    // Register fields
    const registerBankNameInput = document.getElementById('register-bank-name');
    const registerMinecraftEdition = document.getElementById('register-minecraft-edition');
    const registerJavaUsernameGroup = document.getElementById('register-java-username-group');
    const registerBedrockUsernameGroup = document.getElementById('register-bedrock-username-group');
    const registerJavaUsernameInput = document.getElementById('register-java-username');
    const registerBedrockUsernameInput = document.getElementById('register-bedrock-username-input');
    const registerPasswordInput = document.getElementById('register-password');
    const generatedBankIdInput = document.getElementById('generated-bank-id');
    const copyBankIdBtn = document.getElementById('copy-bank-id');

    // Main app elements
    const sidebar = document.querySelector('.sidebar');
    const openSidebarBtn = document.getElementById('open-sidebar');
    const closeSidebarBtn = document.getElementById('close-sidebar');
    const mainContent = document.querySelector('.main-content');
    const navLinks = document.querySelectorAll('.nav-link');
    const mainPages = document.querySelectorAll('.main-page');
    const logoutBtn = document.getElementById('logout-btn');
    const profileInitial = document.getElementById('profile-initial');

    // Bank Status Page
    const statusBankName = document.getElementById('status-bank-name');
    const statusBankBalance = document.getElementById('status-bank-balance');

    // Tax Page
    const taxProfileInitial = document.getElementById('tax-profile-initial');
    const taxBankName = document.getElementById('tax-bank-name');
    const taxMinecraftName = document.getElementById('tax-minecraft-name');
    const totalTax = document.getElementById('total-tax');
    const sellingTax = document.getElementById('selling-tax');
    const buyingTax = document.getElementById('buying-tax');
    const taxPaid = document.getElementById('tax-paid');
    const taxHistoryList = document.getElementById('tax-history-list');
    const taxChartCanvas = document.getElementById('tax-chart-canvas');
    let taxChart;

    // Loan Page
    const loanTypeSelect = document.getElementById('loan-type');
    const loanDurationSelect = document.getElementById('loan-duration');
    const loanInterestRate = document.getElementById('loan-interest-rate');
    const loanPerDayCost = document.getElementById('loan-per-day-cost');
    const loanDetailGroups = {
        'personal': document.getElementById('loan-details-personal'),
        'home': document.getElementById('loan-details-home'),
        'business': document.getElementById('loan-details-business'),
        'home-startup': document.getElementById('loan-details-startup'),
        'business-startup': document.getElementById('loan-details-startup')
    };

    // Settings Page
    const settingsBankNameInput = document.getElementById('settings-bank-name');
    const settingsMinecraftUsernameInput = document.getElementById('settings-minecraft-username');
    const settingsSocialInfoInput = document.getElementById('settings-social-info');
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    const currentPasswordInput = document.getElementById('current-password');
    const newPasswordInput = document.getElementById('new-password');
    const changePasswordBtn = document.getElementById('change-password-btn');

    // Theme Settings
    const themeSelect = document.getElementById('theme-select');

    // Top Payers
    const topTaxPayersList = document.getElementById('top-tax-payers-list');
    const topAdvTaxPayersList = document.getElementById('top-adv-tax-payers-list');

    // --- Data Store ---
    let users = JSON.parse(localStorage.getItem('bankUsers')) || [];
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    const saveUsers = () => {
        localStorage.setItem('bankUsers', JSON.stringify(users));
    };

    // --- Initial Setup ---
    const init = () => {
        // Create a default user for testing
        if (!users.find(u => u.bankId === 'BANK006443')) {
            users.push({
                bankId: 'BANK006443',
                password: '26',
                bankName: 'Test Bank',
                mcEdition: 'java',
                mcUsername: 'tester',
                balance: 10000,
                socialInfo: '',
                taxData: {
                    total: 500, selling: 300, buying: 200, paid: 100,
                    history: [{ date: '2025-06-28', amount: 50 }, { date: '2025-06-20', amount: 50 }],
                    daily: [10, 15, 5, 20, 12, 25, 18]
                }
            });
            saveUsers();
        }

        // Dummy data for top payers
        localStorage.setItem('topTaxPayers', JSON.stringify([
            { name: 'Player1', amount: 1500 },
            { name: 'Player2', amount: 1200 },
            { name: 'Player3', amount: 950 },
        ]));
        localStorage.setItem('topAdvTaxPayers', JSON.stringify([
            { name: 'AdvPlayerA', amount: 800 },
            { name: 'AdvPlayerB', amount: 750 },
            { name: 'AdvPlayerC', amount: 600 },
        ]));

        if (currentUser) {
            navigateTo('main');
            loadUserData();
        } else {
            navigateTo('login');
        }
    };

    // --- Navigation ---
    const navigateTo = (pageName) => {
        Object.values(pages).forEach(p => p.classList.remove('active'));
        if (pages[pageName]) {
            pages[pageName].classList.add('active');
        }
        if (pageName === 'main') {
            mainApp.style.display = 'flex';
        } else {
            mainApp.style.display = 'none';
        }
    };

    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('register');
        generateBankId();
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('login');
    });

    // --- Authentication ---
    loginBtn.addEventListener('click', () => {
        const idType = loginIdType.value;
        const password = loginPasswordInput.value;
        let user;

        if (idType === 'bank-id') {
            const bankId = loginBankIdInput.value;
            user = users.find(u => u.bankId === bankId && u.password === password);
        } else {
            const edition = loginMinecraftEdition.value;
            const username = edition === 'java' ? loginMinecraftUsernameInput.value : '.' + loginBedrockUsernameInput.value;
            user = users.find(u => u.mcUsername === username && u.mcEdition === edition && u.password === password);
        }

        if (user) {
            currentUser = user;
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            navigateTo('main');
            loadUserData();
        } else {
            alert('Invalid credentials!');
        }
    });

    registerBtn.addEventListener('click', () => {
        const bankName = registerBankNameInput.value;
        const edition = registerMinecraftEdition.value;
        const username = edition === 'java' ? registerJavaUsernameInput.value : '.' + registerBedrockUsernameInput.value;
        const password = registerPasswordInput.value;
        const bankId = generatedBankIdInput.value;

        if (!bankName || !username || !password) {
            alert('Please fill all fields.');
            return;
        }

        if (users.some(u => u.bankId === bankId) || users.some(u => u.mcUsername === username && u.mcEdition === edition)) {
            alert('User with this Bank ID or Minecraft name already exists.');
            return;
        }

        const newUser = {
            bankId, password, bankName, mcEdition: edition, mcUsername: username,
            balance: 1000, // Starting balance
            socialInfo: '',
            taxData: { total: 0, selling: 0, buying: 0, paid: 0, history: [], daily: [0,0,0,0,0,0,0] }
        };

        users.push(newUser);
        saveUsers();
        alert('Account created successfully! Please login.');
        navigateTo('login');
    });

    logoutBtn.addEventListener('click', () => {
        currentUser = null;
        sessionStorage.removeItem('currentUser');
        navigateTo('login');
    });

    // --- UI Logic ---
    loginIdType.addEventListener('change', () => {
        const isBankId = loginIdType.value === 'bank-id';
        loginBankIdGroup.style.display = isBankId ? 'block' : 'none';
        loginMinecraftGroup.style.display = isBankId ? 'none' : 'block';
    });

    loginMinecraftEdition.addEventListener('change', () => {
        const isJava = loginMinecraftEdition.value === 'java';
        loginJavaUsernameGroup.style.display = isJava ? 'block' : 'none';
        loginBedrockUsernameGroup.style.display = isJava ? 'none' : 'block';
    });

    registerMinecraftEdition.addEventListener('change', () => {
        const isJava = registerMinecraftEdition.value === 'java';
        registerJavaUsernameGroup.style.display = isJava ? 'block' : 'none';
        registerBedrockUsernameGroup.style.display = isJava ? 'none' : 'flex';
    });

    const generateBankId = () => {
        let newId;
        do {
            newId = 'BANK' + Math.random().toString().slice(2, 8).toUpperCase();
        } while (users.some(u => u.bankId === newId));
        generatedBankIdInput.value = newId;
    };

    copyBankIdBtn.addEventListener('click', () => {
        generatedBankIdInput.select();
        document.execCommand('copy');
        alert('Bank ID copied!');
    });

    // --- Main App Functionality ---
    const loadUserData = () => {
        if (!currentUser) return;

        // Update profile pic
        const initial = (currentUser.mcUsername.startsWith('.') ? currentUser.mcUsername.charAt(1) : currentUser.mcUsername.charAt(0)).toUpperCase();
        profileInitial.textContent = initial;
        taxProfileInitial.textContent = initial;

        // Load Bank Status
        statusBankName.textContent = currentUser.bankName;
        statusBankBalance.textContent = `$${currentUser.balance.toLocaleString()}`;

        // Load Tax Info
        taxBankName.textContent = currentUser.bankName;
        taxMinecraftName.textContent = currentUser.mcUsername;
        totalTax.textContent = `$${currentUser.taxData.total}`;
        sellingTax.textContent = `$${currentUser.taxData.selling}`;
        buyingTax.textContent = `$${currentUser.taxData.buying}`;
        taxPaid.textContent = `$${currentUser.taxData.paid}`;
        renderTaxHistory();
        renderTaxChart();

        // Load Settings
        settingsBankNameInput.value = currentUser.bankName;
        settingsMinecraftUsernameInput.value = currentUser.mcUsername;
        settingsSocialInfoInput.value = currentUser.socialInfo;

        // Load Top Payers
        renderTopPayers();

        // Set default page
        navigateToMainPage('bank-status');
    };

    const renderTaxHistory = () => {
        taxHistoryList.innerHTML = '';
        const history = currentUser.taxData.history.slice(-5);
        if (history.length === 0) {
            taxHistoryList.innerHTML = '<li>No payment history.</li>';
            return;
        }
        history.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `Paid $${item.amount} on ${item.date}`;
            taxHistoryList.appendChild(li);
        });
    };

    const renderTaxChart = () => {
        if (taxChart) {
            taxChart.destroy();
        }
        const ctx = taxChartCanvas.getContext('2d');
        taxChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
                datasets: [{
                    label: 'Daily Tax Charges',
                    data: currentUser.taxData.daily,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    };

    const renderTopPayers = () => {
        const topTax = JSON.parse(localStorage.getItem('topTaxPayers')) || [];
        const topAdvTax = JSON.parse(localStorage.getItem('topAdvTaxPayers')) || [];
        topTaxPayersList.innerHTML = topTax.map(p => `<li>${p.name} - $${p.amount}</li>`).join('');
        topAdvTaxPayersList.innerHTML = topAdvTax.map(p => `<li>${p.name} - $${p.amount}</li>`).join('');
    };

    // --- Sidebar and Page Navigation ---
    openSidebarBtn.addEventListener('click', () => sidebar.classList.add('open'));
    closeSidebarBtn.addEventListener('click', () => sidebar.classList.remove('open'));

    const navigateToMainPage = (pageId) => {
        mainPages.forEach(p => p.classList.remove('active'));
        document.getElementById(`${pageId}-page`).classList.add('active');
        sidebar.classList.remove('open');
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.dataset.page;
            if (pageId) {
                navigateToMainPage(pageId);
            }
        });
    });

    // --- Loan Calculation ---
    const interestRates = {
        personal: [6, 7, 9, 13, 16],
        home: [2, 3, 4, 5, 6.5],
        business: [5, 7, 8, 10.5, 13],
        'home-startup': [2, 3, 5, 7, 8],
        'business-startup': [3, 4, 6, 7, 9]
    };

    const updateLoanDetails = () => {
        const type = loanTypeSelect.value;
        const duration = parseInt(loanDurationSelect.value, 10);
        const amount = parseFloat(document.getElementById('loan-amount').value) || 0;

        // Show/hide specific loan fields
        Object.values(loanDetailGroups).forEach(group => group.style.display = 'none');
        if (loanDetailGroups[type]) {
            loanDetailGroups[type].style.display = 'block';
        }

        // Calculate interest
        const rate = interestRates[type][duration - 1];
        loanInterestRate.textContent = rate;

        // Calculate per day cost
        const totalCost = amount * (1 + rate / 100);
        const perDayCost = totalCost / (duration * 7);
        loanPerDayCost.textContent = `$${perDayCost.toFixed(2)}`;
    };

    loanTypeSelect.addEventListener('change', updateLoanDetails);
    loanDurationSelect.addEventListener('change', updateLoanDetails);
    document.getElementById('loan-amount').addEventListener('input', updateLoanDetails);

    // --- Settings ---
    saveSettingsBtn.addEventListener('click', () => {
        currentUser.bankName = settingsBankNameInput.value;
        currentUser.socialInfo = settingsSocialInfoInput.value;
        const userIndex = users.findIndex(u => u.bankId === currentUser.bankId);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            saveUsers();
            alert('Settings saved!');
            loadUserData(); // Refresh display
        }
    });

    changePasswordBtn.addEventListener('click', () => {
        if (currentPasswordInput.value !== currentUser.password) {
            alert('Incorrect current password.');
            return;
        }
        if (!newPasswordInput.value) {
            alert('New password cannot be empty.');
            return;
        }
        currentUser.password = newPasswordInput.value;
        const userIndex = users.findIndex(u => u.bankId === currentUser.bankId);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            saveUsers();
            alert('Password changed successfully!');
            currentPasswordInput.value = '';
            newPasswordInput.value = '';
        }
    });

    // --- Theme Switcher ---
    themeSelect.addEventListener('change', () => {
        document.documentElement.setAttribute('data-theme', themeSelect.value);
        localStorage.setItem('theme', themeSelect.value);
    });

    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeSelect.value = savedTheme;

    // --- Initialize App ---
    init();
});
