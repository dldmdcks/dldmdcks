document.addEventListener('DOMContentLoaded', () => {
    const state = {
        team: ['김팀장', '박부장', '이대리', '최주임', '정사원'],
        owners: [
            { name: '홍길동', contact: '010-1234-5678' },
            { name: '김철수', contact: '010-9876-5432' },
        ],
        properties: [
            { id: 1, registered_date: '2023-10-01', address: '서울시 강남구 삼성동 100', property_type: '아파트', transaction_type: '매매', price: 150000, area: 84, owner: '홍길동', manager: '김팀장', status: '거래가능', description: '로얄층, 한강뷰' },
            { id: 2, registered_date: '2023-10-15', address: '서울시 용산구 한남동 200', property_type: '빌라', transaction_type: '전세', price: 80000, area: 120, owner: '김철수', manager: '박부장', status: '거래중', description: '리모델링 완료, 즉시 입주 가능' },
            { id: 3, registered_date: '2023-10-28', address: '서울시 마포구 공덕동 300', property_type: '오피스텔', transaction_type: '월세', price: 5000, rent: 150, area: 45, owner: '홍길동', manager: '이대리', status: '거래완료', description: '역세권, 풀옵션' },
        ],
        contracts: [
             { id: 1, date: '2023-10-26', address: '서울시 강남구 역삼동', type: '전세', commission: 200, manager: '이대리' },
             { id: 2, date: '2023-10-28', address: '서울시 서초구 반포동', type: '매매', commission: 550, manager: '김팀장' },
        ],
    };

    const updateSidebarStats = () => {
        const today = new Date().toISOString().slice(0, 10);
        const currentMonth = today.slice(0, 7);

        const totalProperties = state.properties.length;
        const availableProperties = state.properties.filter(p => p.status === '거래가능').length;
        const todayRegistered = state.properties.filter(p => p.registered_date === today).length;
        const monthlyCommission = state.contracts
            .filter(c => c.date.startsWith(currentMonth))
            .reduce((sum, c) => sum + c.commission, 0);

        document.getElementById('status-total-properties').textContent = totalProperties;
        document.getElementById('status-available-properties').textContent = availableProperties;
        document.getElementById('status-today-registered').textContent = todayRegistered;
        document.getElementById('status-monthly-commission').textContent = `${monthlyCommission.toLocaleString()}만원`;
    };

    const setActiveTab = (section, tab) => { /* ... */ };
    const initNavigation = () => { /* ... */ };

    const initSidebar = () => {
        const statusHeader = document.querySelector('.sidebar-status .status-header');
        statusHeader.addEventListener('click', () => {
            const sidebarStatus = document.querySelector('.sidebar-status');
            sidebarStatus.classList.toggle('expanded');
        });
        updateSidebarStats();
    };

    const initContractSettlement = () => {
        const form = document.getElementById('settlement-entry-form');
        // ... (rest of the function)
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // ... (form data processing)
            state.contracts.push(newContract);
            form.reset();
            renderSettlementList();
            setActiveTab('contract', 'settlement-view');
            updateSidebarStats(); // Update stats on new contract
        });
        renderSettlementList();
    };

    const initPropertyManagement = () => {
        // ... (search form, list container setup)

        // ... (renderPropertyList function)

        propertyListContainer.addEventListener('click', (e) => {
            // ... (summary click logic)
            if (deleteButton) {
                const propertyId = parseInt(item.dataset.id, 10);
                state.properties = state.properties.filter(p => p.id !== propertyId);
                searchForm.dispatchEvent(new Event('submit'));
                updateSidebarStats(); // Update stats on delete
            }
        });

        const registrationForm = document.getElementById('property-registration-form');
        // ... (dropdown population)

        registrationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(registrationForm);
            const newProperty = {
                id: Date.now(),
                registered_date: new Date().toISOString().slice(0, 10),
                // ... (rest of the properties)
            };
            state.properties.push(newProperty);
            registrationForm.reset();
            renderPropertyList(state.properties, propertyListContainer);
            setActiveTab('property', 'property-search');
            updateSidebarStats(); // Update stats on new property
        });

        // ... (owner management logic)
    };

    // ... (initMonthlyStats, initTeamStats)

    const init = () => {
        initNavigation();
        initSidebar();
        initContractSettlement();
        initMonthlyStats();
        initTeamStats();
        initPropertyManagement();
    };

    init();
});
