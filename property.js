document.addEventListener('DOMContentLoaded', () => {
    const state = {
        team: ['김팀장', '박부장', '이대리', '최주임', '정사원'],
        owners: [
            { id: 1, name: '홍길동', contact: '010-1234-5678' },
            { id: 2, name: '김철수', contact: '010-9876-5432' },
        ],
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
        if (statusHeader) {
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

    const initPropertyManagement = () => {
        const searchForm = document.getElementById('property-search-form');
        const propertyListContainer = document.getElementById('property-list');
        const registrationForm = document.getElementById('property-registration-form');
        const ownerRegForm = document.getElementById('add-owner-form');
        const ownerListContainer = document.getElementById('owner-list');
        const ownerPropertiesContainer = document.getElementById('owner-properties-list');

        const renderPropertyList = (properties, container) => {
            container.innerHTML = '';
            if (properties.length === 0) {
                container.innerHTML = '<p>해당하는 매물이 없습니다.</p>';
                return;
            }

            properties.forEach(p => {
                const owner = state.owners.find(o => o.id === p.owner);
                const item = document.createElement('div');
                item.className = 'property-item-summary';
                item.dataset.id = p.id;
                item.innerHTML = `
                    <div><strong>${p.address}</strong></div>
                    <div>${p.status}</div>
                    <div><button class="button-secondary button-sm">상세</button></div>
                `;
                container.appendChild(item);
            });
             document.getElementById('property-results-caption').textContent = `총 ${properties.length}개의 매물이 있습니다.`;
        };

        const renderOwnerList = () => {
            ownerListContainer.innerHTML = '';
            state.owners.forEach(owner => {
                const item = document.createElement('div');
                item.className = 'owner-list-item';
                item.dataset.id = owner.id;
                item.innerHTML = `
                    <span>${owner.name}</span>
                    <i data-lucide='chevron-right' class='icon-sm'></i>
                `;
                ownerListContainer.appendChild(item);
            });
        };
        
        const renderOwnerProperties = (ownerId) => {
            const properties = state.properties.filter(p => p.owner === ownerId);
            ownerPropertiesContainer.innerHTML = '';

            if(properties.length === 0) {
                ownerPropertiesContainer.innerHTML = '<p>이 소유자의 보유 매물이 없습니다.</p>';
                return;
            }
            
            properties.forEach(p => {
                const item = document.createElement('div');
                item.className = 'property-item-summary';
                item.innerHTML = `
                    <div><strong>${p.address}</strong> (${p.property_type}/${p.transaction_type})</div>
                    <div>${p.status}</div>
                     <div><button class="button-secondary button-sm button-delete" data-id="${p.id}"><i data-lucide="trash-2" class="icon-sm"></i></button></div>
                `;
                ownerPropertiesContainer.appendChild(item);
            });
            lucide.createIcons();
        };

        const populateDropdowns = () => {
            const ownerSelect = registrationForm.querySelector('select[name="p_reg_owner"]');
            const managerSelect = registrationForm.querySelector('select[name="p_reg_manager"]');
            
            ownerSelect.innerHTML = state.owners.map(o => `<option value="${o.id}">${o.name}</option>`).join('');
            managerSelect.innerHTML = state.team.map(m => `<option>${m}</option>`).join('');
        };

        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(searchForm);
            const address = formData.get('p_search_address').toLowerCase();
            const manager = formData.get('p_search_manager').toLowerCase();
            const status = formData.get('p_search_status');

            const filtered = state.properties.filter(p => 
                p.address.toLowerCase().includes(address) &&
                p.manager.toLowerCase().includes(manager) &&
                (status === '' || p.status === status)
            );
            renderPropertyList(filtered, propertyListContainer);
        });

        registrationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(registrationForm);
            const newProperty = {
                id: Date.now(),
                registered_date: new Date().toISOString().slice(0, 10),
                address: formData.get('p_reg_address'),
                property_type: formData.get('p_reg_property_type'),
                transaction_type: formData.get('p_reg_transaction_type'),
                price: parseInt(formData.get('p_reg_price')),
                rent: parseInt(formData.get('p_reg_rent')) || 0,
                m_fee: parseInt(formData.get('p_reg_m_fee')) || 0,
                area: parseFloat(formData.get('p_reg_area')),
                owner: parseInt(formData.get('p_reg_owner')),
                manager: formData.get('p_reg_manager'),
                status: '거래가능',
                description: formData.get('p_reg_description')
            };
            state.properties.push(newProperty);
            registrationForm.reset();
            searchForm.dispatchEvent(new Event('submit')); 
            setActiveTab('property-search');
            updateSidebarStats();
        });

        ownerRegForm.addEventListener('submit', e => {
            e.preventDefault();
            const name = e.target.owner_name.value;
            const contact = e.target.owner_contact.value;
            if (name && contact) {
                const newOwner = { id: Date.now(), name, contact };
                state.owners.push(newOwner);
                renderOwnerList();
                populateDropdowns();
                e.target.reset();
            }
        });

        ownerListContainer.addEventListener('click', e => {
            const item = e.target.closest('.owner-list-item');
            if(item) {
                const ownerId = parseInt(item.dataset.id);
                document.querySelectorAll('.owner-list-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                renderOwnerProperties(ownerId);
            }
        });
        
        ownerPropertiesContainer.addEventListener('click', e => {
            const deleteButton = e.target.closest('.button-delete');
            if (deleteButton) {
                const propertyId = parseInt(deleteButton.dataset.id, 10);
                const ownerItem = ownerListContainer.querySelector('.active');
                const ownerId = ownerItem ? parseInt(ownerItem.dataset.id) : null;
                
                state.properties = state.properties.filter(p => p.id !== propertyId);

                if(ownerId) renderOwnerProperties(ownerId);
                searchForm.dispatchEvent(new Event('submit'));
                updateSidebarStats();
            }
        });
        
        document.querySelector('.tab-nav').addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                setActiveTab(e.target.dataset.tab);
            }
        });

        renderPropertyList(state.properties, propertyListContainer);
        renderOwnerList();
        populateDropdowns();
    };

    const init = () => {
        initSidebar();
        initPropertyManagement();
        setActiveTab('owner-management'); // 초기 활성 탭
    };

    init();
});
