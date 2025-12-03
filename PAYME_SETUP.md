# QuickPayment (PayMe) Integration Setup

## הגדרות סביבה

הוסף את השורות הבאות לקובץ `.env` שלך:

```env
# PayMe (QuickPayment) Configuration
# הערכים שלך מ-PayMe:
NEXT_PUBLIC_APP_URL="https://your-domain.com"  # כתובת האפליקציה שלך (לא localhost!)
```

**חשוב**: הפרטים של PayMe מוזנים דרך דף ההגדרות של Owner במערכת, לא דרך `.env`!

## הגדרת PayMe במערכת

1. התחבר למערכת כ-Owner
2. לך ל-**הגדרות** → **הגדרות תשלום**
3. הזן את הפרטים הבאים:

### פרטי PayMe שלך:
- **Seller PayMe ID (MPL)**: `MPL17647-88080YHW-UH8TS65W-INZDMDKP`
- **Seller PayMe Secret**: `6cVTwgpjCMU6CFmyEJE0k3izN9C9tQ` (מוזן ב-Webhook Secret)
- **Public Key UUID**: `1b197b90-bde2-47b9-ac6a-e60db781310e` (לא נדרש כרגע, רק ל-Client-side integration)

### הגדרות:
- **סביבה**: בחר `sandbox` לבדיקות או `production` לפרודקשן
- **Webhook Secret**: הזן את ה-Seller PayMe Secret: `6cVTwgpjCMU6CFmyEJE0k3izN9C9tQ`
- **הפעל תשלומים**: סמן את התיבה כדי להפעיל תשלומים

## איך להשיג את הערכים? (למקרה שצריך)

### 1. Seller PayMe ID (MPL)
1. התחבר ל-[PayMe Dashboard](https://dashboard.payme.io)
2. לך ל-**Settings** → **API Keys**
3. העתק את ה-**Seller ID**

### 2. Seller PayMe Secret
- זה ה-Secret Key שנתן לך PayMe
- מוזן ב-**Webhook Secret** בהגדרות המערכת

### 3. Public Key UUID
- משמש ל-Client-side integration (Hosted Fields)
- לא נדרש כרגע ל-Server-side API

### 4. NEXT_PUBLIC_APP_URL
- **חשוב**: PayMe לא תומך ב-localhost URLs!
- לפיתוח מקומי: השתמש ב-ngrok או כלי tunnel אחר (למשל: `https://your-domain.ngrok.io`)
- לפרודקשן: `https://your-domain.com`

**הערה**: אם אתה מפתח מקומית, תצטרך להשתמש ב-ngrok או כלי דומה כדי לחשוף את השרת המקומי ל-URL חיצוני. PayMe דורש URLs ציבוריים עבור callback ו-return URLs.

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

