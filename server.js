const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// --- Mock Data --- //
const users = [{ username: 'test', password: '1' }];

const allProperties = [
    // Live Properties
    { row_idx: 1, city: "서울특별시", gu: "송파구", dong: "방이동", bon: "28", bu: "2", bldg: "엘루이시티", room: "614", tr_type: "월세", price_str: "10,000,000 / 850,000", d_day: -4, end_date: "2026.06.03", biz_type: "무사업자", registrar: "곽태근대표", memo: "[26.04.02] 매물방 등록:", owner_name: "김소유", owner_phone: "010-1111-1111", pet_ok: false, tags: ["신규"] },
    { row_idx: 2, city: "서울특별시", gu: "송파구", dong: "방이동", bon: "28", bu: "2", bldg: "엘루이시티", room: "915", tr_type: "월세", price_str: "6,000,000 / 847,600", d_day: 4, end_date: "2026.05.03", biz_type: "주임사", registrar: "곽태근대표", memo: "[26.04.02] 매물방 등록: 입주가능일 조율 불가 고정임.", owner_name: "박임대", owner_phone: "010-2222-2222", pet_ok: true, tags: ["풀옵션"] },
    { row_idx: 3, city: "서울특별시", gu: "송파구", dong: "방이동", bon: "28", bu: "3", bldg: "푸르지오발라드", room: "1504", tr_type: "월세", price_str: "3,000 / 200", d_day: -3, end_date: "2025.01.01", biz_type: "일임사", registrar: "이용천팀장", memo: "[26.04.01] 신규 등록: 풀옵션, 전입가능", owner_name: "이건물", owner_phone: "010-3333-3333", pet_ok: true, tags: ["전입"] },
    // Additional data for search
    { row_idx: 4, city: "서울특별시", gu: "강남구", dong: "역삼동", bon: "123", bu: "45", bldg: "강남타워", room: "1010", tr_type: "전세", price_str: "50,000", d_day: 15, end_date: "2025.08.15", biz_type: "무사업자", registrar: "박팀장", memo: "시스템에어컨, 애완동물 불가능", owner_name: "최부자", owner_phone: "010-4444-4444", pet_ok: false, tags: ["역세권"] },
    { row_idx: 5, city: "경기도", gu: "성남시 분당구", dong: "정자동", bon: "5", bu: "", bldg: "분당아이파크", room: "2501", tr_type: "매매", price_str: "200,000", d_day: 90, end_date: "N/A", biz_type: "N/A", registrar: "김중개", memo: "조용한 주거 환경, 주차 2대 가능", owner_name: "정평온", owner_phone: "010-5555-5555", pet_ok: false, tags: ["주차"] }
];

const cleanNumeric = (t) => t.toString().replace(/[^0-9]/g, '');

// --- API Endpoints --- //

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return res.status(401).json({ message: '사용자 이름 또는 비밀번호가 잘못되었습니다.' });
    res.status(200).json({ message: '로그인 성공!' });
});

app.get('/api/properties/live', (req, res) => {
    // Simulate fetching only 'live' properties
    const liveProperties = allProperties.filter(p => p.row_idx <= 3); 
    res.status(200).json(liveProperties);
});

app.post('/api/properties/search', (req, res) => {
    const filters = req.body;
    let results = allProperties;

    if (filters.s_city && filters.s_city !== '전체') {
        results = results.filter(p => p.city === filters.s_city);
    }
    if (filters.s_gu && filters.s_gu !== '전체') {
        results = results.filter(p => p.gu === filters.s_gu);
    }
    if (filters.s_dong && filters.s_dong !== '전체') {
        results = results.filter(p => p.dong === filters.s_dong);
    }
    
    // Simple text search for bldg, bon, bu, room
    const bldgSearch = filters.b_search?.replace(/ /g, '') || '';
    if (bldgSearch) {
        results = results.filter(p => 
            (p.bldg + p.bon + p.bu).replace(/ /g, '').includes(bldgSearch)
        );
    }
    const roomSearch = filters.r_search?.replace(/ /g, '') || '';
    if (roomSearch) {
        results = results.filter(p => p.room.replace(/ /g, '').includes(roomSearch));
    }

    // Price filters (converted to millions/10 thousands for matching)
    // Note: This is a simplified search logic

    // Keyword search
    if (filters.pet_ok) {
        results = results.filter(p => p.pet_ok);
    }
    if (filters.kw_search) {
        const kw = filters.kw_search.replace(/ /g, '');
        results = results.filter(p => p.memo.includes(kw) || p.tags?.includes(kw));
    }
    
    res.status(200).json(results);
});

app.post('/api/token/use', (req, res) => {
    // Simulate token deduction
    console.log("Token used for property: ", req.body.propertyId);
    // In a real app, you would deduct from the user's token balance
    res.status(200).json({ message: "토큰이 사용되었습니다.", tokens_left: Math.floor(Math.random() * 100) });
});


app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});