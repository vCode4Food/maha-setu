import { chatIntents, defaultResponse, quickPrompts } from '../data/chatbot';
import type { ChatAction, ChatIntent } from '../data/chatbot';
import type { Language } from '../types';
import { t } from '../utils/i18n';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  actions?: ChatAction[];
  timestamp: Date;
}

export { quickPrompts };

export function detectIntent(message: string, language: Language = 'en'): ChatIntent | null {
  const normalized = message.toLowerCase().trim();
  const quickIntent: Record<string, string> = {
    [t('chat.find', language).toLowerCase()]: 'find-service',
    [t('chat.car', language).toLowerCase()]: 'car',
    [t('chat.address', language).toLowerCase()]: 'address',
    [t('chat.track', language).toLowerCase()]: 'track',
  };
  const quickId = quickIntent[normalized];
  if (quickId) return chatIntents.find((intent) => intent.id === quickId) ?? null;
  for (const intent of chatIntents) {
    if (intent.patterns.some((p) => normalized.includes(p))) {
      return intent;
    }
  }
  return null;
}

const localizedIntentReplies: Record<Exclude<Language, 'en'>, Record<string, string>> = {
  hi: {
    car: 'नया वाहन खरीदने के बाद पंजीकरण, बीमा और परिवहन दस्तावेज़ों को अद्यतन रखें। इस प्रोटोटाइप में आप दस्तावेज़, निकटवर्ती केंद्र और प्रोफ़ाइल विवरण देख सकते हैं।', address: 'पता बदलने पर अपनी महा सेतु प्रोफ़ाइल, पहचान व अधिवास दस्तावेज़, और सक्रिय आवेदनों की जानकारी की समीक्षा करें।', job: 'नौकरी खोजने या शुरू करने के लिए रोजगार पंजीकरण, नौकरी व करियर सेवाएँ और कौशल प्रशिक्षण देखें।', admission: 'नए प्रवेश के साथ छात्रवृत्ति, शिक्षा प्रमाणपत्र और विद्यार्थी लाभों की समीक्षा करना उपयोगी रहेगा।', scholarship: 'पात्र विद्यार्थियों के लिए छात्रवृत्ति सहायता उपलब्ध है। पहले संभावित पात्रता जाँचें, फिर वॉल्ट में रखे दस्तावेज़ों से आवेदन करें।', 'lost-document': 'पहले वॉल्ट में उपलब्ध सत्यापित दस्तावेज़ देखें। डुप्लीकेट या सत्यापन के लिए विद्यार्थी प्रमाणपत्र सेवा सहायता कर सकती है।', child: 'इस प्रोटोटाइप में शिक्षा और रोजगार सेवाएँ शामिल हैं। प्रोफ़ाइल व दस्तावेज़ अद्यतन रखें और सहायता के लिए निकटवर्ती केंद्र खोजें।', retirement: 'संपर्क विवरण और विभागों में उपयोग होने वाले दस्तावेज़ों की समीक्षा करें। व्यक्तिगत सहायता के लिए निकटवर्ती सरकारी केंद्र भी देखा जा सकता है।', skill: 'महा सेतु पर शिक्षा और रोजगार दोनों से जुड़ी कौशल सेवाएँ उपलब्ध हैं। प्रशिक्षण व प्रमाणन के लिए उपयुक्त कार्यक्रम चुनें।', degree: 'डिग्री पूरा होने पर शिक्षा प्रमाणपत्र अद्यतन करें, नौकरी सहायता देखें और करियर तैयारी के लिए कौशल कार्यक्रम खोजें।', certificate: 'विद्यार्थी प्रमाणपत्र सेवा में डुप्लीकेट अनुरोध, सत्यापन और अंकपत्र संबंधी सहायता एक आवेदन में मिलती है।', business: 'व्यवसाय पंजीकरण इस प्रोटोटाइप में पूर्ण रूप से शामिल नहीं है। प्रोफ़ाइल अद्यतन करें, कौशल कार्यक्रम देखें या निकटवर्ती केंद्र खोजें।', married: 'विवाह के बाद नाम, पते या लाभार्थी विवरण बदल सकते हैं। बाद के आवेदनों को सही रखने के लिए प्रोफ़ाइल और दस्तावेज़ देखें।', mobile: 'अपना मोबाइल नंबर महा सेतु प्रोफ़ाइल में अपडेट करें ताकि आवेदन अलर्ट आप तक पहुँचें। यह प्रोटोटाइप वास्तविक सरकारी डेटाबेस नहीं बदलता।', track: 'मेरे आवेदन में संदर्भ संख्या, स्थिति बैज और जमा करने से निर्णय तक की समयरेखा दिखाई जाती है।', documents: 'दस्तावेज़ वॉल्ट पहचान, शिक्षा, अधिवास और आय जैसे दस्तावेज़ों को आवेदनों में दोबारा उपयोग करने के लिए है।', eligibility: 'प्रत्येक सेवा में पूर्ण आवेदन से पहले छोटी पात्रता जाँच होती है। सेवा खोजें और “पात्रता जाँचें” चुनें।', 'find-service': 'महा सेतु को अपनी आवश्यकता बताएं, विभाग नहीं। छात्रवृत्ति, नौकरी या कौशल प्रशिक्षण खोजें या मेनू से सेवाएँ खोलें।', greeting: 'नमस्ते। मैं महा सेतु सहायक हूँ। मैं सेवाएँ खोजने, पात्रता जाँचने, दस्तावेज़ देखने और आवेदनों को ट्रैक करने में मदद कर सकता हूँ।',
  },
  mr: {
    car: 'नवीन वाहन घेतल्यानंतर नोंदणी, विमा आणि वाहतूक कागदपत्रे अद्ययावत ठेवा. या प्रोटोटाइपमध्ये तुम्ही कागदपत्रे, जवळची केंद्रे आणि प्रोफाइल तपशील पाहू शकता.', address: 'पत्ता बदलल्यावर तुमचे महासेतू प्रोफाइल, ओळख व अधिवास कागदपत्रे आणि सक्रिय अर्जांची माहिती तपासा.', job: 'नोकरी शोधण्यासाठी किंवा सुरू करण्यासाठी रोजगार नोंदणी, नोकरी व करिअर सेवा आणि कौशल्य प्रशिक्षण पहा.', admission: 'नवीन प्रवेशासह शिष्यवृत्ती, शिक्षण प्रमाणपत्रे आणि विद्यार्थी लाभांचे पुनरावलोकन उपयुक्त ठरते.', scholarship: 'पात्र विद्यार्थ्यांसाठी शिष्यवृत्ती सहाय्य उपलब्ध आहे. आधी संभाव्य पात्रता तपासा, नंतर वॉल्टमधील कागदपत्रांसह अर्ज करा.', 'lost-document': 'आधी वॉल्टमधील पडताळलेली कागदपत्रे पहा. डुप्लिकेट किंवा पडताळणीसाठी विद्यार्थी प्रमाणपत्र सेवा मदत करू शकते.', child: 'या प्रोटोटाइपमध्ये शिक्षण आणि रोजगार सेवा आहेत. प्रोफाइल व कागदपत्रे अद्ययावत ठेवा आणि मदतीसाठी जवळचे केंद्र शोधा.', retirement: 'संपर्क तपशील आणि विभागांमध्ये वापरली जाणारी कागदपत्रे तपासा. प्रत्यक्ष मदतीसाठी जवळचे शासकीय केंद्रही पाहू शकता.', skill: 'महासेतूवर शिक्षण आणि रोजगार या दोन्हींशी संबंधित कौशल्य सेवा उपलब्ध आहेत. प्रशिक्षण व प्रमाणपत्रासाठी योग्य कार्यक्रम निवडा.', degree: 'पदवी पूर्ण झाल्यावर शिक्षण प्रमाणपत्रे अद्ययावत करा, नोकरी सहाय्य पहा आणि करिअर तयारीसाठी कौशल्य कार्यक्रम शोधा.', certificate: 'विद्यार्थी प्रमाणपत्र सेवेत डुप्लिकेट विनंती, पडताळणी आणि गुणपत्रिका-संबंधित सहाय्य एकाच अर्जात मिळते.', business: 'व्यवसाय नोंदणी या प्रोटोटाइपमध्ये पूर्णपणे समाविष्ट नाही. प्रोफाइल अद्ययावत करा, कौशल्य कार्यक्रम पहा किंवा जवळचे केंद्र शोधा.', married: 'विवाहानंतर नाव, पत्ता किंवा लाभार्थी तपशील बदलू शकतात. पुढील अर्ज योग्य राहण्यासाठी प्रोफाइल व कागदपत्रे तपासा.', mobile: 'अर्ज सूचना मिळण्यासाठी तुमचा मोबाइल नंबर महासेतू प्रोफाइलमध्ये अद्ययावत करा. हा प्रोटोटाइप प्रत्यक्ष शासकीय डेटाबेस बदलत नाही.', track: 'माझे अर्ज मध्ये संदर्भ क्रमांक, स्थिती बॅज आणि सादरीकरणापासून निर्णयापर्यंतची कालरेषा दिसते.', documents: 'कागदपत्र वॉल्टमध्ये ओळख, शिक्षण, अधिवास आणि उत्पन्नाची कागदपत्रे अर्जांमध्ये पुन्हा वापरण्यासाठी ठेवली जातात.', eligibility: 'प्रत्येक सेवेसाठी पूर्ण अर्जापूर्वी छोटी पात्रता तपासणी असते. सेवा शोधा आणि “पात्रता तपासा” निवडा.', 'find-service': 'महासेतूला विभाग नव्हे तर तुमची गरज सांगा. शिष्यवृत्ती, नोकरी किंवा कौशल्य प्रशिक्षण शोधा किंवा मेनूमधून सेवा उघडा.', greeting: 'नमस्कार. मी महासेतू सहाय्यक आहे. मी सेवा शोधणे, पात्रता तपासणे, कागदपत्रे पाहणे आणि अर्जांचा मागोवा घेणे यात मदत करू शकतो.',
  },
};

