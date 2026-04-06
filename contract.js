document.addEventListener('DOMContentLoaded', () => {
    const initTabs = () => {
        const tabNav = document.querySelector('.main-header .tab-nav');
        if (!tabNav) return;

        tabNav.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const targetTab = e.target.dataset.tab;

                // Deactivate all tabs and content
                tabNav.querySelectorAll('.tab-button').forEach(btn => {
                    btn.classList.remove('active');
                    btn.textContent = `⚪️ ${btn.textContent.substring(2)}`;
                });
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });

                // Activate clicked tab and content
                e.target.classList.add('active');
                e.target.textContent = `✅ ${e.target.textContent.substring(2)}`;
                const newActiveContent = document.getElementById(targetTab);
                if (newActiveContent) {
                    newActiveContent.classList.add('active');
                }
            }
        });
    };

    const initConfirmRequestForm = () => {
        const formContainer = document.getElementById('confirm-request');
        if (!formContainer) return;

        const submitButton = formContainer.querySelector('.button-danger');
        if (!submitButton) return;

        submitButton.addEventListener('click', (e) => {
            e.preventDefault();

            const getValue = (selector) => {
                const element = formContainer.querySelector(selector);
                return element ? element.value : '';
            };

            const getRadioValue = (name) => {
                const element = formContainer.querySelector(`input[name="${name}"]:checked`);
                return element ? element.parentElement.textContent.trim() : '';
            }

            const propertyType = getRadioValue('property-type');
            const sido = getValue('#sido');
            const sigungu = getValue('#sigungu');
            const dong = getValue('#dong');
            const beonji = getValue('#beonji');
            const buildingDong = getValue('#building-dong');
            const ho = getValue('#ho');
            const deposit = getValue('#deposit');
            const rent = getValue('#rent');
            const priorityRepayment = getValue('#priority-repayment');
            const loanStatus = getValue('#loan-status');
            const notes = getValue('#notes');

            const message = `
[✅ 계약 컨펌 요청]

🚨 등기종류: ${propertyType}

🏠 매물정보
- 주소: ${sido} ${sigungu} ${dong} ${beonji} ${buildingDong || ''} ${ho}호
- 보증금: ${Number(deposit).toLocaleString()}원
- 월세: ${Number(rent).toLocaleString()}원

⚖️ 권리분석
- 최우선변제금액: ${Number(priorityRepayment).toLocaleString()}원
- 대출유무: ${loanStatus}
- 특이사항: ${notes}
            `;

            alert("아래 내용으로 카카오워크에 전송됩니다:" + message);
            console.log("Generated message for Kakaowork:", message);
        });
    };

    const init = () => {
        lucide.createIcons();
        initTabs();
        initConfirmRequestForm();
    };

    init();
});
