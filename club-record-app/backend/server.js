import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// 記憶體暫存資料 (重開伺服器會重置)
let households = [
  { id: 1, name: "王大明", phone: "0912-345-678", address: "村莊路1號", notes: "家中有長輩" },
  { id: 2, name: "李小華", phone: "0922-333-444", address: "村莊路2號", notes: "需要物資協助" },
  { id: 18, name: "百恩商店", phone: "03-1234567", address: "中心街", notes: "雜貨店，可詢問村莊近況" }
];

let records = [
  { id: "r1", householdId: 1, date: "2023-10-25", visitors: "張三, 李四", content: "送達秋季物資，長輩健康狀況良好。" }
];

app.get('/api/households', (req, res) => {
  res.json(households);
});

app.post('/api/households', (req, res) => {
  const newHouse = req.body;
  const index = households.findIndex(h => h.id === newHouse.id);
  if (index >= 0) {
    households[index] = newHouse;
  } else {
    households.push(newHouse);
  }
  res.json({ success: true, data: newHouse });
});

app.get('/api/records', (req, res) => {
  const { householdId } = req.query;
  let result = records;
  if (householdId) {
    result = records.filter(r => r.householdId === parseInt(householdId));
  }
  result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  res.json(result);
});

app.post('/api/records', (req, res) => {
  const newRecord = { 
    ...req.body, 
    id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` 
  };
  records.push(newRecord);
  res.json({ success: true, data: newRecord });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 後端伺服器已啟動！正在監聽 Port: ${PORT}`);
  console.log(`👉 測試 API: http://localhost:${PORT}/api/households`);
  console.log(`==================================================`);
});
