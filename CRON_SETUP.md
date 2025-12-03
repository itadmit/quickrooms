# הגדרת Cron Jobs ו-Email

## הגדרת Vercel Cron Jobs

### שלב 1: יצירת vercel.json
הקובץ `vercel.json` כבר נוצר עם ההגדרות הבאות:

```json
{
  "crons": [
    {
      "path": "/api/cron/reset-credits",
      "schedule": "0 0 * * *"
    },
    {
      "path": "/api/cron/send-reminders",
      "schedule": "*/30 * * * *"
    }
  ]
}
```

### שלב 2: הגדרת Environment Variables ב-Vercel (אופציונלי)

**הערה:** Vercel Cron שולח אוטומטית את ה-header `x-vercel-cron`, אז לא צריך CRON_SECRET אם אתה משתמש רק ב-Vercel Cron.

אם אתה רוצה להפעיל ידנית (ל-development או testing), הוסף:

```
CRON_SECRET=your-secret-key-here
```

**חשוב:** השתמש ב-secret חזק וייחודי. ניתן ליצור אחד עם:
```bash
openssl rand -base64 32
```

### שלב 3: עדכון ה-Cron Jobs ב-Vercel

1. ב-Vercel Dashboard, לך ל-Settings > Cron Jobs
2. ודא שהקובץ `vercel.json` מזוהה
3. ה-Cron Jobs יופעלו אוטומטית

### שלב 4: בדיקת Cron Jobs

לאחר הפריסה, Vercel יקרא ל-endpoints הבאים:
- `/api/cron/reset-credits` - פעם ביום ב-00:00 UTC
- `/api/cron/send-reminders` - כל 30 דקות

**הערה:** Vercel Cron Jobs עובדים רק ב-Production. ל-development, תוכל להפעיל ידנית:
```bash
curl -X GET "https://your-domain.com/api/cron/reset-credits" \
  -H "Authorization: Bearer your-secret-key"
```

---

## הגדרת Google SMTP

**חשוב:** כל Owner מגדיר את ה-SMTP שלו בעצמו דרך הגדרות המערכת.

### שלב 1: יצירת App Password ב-Gmail

1. היכנס לחשבון Google שלך
2. לך ל-[Google Account Security](https://myaccount.google.com/security)
3. הפעל **2-Step Verification** (אם לא מופעל)
4. לך ל-[App Passwords](https://myaccount.google.com/apppasswords)
5. בחר "Mail" ו-"Other (Custom name)"
6. הזן שם: "Quick Rooms"
7. העתק את ה-App Password שנוצר (16 תווים)

### שלב 2: הגדרת SMTP בהגדרות המערכת

1. היכנס לדשבורד Owner
2. לך ל-**הגדרות** (Settings)
3. גלול למטה לסקשן **הגדרות אימייל (SMTP)**
4. הפעל את **"הפעל שליחת אימיילים"**
5. מלא את הפרטים:
   - **SMTP Host**: `smtp.gmail.com`
   - **SMTP Port**: `587` (או `465` ל-SSL)
   - **Secure**: `false` (או `true` לפורט 465)
   - **SMTP Username**: כתובת ה-Gmail שלך
   - **SMTP Password**: ה-App Password שיצרת
6. לחץ על **שמור**

### שלב 3: בדיקת Email

לאחר ההגדרה, המערכת תשלח אימיילים אוטומטית ל-Members שלך:
- אישור הזמנה
- תזכורות להזמנות קרובות
- התראות על קרדיטים נמוכים

**הערה:** אם SMTP לא מוגדר, המערכת תמשיך לעבוד אבל לא תשלח אימיילים (תתעד ב-logs).

---

## סיכום Cron Jobs

| Endpoint | תדירות | תפקיד |
|----------|---------|-------|
| `/api/cron/reset-credits` | פעם ביום (00:00 UTC) | איפוס קרדיטים חודשי ל-Members |
| `/api/cron/send-reminders` | כל 30 דקות | שליחת תזכורות להזמנות קרובות |

---

## פתרון בעיות

### Cron Jobs לא עובדים
1. ודא ש-`vercel.json` קיים ב-root של הפרויקט
2. ודא ש-`CRON_SECRET` מוגדר ב-Environment Variables
3. בדוק את ה-logs ב-Vercel Dashboard

### Email לא נשלח
1. ודא ש-`SMTP_USER` ו-`SMTP_PASS` מוגדרים נכון
2. ודא ש-2-Step Verification מופעל ב-Gmail
3. ודא שהשתמשת ב-App Password ולא בסיסמה רגילה
4. בדוק את ה-logs ב-Vercel Dashboard

### תזכורות לא נשלחות
1. ודא שה-Cron Job של `send-reminders` רץ כל 30 דקות
2. בדוק שיש הזמנות שמתחילות בעוד 30 דקות
3. בדוק את ה-logs ב-Vercel Dashboard

