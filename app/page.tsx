"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "@/components/Logo";
import { Calendar, CreditCard, BarChart3, Users, CheckCircle2, ArrowLeft, Clock, Shield } from "lucide-react";

interface Space {
  id: string;
  name: string;
  address: string;
  logo: string | null;
  meetingRooms: Array<{
    id: string;
    name: string;
    capacity: number;
  }>;
}

export default function Home() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpaces();
  }, []);

  const fetchSpaces = async () => {
    try {
      const response = await fetch("/api/spaces");
      if (response.ok) {
        const data = await response.json();
        setSpaces(data.spaces || []);
      }
    } catch (error) {
      console.error("Error fetching spaces:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans scroll-smooth">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-6 h-20 flex justify-between items-center">
          <Logo />
          <nav className="hidden md:flex items-center gap-4">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-black transition-colors scroll-smooth">פתרונות</a>
            <a href="#spaces" className="text-sm font-medium text-gray-600 hover:text-black transition-colors scroll-smooth">מתחמים</a>
            <a href="#owners" className="text-sm font-medium text-gray-600 hover:text-black transition-colors scroll-smooth">לבעלי מתחמים</a>
            <div className="w-px h-4 bg-gray-200"></div>
            <Link
              href="/login"
              className="text-sm font-bold text-indigo-600 border border-indigo-500 px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              התחברות
            </Link>
            <Link
              href="/login"
              className="bg-indigo-500 text-white text-sm font-bold px-6 py-3 rounded-lg hover:bg-indigo-600 transition-all"
            >
              התחל עכשיו
            </Link>
          </nav>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center bg-[#F7F7F7]">
          <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20">
            <div className="max-w-2xl z-10">
              <h1 className="text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
                הפוך את ניהול חדרי הישיבות <br />
                <span className="text-indigo-500">לאוטומטי וחכם.</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed font-light">
                מערכת ניהול מתקדמת לבעלי משרדים ומתחמים.
                ניהול קרדיטים אוטומטי, סליקת אשראי, הפקת חשבוניות מס ויומן הזמנות חכם - הכל בפלטפורמה אחת שחוסכת לך זמן וכסף.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/login"
                  className="bg-indigo-500 text-white text-lg font-bold px-10 py-4 rounded-lg hover:bg-indigo-600 transition-all flex items-center justify-center gap-2"
                >
                  התחל ניסיון חינם
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <Link
                  href="#features"
                  className="bg-white text-black border border-gray-200 text-lg font-bold px-10 py-4 rounded-lg hover:border-black transition-all flex items-center justify-center"
                >
                  איך זה עובד?
                </Link>
              </div>
              
              <div className="mt-12 flex items-center gap-8 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                  <span>חשבוניות אוטומטיות</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                  <span>ניהול קרדיטים</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                  <span>סליקה מאובטחת</span>
                </div>
              </div>
            </div>
            
            <div className="relative h-[600px] hidden lg:block rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="/images/1.png" 
                alt="Modern Workspace" 
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </section>

        {/* Features / Value Prop */}
        <section id="features" className="py-32 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-20">
              <h2 className="text-4xl font-bold mb-6">כל הכלים לניהול המשרד</h2>
              <p className="text-xl text-gray-500 font-light">
                הפלטפורמה שלנו דואגת לצד הטכני והפיננסי, כדי שאתם תוכלו
                להתמקד בניהול העסק והקהילה שלכם.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="p-8 border-l border-gray-100 first:border-0">
                <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center mb-8 text-indigo-600">
                  <CreditCard className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4">סליקה וחשבוניות</h3>
                <p className="text-gray-500 leading-relaxed">
                  חיוב אוטומטי של לקוחות מזדמנים וחריגות מנוי.
                  המערכת מפיקה ושולחת חשבונית מס באופן אוטומטי לכל עסקה.
                </p>
              </div>
              
              <div className="p-8 border-l border-gray-100 first:border-0">
                <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center mb-8 text-indigo-600">
                  <Calendar className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4">ניהול קרדיטים</h3>
                <p className="text-gray-500 leading-relaxed">
                  הקצאת חבילות שעות (קרדיטים) למנויים. המערכת מנכה
                  אוטומטית שעות מכל הזמנה ומחשבת חיובים נוספים בעת הצורך.
                </p>
              </div>

              <div className="p-8 border-l border-gray-100 first:border-0">
                <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center mb-8 text-indigo-600">
                  <BarChart3 className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4">שליטה ובקרה</h3>
                <p className="text-gray-500 leading-relaxed">
                  דשבורד ניהול מתקדם עם נתונים בזמן אמת על תפוסת החדרים,
                  הכנסות צפויות, וסטטוס המנויים במתחם.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Split Section - For Owners */}
        <section id="owners" className="py-32 bg-black text-white overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <div className="inline-block bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-6">
                  לבעלי מתחמים
                </div>
                <h2 className="text-5xl font-bold mb-8">שליטה מלאה במתחם שלך</h2>
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">ניהול קהילה</h4>
                      <p className="text-gray-200">הוספה וניהול של חברים, הגדרת הרשאות ומסלולים מותאמים אישית.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">חיסכון בזמן</h4>
                      <p className="text-gray-200">תן לחברים להזמין לבד. המערכת מנהלת את הקרדיטים והזמינות אוטומטית.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">תשלומים בטוחים</h4>
                      <p className="text-gray-200">אינטגרציה מלאה לסליקת אשראי עבור חריגות ואורחים מזדמנים.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-12">
                  <Link
                    href="/login"
                    className="bg-white text-black text-lg font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-all inline-flex items-center gap-2"
                  >
                    הצטרף כבעל מתחם
                    <ArrowLeft className="w-5 h-5" />
                  </Link>
                </div>
              </div>
              
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
                 <img 
                   src="/images/dark.png" 
                   alt="Owner Dashboard Environment" 
                   className="object-cover w-full h-full hover:scale-105 transition-transform duration-700 opacity-90"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Spaces Grid (Product Demo) */}
        <section id="spaces" className="py-32 bg-[#F7F7F7]">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <h2 className="text-4xl font-bold mb-4">הממשק שהלקוחות שלך יקבלו</h2>
                <p className="text-xl text-gray-500 font-light">הענק ללקוחות שלך חווית הזמנה עצמאית, פשוטה ויוקרתית</p>
              </div>
              {!loading && spaces.length > 0 && (
                <Link href="/login" className="text-indigo-600 font-bold hover:text-indigo-700 flex items-center gap-2 text-lg">
                  ראה דוגמה חיה
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-[4/3] bg-gray-200 rounded-xl"></div>
                ))}
              </div>
            ) : spaces.length === 0 ? (
              <div className="bg-white rounded-2xl p-16 text-center border border-gray-200 shadow-sm">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">בקרוב...</h3>
                <p className="text-gray-500 mb-8 text-lg">אנחנו עדיין בונים את רשת המתחמים שלנו.</p>
                <Link
                  href="/login"
                  className="inline-block bg-black text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-800 transition-colors"
                >
                  הצטרף כבעל מתחם ראשון
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {spaces.map((space) => (
                  <Link
                    href="/login"
                    key={space.id}
                    className="group block bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                      {space.logo ? (
                        <img
                          src={space.logo}
                          alt={space.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                          <span className="text-gray-400 font-bold text-xl">{space.name}</span>
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        זמין עכשיו
                      </div>
                    </div>
                    <div className="p-8">
                      <h3 className="text-2xl font-bold mb-2 text-gray-900">{space.name}</h3>
                      <p className="text-gray-500 mb-6 font-light">{space.address}</p>
                      <div className="flex flex-wrap gap-2">
                        {space.meetingRooms?.slice(0, 3).map((room) => (
                          <span key={room.id} className="px-3 py-1 bg-gray-50 rounded-lg text-xs font-medium text-gray-600 border border-gray-100">
                            {room.name}
                          </span>
                        ))}
                        {space.meetingRooms?.length > 3 && (
                          <span className="px-3 py-1 bg-gray-50 rounded-lg text-xs font-medium text-gray-400 border border-gray-100">
                            +{space.meetingRooms.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 bg-white border-t border-gray-100">
           <div className="container mx-auto px-6 text-center">
             <h2 className="text-5xl font-bold mb-8 tracking-tight">מוכנים להתחיל?</h2>
             <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto font-light">
               הצטרפו למאות עסקים שכבר מנהלים את חדרי הישיבות שלהם בצורה חכמה יותר.
             </p>
             <Link
               href="/login"
               className="bg-indigo-500 text-white text-lg font-bold px-12 py-5 rounded-lg hover:bg-indigo-600 transition-all shadow-xl hover:shadow-2xl inline-flex items-center gap-3"
             >
               צור חשבון בחינם
               <ArrowLeft className="w-5 h-5" />
             </Link>
           </div>
        </section>
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
              <Logo />
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-500">
                © 2024 Quick Rooms Inc.
              </span>
            </div>
            <div className="flex gap-8 text-sm font-medium text-gray-500">
              <a href="#" className="hover:text-black transition-colors">תנאי שימוש</a>
              <a href="#" className="hover:text-black transition-colors">פרטיות</a>
              <a href="#" className="hover:text-black transition-colors">צור קשר</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}