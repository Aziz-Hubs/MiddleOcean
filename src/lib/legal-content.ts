export const LEGAL_DEFINITIONS = {
  en: [
    { term: "Agreement", description: "The collective terms, conditions, and policies referenced herein." },
    { term: "B2B", description: "Business-to-Business transactions and interactions." },
    { term: "Force Majeure", description: "Unforeseeable circumstances that prevent someone from fulfilling a contract." },
    { term: "Intellectual Property", description: "Intangible creations of the mind, such as inventions, literary and artistic works, designs, symbols, names, and images used in commerce." },
    { term: "Quotation", description: "A formal statement setting out the estimated cost for a particular job or service." },
  ],
  ar: [
    { term: "الاتفاقية", description: "مجموعة الشروط والأحكام والسياسات المشار إليها هنا." },
    { term: "B2B", description: "المعاملات والتفاعلات بين الشركات." },
    { term: "القوة القاهرة", description: "الظروف غير المتوقعة التي تمنع شخصاً ما من الوفاء بالعقد." },
    { term: "الملكية الفكرية", description: "الإبداعات غير الملموسة للعقل، مثل الاختراعات والأعمال الأدبية والفنية والتصاميم والرموز والأسماء والصور المستخدمة في التجارة." },
    { term: "عرض السعر", description: "بيان رسمي يحدد التكلفة التقديرية لوظيفة أو خدمة معينة." },
  ]
};

