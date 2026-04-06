document.addEventListener('DOMContentLoaded', () => {
    const state = {
        team: ['김팀장', '박부장', '이대리', '최주임', '정사원'],
        properties: [
            { id: 1, registered_date: '2023-10-01', address: '서울시 강남구 삼성동 100', property_type: '아파트', transaction_type: '매매', price: 150000, rent: 0, m_fee: 0, area: 84, owner: 1, manager: '김팀장', status: '거래가능', description: '로얄층, 한강뷰' },
            { id: 2, registered_date: '2023-10-15', address: '서울시 용산구 한남동 200', property_type: '빌라', transaction_type: '전세', price: 80000, rent: 0, m_fee: 0, area: 120, owner: 2, manager: '박부장', status: '거래중', description: '리모델링 완료, 즉시 입주 가능' },
            { id: 3, registered_date: '2023-10-28', address: '서울시 마포구 공덕동 300', property_type: '오피스텔', transaction_type: '월세', price: 5000, rent: 150, m_fee: 10, area: 45, owner: 1, manager: '이대리', status: '거래완료', description: '역세권, 풀옵션' },
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

    const initSidebar = () => {
        const statusHeader = document.querySelector('.sidebar-status .status-header');
        if(statusHeader) {
            statusHeader.addEventListener('click', () => {
                const sidebarStatus = document.querySelector('.sidebar-status');
                sidebarStatus.classList.toggle('expanded');
            });
        }
        updateSidebarStats();
    };

    const setActiveTab = (tabId) => {
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));

        document.getElementById(tabId).classList.add('active');
        document.querySelector(`.tab-button[data-tab='${tabId}']`).classList.add('active');
    };

    const initContractSettlement = () => {
        const form = document.getElementById('settlement-entry-form');
        const listContainer = document.getElementById('settlement-list-container');
        
        const renderSettlementList = () => {
            listContainer.innerHTML = '';
            state.contracts.forEach(c => {
                const item = document.createElement('div');
                item.className = 'list-item';
                item.innerHTML = `
                    <div>${c.date}</div>
                    <div>${c.address}</div>
                    <div>${c.type}</div>
                    <div>${c.commission.toLocaleString()}만원</div>
                    <div>${c.manager}</div>
                    <div><button class="button-danger button-sm" data-id="${c.id}">삭제</button></div>
                `;
                listContainer.appendChild(item);
            });
        };

        const populateManagerDropdown = () => {
            const managerSelect = form.querySelector('select[name="manager"]');
            managerSelect.innerHTML = state.team.map(m => `<option>${m}</option>`).join('');
        };

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const newContract = {
                id: Date.now(),
                date: formData.get('contract_date'),
                address: formData.get('address'),
                type: formData.get('contract_type'),
                commission: parseInt(formData.get('commission')),
                manager: formData.get('manager')
            };
            state.contracts.push(newContract);
            form.reset();
            renderSettlementList();
            setActiveTab('settlement-view');
            updateSidebarStats();
        });

        listContainer.addEventListener('click', e => {
            if (e.target.classList.contains('button-danger')) {
                const contractId = parseInt(e.target.dataset.id);
                state.contracts = state.contracts.filter(c => c.id !== contractId);
                renderSettlementList();
                updateSidebarStats();
            }
        });

        renderSettlementList();
        populateManagerDropdown();
    };

    const initMonthlyStats = () => {
        const form = document.getElementById('monthly-stats-form');
        const yearSelect = form.querySelector('select[name="stats_year"]');
        const monthSelect = form.querySelector('select[name="stats_month"]');
        const summaryContainer = document.getElementById('stats-summary-container');
        const tableContainer = document.getElementById('monthly-stats-table-container');
        
        const currentYear = new Date().getFullYear();
        for (let i = currentYear; i >= currentYear - 5; i--) {
            yearSelect.add(new Option(i, i));
        }
        for (let i = 1; i <= 12; i++) {
            monthSelect.add(new Option(i, i));
        }
        monthSelect.value = new Date().getMonth() + 1;

        form.addEventListener('submit', e => {
            e.preventDefault();
            const year = yearSelect.value;
            const month = monthSelect.value.padStart(2, '0');
            const period = `${year}-${month}`;

            const monthlyContracts = state.contracts.filter(c => c.date.startsWith(period));
            
            const totalCommission = monthlyContracts.reduce((sum, c) => sum + c.commission, 0);
            const totalCases = monthlyContracts.length;
            const avgCommission = totalCases > 0 ? totalCommission / totalCases : 0;

            summaryContainer.innerHTML = `
                <div class="card">
                    <h4>총 수수료</h4>
                    <p>${totalCommission.toLocaleString()} 만원</p>
                </div>
                <div class="card">
                    <h4>총 계약 건수</h4>
                    <p>${totalCases} 건</p>
                </div>
                <div class="card">
                    <h4>평균 수수료</h4>
                    <p>${avgCommission.toFixed(1).toLocaleString()} 만원</p>
                </div>
            `;

            tableContainer.innerHTML = `
                <div class="list-header">
                    <div>계약일</div><div>주소</div><div>유형</div><div>수수료</div><div>담당자</div>
                </div>
            ` + monthlyContracts.map(c => `
                <div class="list-item">
                     <div>${c.date}</div>
                     <div>${c.address}</div>
                     <div>${c.type}</div>
                     <div>${c.commission.toLocaleString()} 만원</div>
                     <div>${c.manager}</div>
                </div>
            `).join('');
        });
        form.dispatchEvent(new Event('submit'));
    };

    const initTeamStats = () => {
        const form = document.getElementById('team-stats-form');
        const yearSelect = form.querySelector('select[name="team_stats_year"]');
        const monthSelect = form.querySelector('select[name="team_stats_month"]');
        const leaderboardContainer = document.getElementById('leaderboard');
        
        const currentYear = new Date().getFullYear();
        for (let i = currentYear; i >= currentYear - 5; i--) {
            yearSelect.add(new Option(i, i));
        }
        for (let i = 1; i <= 12; i++) {
            monthSelect.add(new Option(i, i));
        }
        monthSelect.value = new Date().getMonth() + 1;

        form.addEventListener('submit', e => {
            e.preventDefault();
            const year = yearSelect.value;
            const month = monthSelect.value.padStart(2, '0');
            const period = `${year}-${month}`;

            const monthlyContracts = state.contracts.filter(c => c.date.startsWith(period));
            const stats = state.team.map(member => ({
                name: member,
                commission: monthlyContracts.filter(c => c.manager === member).reduce((sum, c) => sum + c.commission, 0),
                cases: monthlyContracts.filter(c => c.manager === member).length,
            }));
            
            stats.sort((a, b) => b.commission - a.commission);

            leaderboardContainer.innerHTML = '';
            stats.forEach((member, index) => {
                const item = document.createElement('div');
                item.className = 'leaderboard-item';
                item.innerHTML = `
                    <div class="rank">${index + 1}</div>
                    <div class="member-name">${member.name}</div>
                    <div class="member-commission">${member.commission.toLocaleString()} 만원</div>
                    <div class="member-cases">(${member.cases} 건)</div>
                `;
                leaderboardContainer.appendChild(item);
            });
        });

        form.dispatchEvent(new Event('submit'));
    };

    const init = () => {
        initSidebar();
        initContractSettlement();
        initMonthlyStats();
        initTeamStats();
        
        document.querySelector('.tab-nav').addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                setActiveTab(e.target.dataset.tab);
            }
        });

        setActiveTab('settlement-view');
    };

    init();
});
