# Quick Rooms - מערכת ניהול חדרי ישיבות

פלטפורמת SaaS לניהול והזמנת חדרי ישיבות למתחמי עבודה.

## טכנולוגיות

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes (App Router)
- **Database**: PostgreSQL עם Prisma ORM
- **Authentication**: JWT עם cookies
- **Payments**: PayPal

## התקנה

1. התקן את התלויות:
```bash
npm install
```

2. הגדר את משתני הסביבה:
```bash
cp .env.example .env
# ערוך את .env והוסף את פרטי ה-DATABASE_URL וה-JWT_SECRET שלך
```

3. הגדר את מסד הנתונים:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. הפעל את השרת:
```bash
npm run dev
```

האפליקציה תהיה זמינה ב-http://localhost:3000

## מבנה הפרויקט

- `app/` - דפי Next.js (App Router)
- `lib/` - פונקציות עזר (auth, prisma)
- `prisma/` - סכמת מסד הנתונים
- `components/` - רכיבי React לשימוש חוזר

## תכונות עיקריות

### ✅ מיושם במלואו:
- ✅ מערכת משתמשים (Owner, Member, Guest)
- ✅ Authentication עם JWT ו-cookies מאובטחים
- ✅ ניהול מתחמים (Spaces) - CRUD מלא (יצירה, עדכון, מחיקה)
- ✅ ניהול חדרי ישיבות - CRUD מלא (יצירה, עדכון, מחיקה)
- ✅ ניהול Members וחבילות קרדיט - CRUD מלא
- ✅ מערכת קרדיטים חודשית עם חישוב חריגה
- ✅ הזמנת חדרים (Member עם קרדיטים / Guest עם תשלום)
- ✅ מניעת double booking
- ✅ חישוב חריגה מהקרדיט החודשי
- ✅ Dashboard ל-Owner ול-Member
- ✅ מסך בית ציבורי עם רשימת מתחמים
- ✅ לוח הזמנות עם פילטרים
- ✅ **לוח זמנים Calendar View (שבועי/חודשי)**
- ✅ **דוחות ו-Analytics מפורטים** (שימוש קרדיט, הכנסות, חריגות)
- ✅ **מנגנון איפוס קרדיטים חודשי אוטומטי** (cron endpoint)
- ✅ **אינטגרציה בסיסית עם PayPal** (יצירת תשלום, webhook)
- ✅ **עמוד תודה אחרי הזמנה/תשלום**
- ✅ **צפייה בהזמנות חריגות וסליקות PayPal**

### 🚧 נדרש להשלמה/שיפור:
- ⏳ אינטגרציה מלאה עם PayPal SDK (כרגע יש מבנה בסיסי)
- ⏳ Webhooks מ-PayPal עם אימות חתימה
- ⏳ העלאת תמונות לחדרים (כרגע רק URL)
- ⏳ Rate limiting ו-Caching
- ⏳ 2FA (אופציונלי לפי האפיון)
- ⏳ Rate limiting ו-Caching

## מבנה API Routes

### Authentication
- `POST /api/auth/login` - התחברות
- `GET /api/auth/me` - פרטי משתמש מחובר

### Spaces (מתחמים)
- `GET /api/spaces` - רשימת מתחמים (ציבורי)
- `POST /api/spaces` - יצירת מתחם (Owner)
- `PUT /api/spaces/[spaceId]` - עדכון מתחם (Owner)
- `DELETE /api/spaces/[spaceId]` - מחיקת מתחם (Owner)

### Rooms (חדרים)
- `GET /api/rooms?spaceId=...` - רשימת חדרים
- `GET /api/rooms/[roomId]` - פרטי חדר
- `POST /api/rooms` - יצירת חדר (Owner)
- `PUT /api/rooms/[roomId]` - עדכון חדר (Owner)
- `DELETE /api/rooms/[roomId]` - מחיקת חדר (Owner)

### Members
- `GET /api/members` - רשימת Members (Owner)
- `POST /api/members` - יצירת Member (Owner)
- `PUT /api/members/[memberId]` - עדכון Member (Owner)
- `DELETE /api/members/[memberId]` - מחיקת Member (Owner)

### Credit Plans
- `GET /api/credit-plans` - חבילות קרדיט (Owner)
- `POST /api/credit-plans` - יצירת חבילת קרדיט (Owner)
- `DELETE /api/credit-plans/[planId]` - מחיקת חבילת קרדיט (Owner)

### Bookings
- `GET /api/bookings` - רשימת הזמנות
- `POST /api/bookings` - יצירת הזמנה

### Reports & Analytics
- `GET /api/reports?startDate=...&endDate=...` - דוחות ו-Analytics (Owner)

### Transactions & Payments
- `GET /api/transactions?type=overuse` - תשלומי חריגה (Owner)
- `POST /api/paypal/create-payment` - יצירת תשלום PayPal
- `POST /api/paypal/webhook` - Webhook מ-PayPal

### Cron Jobs
- `POST /api/cron/reset-credits` - איפוס קרדיטים חודשי (מוגן ב-API key)

## מצב פיתוח

הפרויקט נמצא בשלבי פיתוח מתקדמים. הבסיס הושלם וניתן להתחיל להשתמש במערכת. ראה את קובץ `אפיון.md` לפרטים מלאים.

