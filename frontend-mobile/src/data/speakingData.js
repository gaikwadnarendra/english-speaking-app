// Master Offline Speaking Data for English Shikha Mobile App

export const SPEAKING_SCENARIOS = [
  {
    id: 'daily',
    title_mr: 'दैनंदिन गप्पा (Daily Casual Chat)',
    title_hi: 'दैनिक बातचीत (Daily Casual Chat)',
    title_en: 'Daily Casual Conversation',
    description_mr: 'दिवसाची सुरुवात, छंद, कुटुंब आणि कामाबद्दल सोप्या गप्पा.',
    description_hi: 'दिन की शुरुआत, शौक, परिवार और काम के बारे में आसान बातचीत।',
    description_en: 'Simple conversations about hobbies, family, daily routines and work.',
    initial_ai_en: 'Hello! How is your day going? What did you do today?',
    initial_ai_mr: 'नमस्कार! तुमचा आजचा दिवस कसा चालला आहे? आज तुम्ही काय केले?',
    initial_ai_hi: 'नमस्ते! आपका आज का दिन कैसा जा रहा है? आज आपने क्या किया?',
    suggested_starter: [
      'I am doing good, thank you.',
      'I was busy at work today.',
      'I am learning English right now.'
    ]
  },
  {
    id: 'interview',
    title_mr: 'नोकरी मुलाखत सराव (Job Interview)',
    title_hi: 'नौकरी साक्षात्कार अभ्यास (Job Interview)',
    title_en: 'Job Interview Simulation',
    description_mr: 'तुमची ओळख, अनुभव, कौशल्ये आणि ताकदीबद्दल सराव.',
    description_hi: 'अपना परिचय, अनुभव, कौशल और खूबियों के बारे में अभ्यास।',
    description_en: 'Practice your introduction, work experience, strengths and career goals.',
    initial_ai_en: 'Welcome to the interview! Could you please introduce yourself briefly?',
    initial_ai_mr: 'मुलाखतीत आपले स्वागत आहे! कृपया तुमची थोडक्यात ओळख करून द्याल का?',
    initial_ai_hi: 'साक्षात्कार में आपका स्वागत है! क्या आप कृपया संक्षेप में अपना परिचय देंगे?',
    suggested_starter: [
      'My name is Rahul and I have 2 years of experience.',
      'I am passionate about learning new skills.',
      'Thank you for this opportunity.'
    ]
  },
  {
    id: 'shopping',
    title_mr: 'खरेदी व दुकान (Shopping & Market)',
    title_hi: 'खरीदारी और बाज़ार (Shopping & Market)',
    title_en: 'Shopping & Bargaining',
    description_mr: 'किंमत विचारणे, साईज, सवलत आणि बिल देण्याचा सराव.',
    description_hi: 'कीमत पूछना, साइज़, डिस्काउंट और बिल चुकाने का अभ्यास।',
    description_en: 'Inquire about prices, sizes, available discounts and checkout.',
    initial_ai_en: 'Hello! Welcome to our store. How can I help you today?',
    initial_ai_mr: 'नमस्कार! आमच्या दुकानात आपले स्वागत आहे. मी आपली काय मदत करू?',
    initial_ai_hi: 'नमस्ते! हमारी दुकान में आपका स्वागत है। मैं आपकी क्या मदद कर सकता हूँ?',
    suggested_starter: [
      'How much does this shirt cost?',
      'Do you have this in a larger size?',
      'Is there any discount available?'
    ]
  },
  {
    id: 'restaurant',
    title_mr: 'हॉटेल व जेवण (Restaurant & Dining)',
    title_hi: 'होटल और खाना (Restaurant & Dining)',
    title_en: 'Ordering Food at a Restaurant',
    description_mr: 'मेन्यू मागवणे, खाद्यपदार्थ ऑर्डर करणे आणि बिल मागणे.',
    description_hi: 'मेन्यू मांगना, खाना ऑर्डर करना और बिल मांगना।',
    description_en: 'Asking for the menu, ordering dishes and requesting the check.',
    initial_ai_en: 'Good evening! Here is the menu. Are you ready to order or do you need a few minutes?',
    initial_ai_mr: 'शुभ संध्याकाळ! हा घ्या मेनू. आपण ऑर्डर देण्यास तयार आहात की थोडा वेळ हवा आहे?',
    initial_ai_hi: 'शुभ संध्या! यह रहा मेन्यू। क्या आप ऑर्डर देने के लिए तैयार हैं या कुछ समय चाहिए?',
    suggested_starter: [
      'I would like to order coffee and sandwich, please.',
      'What is the special dish today?',
      'Could you please bring the bill?'
    ]
  },
  {
    id: 'travel',
    title_mr: 'प्रवास व विमानतळ (Travel & Airport)',
    title_hi: 'यात्रा और हवाई अड्डा (Travel & Airport)',
    title_en: 'Travel, Railway & Airport',
    description_mr: 'तिकीट विचारणे, प्लॅटफॉर्म शोधणे आणि मार्ग विचारणे.',
    description_hi: 'टिकट पूछना, प्लेटफॉर्म ढूंढना और रास्ता पूछना।',
    description_en: 'Booking tickets, locating platforms and asking for directions.',
    initial_ai_en: 'Hello traveller! Where are you planning to travel today?',
    initial_ai_mr: 'नमस्कार प्रवासी! आज तुम्ही कुठे प्रवास करण्याचा विचार करत आहात?',
    initial_ai_hi: 'नमस्ते यात्री! आज आप कहाँ यात्रा करने की योजना बना रहे हैं?',
    suggested_starter: [
      'I want to book a ticket to Mumbai.',
      'Which platform does the train arrive on?',
      'How long will the flight take?'
    ]
  },
  {
    id: 'doctor',
    title_mr: 'दवाखाना व डॉक्टर (Doctor Consultation)',
    title_hi: 'अस्पताल और डॉक्टर (Doctor Consultation)',
    title_en: 'Doctor & Health Consultation',
    description_mr: 'आजाराची लक्षणे, वेदना आणि औषधांबद्दल डॉक्टरांशी बोलणे.',
    description_hi: 'बीमारी के लक्षण, दर्द और दवाओं के बारे में डॉक्टर से बात करना।',
    description_en: 'Explaining symptoms, health issues and asking for prescriptions.',
    initial_ai_en: 'Hello, please sit down. What symptoms or health issues are you experiencing?',
    initial_ai_mr: 'नमस्कार, कृपया बसा. तुम्हाला काय त्रास किंवा लक्षणे जाणवत आहेत?',
    initial_ai_hi: 'नमस्ते, कृपया बैठें। आपको क्या परेशानी या लक्षण महसूस हो रहे हैं?',
    suggested_starter: [
      'I have a mild fever and headache since yesterday.',
      'My throat is paining when I swallow.',
      'Could you please suggest some medicine?'
    ]
  }
];

