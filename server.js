const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// 임시 사용자 데이터 저장소
const users = [];

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// 회원가입 엔드포인트
app.post('/signup', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: '사용자 이름과 비밀번호를 모두 입력해주세요.' });
    }

    // 사용자 이름 중복 확인
    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: '이미 존재하는 사용자 이름입니다.' });
    }

    const newUser = { username, password };
    users.push(newUser);

    res.status(201).json({ message: '회원가입이 완료되었습니다.' });
});

// 로그인 엔드포인트
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: '사용자 이름과 비밀번호를 모두 입력해주세요.' });
    }

    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ message: '사용자 이름 또는 비밀번호가 잘못되었습니다.' });
    }

    res.status(200).json({ message: '로그인 성공!' });
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