export const TOS_SECTIONS = {
  en: [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      tlDr: "By using this site, you agree to our rules. This is a B2B platform intended for professional use.",
      content: [
        {
          _type: "block",
          children: [{ _type: "span", text: "Welcome to Middle Ocean. By accessing or using our digital catalog, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you are using this site on behalf of a company, you represent that you have the authority to bind that entity to these terms." }]
        }
      ]
    },
    {
      id: "catalog-only",
      title: "Digital Catalog Disclaimer",
      tlDr: "This website is a showcase. Prices and availability can change. Nothing here is a binding offer until we sign a contract.",
      content: [
        {
          _type: "block",
          children: [{ _type: "span", text: "All products, machinery, and materials displayed on this website constitute a digital catalog. While we strive for accuracy, descriptions, specifications, and availability are subject to change without notice. No information on this site constitutes a legally binding offer of sale." }]
        },
        {
          _type: "block",
          children: [{ _type: "span", text: "A formal purchase requires a signed Quotation or Sales Order issued by Middle Ocean through our official business channels (Email or WhatsApp)." }]
        }
      ]
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property Rights",
      tlDr: "We own our brand, and our partners own theirs. Don't copy our content without permission.",
      content: [
        {
          _type: "block",
          children: [{ _type: "span", text: "All content on this site, including text, graphics, logos, and images, is the property of Middle Ocean or its content suppliers and protected by international copyright laws. Trademarks of our partners (e.g., specific printer brands) remain the property of their respective owners. Unauthorized use, reproduction, or distribution is strictly prohibited." }]
        }
      ]
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      tlDr: "We aren't liable for indirect losses or site downtime. Always verify technical specs before purchase.",
      content: [
        {
          _type: "block",
          children: [{ _type: "span", text: "Middle Ocean shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the site or its content. Technical specifications provided are theoretical maxima and may vary based on environmental factors as detailed in our technical clauses." }]
        }
      ]
    },
    {
      id: "governing-law",
      title: "Governing Law",
      tlDr: "Legal disputes will be handled in accordance with local regulations where Middle Ocean is registered.",
      content: [
        {
          _type: "block",
          children: [{ _type: "span", text: "These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Middle Ocean operates, without regard to its conflict of law provisions." }]
        }
      ]
    }
  ],
  ar: [
    {
      id: "acceptance",
      title: "قبول الشروط",
      tlDr: "باستخدام هذا الموقع، فإنك توافق على قواعدنا. هذه منصة B2B مخصصة للاستخدام المهني.",
      content: [
        {
          _type: "block",
          children: [{ _type: "span", text: "مرحبًا بكم في ميدل أوشن. من خلال الوصول إلى كتالوجنا الرقمي أو استخدامه، فإنك تقر بأنك قرأت وفهمت وتوافق على الالتزام بشروط الخدمة هذه. إذا كنت تستخدم هذا الموقع نيابة عن شركة، فإنك تقر بأن لديك السلطة لإلزام هذا الكيان بهذه الشروط." }]
        }
      ]
    },
    {
      id: "catalog-only",
      title: "إخلاء مسؤولية الكتالوج الرقمي",
      tlDr: "هذا الموقع هو واجهة عرض. يمكن أن تتغير الأسعار والتوافر. لا يوجد شيء هنا يعد عرضاً ملزماً حتى نوقع عقداً.",
      content: [
        {
          _type: "block",
          children: [{ _type: "span", text: "جميع المنتجات والآلات والمواد المعروضة على هذا الموقع تشكل كتالوجاً رقمياً. بينما نسعى جاهدين لتحقيق الدقة، تخضع الأوصاف والمواصفات والتوافر للتغيير دون إشعار. لا تشكل أي معلومات على هذا الموقع عرضاً ملزماً قانوناً للبيع." }]
        },
        {
          _type: "block",
          children: [{ _type: "span", text: "تتطلب عملية الشراء الرسمية عرض سعر أو أمر مبيعات موقعاً صادراً عن ميدل أوشن من خلال قنوات المبيعات الرسمية لدينا (البريد الإلكتروني أو واتساب)." }]
        }
      ]
    },
    {
      id: "intellectual-property",
      title: "حقوق الملكية الفكرية",
      tlDr: "نحن نملك علامتنا التجارية، وشركاؤنا يملكون علاماتهم. لا تنسخ محتوانا دون إذن.",
      content: [
        {
          _type: "block",
          children: [{ _type: "span", text: "جميع المحتويات الموجودة على هذا الموقع، بما في ذلك النصوص والرسومات والشعارات والصور، هي ملك لميدل أوشن أو موردي محتواها ومحمية بموجب قوانين حقوق النشر الدولية. تظل العلامات التجارية لشركائنا (مثل ماركات طابعات معينة) ملكاً لأصحابها المعنيين. يحظر تماماً الاستخدام غير المصرح به أو إعادة الإنتاج أو التوزيع." }]
        }
      ]
    },
    {
      id: "liability",
      title: "تحديد المسؤولية",
      tlDr: "نحن لسنا مسؤولين عن الخسائر غير المباشرة أو توقف الموقع. تحقق دائماً من المواصفات الفنية قبل الشراء.",
      content: [
        {
          _type: "block",
          children: [{ _type: "span", text: "ميدل أوشن لن تكون مسؤولة عن أي أضرار مباشرة أو غير مباشرة أو عرضية أو تبعية تنتج عن استخدام أو عدم القدرة على استخدام الموقع أو محتواه. المواصفات الفنية المقدمة هي قيم نظرية قصوى وقد تختلف بناءً على العوامل البيئية كما هو مفصل في بنودنا الفنية." }]
        }
      ]
    },
    {
      id: "governing-law",
      title: "القانون الواجب التطبيق",
      tlDr: "سيتم التعامل مع النزاعات القانونية وفقاً للوائح المحلية حيث تم تسجيل ميدل أوشن.",
      content: [
        {
          _type: "block",
          children: [{ _type: "span", text: "تخضع هذه الشروط وتفسر وفقاً لقوانين الولاية القضائية التي تعمل فيها ميدل أوشن، دون اعتبار لتضارب أحكام القوانين." }]
        }
      ]
    }
  ]
};

export const TOS_METADATA = {
  lastUpdated: "2024-03-22",
  brandAssets: [
    "/brand/logo-gold.png", // Example paths
    "/brand/partner-brand-1.png",
  ]
};
