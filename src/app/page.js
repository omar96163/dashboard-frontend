"use client";

import { toast } from "sonner";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import Hero from "@/components/ui/animated-shader-hero";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns";
import {
  Loader2,
  Briefcase,
  Users,
  BarChart3,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { user, token, hydrate } = useAuthStore();

  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const handleContactSubmit = (e) => {
    e.preventDefault();
    toast.success("شكراً لتواصلك معنا! سنرد عليك قريباً.");
    setContactData({ name: "", email: "", message: "" });
  };

  const testimonials = [
    {
      text: "This ERP revolutionized our operations, streamlining finance and inventory. The cloud-based platform keeps us productive, even remotely.",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      name: "Briana Patton",
      role: "Operations Manager",
    },
    {
      text: "Implementing this ERP was smooth and quick. The customizable, user-friendly interface made team training effortless.",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      name: "Bilal Ahmed",
      role: "IT Manager",
    },
    {
      text: "The support team is exceptional, guiding us through setup and providing ongoing assistance, ensuring our satisfaction.",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
      name: "Saman Malik",
      role: "Customer Support Lead",
    },
    {
      text: "This ERP's seamless integration enhanced our business operations and efficiency. Highly recommend for its intuitive interface.",
      image: "https://randomuser.me/api/portraits/men/4.jpg",
      name: "Omar Raza",
      role: "CEO",
    },
    {
      text: "Its robust features and quick support have transformed our workflow, making us significantly more efficient.",
      image: "https://randomuser.me/api/portraits/women/5.jpg",
      name: "Zainab Hussain",
      role: "Project Manager",
    },
    {
      text: "The smooth implementation exceeded expectations. It streamlined processes, improving overall business performance.",
      image: "https://randomuser.me/api/portraits/women/6.jpg",
      name: "Aliza Khan",
      role: "Business Analyst",
    },
    {
      text: "Our business functions improved with a user-friendly design and positive customer feedback.",
      image: "https://randomuser.me/api/portraits/men/7.jpg",
      name: "Farhan Siddiqui",
      role: "Marketing Director",
    },
    {
      text: "They delivered a solution that exceeded expectations, understanding our needs and enhancing our operations.",
      image: "https://randomuser.me/api/portraits/women/8.jpg",
      name: "Sana Sheikh",
      role: "Sales Manager",
    },
    {
      text: "Using this ERP, our online presence and conversions significantly improved, boosting business performance.",
      image: "https://randomuser.me/api/portraits/men/9.jpg",
      name: "Hassan Ali",
      role: "E-commerce Manager",
    },
  ];
  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6, 9);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (token && user) router.replace("/dashboard");
  }, [token, user, router]);

  if (typeof window !== "undefined" && token && user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
        <p className="mt-4 text-gray-600 animate-pulse">
          جاري التحويل إلي لوحة التحكم الخاصة بك ...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-indigo-50/50 via-white to-blue-50/50">
      {/* Navigation Header */}
      <header
        className={`sticky top-0 backdrop-blur-lg z-50 shadow-sm bg-linear-to-b from-indigo-400/70 via-indigo-200/70 to-white/70
        px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-around animate-fade-in-down rounded-bl-full rounded-br-full`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 bg-linear-to-br from-indigo-600 to-blue-500 rounded-full flex items-center justify-center 
            shadow-lg transform hover:scale-105 transition-transform`}
          >
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            إبداع
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 mr-35.5">
          <a
            href="#features"
            className="text-gray-700 hover:text-indigo-600 font-semibold transition-all duration-300 hover:translate-y-1"
          >
            المميزات
          </a>
          <a
            href="#how-it-works"
            className="text-gray-700 hover:text-indigo-600 font-semibold transition-all duration-300 hover:translate-y-1"
          >
            كيفية العمل
          </a>
          <a
            href="#contact"
            className="text-gray-700 hover:text-indigo-600 font-semibold transition-all duration-300 hover:translate-y-1"
          >
            تواصل معنا
          </a>
          <a
            href="#testimonials"
            className="text-gray-700 hover:text-indigo-600 font-semibold transition-all duration-300 hover:translate-y-1"
          >
            أراء المستخدمين
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/login")}
            className={`text-gray-700 hover:text-indigo-600 font-semibold transition duration-300 hover:bg-indigo-50/50 
            px-4 py-2 rounded-lg cursor-pointer`}
          >
            تسجيل الدخول
          </button>
          <button
            onClick={() => router.push("/register")}
            className={`bg-linear-to-r from-indigo-600 to-blue-500 text-white px-6 py-2 rounded-lg hover:from-indigo-700 cursor-pointer
            hover:to-blue-600 transition duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105`}
          >
            إنشاء حساب
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="-translate-y-19">
        <Hero
          trustBadge={{
            text: "منصة موثوقة لأكثر من 10,000 مستخدم",
            icons: ["🚀", "✨"],
          }}
          headline={{
            line1: "منصة المبدعين الأولى",
            line2: "في المنطقة العربية",
          }}
          subtitle="نجمع بين العملاء و المبدعين في جميع انحاء الوطن العربي , ابدأ مشروعك الآن أو قدم خدماتك الاحترافية بأمان وسهولة"
          buttons={{
            primary: {
              text: "ابدأ الآن مجاناً",
              onClick: () => router.push("/register"),
            },
            secondary: {
              text: "تسجيل الدخول",
              onClick: () => router.push("/login"),
            },
          }}
        />
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.1,
              ease: "easeOut",
            }}
            viewport={{ once: true }}
            className="flex flex-col items-center mb-20"
          >
            <h2 className="text-5xl font-bold bg-linear-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6">
              المميزات الرئيسية
            </h2>
            <p
              className={`text-xsm text-gray-600 px-6 py-3 bg-blue-500/10 backdrop-blur-md border border-blue-300/30 
              rounded-full`}
            >
              كل ما تحتاجه لتبدأ رحلتك الاحترافية مع أدوات متقدمة وآمنة ✨
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.3,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
              className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:translate-y-2 transition-all
              border border-indigo-100/50 hover:border-indigo-300/50 hover:shadow-indigo-200 duration-300 hover:-rotate-2`}
            >
              <div className="absolute inset-0 bg-linear-to-tr via-indigo-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="w-14 h-14 bg-linear-to-br from-indigo-600 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  إدارة المشاريع
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  إنشاء وإدارة مشاريعك الخاصه بسهولة. تتبع التقدم وكل التفاصيل
                  في مكان واحد مع تنبيهات فورية.
                </p>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.5,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
              className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:translate-y-2 transition-all
              border border-indigo-100/50 hover:border-indigo-300/50 hover:shadow-indigo-200 duration-300 hover:-rotate-2`}
            >
              <div className="absolute inset-0 bg-linear-to-tr via-indigo-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="w-14 h-14 bg-linear-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  فريق محترف
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  اختر من بين آلاف المستقلين المحترفين والموثوقين. ابحث حسب
                  التقييمات والخبرة والتخصص.
                </p>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.7,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
              className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:translate-y-2 transition-all
              border border-indigo-100/50 hover:border-indigo-300/50 hover:shadow-indigo-200 duration-300 hover:-rotate-2`}
            >
              <div className="absolute inset-0 bg-linear-to-tr via-indigo-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="w-14 h-14 bg-linear-to-br from-cyan-600 to-indigo-500 rounded-xl flex items-center justify-center mb-6 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  تحليلات وإحصائيات
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  احصل على تقارير مفصلة وشاملة عن أداء مشاريعك وعملك بصيغ
                  احترافية.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.1,
              ease: "easeOut",
            }}
            viewport={{ once: true }}
            className="flex flex-col items-center mb-20"
          >
            <h2 className="text-5xl font-bold bg-linear-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6">
              كيفية العمل
            </h2>
            <p
              className={`text-xsm text-gray-600 px-6 py-3 bg-blue-500/10 backdrop-blur-md border border-blue-300/30 
              rounded-full`}
            >
              ثلاث خطوات بسيطة وسهلة للبدء على المنصة ✨
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.7,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
              className="hidden md:block absolute top-1/4 left-1/3 right-1/3 h-1 bg-linear-to-r from-indigo-300 via-blue-300 to-cyan-300"
            ></motion.div>

            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.3,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
              className="relative text-center group"
            >
              <div className="w-20 h-20 bg-linear-to-br from-indigo-600 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-8 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-2">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                إنشاء الحساب
              </h3>
              <p className="text-gray-600 leading-relaxed">
                سجل حسابك الآن واختر نوع العضوية المناسب لك بسهولة وأمان.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.5,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
              className="relative text-center group"
            >
              <div className="w-20 h-20 bg-linear-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-8 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-2">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                البحث والتصفح
              </h3>
              <p className="text-gray-600 leading-relaxed">
                ابحث عن المستقلين المناسبين أو المشاريع المتاحة بسهولة.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.7,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
              className="relative text-center group"
            >
              <div className="w-20 h-20 bg-linear-to-br from-cyan-600 to-indigo-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-8 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-2">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                التعاون والإنجاز
              </h3>
              <p className="text-gray-600 leading-relaxed">
                تواصل مع الفريق وحقق أهدافك بكفاءة عالية.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24">
        <div className="px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.1,
              ease: "easeOut",
            }}
            viewport={{ once: true }}
            className="flex flex-col items-center mb-20"
          >
            <h2 className="text-5xl font-bold bg-linear-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6 py-2">
              آراء المستخدمين
            </h2>
            <p
              className={`text-xsm text-gray-600 px-6 py-3 bg-blue-500/10 backdrop-blur-md border border-blue-300/30 
              rounded-full`}
            >
              قصص نجاح حقيقية من مستخدمينا الذين حققوا أهدافهم بفضل منصتنا ✨
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.3,
              ease: "easeOut",
            }}
            viewport={{ once: true }}
            className={`flex justify-center gap-6 mt-10 mask-[linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] 
            max-h-185 overflow-hidden`}
          >
            <TestimonialsColumn testimonials={firstColumn} duration={15} />
            <TestimonialsColumn
              testimonials={secondColumn}
              className="hidden md:block"
              duration={23}
            />
            <TestimonialsColumn
              testimonials={thirdColumn}
              className="hidden lg:block"
              duration={19}
            />
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.1,
              ease: "easeOut",
            }}
            viewport={{ once: true }}
            className="flex flex-col items-center mb-12"
          >
            <h2
              className={`text-4xl md:text-5xl font-bold bg-linear-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text 
              text-transparent mb-3 py-2`}
            >
              الباقات والأسعار
            </h2>
            <p
              className={`text-xsm text-gray-600 px-6 py-3 bg-blue-500/10 backdrop-blur-md border border-blue-300/30 
              rounded-full`}
            >
              باقات مصممة لكل فئة — مبدعون , عملاء , وكالات — اختر الباقة
              المناسبة وابدأ بسرعة ✨
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Creatives Column */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center p-2 bg-linear-to-l via-blue-200">
                المبدعون
              </h3>
              <div className="space-y-6">
                {/* Plan 1 */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.3,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-6 shadow-md ring-1 ring-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-800">أساسي</h4>
                      <p className="text-sm text-gray-500">مناسب للمبتدئين</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-extrabold text-gray-900">
                        مجاناً
                      </div>
                      <div className="text-xs text-gray-400">دائماً</div>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-600 mb-4 space-y-2">
                    <li>• ملف شخصي</li>
                    <li>• التقديم على المشاريع</li>
                    <li>• محفظة أعمال</li>
                  </ul>
                  <button
                    onClick={() => router.push("/register")}
                    className={`w-full px-4 py-2 bg-linear-to-r from-indigo-600 to-blue-500 text-white rounded-md font-semibold 
                    cursor-pointer hover:shadow-lg shadow-gray-400 transition-all duration-500`}
                  >
                    ابدأ مجاناً
                  </button>
                </motion.div>

                {/* Plan 2 (highlight) */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.4,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true }}
                  className="relative bg-white rounded-2xl p-6 shadow-2xl ring-1 ring-indigo-50 border-2 border-indigo-100 transform scale-100"
                >
                  <div className="absolute -top-3 left-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    الأكثر شيوعاً
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-800">مميز</h4>
                      <p className="text-sm text-gray-500">
                        زيادة ظهور وعطاءات مميزة
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-extrabold text-gray-900">
                        5$
                      </div>
                      <div className="text-[13px] text-gray-400">/ شهرياً</div>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-600 mb-4 space-y-2">
                    <li>• أولوية في الظهور</li>
                    <li>• زيادة عدد التقديمات</li>
                    <li>• دعم سريع</li>
                  </ul>
                  <button
                    onClick={() => router.push("/register")}
                    className={`w-full px-4 py-2 bg-indigo-600 text-white rounded-md font-semibold 
                    cursor-pointer hover:shadow-lg shadow-gray-400 transition-all duration-500`}
                  >
                    اشترك الآن
                  </button>
                </motion.div>

                {/* Plan 3 */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.5,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-6 shadow-md ring-1 ring-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-800">محترف</h4>
                      <p className="text-sm text-gray-500">
                        حلول متقدمة للمحترفين
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-extrabold text-gray-900">
                        15$
                      </div>
                      <div className="text-[13px] text-gray-400">/ شهرياً</div>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-600 mb-4 space-y-2">
                    <li>• عروض مميزة للعملاء</li>
                    <li>• تحليلات أداء</li>
                    <li>• استشارات مهنية</li>
                  </ul>
                  <button
                    onClick={() => router.push("/register")}
                    className={`w-full px-4 py-2 bg-linear-to-r from-indigo-600 to-blue-500 text-white rounded-md font-semibold
                    cursor-pointer hover:shadow-lg shadow-gray-400 transition-all duration-500`}
                  >
                    اشترك
                  </button>
                </motion.div>
              </div>
            </motion.div>

            {/* Clients Column */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center p-2 bg-linear-to-l via-blue-200">
                العملاء
              </h3>
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.3,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-6 shadow-md ring-1 ring-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-800">مبتدئ</h4>
                      <p className="text-sm text-gray-500">
                        نشر محدود للمشاريع
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-extrabold text-gray-900">
                        مجاناً
                      </div>
                      <div className="text-xs text-gray-400">دائماً</div>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-600 mb-4 space-y-2">
                    <li>• نشر مشاريع أساسية</li>
                    <li>• استقبال عروض</li>
                    <li>• إدارة محادثات</li>
                  </ul>
                  <button
                    onClick={() => router.push("/register")}
                    className={`w-full px-4 py-2 bg-linear-to-r from-indigo-600 to-blue-500 text-white rounded-md font-semibold
                    cursor-pointer hover:shadow-lg shadow-gray-400 transition-all duration-500`}
                  >
                    ابدأ مجاناً
                  </button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.4,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true }}
                  className="relative bg-white rounded-2xl p-6 shadow-2xl ring-1 ring-indigo-50 border-2 border-indigo-100 transform scale-100"
                >
                  <div className="absolute -top-3 left-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    الأكثر شيوعاً
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-800">محترف</h4>
                      <p className="text-sm text-gray-500">
                        لأصحاب المشاريع المتكررّة
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-extrabold text-gray-900">
                        9$
                      </div>
                      <div className="text-[13px] text-gray-400">/ شهرياً</div>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-600 mb-4 space-y-2">
                    <li>• نشر مشاريع غير محدود</li>
                    <li>• وصول لمستقلين مميزين</li>
                    <li>• دعم فني أولي</li>
                  </ul>
                  <button
                    onClick={() => router.push("/register")}
                    className={`w-full px-4 py-2 bg-indigo-600 text-white rounded-md font-semibold
                    cursor-pointer hover:shadow-lg shadow-gray-400 transition-all duration-500`}
                  >
                    اشترك الآن
                  </button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.5,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-6 shadow-md ring-1 ring-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-800">شركات</h4>
                      <p className="text-sm text-gray-500">حلول شركات وفرق</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-extrabold text-gray-900">
                        29$
                      </div>
                      <div className="text-[13px] text-gray-400">/ شهرياً</div>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-600 mb-4 space-y-2">
                    <li>• حسابات متعددة</li>
                    <li>• تقارير متقدمة</li>
                    <li>• دعم مخصص</li>
                  </ul>
                  <button
                    onClick={() => router.push("/register")}
                    className={`w-full px-4 py-2 bg-linear-to-r from-indigo-600 to-blue-500 text-white rounded-md font-semibold
                    cursor-pointer hover:shadow-lg shadow-gray-400 transition-all duration-500`}
                  >
                    احصل على النسخة
                  </button>
                </motion.div>
              </div>
            </motion.div>

            {/* Agencies Column */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center p-2 bg-linear-to-r via-blue-200">
                الوكالات
              </h3>
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.3,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-6 shadow-md ring-1 ring-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-800">أساسي</h4>
                      <p className="text-sm text-gray-500">حساب وكالة صغير</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-extrabold text-gray-900">
                        تواصل
                      </div>
                      <div className="text-xs text-gray-400">
                        للحصول على السعر
                      </div>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-600 mb-4 space-y-2">
                    <li>• حسابات فرعية</li>
                    <li>• تقارير أساسية</li>
                    <li>• دعم عبر البريد</li>
                  </ul>
                  <button
                    onClick={() => router.push("/contact")}
                    className={`w-full px-4 py-2 bg-linear-to-r from-indigo-600 to-blue-500 text-white rounded-md font-semibold
                    cursor-pointer hover:shadow-lg shadow-gray-400 transition-all duration-500`}
                  >
                    اطلب عرض
                  </button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.4,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true }}
                  className="relative bg-white rounded-2xl p-6 shadow-2xl ring-1 ring-indigo-50 border-2 border-indigo-100 transform scale-100"
                >
                  <div className="absolute -top-3 left-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    الأكثر شيوعاً
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-800">احترافي</h4>
                      <p className="text-sm text-gray-500">
                        حلول متقدمة للوكالات
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-extrabold text-gray-900">
                        اتفاق
                      </div>
                      <div className="text-xs text-gray-400">تخصيص السعر</div>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-600 mb-4 space-y-2">
                    <li>• إدارة فرق كبيرة</li>
                    <li>• مدير حساب مخصص</li>
                    <li>• تكاملات وAPI</li>
                  </ul>
                  <button
                    onClick={() => router.push("/contact")}
                    className={`w-full px-4 py-2 bg-indigo-600 text-white rounded-md font-semibold
                    cursor-pointer hover:shadow-lg shadow-gray-400 transition-all duration-500`}
                  >
                    احصل على عرض
                  </button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.5,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-6 shadow-md ring-1 ring-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-800">مؤسسي</h4>
                      <p className="text-sm text-gray-500">
                        حلول مخصصة للمؤسسات
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-extrabold text-gray-900">
                        تواصل
                      </div>
                      <div className="text-xs text-gray-400">
                        للحصول على السعر
                      </div>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-600 mb-4 space-y-2">
                    <li>• عقود طويلة الأمد</li>
                    <li>• دعم مخصص 24/7</li>
                    <li>• حلول أمنية متقدمة</li>
                  </ul>
                  <button
                    onClick={() => router.push("/contact")}
                    className={`w-full px-4 py-2 bg-linear-to-r from-indigo-600 to-blue-500 text-white rounded-md font-semibold
                    cursor-pointer hover:shadow-lg shadow-gray-400 transition-all duration-500`}
                  >
                    احجز استشارة
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-500">
            الأسعار قابلة للتغيير. اتصل بفريقنا للعروض المخصصة والحلول المؤسسية.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24">
        <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.1,
              ease: "easeOut",
            }}
            viewport={{ once: true }}
            className="flex flex-col items-center mb-12"
          >
            <h2
              className={`text-4xl md:text-5xl font-bold bg-linear-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text 
              text-transparent mb-3 py-2`}
            >
              تواصل معنا
            </h2>
            <p
              className={`text-xsm text-gray-600 px-6 py-3 bg-blue-500/10 backdrop-blur-md border border-blue-300/30 
              rounded-full`}
            >
              لديك أسئلة أو تحتاج إلى مساعدة ؟ فريق الدعم لدينا هنا لمساعدتك في
              أي وقت ✨
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* form column */}
            <motion.form
              onSubmit={handleContactSubmit}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.3,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  اسمك
                </label>
                <input
                  type="text"
                  value={contactData.name}
                  onChange={(e) =>
                    setContactData({ ...contactData, name: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  بريدك الإلكتروني
                </label>
                <input
                  type="email"
                  value={contactData.email}
                  onChange={(e) =>
                    setContactData({ ...contactData, email: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  رسالتك
                </label>
                <textarea
                  value={contactData.message}
                  onChange={(e) =>
                    setContactData({ ...contactData, message: e.target.value })
                  }
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-linear-to-r from-indigo-600 to-blue-500 text-white py-2 rounded-lg font-semibold hover:from-indigo-700 hover:to-blue-600 transition-all duration-300"
                >
                  إرسال
                </button>
              </div>
            </motion.form>

            {/* info column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.5,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
              className="space-y-6 flex flex-col justify-center items-end"
            >
              <div className="flex items-center">
                <span className="text-gray-700 hover:text-shadow-lg">
                  +123 456 7890
                </span>
                <div className="w-10 h-10 flex items-center justify-center text-blue-600 m-2 bg-linear-to-br via-blue-200 rounded-full animate-pulse">
                  <Phone className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-gray-700 hover:text-shadow-lg">
                  support@example.com
                </span>
                <div className="w-10 h-10 flex items-center justify-center text-red-600 m-2 bg-linear-to-br via-red-200 rounded-full animate-pulse">
                  <Mail className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-gray-700 hover:text-shadow-lg">
                  الرياض، المملكة العربية السعودية
                </span>
                <div className="w-10 h-10 flex items-center justify-center text-green-600 m-2 bg-linear-to-br via-green-200 rounded-full animate-pulse">
                  <MapPin className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.1,
            ease: "easeOut",
          }}
          viewport={{ once: true }}
          className="absolute inset-0 bg-linear-to-r from-indigo-600 via-blue-600 to-cyan-600"
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.1,
            ease: "easeOut",
          }}
          viewport={{ once: true }}
          className="absolute inset-0 bg-[radial-linear(ellipse_at_top,rgba(255,255,255,0.1),transparent)]"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.1,
            ease: "easeOut",
          }}
          viewport={{ once: true }}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h2 className="text-5xl font-bold text-white mb-8">
            جاهز للبدء الآن ؟
          </h2>
          <p className="text-2xl text-indigo-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            انضم الآن لآلاف المستقلين والعملاء الناجحين على منصتنا الموثوقة
            والآمنة
          </p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.3,
              ease: "easeOut",
            }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={() => router.push("/register")}
              className={`group relative px-10 py-4 bg-white text-indigo-600 rounded-full font-bold text-lg hover:bg-indigo-50 
              transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer`}
            >
              <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              إنشاء حساب مجاني
            </button>
            <button
              onClick={() => router.push("/login")}
              className={`px-10 py-4 bg-white/10 backdrop-blur-md text-white rounded-full font-bold text-lg border border-white/30 
              hover:bg-white/20 transition-all duration-300 hover:border-white/50 cursor-pointer`}
            >
              تسجيل الدخول
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.1,
            ease: "easeOut",
          }}
          viewport={{ once: true }}
          className="px-4 sm:px-6 lg:px-8 bg-linear-to-b from-gray-900 to-black text-gray-400 pt-16 pb-8 border-t border-gray-800"
        >
          <div className="grid md:grid-cols-4 gap-12 mb-12 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.1,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-11 h-11 bg-linear-to-br from-indigo-600 to-blue-500 rounded-full flex items-center justify-center 
                  shadow-lg transform hover:scale-105 transition-transform`}
                >
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  إبداع
                </span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                منصة المبدعين الأولي في الوطن العربي
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
            >
              <h5 className="text-white font-bold mb-6 text-lg">الروابط</h5>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-indigo-400 transition duration-300"
                  >
                    الصفحة الرئيسية
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-gray-400 hover:text-indigo-400 transition duration-300"
                  >
                    المميزات
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-gray-400 hover:text-indigo-400 transition duration-300"
                  >
                    كيفية العمل
                  </a>
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.3,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
            >
              <h5 className="text-white font-bold mb-6 text-lg">القانونية</h5>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-indigo-400 transition duration-300"
                  >
                    سياسة الخصوصية
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-indigo-400 transition duration-300"
                  >
                    شروط الخدمة
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-indigo-400 transition duration-300"
                  >
                    الأسئلة الشائعة
                  </a>
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.4,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
            >
              <h5 className="text-white font-bold mb-6 text-lg">تواصل معنا</h5>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="mailto:info@profreelance.com"
                    className="text-gray-400 hover:text-indigo-400 transition duration-300"
                  >
                    info@profreelance.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+201000000000"
                    className="text-gray-400 hover:text-indigo-400 transition duration-300"
                  >
                    +20 100 0000 000
                  </a>
                </li>
              </ul>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.5,
              ease: "easeOut",
            }}
            viewport={{ once: true }}
            className="border-t border-gray-800 pt-8 max-w-7xl mx-auto"
          >
            <p className="text-center text-sm text-gray-500">
              منصة إبداع , جميع الحقوق محفوظة &copy; 2026
            </p>
          </motion.div>
        </motion.div>
      </footer>
    </div>
  );
}
