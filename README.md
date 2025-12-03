# Quick Rooms - מערכת ניהול חדרי ישיבות

פלטפורמת SaaS לניהול והזמנת חדרי ישיבות למתחמי עבודה.

## טכנולוגיות

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes (App Router)
- **Database**: SQLite עם Prisma ORM
- **Authentication**: JWT עם cookies
- **Payments**: PayMe (QuickPayment) - White-label payment gateway
- **Email**: SMTP (Google Gmail) - כל Owner מגדיר את ה-SMTP שלו
- **Notifications**: In-App Notifications + Email
- **Cron Jobs**: Vercel Cron Jobs לתזכורות ואיפוס קרדיטים

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
- ✅ **אינטגרציה מלאה עם PayMe (QuickPayment)** - Hosted Payment Page, Webhooks, Tokenization
- ✅ **עמוד תודה אחרי הזמנה/תשלום**
- ✅ **צפייה בהזמנות חריגות וסליקות PayMe**
- ✅ **העלאת תמונות לחדרים** - העלאה מקומית + תצוגה מקדימה
- ✅ **Rate Limiting** - הגנה על API routes מפני התקפות
- ✅ **Caching** - שיפור ביצועים ל-API routes נפוצים
- ✅ **מערכת Email עם SMTP** - כל Owner מגדיר את ה-SMTP שלו (Google Gmail)
- ✅ **In-App Notifications** - התראות במערכת עם dropdown
- ✅ **תזכורות אוטומטיות** - תזכורות להזמנות קרובות (כל 30 דקות)
- ✅ **Cron Jobs** - איפוס קרדיטים חודשי ותזכורות (Vercel Cron)
- ✅ **הגדרות Owner ו-Member** - הגדרות נפרדות לכל תפקיד

### ✨ המערכת מוכנה לשימוש!

כל התכונות העיקריות מיושמות ומוכנות לשימוש.

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
- `POST /api/payments/create` - יצירת תשלום PayMe
- `POST /api/payments/webhook` - Webhook מ-PayMe
- `GET /api/payments/invoice/[bookingId]` - הורדת חשבונית/קבלה

### Notifications
- `GET /api/notifications` - קבלת התראות של המשתמש
- `PUT /api/notifications` - עדכון התראה (סימון כנקראה)
- `DELETE /api/notifications?id=...` - מחיקת התראה

### Settings
- `GET /api/settings/owner` - קבלת הגדרות Owner
- `PUT /api/settings/owner` - עדכון הגדרות Owner (כולל SMTP ו-PayMe)
- `GET /api/settings/member` - קבלת הגדרות Member
- `PUT /api/settings/member` - עדכון הגדרות Member

### Upload
- `POST /api/upload` - העלאת תמונות לחדרים (Owner only)

### Cron Jobs
- `GET /api/cron/reset-credits` - איפוס קרדיטים חודשי (Vercel Cron - פעם ביום)
- `GET /api/cron/send-reminders` - שליחת תזכורות (Vercel Cron - כל 30 דקות)

## הגדרות נדרשות

### משתני סביבה (`.env`)
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-here"
CRON_SECRET="your-cron-secret" # אופציונלי - רק אם רוצים להפעיל ידנית
NEXT_PUBLIC_APP_URL="http://localhost:3010" # או ה-URL של הפרודקשן
```

### הגדרת SMTP (כל Owner מגדיר בעצמו)
כל Owner מגדיר את ה-SMTP שלו דרך **הגדרות** → **הגדרות אימייל (SMTP)**:
- SMTP Host: `smtp.gmail.com`
- SMTP Port: `587` (או `465` ל-SSL)
- SMTP Username: כתובת Gmail שלך
- SMTP Password: App Password מ-Google (ראה `CRON_SETUP.md`)

### הגדרת Vercel Cron Jobs
ראה קובץ `CRON_SETUP.md` להוראות מפורטות.

## מצב פיתוח

הפרויקט נמצא בשלבי פיתוח מתקדמים. כל התכונות העיקריות הושלמו וניתן להשתמש במערכת. ראה את קובץ `CRON_SETUP.md` להגדרת Cron Jobs ו-Email.

