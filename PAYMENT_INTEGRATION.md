# QuickPayment Integration - תיעוד טכני

## מבנה האינטגרציה

### API Routes שנוצרו:

```
/api/payments/
├── create/route.ts      - יצירת תשלום PayMe חדש
├── webhook/route.ts     - קבלת עדכונים מ-PayMe
└── invoice/[bookingId]/
    └── route.ts         - הורדת חשבונית
```

---

## 1. יצירת תשלום (`POST /api/payments/create`)

### Request:
```typescript
POST /api/payments/create
Content-Type: application/json
Cookie: auth-token=<JWT>

{
  "bookingId": "booking-id-here"
}
```

### Response (Success):
```json
{
  "success": true,
  "paymentUrl": "https://sandbox.payme.io/sale/generate/XXXX-XXXX",
  "paymeSaleId": "XXXX-XXXX-XXXX-XXXX"
}
```

### שימוש בלקוח:
```typescript
const response = await fetch('/api/payments/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ bookingId: booking.id }),
});

const { paymentUrl } = await response.json();

// פתח את דף התשלום
window.location.href = paymentUrl;
// או במודל:
// window.open(paymentUrl, '_blank');
```

---

## 2. Webhook Handler (`POST /api/payments/webhook`)

### מטרה:
מקבל התראות מ-PayMe על הצלחה/כישלון של תשלום.

### Payload מ-PayMe:
```json
{
  "payme_status": "success",
  "payme_sale_id": "XXXX-XXXX-XXXX-XXXX",
  "payme_transaction_id": "YYYY-YYYY-YYYY-YYYY",
  "transaction_id": "booking-id-from-our-db",
  "price": 10000,
  "currency": "ILS"
}
```

### תהליך:
1. אימות חתימה (אם קיימת)
2. חיפוש ההזמנה לפי `transaction_id`
3. עדכון `paymentStatus` ל-`PAID` או `FAILED`
4. יצירת `Transaction` record

### הגדרת Webhook ב-PayMe:
```
URL: https://your-domain.com/api/payments/webhook
Method: POST
Events: payment.success, payment.failed
```

---

## 3. הורדת חשבונית (`GET /api/payments/invoice/:bookingId`)

### Request:
```typescript
GET /api/payments/invoice/booking-123
Cookie: auth-token=<JWT>
```

### Response (Current - JSON):
```json
{
  "invoiceNumber": "INV-booking-",
  "date": "2025-12-02T...",
  "booking": {...},
  "customer": {...},
  "seller": {...},
  "payment": {...}
}
```

### TODO: PDF Generation
```typescript
// עתידי - יחזיר PDF
Response Headers:
  Content-Type: application/pdf
  Content-Disposition: attachment; filename="invoice-123.pdf"
```

---

## תהליך מלא - Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ 1. משתמש מזמין חדר עם חריגה (cost.price > 0)              │
└─────────────┬───────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. הזמנה נוצרת עם paymentStatus: PENDING                   │
└─────────────┬───────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. קריאה ל-POST /api/payments/create                        │
│    → מקבל paymentUrl מ-PayMe                                │
└─────────────┬───────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. הפניית משתמש ל-paymentUrl (דף PayMe)                    │
└─────────────┬───────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. משתמש מזין פרטי כרטיס אשראי ומשלם                       │
└─────────────┬───────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. PayMe שולח webhook ל-/api/payments/webhook              │
│    → מעדכן booking.paymentStatus = PAID                     │
└─────────────┬───────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. PayMe מפנה למשתמש חזרה ל-sale_return_url                │
│    → דשבורד עם הודעת הצלחה                                  │
└─────────────┬───────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. משתמש יכול להוריד חשבונית                               │
│    GET /api/payments/invoice/:bookingId                     │
└─────────────────────────────────────────────────────────────┘
```

---

## אבטחה

### 1. אימות Webhook
```typescript
const signature = request.headers.get('payme-signature');
const expectedSignature = crypto
  .createHmac('sha256', process.env.PAYME_WEBHOOK_SECRET)
  .update(JSON.stringify(body))
  .digest('hex');

if (signature !== expectedSignature) {
  return 401 Unauthorized;
}
```

### 2. הגנה על Endpoints
- כל ה-routes מוגנים עם JWT authentication
- בדיקת הרשאות (member יכול לגשת רק להזמנות שלו)

### 3. Validation
- בדיקה ש-`priceCharged > 0` לפני יצירת תשלום
- בדיקה ש-`paymentStatus !== PAID` (מניעת תשלום כפול)

---

## בדיקות

### 1. בדיקה מקומית (Sandbox)
```bash
# הפעל את השרת
npm run dev

# בדוק את ה-webhook endpoint
curl http://localhost:3010/api/payments/webhook

# צפוי: {"status":"active",...}
```

### 2. בדיקה עם PayMe Sandbox
- השתמש ב-Seller ID של sandbox
- כרטיס בדיקה: `4580-4580-4580-4580`
- CVV: `123`

### 3. בדיקת Webhook מקומית
אפשר להשתמש ב-[ngrok](https://ngrok.com) או [localtunnel](https://localtunnel.github.io):
```bash
npx localtunnel --port 3010
# תקבל URL ציבורי זמני - הגדר אותו כ-webhook URL ב-PayMe
```

---

## שלבים הבאים (TODO)

### חובה:
- [ ] מלא את ערכי ה-.env
- [ ] בדוק את האינטגרציה עם Sandbox
- [ ] הוסף כפתור "שלם עכשיו" בדשבורד Member
- [ ] טפל ב-return URL (success/error pages)

### רצוי:
- [ ] הוסף PDF generation לחשבוניות
- [ ] הוסף retry logic ל-webhook failures
- [ ] לוגים מפורטים יותר
- [ ] תמיכה בהחזרים (refunds) דרך API

### מתקדם:
- [ ] Hosted Fields במקום redirect (חוויה חלקה יותר)
- [ ] תמיכה ב-Apple Pay / Google Pay
- [ ] Recurring payments למנויים

---

## תמיכה וכלים

- [PayMe API Documentation](https://docs.payme.io)
- [Postman Collection](./quickpayment.md)
- [Status Page](https://status.payme.io)