function localizeAction(action: ChatAction, language: Language): ChatAction {
  if (language === 'en') return action;
  const targetLabel: Record<string, string> = {
    '/documents': t('nav.documents', language), '/profile': t('nav.profile', language), '/applications': t('nav.applications', language), '/search': t('nav.search', language), '/help': t('nav.help', language), '/education': t('nav.education', language), '/employability': t('nav.employability', language),
    '/services/scholarship-assistance': language === 'hi' ? 'छात्रवृत्ति सहायता' : 'शिष्यवृत्ती सहाय्य', '/services/employment-registration': language === 'hi' ? 'रोज़गार पंजीकरण' : 'रोजगार नोंदणी', '/services/education-certificate-assistance': language === 'hi' ? 'प्रमाणपत्र सहायता' : 'प्रमाणपत्र सहाय्य', '/services/education-skill-development': language === 'hi' ? 'शिक्षा कौशल कार्यक्रम' : 'शिक्षण कौशल्य कार्यक्रम', '/services/skill-development-training': language === 'hi' ? 'कौशल प्रशिक्षण' : 'कौशल्य प्रशिक्षण',
  };
  return { ...action, label: targetLabel[action.target ?? ''] ?? (action.type === 'scroll' ? (language === 'hi' ? 'निकटवर्ती केंद्र' : 'जवळची केंद्रे') : action.label) };
}

