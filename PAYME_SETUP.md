# QuickPayment (PayMe) Integration Setup

## הגדרות סביבה

הוסף את השורות הבאות לקובץ `.env` שלך:

```env
# PayMe (QuickPayment) Configuration
# קבל את הערכים האלה מדשבורד PayMe שלך
PAYME_SELLER_ID="MPL########-########-########-########"  # ה-Seller ID שלך מ-PayMe
PAYME_ENVIRONMENT="sandbox"  # השתמש ב-"sandbox" לבדיקות, "production" לפרודקשן
PAYME_WEBHOOK_SECRET="your-webhook-secret-here"  # למען אימות webhooks

# Application URLs
NEXT_PUBLIC_APP_URL="http://localhost:3010"  # כתובת האפליקציה שלך (לצורך callbacks)
```

## איך להשיג את הערכים?

### 1. PAYME_SELLER_ID
1. התחבר ל-[PayMe Dashboard](https://dashboard.payme.io)
2. לך ל-**Settings** → **API Keys**
3. העתק את ה-**Seller ID**

### 2. PAYME_ENVIRONMENT
- לסביבת פיתוח/בדיקות: `sandbox`
- לפרודקשן: `production`

### 3. PAYME_WEBHOOK_SECRET
1. ב-PayMe Dashboard, לך ל-**Settings** → **Webhooks**
2. הגדר webhook URL: `https://your-domain.com/api/payments/webhook`
3. העתק את ה-**Secret Key** שניתן לך

### 4. NEXT_PUBLIC_APP_URL
- לפיתוח מקומי: `http://localhost:3010`
- לפרודקשן: `https://your-domain.com`

## URLs חשובים

### Sandbox (פיתוח)
- API: `https://sandbox.payme.io`
- Dashboard: `https://sandbox-dashboard.payme.io`

### Production (פרודקשן)
- API: `https://production.payme.io`
- Dashboard: `https://dashboard.payme.io`

## בדיקת ההגדרות

אחרי שמילאת את הערכים, הרץ:

```bash
npm run dev
```

ונסה לבצע הזמנה עם חריגה - אמור להופיע כפתור תשלום.

## כרטיסי בדיקה (Sandbox)

לבדיקות בסביבת Sandbox, השתמש בכרטיסים הבאים:

### כרטיס מוצלח
- מספר: `4580-4580-4580-4580`
- תוקף: כל תאריך עתידי
- CVV: `123`

### כרטיס נכשל
- מספר: `4111-1111-1111-1111`
- תוקף: כל תאריך עתידי
- CVV: `123`

## תמיכה

- [PayMe Documentation](https://docs.payme.io)
- [PayMe Help Center](https://help.payme.co.il)
- [PayMe Status Page](https://status.payme.io)

