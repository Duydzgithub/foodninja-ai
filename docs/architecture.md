# Sơ đồ khối hệ thống và logic xử lý

Tài liệu mô tả kiến trúc tổng thể và luồng xử lý chính của hệ thống Nhận diện Thực phẩm & Tư vấn Dinh dưỡng (PWA + Flask API + Clarifai/CalorieNinjas/Cohere).

## 1) Sơ đồ khối tổng thể

```mermaid
graph TD
  U[Người dùng<br/>Mobile / Desktop] -->|HTTPS| PWA[Frontend PWA (SPA)<br/>HTML/CSS/JS]
  PWA -->|/predict (multipart image)| B[Flask Backend API]
  PWA -->|/chat (JSON)| B
  PWA -->|/ask_ai (JSON)| B
  
  PWA <-->|Cache tĩnh| SW[Service Worker]
  PWA <-->|Lưu lịch sử| LS[LocalStorage]

  B -->|PAT| CV[Clarifai<br/>food-item-recognition]
  B -->|X-Api-Key| CN[CalorieNinjas<br/>Nutrition DB]
  B -->|API Key| CAI[Cohere<br/>LLM]

  B -. CORS/Rate limit/Validation .- PWA
  classDef ext fill:#f7f7f7,stroke:#aaa,color:#333;
  class CV,CN,CAI ext;
```

Thành phần chính:
- Frontend PWA: giao diện, camera/upload, hiển thị kết quả, chatbot, lưu lịch sử cục bộ, cài đặt như app.
- Backend Flask: điều phối gọi Clarifai → lọc độ tin cậy → CalorieNinjas → Cohere → trả JSON.
- Dịch vụ ngoài: Clarifai (CV), CalorieNinjas (dinh dưỡng), Cohere (phân tích & tư vấn).

Biến môi trường chính: `CLARIFAI_PAT`, `CALORIE_API_KEY`, `COHERE_API_KEY`, `ALLOWED_ORIGINS`, `MIN_CONFIDENCE` (mặc định 0.4).

---

## 2) Trình tự xử lý /predict

```mermaid
sequenceDiagram
  participant U as User
  participant F as Frontend (PWA)
  participant B as Backend (Flask)
  participant CV as Clarifai
  participant ND as CalorieNinjas
  participant AI as Cohere

  U->>F: Chọn/Chụp ảnh (preview)
  F->>B: POST /predict (multipart image)
  B->>CV: predict_by_bytes(image)
  CV-->>B: concepts[] (name, probability)
  alt Độ tin cậy < MIN_CONFIDENCE
    B-->>F: JSON { low_confidence:true, message, alternatives[] }
    F->>U: Hiện cảnh báo + gợi ý + nút "Hỏi AI"/"Thử lại"
  else Độ tin cậy ≥ MIN_CONFIDENCE
    B->>ND: GET /nutrition?query=food_name
    ND-->>B: nutrition JSON
    B->>AI: chat(prompt từ food_name + nutrition)
    AI-->>B: ai_answer (text)
    B-->>F: JSON { food_name, probability, nutrition, ai_answer }
    F->>U: Hiển thị kết quả + phân tích AI; lưu lịch sử
  end
```

---

## 3) Logic lọc độ tin cậy và phản hồi người dùng

```mermaid
flowchart TD
  A[Nhận ảnh từ client] --> B[Gọi Clarifai]
  B --> C[Lấy dự đoán top-1: (food, prob)]
  C -->|prob < MIN_CONFIDENCE| D[Trả về low_confidence:true<br/>message + top-3 alternatives<br/>BỎ QUA gọi dinh dưỡng/AI]
  C -->|prob ≥ MIN_CONFIDENCE| E[Gọi CalorieNinjas]
  E --> F[Gọi Cohere (phân tích)]
  F --> G[Trả JSON: food, prob, nutrition, ai_answer]

  D --> H[Frontend hiển thị cảnh báo + chip gợi ý]
  H --> I[Optional: /ask_ai với món gợi ý]
  I --> J[Hiển thị trả lời AI (tổng quan)]

  classDef good fill:#e8f5e9,stroke:#66bb6a,color:#2e7d32;
  classDef warn fill:#fff8e1,stroke:#ffb74d,color:#ef6c00;
  class D,H warn;
  class G good;
```

Gợi ý hiển thị (low confidence):
- Nhắc chụp gần hơn, đủ sáng, nền đơn giản, chỉ 1 món chính.
- Hiện top-3 gợi ý (nút chip) và nút “Hỏi AI về món …”.
- Cho phép “Chụp/Upload ảnh khác”.

---

## 4) PWA & Offline (App Shell)

```mermaid
flowchart LR
  U[User] -->|Lần đầu| Net[CDN/Hosting]
  Net --> SW[Service Worker đăng ký]
  SW --> C[Cache App Shell (HTML/CSS/JS/icons)]
  U -->|Lần sau| SW
  SW -->|Cache hit| F[App chạy offline cơ bản]
  SW -->|Network fetch| Net
```

Ghi chú:
- Ảnh chụp/upload và gọi API cần mạng; App shell có thể hoạt động offline hạn chế.
- Camera yêu cầu HTTPS trên mobile browser.

---

## 5) Ma trận endpoint và dữ liệu

- POST `/predict`: multipart form-data `image` → JSON `{ low_confidence?, min_confidence, food_name, probability, alternatives?, nutrition?, ai_answer? }`
- POST `/chat`: JSON `{ message }` → JSON `{ response }`
- POST `/ask_ai`: JSON `{ prompt }` → JSON `{ result }`
- GET `/`: health check

---

Phiên bản: 10/08/2025