export function getAssistantResponse(message: string, language: Language = 'en'): Omit<ChatMessage, 'id' | 'timestamp'> {
  const intent = detectIntent(message, language);
  if (intent) {
    return {
      role: 'assistant',
      content: language === 'en' ? intent.response : localizedIntentReplies[language][intent.id] ?? t('chat.welcome', language),
      actions: intent.actions?.map((action) => localizeAction(action, language)),
    };
  }
  return {
    role: 'assistant',
    content: language === 'en' ? defaultResponse : (language === 'hi' ? 'मैं महा सेतु सेवाओं में आपका मार्गदर्शन कर सकता हूँ। छात्रवृत्ति, नौकरी, दस्तावेज़, आवेदन ट्रैकिंग या जीवन की किसी घटना के बारे में पूछें।' : 'मी तुम्हाला महासेतू सेवांमध्ये मार्गदर्शन करू शकतो. शिष्यवृत्ती, नोकरी, कागदपत्रे, अर्जाचा मागोवा किंवा जीवनातील एखाद्या बदलाबद्दल विचारा.'),
    actions: [
      localizeAction({ id: 'def-search', label: 'Search services', type: 'navigate', target: '/search' }, language),
      localizeAction({ id: 'def-help', label: 'Help & Support', type: 'navigate', target: '/help' }, language),
    ],
  };
}

export function getContextualHint(pathname: string, step?: string, language: Language = 'en'): string | null {
  const copy = language === 'hi'
    ? { apply: 'आप एक आवेदन भर रहे हैं। दस्तावेज़ों या पात्रता में सहायता चाहिए तो पूछें।', eligibility: 'हर प्रश्न का ईमानदारी से उत्तर दें — इससे संभावित पात्रता का आकलन होता है।', application: 'आप आवेदन की स्थिति या अगले कदम के बारे में पूछ सकते हैं।', documents: 'वॉल्ट के दस्तावेज़ सेवा आवेदनों में दोबारा उपयोग किए जा सकते हैं।', submitted: 'आपका आवेदन सफलतापूर्वक जमा हो गया है। क्या आप इसे ट्रैक करना चाहेंगे?' }
    : language === 'mr'
      ? { apply: 'तुम्ही अर्ज भरत आहात. कागदपत्रे किंवा पात्रतेबाबत मदत हवी असल्यास विचारा.', eligibility: 'प्रत्येक प्रश्नाचे प्रामाणिक उत्तर द्या — त्यामुळे संभाव्य पात्रतेचे मूल्यांकन करता येते.', application: 'तुम्ही अर्जाची स्थिती किंवा पुढील पायरीबद्दल विचारू शकता.', documents: 'वॉल्टमधील कागदपत्रे सेवा अर्जांमध्ये पुन्हा वापरता येतात.', submitted: 'तुमचा अर्ज यशस्वीरित्या सादर झाला आहे. त्याचा मागोवा घ्यायचा आहे का?' }
      : { apply: "You're filling an application. Need help with documents or eligibility? Just ask.", eligibility: 'Answer each question honestly — this helps us assess your likely eligibility.', application: 'You can ask me about your application status or what happens next.', documents: 'Documents in your vault can be reused when applying for services.', submitted: 'Your application has been submitted successfully. Would you like to track it?' };
  if (pathname.includes('/apply')) {
    return copy.apply;
  }
  if (pathname.includes('/eligibility')) {
    return copy.eligibility;
  }
  if (pathname.includes('/applications/')) {
    return copy.application;
  }
  if (pathname === '/documents') {
    return copy.documents;
  }
  if (step === 'submitted') {
    return copy.submitted;
  }
  return null;
}

export function createMessage(
  role: 'user' | 'assistant',
  content: string,
  actions?: ChatAction[]
): ChatMessage {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role,
    content,
    actions,
    timestamp: new Date(),
  };
}
