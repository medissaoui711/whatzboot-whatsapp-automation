# WhatzBoot - Enterprise WhatsApp Automation & AI Voice Agent Platform
# واتزبوت - منصة أتمتة واتساب المتطورة والوكيل الصوتي الذكي بالذكاء الاصطناعي

<div align="center">

<img src="https://lh3.googleusercontent.com/d/11vkYEBNZdGS7dgJYX8sRblyXL2jayr3T" alt="WhatzBoot Platform Preview" width="100%" style="border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.12);" />

<br/><br/>

[![Next.js](https://img.shields.io/badge/Next.js-15.x-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-2.5_Flash-8E75B2?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**[English](#-english-documentation)** | **[العربية](#-التوثيق-باللغة-العربية)**

</div>

---

## 🌐 English Documentation

### 📌 Overview
**WhatzBoot** is an enterprise-grade WhatsApp Marketing, Customer Relationship Management (CRM), and Autonomous AI Voice Agent platform designed for high-velocity e-commerce brands, sales teams, and customer support organizations. It streamlines multi-channel WhatsApp messaging, automated group moderation, bulk broadcasting with anti-ban safeguards, visual workflow builders, and real-time conversational AI voice agents capable of conducting human-grade phone calls.

---

### ✨ Key Capabilities & Modules

#### 1. 🎙️ Autonomous AI Voice Agent (Gemini & Neural DSP)
- **Ultra-Realistic Phone Simulator**: Interactive audio dialer for automated outbound customer calling, order verification, and objection handling.
- **Human Voice Personas**:
  - 👔 **Abdulrahman (VIP Executive)**: Deep masculine baritone with chest resonance DSP (`0.50x Pitch | Charon Voice`) for high-ticket wholesale and VIP deals.
  - 👷‍♂️ **Tariq (Logistics & Operations)**: Crisp, fast-paced male operations specialist (`Fenrir Voice`).
  - 🧑‍💼 **Faisal (Tech & Sales)**: Modern, engaging male consultant for tech and gadgets (`Puck Voice`).
  - 🌸 **Sara (Sales Specialist)**: Warm, empathetic Saudi female sales rep (`Aoede Voice`).
  - 🎧 **Noura (COD Confirmations)**: Direct, vibrant female agent for cash-on-delivery validation.
  - 🧕 **Mariam (Modern Standard Arabic)**: Pure classical Arabic for formal cross-border support.
- **Real-Time Voice Activity Detection (VAD)** & Web Audio DSP filters for crystal-clear acoustic presence.

#### 2. 🤖 Visual Automation & Smart Flow Builder
- Drag-and-drop canvas for complex decision-tree workflows.
- NLP-driven keyword triggers, conditional branching, sentiment analysis, and fallback handlers.
- Pre-built templates for abandoned cart recovery, order tracking, and lead qualification.

#### 3. 👥 Multi-Agent Team Inbox & Shared CRM
- Unified omnichannel messaging hub with live assignment rules.
- Team collaboration with internal notes, customer tagging, custom contact fields, and conversation states.
- Canned responses with shortcut macros and dynamic parameter replacement.

#### 4. 📢 Smart Broadcasts & Campaign Management
- Bulk messaging engine equipped with anti-ban throttling, random delay intervals, and dynamic variables.
- Audience segmentation by purchase history, tags, country codes, and engagement scores.
- Real-time delivery, read receipts, and conversion attribution telemetry.

#### 5. 🛒 E-Commerce & Store Integrations
- Native support for **Salla**, **Zid**, **Shopify**, and **WooCommerce**.
- Automated Cash-on-Delivery (COD) confirmation flows and instant tracking alerts.

---

### 🏗️ Architecture & Technology Stack

```
WhatzBoot Architecture
├── 🖥️ Frontend (Client Portal & Dashboard)
│   ├── Next.js 15 (App Router) + TypeScript
│   ├── Tailwind CSS + Lucide Icons + Headless UI
│   ├── Web Audio API (Neural DSP Audio Engine)
│   └── Gemini Multimodal & Live Voice Client
│
└── ⚙️ Backend (API Server & WhatsApp Gateway)
    ├── FastAPI (Python 3.11+) + Uvicorn
    ├── WhatsApp Baileys / WhatsApp Cloud API Integration
    ├── SQLAlchemy + PostgreSQL / SQLite
    └── Celery / Redis Task Queue for Broadcast Throttling
```

---

### 🚀 Getting Started (English)

#### Prerequisites
- Node.js `18.x` or higher
- Python `3.10` or higher
- Git

#### 1. Clone & Setup Repository
```bash
git clone https://github.com/your-org/whatzboot.git
cd whatzboot
```

#### 2. Configure Environment Variables
```bash
# Frontend environment
cp frontend/.env.example frontend/.env.local

# Backend environment
cp backend/.env.example backend/.env
```

#### 3. Launch Frontend
```bash
cd frontend
npm install
npm run dev
# App is available at: http://localhost:3000
```

#### 4. Launch Backend API
```bash
cd backend
python -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
# API docs available at: http://localhost:8000/docs
```

---

<br/>

## 🇸🇦 التوثيق باللغة العربية

### 📌 نظرة عامة
**واتزبوت (WhatzBoot)** هي منصة برمجية سحابية متكاملة واحترافية متخصصة في أتمتة رسائل الواتساب، إدارة علاقات العملاء (CRM)، وإطلاق الحملات الإعلانية الذكية، معززة **بوكيل صوتي ذكي بالذكاء الاصطناعي (AI Voice Agent)** قادر على إجراء مكالمات هاتفية حية ومحاكاة محادثات بشرية طبيعية بأصوات رجالية ونسائية واقعية لتأكيد الطلبات وزيادة المبيعات.

---

### ✨ أبرز مميزات ووحدات المنصة

#### 1. 🎙️ الوكيل الصوتي الذكي ومحاكي المكالمات البشرية
- **محاكي اتصال هاتفي حي (Live Phone Simulator)**: محاكاة كاملة للمكالمات الصوتية الواردة والصادرة مع المؤثرات الصوتية وطلب التأكيد التفاعلي.
- **شخصيات صوتية بشرية حقيقية بنبرات خليجية وفصحى**:
  - 👔 **المستشار عبدالرحمن (مستشار كبار العملاء VIP)**: صوت رجالي عميق ووقور ناضج (*Deep Baritone*) مزود برنين صدري مضاعف لصفقات الجملة وكبار العملاء.
  - 👷‍♂️ **طارق (مسؤول العمليات والشحن السريع)**: صوت رجالي حازم وسريع البديهة لتنسيق تسليم الشحنات وتصحيح العناوين.
  - 🧑‍💼 **فيصل (المستشار التقني والمبيعات)**: صوت رجالي شبابي عصري وذكي للمنتجات الإلكترونية والأجهزة.
  - 🌸 **سارة (خبيرة المبيعات والعروض)**: صوت نسائي سعودي دافئ وودود لإغلاق صفقات التجزئة.
  - 🎧 **نورة (تأكيد طلبات الدفع عند الاستلام COD)**: صوت أنثوي مبهج وسريع البديهة لتخفيض نسبة الرجيع.
  - 🧕 **مريم (خدمة العملاء الراقية - فصحى)**: صوت عربي نقي بمخارج حروف دقيقة لكافة الدول العربية.
- **محرك معالجة الترددات الصوتية (Web Audio Neural DSP)** لضمان نقاء الصوت وإلغاء أي طابع آلي.

#### 2. 🤖 منشئ مسارات الأتمتة البصرية (Visual Flow Builder)
- واجهة سحب وإفلات لإنشاء تدفقات المحادثة المعقدة والشروط المخصصة.
- التفاعل الذكي مع الكلمات المفتاحية، تحليل المشاعر، وحالات السلة المتروكة.

#### 3. 👥 صندوق الوارد الجماعي وإدارة الفريق (Team Inbox)
- منصة موحدة لاستقبال كافة محادثات العملاء وتوزيعها على أعضاء الفريق تلقائياً.
- ملاحظات داخلية، تصنيف المحادثات (Tags)، وحفظ الردود السريعة الجاهزة (Canned Responses).

#### 4. 📢 الحملات الجماعية والإرسال المجدول (Smart Broadcasts)
- إرسال رسائل تسويقية جماعية مع نظام الحماية من الحظر (Anti-Ban Throttling) والفواصل الزمنية المتغيرة.
- تخصيص الرسائل باسم العميل، رقم الطلب، وكوبونات الخصم الفريدة.

#### 5. 🛒 الربط مع منصات التجارة الإلكترونية
- تكامل مباشر مع منصات **سلة (Salla)**، **زد (Zid)**، **شوبيفاي (Shopify)**، و **ووكومرس (WooCommerce)**.
- إرسال تنبيهات تلقائية بتحديثات الشحن واسترداد السلات المتروكة وتأكيد الدفع عند الاستلام.

---

### 🛠️ خطوات التثبيت والتشغيل المحلي

#### المتطلبات الأساسية
- بيئة عمل Node.js إصدار `18` أو أحدث.
- بيئة عمل Python إصدار `3.10` أو أحدث.

#### 1. استنساخ المشروع
```bash
git clone https://github.com/your-org/whatzboot.git
cd whatzboot
```

#### 2. تشغيل الواجهة الأمامية (Frontend)
```bash
cd frontend
npm install
npm run dev
```
🔗 ستعمل الواجهة على: `http://localhost:3000`

#### 3. تشغيل الخادم الخلفي (Backend)
```bash
cd backend
python -m venv venv
source venv/bin/activate # أو venv\Scripts\activate على ويندوز
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
🔗 توثيق الـ API متاح على: `http://localhost:8000/docs`

---

## 🔒 الأمان وحماية الخصوصية
- تشفير كامل للمفاتيح وبيانات الاتصال الحساسة.
- عدم تخزين المفاتيح الخاصة في الكود المصدري واعتماد متغيرات البيئة `.env`.

---

## 📄 الترخيص (License)
هذا المشروع مرخص بموجب رخصة [MIT License](LICENSE).