export const LISTEN_REPEAT_SENTENCES = [
  {
    id: 1,
    sentence: "I want a glass of water, please.",
    marathi: "मला एक ग्लास पाणी हवे आहे, कृपया.",
    hindi: "मुझे एक गिलास पानी चाहिए, कृपया।",
    pronunciation: "आय वॉन्ट अ ग्लास ऑफ वॉटर, प्लीज."
  },
  {
    id: 2,
    sentence: "Can you please help me with this address?",
    marathi: "तुम्ही मला या पत्त्यासाठी मदत करू शकता का?",
    hindi: "क्या आप इस पते के लिए मेरी मदद कर सकते हैं?",
    pronunciation: "कॅन यू प्लीज हेल्प मी विथ धिस अ‍ॅड्रेस?"
  },
  {
    id: 3,
    sentence: "I didn't understand, could you please repeat?",
    marathi: "मला समजले नाही, कृपया पुन्हा सांगाल का?",
    hindi: "मुझे समझ नहीं आया, क्या आप दोहरा सकते हैं?",
    pronunciation: "आय डिडंट अंडरस्टँड, कुड यू प्लीज रिपीट?"
  },
  {
    id: 4,
    sentence: "Where are you going for your vacation?",
    marathi: "तुम्ही सुट्टीसाठी कुठे जात आहात?",
    hindi: "आप छुट्टियों के लिए कहाँ जा रहे हैं?",
    pronunciation: "व्हेअर आर यू गोइंग फॉर युवर व्हेकेशन?"
  },
  {
    id: 5,
    sentence: "I am very excited to learn English fluently.",
    marathi: "मी अस्खलित इंग्रजी शिकण्यासाठी खूप उत्सुक आहे.",
    hindi: "मैं धाराप्रवाह अंग्रेजी सीखने के लिए बहुत उत्साहित हूँ।",
    pronunciation: "आय एम व्हेरी एक्साईटेड टू लर्न इंग्लिश फ्लुएंटली."
  }
];
