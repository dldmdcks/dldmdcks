document.addEventListener('DOMContentLoaded', function () {
    lucide.createIcons();

    const KOREA_REGION_DATA = {
        // ... (data from previous step)
    };

    // -- Initialize UI Components (Tabs, Expandables) --
    // ... (code from previous step)

    // -- New Property Form Logic & Event Listeners --
    // ... (code from previous step)

    // -- Fetch and Render Live Properties --
    async function fetchAndRenderProperties() {
        try {
            const response = await fetch('/api/properties');
            if (!response.ok) {
                throw new Error('데이터를 불러오는 데 실패했습니다.');
            }
            const properties = await response.json();
            const propertiesList = document.getElementById('live-properties-list');
            
            // Clear placeholder
            propertiesList.innerHTML = '<h3>🏢 오피스텔 매물</h3>'; 

            if (properties.length === 0) {
                propertiesList.innerHTML += '<p>현재 확인된 살아있는 매물이 없습니다.</p>';
                return;
            }

            properties.forEach(prop => {
                const dDayColor = prop.d_day >= 4 ? 'green' : 'red';
                const dDayText = prop.d_day >= 0 ? `D-${prop.d_day}` : `D+${-prop.d_day}🚨`;

                const cardHTML = `
                    <div class="property-card card" data-id="${prop.row_idx}">
                        <p>
                            <strong>${prop.b_name}</strong> (${prop.tr_type} ${prop.price_str})
                            <span class="d-day-badge ${dDayColor}">${dDayText}</span>
                        </p>
                        <p class="property-meta">입주: ${prop.end_date} | 유형: ${prop.biz_type} | 담당: ${prop.registrar}</p>
                        <p class="property-memo"><i data-lucide="message-square"></i> ${prop.memo}</p>
                        <div class="property-actions">
                            <div class="action-expand expandable">
                                <div class="action-header toggle-expand">
                                    <span>🔄 최신화(연장)</span>
                                    <i data-lucide="chevron-down"></i>
                                </div>
                                <div class="expand-content" style="display:none;">
                                    <form class="update-form">
                                        <input type="text" placeholder="추가 피드">
                                        <button type="submit" class="button-primary">최신화(+1)</button>
                                    </form>
                                </div>
                            </div>
                            <div class="action-expand expandable">
                                <div class="action-header toggle-expand">
                                    <span>❌ 내리기(계약/보류)</span>
                                    <i data-lucide="chevron-down"></i>
                                </div>
                                <div class="expand-content" style="display:none;">
                                    <form class="drop-form">
                                        <select><option>타부동산 계약</option><option>보류</option></select>
                                        <button type="submit" class="button-danger">내리기</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                propertiesList.innerHTML += cardHTML;
            });

            // Re-initialize icons and expandable sections inside the newly added cards
            lucide.createIcons();
            initializeExpandableActions();

        } catch (error) {
            console.error(error);
            const propertiesList = document.getElementById('live-properties-list');
            propertiesList.innerHTML = '<p style="color: red;">매물 목록을 불러오는 중 오류가 발생했습니다.</p>';
        }
    }
    
    function initializeExpandableActions() {
        const actionHeaders = document.querySelectorAll('.property-card .action-header.toggle-expand');
        actionHeaders.forEach(header => {
            // Prevent duplicate listeners
            if (header.dataset.initialized) return;
            header.dataset.initialized = true;

            header.addEventListener('click', () => {
                const container = header.closest('.action-expand');
                const content = container.querySelector('.expand-content');
                container.classList.toggle('open');
                content.style.display = container.classList.contains('open') ? 'block' : 'none';
            });
        });
    }

    // -- Initial Load --
    fetchAndRenderProperties();

    // -- User Role Simulation (already present) --
    // ...
});
