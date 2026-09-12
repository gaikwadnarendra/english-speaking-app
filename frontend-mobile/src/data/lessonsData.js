// Comprehensive Offline Lessons Data for English Shikha Mobile App
// 20 rich structured lessons across 5 proficiency levels

export const INITIAL_LESSONS = [
  // ==================== LEVEL 1: BEGINNER BASICS ====================
  {
    id: 1,
    level: 1,
    category: "Alphabet & Phonics",
    category_mr: "मुळाक्षरे आणि उच्चार",
    category_hi: "वर्णमाला और ध्वनियाँ",
    category_en: "Alphabet & Phonics",
    title_en: "Alphabet, Phonics & First Words",
    title_mr: "इंग्रजी मुळाक्षरे, आवाज आणि पहिले शब्द",
    title_hi: "अंग्रेजी वर्णमाला, ध्वनियाँ और पहले शब्द",
    description_mr: "इंग्रजीची सुरुवात! सोपे शब्द, आवाज आणि उच्चार समजून घ्या.",
    description_hi: "अंग्रेजी की शुरुआत! आसान शब्द, आवाज और उच्चारण समझें।",
    description_en: "Kickstart your English with fundamental sounds, phonics, and everyday starter words.",
    grammar_tip: {
      title_mr: "💡 इंग्रजी उच्चार आणि ध्वनी नियम (Phonics Rule)",
      title_hi: "💡 अंग्रेजी उच्चारण और ध्वनि नियम (Phonics Rule)",
      title_en: "💡 Phonics & Sound Basics",
      rule_mr: "इंग्रजीत ५ मुख्य स्वर (Vowels: A, E, I, O, U) आहेत. 'A' चा आवाज 'अ‍ॅ' (Apple) किंवा 'आ' (Arm) असा होतो. मोठ्याने उच्चार ऐका आणि पुन्हा बोला!",
      rule_hi: "अंग्रेजी में 5 मुख्य स्वर (Vowels: A, E, I, O, U) होते हैं। 'A' की ध्वनि 'ऐ' (Apple) या 'आ' (Arm) जैसी होती है। उच्चारण ध्यान से सुनें और दोहराएं!",
      rule_en: "English has 5 vowels (A, E, I, O, U). Practice short and long vowel sounds for clear pronunciation.",
      example_en: "A is for Apple (/अ‍ॅपल/), B is for Ball (/बॉल/).",
      example_mr: "A म्हणजे सफरचंद (Apple), B म्हणजे चेंडू (Ball).",
      example_hi: "A यानी सेब (Apple), B यानी गेंद (Ball)।"
    },
    dialogue: [
      { speaker: "Teacher", text_en: "Hello! Welcome to your first English lesson.", text_mr: "हॅलो! तुमच्या पहिल्या इंग्रजी धड्यात तुमचे स्वागत आहे.", text_hi: "नमस्ते! आपके पहले अंग्रेजी पाठ में स्वागत है।", pron: "हॅलो! वेलकम टू युवर फर्स्ट इंग्लिश लेसन." },
      { speaker: "Student", text_en: "Hello teacher, I want to learn English.", text_mr: "नमस्ते सर, मला इंग्रजी शिकायचे आहे.", text_hi: "नमस्ते सर, मुझे अंग्रेजी सीखनी है।", pron: "हॅलो टीचर, आय वॉन्ट टू लर्न इंग्लिश." },
      { speaker: "Teacher", text_en: "Great! Let's start with basic sounds.", text_mr: "छान! आपण मूलभूत आवाजांपासून सुरुवात करूया.", text_hi: "बहुत बढ़िया! चलिए बुनियादी ध्वनियों से शुरू करते हैं।", pron: "ग्रेट! लेट्स स्टार्ट विथ बेसिक साऊंड्स." }
    ],
    content: [
      { en: "Apple", mr: "सफरचंद", hi: "सेब", pron: "अ‍ॅपल", example_en: "I eat an apple daily.", example_mr: "मी रोज एक सफरचंद खातो.", example_hi: "मैं रोज़ एक सेब खाता हूँ।" },
      { en: "Ball", mr: "चेंडू", hi: "गेंद", pron: "बॉल", example_en: "The boy has a red ball.", example_mr: "मुलाकडे लाल चेंडू आहे.", example_hi: "लड़के के पास लाल गेंद है।" },
      { en: "Cat", mr: "मांजर", hi: "बिल्ली", pron: "कॅट", example_en: "The cat is drinking milk.", example_mr: "मांजर दूध पीत आहे.", example_hi: "बिल्ली दूध पी रही है।" },
      { en: "Dog", mr: "कुत्रा", hi: "कुत्ता", pron: "डॉग", example_en: "The dog is barking.", example_mr: "कुत्रा भुंकत आहे.", example_hi: "कुत्ता भौंक रहा है।" },
      { en: "Elephant", mr: "हत्ती", hi: "हाथी", pron: "एलिफंट", example_en: "The elephant is very large.", example_mr: "हत्ती खूप मोठा असतो.", example_hi: "हाथी बहुत बड़ा होता है।" }
    ],
    quiz: [
      {
        question_mr: "'Apple' या शब्दाचा मराठी अर्थ काय?",
        question_hi: "'Apple' शब्द का हिंदी अर्थ क्या है?",
        question_en: "What does 'Apple' mean?",
        options: ["सफरचंद (Apple)", "मांजर (Cat)", "कुत्रा (Dog)", "चेंडू (Ball)"],
        correct: 0,
        explanation_mr: "Apple चा अर्थ 'सफरचंद' होतो.",
        explanation_hi: "Apple का अर्थ 'सेब' होता है।"
      },
      {
        question_mr: "'चेंडू' ला इंग्रजीत काय म्हणतात?",
        question_hi: "'गेंद' को अंग्रेजी में क्या कहते हैं?",
        question_en: "What is the English word for 'Ball'?",
        options: ["Cat", "Ball", "Dog", "Apple"],
        correct: 1,
        explanation_mr: "चेंडू = Ball (बॉल)",
        explanation_hi: "गेंद = Ball (बॉल)"
      }
    ],
    is_completed: true
  },
  {
    id: 2,
    level: 1,
    category: "Greetings & Manners",
    category_mr: "अभिवादन आणि शिष्टाचार",
    category_hi: "अभिवादन और शिष्टाचार",
    category_en: "Greetings & Manners",
    title_en: "Daily Greetings & Polite Expressions",
    title_mr: "दैनंदिन अभिवादन आणि आदरयुक्त शब्द",
    title_hi: "रोज के अभिवादन और शिष्टाचार",
    description_mr: "सकाळी, संध्याकाळी आणि लोकांशी बोलताना वापरायचे मूलभूत शब्द.",
    description_hi: "सुबह, शाम और लोगों से मिलते समय प्रयोग होने वाले शब्द।",
    description_en: "Learn how to greet people, say please and thank you, and make polite requests.",
    grammar_tip: {
      title_mr: "💡 अभिवादनाचे नियम (Time-based Greetings)",
      title_hi: "💡 अभिवादन के नियम (Time-based Greetings)",
      title_en: "💡 Greeting Rules",
      rule_mr: "सकाळी १२ वाजेपर्यंत 'Good Morning' म्हणा. दुपारी १२ ते संध्याकाळी ५ पर्यंत 'Good Afternoon' आणि ५ नंतर 'Good Evening' वापरा. झोपताना 'Good Night' म्हणा.",
      rule_hi: "सुबह १२ बजे तक 'Good Morning', दोपहर १२ से शाम ५ तक 'Good Afternoon' और ५ बजे के बाद 'Good Evening' कहें। सोने जाते समय 'Good Night' कहें।",
      rule_en: "Use Good Morning (until 12 PM), Good Afternoon (12-5 PM), Good Evening (5 PM onwards), and Good Night when parting to sleep.",
      example_en: "Good morning! How are you doing today?",
      example_mr: "शुभ सकाळ! आज तुम्ही कसे आहात?",
      example_hi: "सुप्रभात! आज आप कैसे हैं?"
    },
    dialogue: [
      { speaker: "Amit", text_en: "Good morning, Priya! How are you?", text_mr: "शुभ सकाळ, प्रिया! तू कशी आहेस?", text_hi: "सुप्रभात, प्रिया! तुम कैसी हो?", pron: "गुड मॉर्निंग, प्रिया! हाऊ आर यू?" },
      { speaker: "Priya", text_en: "Good morning, Amit! I am doing great, thank you.", text_mr: "शुभ सकाळ, अमित! मी मजेत आहे, धन्यवाद.", text_hi: "सुप्रभात, अमित! मैं बहुत अच्छी हूँ, धन्यवाद।", pron: "गुड मॉर्निंग, अमित! आय एम डुइंग ग्रेट, थँक यू." },
      { speaker: "Amit", text_en: "Have a wonderful day ahead!", text_mr: "तुमचा आजचा दिवस चांगला जावो!", text_hi: "आपका आज का दिन बहुत अच्छा रहे!", pron: "हॅव अ वंडरफुल डे अहेड!" }
    ],
    content: [
      { en: "Good Morning", mr: "शुभ सकाळ", hi: "सुप्रभात", pron: "गुड मॉर्निंग", example_en: "Good morning to everyone.", example_mr: "सर्वांना शुभ सकाळ.", example_hi: "सभी को सुप्रभात।" },
      { en: "Good Night", mr: "शुभ रात्री", hi: "शुभ रात्रि", pron: "गुड नाईट", example_en: "Good night, sleep well.", example_mr: "शुभ रात्री, शांत झोपा.", example_hi: "शुभ रात्रि, अच्छे से सोइए।" },
      { en: "Please", mr: "कृपया", hi: "कृपया", pron: "प्लीज", example_en: "Please give me a glass of water.", example_mr: "कृपया मला एक ग्लास पाणी द्या.", example_hi: "कृपया मुझे एक गिलास पानी दीजिए।" },
      { en: "Thank you", mr: "धन्यवाद / आभारी आहे", hi: "धन्यवाद / शुक्रिया", pron: "थँक्यू", example_en: "Thank you very much for your help.", example_mr: "मदतीबद्दल खूप खूप धन्यवाद.", example_hi: "मदद के लिए बहुत बहुत धन्यवाद।" },
      { en: "Sorry / Excuse me", mr: "माफ करा", hi: "माफ़ कीजिए", pron: "सॉरी / एक्सक्यूज मी", example_en: "Excuse me, where is the station?", example_mr: "माफ करा, स्टेशन कुठे आहे?", example_hi: "माफ़ कीजिए, स्टेशन कहाँ है?" }
    ],
    quiz: [
      {
        question_mr: "सकाळी भेटल्यावर काय म्हणावे?",
        question_hi: "सुबह मिलने पर क्या कहना चाहिए?",
        question_en: "What should you say in the morning?",
        options: ["Good Night", "Good Morning", "Good Evening", "Goodbye"],
        correct: 1,
        explanation_mr: "सकाळी १२ वाजेपर्यंत Good Morning म्हणतात.",
        explanation_hi: "सुबह Good Morning बोला जाता है।"
      },
      {
        question_mr: "'कृपया' ला इंग्रजीत काय म्हणतात?",
        question_hi: "'कृपया' को अंग्रेजी में क्या कहते हैं?",
        question_en: "What is the English word for 'Please'?",
        options: ["Thank you", "Sorry", "Please", "Welcome"],
        correct: 2,
        explanation_mr: "कृपया = Please",
        explanation_hi: "कृपया = Please"
      }
    ],
    is_completed: false
  },
  {
    id: 3,
    level: 1,
    category: "Family & Relations",
    category_mr: "कुटुंब आणि नातेसंबंध",
    category_hi: "परिवार और रिश्ते",
    category_en: "Family & Relations",
    title_en: "Family Members & Introducing Yourself",
    title_mr: "कुटुंबातील सदस्य आणि स्वतःची ओळख",
    title_hi: "परिवार के सदस्य और अपना परिचय",
    description_mr: "आई, वडील, भाऊ, बहीण या नात्यांची नावे आणि स्वतःची साधी ओळख करून देणे.",
    description_hi: "माता, पिता, भाई, बहन और अपना संक्षिप्त परिचय देना सीखें।",
    description_en: "Learn vocabulary for relatives and how to introduce yourself with confidence.",
    grammar_tip: {
      title_mr: "💡 स्वतःची ओळख सांगताना (This is my...)",
      title_hi: "💡 अपना और परिवार का परिचय देते समय",
      title_en: "💡 Introducing Family",
      rule_mr: "कुटुंबातील सदस्यांची ओळख करून देताना 'This is my father / mother / brother' अशी वाक्यरचना करा.",
      rule_hi: "परिवार के सदस्य का परिचय देते समय 'This is my father / mother / brother' बोलें।",
      rule_en: "Use 'This is my [relative]' to introduce family members politely.",
      example_en: "This is my mother. Her name is Sunita.",
      example_mr: "ही माझी आई आहे. तिचे नाव सुनीता आहे.",
      example_hi: "यह मेरी माँ हैं। उनका नाम सुनीता है।"
    },
    dialogue: [
      { speaker: "Rohan", text_en: "Hello, what is your name?", text_mr: "हॅलो, तुमचे नाव काय आहे?", text_hi: "नमस्ते, आपका नाम क्या है?", pron: "हॅलो, व्हॉट इज युवर नेम?" },
      { speaker: "Sneha", text_en: "My name is Sneha. This is my brother Rahul.", text_mr: "माझे नाव स्नेहा आहे. हा माझा भाऊ राहुल आहे.", text_hi: "मेरा नाम स्नेहा है। यह मेरा भाई राहुल है।", pron: "माय नेम इज स्नेहा. धिस इज माय ब्रदर राहुल." },
      { speaker: "Rohan", text_en: "Nice to meet you both!", text_mr: "तुम्हा दोघांना भेटून आनंद झाला!", text_hi: "आप दोनों से मिलकर खुशी हुई!", pron: "नाइस टू मीट यू बोथ!" }
    ],
    content: [
      { en: "Father", mr: "वडील / बाबा", hi: "पिताजी / पापा", pron: "फादर", example_en: "My father is a teacher.", example_mr: "माझे बाबा शिक्षक आहेत.", example_hi: "मेरे पिताजी अध्यापक हैं।" },
      { en: "Mother", mr: "आई", hi: "माँ / माताजी", pron: "मदर", example_en: "My mother cooks tasty food.", example_mr: "माझी आई चविष्ट जेवण बनवते.", example_hi: "मेरी माँ स्वादिष्ट खाना बनाती हैं।" },
      { en: "Brother", mr: "भाऊ", hi: "भाई", pron: "ब्रदर", example_en: "I have one younger brother.", example_mr: "मला एक लहान भाऊ आहे.", example_hi: "मेरा एक छोटा भाई है।" },
      { en: "Sister", mr: "बहीण", hi: "बहन", pron: "सिस्टर", example_en: "My sister is studying in college.", example_mr: "माझी बहीण कॉलेजमध्ये शिकत आहे.", example_hi: "मेरी बहन कॉलेज में पढ़ रही है।" },
      { en: "Family", mr: "कुटुंब", hi: "परिवार", pron: "फॅमिली", example_en: "I love my family very much.", example_mr: "माझे माझ्या कुटुंबावर खूप प्रेम आहे.", example_hi: "मैं अपने परिवार से बहुत प्यार करता हूँ।" }
    ],
    quiz: [
      {
        question_mr: "'वडील' या नात्याला इंग्रजीत काय म्हणतात?",
        question_hi: "'पिताजी' को अंग्रेजी में क्या कहते हैं?",
        question_en: "What is the English word for 'Father'?",
        options: ["Brother", "Father", "Mother", "Sister"],
        correct: 1,
        explanation_mr: "वडील = Father",
        explanation_hi: "पिताजी = Father"
      }
    ],
    is_completed: false
  },

  // ==================== LEVEL 2: DAILY LIFE & CONVERSATION ====================
  {
    id: 4,
    level: 2,
    category: "Daily Routine",
    category_mr: "दैनिक दिनचर्या",
    category_hi: "दैनिक दिनचर्या",
    category_en: "Daily Routine",
    title_en: "My Daily Routine & Action Verbs",
    title_mr: "माझी दिनचर्या आणि रोजच्या सवयी",
    title_hi: "मेरी दिनचर्या और दैनिक क्रियाएँ",
    description_mr: "सकाळी उठण्यापासून रात्री झोपेपर्यंतच्या क्रिया इंग्रजीत व्यक्त करा.",
    description_hi: "सुबह जागने से लेकर रात को सोने तक की क्रियाएँ व्यक्त करना सीखें।",
    description_en: "Talk about your day-to-day habits and routine tasks using simple present tense.",
    grammar_tip: {
      title_mr: "💡 साध्या वर्तमानकाळाचा नियम (Simple Present Tense)",
      title_hi: "💡 सामान्य वर्तमान काल का नियम (Simple Present Tense)",
      title_en: "💡 Simple Present Tense for Habits",
      rule_mr: "रोजच्या सवयी सांगताना क्रियापदाचे पहिले रूप (V1) वापरा: 'I wake up early', 'I drink tea'. He/She/It असल्यास क्रियापदाला 's' किंवा 'es' लावा (He wakes up).",
      rule_hi: "रोज़ की आदतें बताते समय क्रिया का पहला रूप (V1) लगाएं: 'I wake up early'. He/She/It के साथ 's/es' लगाएं (He wakes up).",
      rule_en: "Use base verb (V1) for habits (I wake up, I go). Add 's/es' for third person singular (He wakes up).",
      example_en: "I wake up at 6 AM every morning.",
      example_mr: "मी रोज सकाळी ६ वाजता उठतो.",
      example_hi: "मैं रोज़ सुबह ६ बजे उठता हूँ।"
    },
    dialogue: [
      { speaker: "Karan", text_en: "What time do you wake up every day?", text_mr: "तू रोज किती वाजता उठतोस?", text_hi: "तुम रोज़ कितने बजे उठते हो?", pron: "व्हॉट टाईम डू यू वेक अप एव्हरी डे?" },
      { speaker: "Vikas", text_en: "I usually wake up at 6:30 AM.", text_mr: "मी सहसा सकाळी ६:३० वाजता उठतो.", text_hi: "मैं आमतौर पर सुबह ६:३० बजे उठता हूँ।", pron: "आय युज्युअली वेक अप अ‍ॅट सिक्स थर्टी एएम." }
    ],
    content: [
      { en: "Wake up", mr: "झोपेतून उठणे", hi: "जागना / उठना", pron: "वेक अप", example_en: "I wake up early in the morning.", example_mr: "मी सकाळी लवकर उठतो.", example_hi: "मैं सुबह जल्दी उठता हूँ।" },
      { en: "Brush teeth", mr: "दात घासणे", hi: "दाँत साफ़ करना", pron: "ब्रश टीथ", example_en: "I brush my teeth twice a day.", example_mr: "मी दिवसातून दोनदा दात घासतो.", example_hi: "मैं दिन में दो बार ब्रश करता हूँ।" },
      { en: "Have breakfast", mr: "सकाळचा नाश्ता करणे", hi: "नाश्ता करना", pron: "हॅव ब्रेकफास्ट", example_en: "We have breakfast together.", example_mr: "आम्ही एकत्र नाश्ता करतो.", example_hi: "हम साथ में नाश्ता करते हैं।" },
      { en: "Go to work / school", mr: "कामावर / शाळेत जाणे", hi: "काम पर / स्कूल जाना", pron: "गो टू वर्क / स्कूल", example_en: "He goes to office by bus.", example_mr: "तो बसने ऑफिसला जातो.", example_hi: "वह बस से ऑफिस जाता है।" },
      { en: "Sleep / Go to bed", mr: "झोपायला जाणे", hi: "सोना", pron: "स्लीप / गो टू बेड", example_en: "I go to bed at 10 PM.", example_mr: "मी रात्री १० वाजता झोपतो.", example_hi: "मैं रात १० बजे सोता हूँ।" }
    ],
    quiz: [
      {
        question_mr: "'मी सकाळी लवकर उठतो' चे योग्य इंग्रजी काय?",
        question_hi: "'मैं सुबह जल्दी उठता हूँ' का सही अंग्रेजी क्या है?",
        question_en: "How do you say 'I wake up early in the morning'?",
        options: ["I sleep early", "I wake up early", "I run fast", "I eat breakfast"],
        correct: 1,
        explanation_mr: "Wake up म्हणजे उठणे.",
        explanation_hi: "Wake up का अर्थ उठना होता है।"
      }
    ],
    is_completed: false
  },

  // ==================== LEVEL 3: SENTENCE PATTERNS & TENSES ====================
  {
    id: 5,
    level: 3,
    category: "Grammar & Tenses",
    category_mr: "व्याकरण आणि काळ",
    category_hi: "व्याकरण और काल",
    category_en: "Grammar & Tenses",
    title_en: "Past Tense: Talking About Yesterday",
    title_mr: "भूतकाळ: काल काय घडले ते सांगणे",
    title_hi: "भूतकाल: कल क्या हुआ यह बताना",
    description_mr: "भूतकाळातील घटनांसाठी क्रियापदाचे दुसरे रूप (V2) वापरण्याचे नियम.",
    description_hi: "भूतकाल की घटनाओं के लिए V2 क्रिया रूप का प्रयोग सीखें।",
    description_en: "Master past simple tense with regular and irregular verbs (V2).",
    grammar_tip: {
      title_mr: "💡 साधा भूतकाळ (Simple Past Tense - V2)",
      title_hi: "💡 सामान्य भूतकाल (Simple Past Tense - V2)",
      title_en: "💡 Past Simple Rule (V2)",
      rule_mr: "भूतकाळातील कोणत्याही घटनेसाठी क्रियापदाचे दुसरे रूप (V2) वापरा. उदा. Go -> Went, Eat -> Ate, See -> Saw.",
      rule_hi: "बीते हुए समय की बात करने के लिए V2 रूप का प्रयोग करें। जैसे: Go -> Went, Eat -> Ate, See -> Saw.",
      rule_en: "Use Past tense (V2) for completed actions. Negative: Did not + V1 (I did not go).",
      example_en: "I went to the market yesterday and bought vegetables.",
      example_mr: "मी काल बाजारात गेलो आणि भाज्या खरेदी केल्या.",
      example_hi: "मैं कल बाज़ार गया और सब्जियाँ खरीदीं।"
    },
    dialogue: [
      { speaker: "Neha", text_en: "Where did you go yesterday?", text_mr: "तू काल कुठे गेला होतास?", text_hi: "तुम कल कहाँ गए थे?", pron: "व्हेअर डिड यू गो यस्टरडे?" },
      { speaker: "Ajay", text_en: "I went to Pune to meet my friends.", text_mr: "मी मित्रांना भेटण्यासाठी पुण्यात गेलो होतो.", text_hi: "मैं दोस्तों से मिलने पुणे गया था।", pron: "आय वेंट टू पुणे टू मीट माय फ्रेंड्स." }
    ],
    content: [
      { en: "Went", mr: "गेलो / गेली", hi: "गया / गई", pron: "वेंट", example_en: "We went to Mumbai last week.", example_mr: "आम्ही गेल्या आठवड्यात मुंबईला गेलो होतो.", example_hi: "हम पिछले हफ्ते मुंबई गए थे।" },
      { en: "Saw", mr: "पाहिले", hi: "देखा", pron: "सॉ", example_en: "I saw a nice movie yesterday.", example_mr: "मी काल एक छान चित्रपट पाहिला.", example_hi: "मैंने कल एक अच्छी फिल्म देखी।" },
      { en: "Met", mr: "भेटलो", hi: "मिला / मिले", pron: "मेट", example_en: "I met my old school friend.", example_mr: "मी माझ्या जुन्या शालेय मित्राला भेटलो.", example_hi: "मैं अपने पुराने स्कूल के दोस्त से मिला।" },
      { en: "Bought", mr: "खरेदी केले", hi: "खरीदा", pron: "बॉट", example_en: "She bought a new phone.", example_mr: "तिने नवीन फोन विकत घेतला.", example_hi: "उसने एक नया फ़ोन खरीदा।" },
      { en: "Finished", mr: "पूर्ण केले / संपवले", hi: "समाप्त किया", pron: "फिनिश्ड", example_en: "I finished my work on time.", example_mr: "मी माझे काम वेळेत पूर्ण केले.", example_hi: "मैंने समय पर अपना काम पूरा कर लिया।" }
    ],
    quiz: [
      {
        question_mr: "'Go' चे भूतकाळी रूप (V2) काय आहे?",
        question_hi: "'Go' का भूतकाल रूप (V2) क्या है?",
        question_en: "What is the V2 past form of 'Go'?",
        options: ["Gone", "Went", "Going", "Goes"],
        correct: 1,
        explanation_mr: "Go (V1) -> Went (V2) -> Gone (V3)",
        explanation_hi: "Go (V1) -> Went (V2) -> Gone (V3)"
      }
    ],
    is_completed: false
  },

  // ==================== LEVEL 4: CONVERSATIONAL MASTERY ====================
  {
    id: 6,
    level: 4,
    category: "Speaking in Public",
    category_mr: "सार्वजनिक ठिकाणी संभाषण",
    category_hi: "सार्वजनिक स्थलों पर बातचीत",
    category_en: "Public Conversations",
    title_en: "Ordering Food in a Restaurant & Shopping",
    title_mr: "हॉटेलमध्ये जेवणाची ऑर्डर देणे आणि खरेदी करणे",
    title_hi: "रेस्टोरेंट में खाना ऑर्डर करना और खरीदारी",
    description_mr: "रेस्टॉरंटमध्ये ऑर्डर कशी द्यावी आणि दुकानात भाव कसा करावा ते शिका.",
    description_hi: "होटल में खाना ऑर्डर करना और मॉल या बाज़ार में मोलभाव करना सीखें।",
    description_en: "Speak fluently while placing orders, asking prices, and requesting bills.",
    grammar_tip: {
      title_mr: "💡 नम्रपणे मागणी करणे (I would like... / Could I have...)",
      title_hi: "💡 विनम्रतापूर्वक निवेदन करना (I would like...)",
      title_en: "💡 Polite Ordering Patterns",
      rule_mr: "'मला हे पाहिजे' म्हणताना 'I want' ऐवजी 'I would like to order...' किंवा 'Could I please have...' वापरल्यास संभाषण अधिक प्रभावी वाटते.",
      rule_hi: "'I want' के स्थान पर 'I would like...' या 'Could you please give me...' का प्रयोग करें।",
      rule_en: "Use 'I would like [item]' or 'Could I have [item], please?' for courteous requests.",
      example_en: "Could I please have the menu card and a bottle of water?",
      example_mr: "कृपया मला मेनू कार्ड आणि पाण्याची बाटली मिळेल का?",
      example_hi: "क्या मुझे मेनू कार्ड और पानी की बोतल मिल सकती है?"
    },
    dialogue: [
      { speaker: "Waiter", text_en: "Good evening sir, are you ready to order?", text_mr: "शुभ संध्याकाळ सर, तुम्ही ऑर्डर देण्यासाठी तयार आहात का?", text_hi: "शुभ संध्या सर, क्या आप ऑर्डर देने के लिए तैयार हैं?", pron: "गुड इव्हनिंग सर, आर यू रेडी टू ऑर्डर?" },
      { speaker: "Customer", text_en: "Yes, I would like a masala tea and one sandwich.", text_mr: "हो, मला एक मसाला चहा आणि एक सँडविच हवे आहे.", text_hi: "हाँ, मुझे एक मसाला चाय और एक सैंडविच चाहिए।", pron: "येस, आय वुड लाईक अ मसाला टी अँड वन सँडविच." },
      { speaker: "Waiter", text_en: "Sure sir, it will be served in 10 minutes.", text_mr: "नक्कीच सर, १० मिनिटांत घेऊन येतो.", text_hi: "बिल्कुल सर, १० मिनट में तैयार हो जाएगा।", pron: "शुअर सर, इट विल बी सर्व्हड इन टेन मिनिट्स." }
    ],
    content: [
      { en: "Menu card", mr: "मेनू कार्ड / पदार्थांची यादी", hi: "मेनू कार्ड", pron: "मेनू कार्ड", example_en: "Please bring the menu card.", example_mr: "कृपया मेनू कार्ड आणा.", example_hi: "कृपया मेनू कार्ड लाइए।" },
      { en: "How much is this?", mr: "याची किंमत किती आहे?", hi: "यह कितने का है?", pron: "हाऊ मच इज धिस?", example_en: "Excuse me, how much is this shirt?", example_mr: "माफ करा, या शर्टची किंमत किती आहे?", example_hi: "माफ़ कीजिए, यह शर्ट कितने की है?" },
      { en: "Bill please", mr: "कृपया बिल द्या", hi: "कृपया बिल दीजिए", pron: "बिल प्लीज", example_en: "Could you get us the bill, please?", example_mr: "कृपया आम्हाला बिल आणून द्याल का?", example_hi: "क्या आप हमें बिल दे सकते हैं?" },
      { en: "Discount", mr: "सूट / सवलत", hi: "छूट / डिस्काउंट", pron: "डिस्काउंट", example_en: "Is there any discount on this item?", example_mr: "या वस्तूवर काही सूट आहे का?", example_hi: "क्या इस वस्तु पर कोई छूट है?" },
      { en: "Delicious", mr: "अतिशय चवदार / स्वादिष्ट", hi: "स्वादिष्ट", pron: "डिलिशस", example_en: "The food was really delicious.", example_mr: "जेवण खरोखर खूप चवदार होते.", example_hi: "खाना वास्तव में बहुत स्वादिष्ट था।" }
    ],
    quiz: [
      {
        question_mr: "हॉटेलमध्ये बिल मागताना काय बोलाल?",
        question_hi: "होटल में बिल मांगते समय क्या बोलेंगे?",
        question_en: "What do you say when requesting the bill?",
        options: ["Where is the bus?", "Bill please", "I am sleeping", "Good morning"],
        correct: 1,
        explanation_mr: "बिल मागण्यासाठी 'Bill please' किंवा 'Could I have the bill?' वापरतात.",
        explanation_hi: "बिल मांगने के लिए 'Bill please' कहते हैं।"
      }
    ],
    is_completed: false
  },

  // ==================== LEVEL 5: ADVANCED FLUENCY ====================
  {
    id: 7,
    level: 5,
    category: "Professional & Job Interview",
    category_mr: "नोकरी आणि मुलाखत संभाषण",
    category_hi: "नौकरी और साक्षात्कार",
    category_en: "Professional & Interviews",
    title_en: "Acing Job Interviews & Professional Meetings",
    title_mr: "नोकरीची मुलाखत आणि व्यावसायिक सभांमध्ये इंग्रजी",
    title_hi: "नौकरी का इंटरव्यू और पेशेवर बैठकें",
    description_mr: "आत्मविश्वासाने मुलाखत देणे, अनुभव सांगणे आणि व्यावसायिक ईमेल मांडणी.",
    description_hi: "साक्षात्कार में आत्मविश्वास से जवाब देना और अनुभव साझा करना सीखें।",
    description_en: "Excel at workplace communication, interviews, self-pitch, and meetings.",
    grammar_tip: {
      title_mr: "💡 अनुभव सांगताना (Present Perfect Tense)",
      title_hi: "💡 अनुभव बताते समय (Present Perfect Tense)",
      title_en: "💡 Expressing Work Experience",
      rule_mr: "कामाचा अनुभव सांगताना 'I have worked for 3 years' किंवा 'I have completed my degree' (Have/Has + V3) चा वापर करा.",
      rule_hi: "कार्य अनुभव साझा करते समय 'I have worked...', 'I have managed...' (Have/Has + V3) लगाएं।",
      rule_en: "Use Present Perfect (have/has + V3) to talk about professional accomplishments.",
      example_en: "I have managed team projects successfully for over 4 years.",
      example_mr: "मी ४ वर्षांहून अधिक काळ सांघिक प्रकल्प यशस्वीरीत्या सांभाळले आहेत.",
      example_hi: "मैंने ४ से अधिक वर्षों तक टीम प्रोजेक्ट्स का सफलतापूर्वक प्रबंधन किया है।"
    },
    dialogue: [
      { speaker: "Interviewer", text_en: "Could you please tell me about yourself and your background?", text_mr: "कृपया तुमच्याबद्दल आणि तुमच्या पार्श्वभूमीबद्दल सांगाल का?", text_hi: "क्या आप अपने और अपनी पृष्ठभूमि के बारे में बता सकते हैं?", pron: "कुड यू प्लीज टेल मी अबाउट युवरसेल्फ अँड युवर बॅकग्राऊंड?" },
      { speaker: "Candidate", text_en: "Certainly! I am a passionate learner with strong communication and problem-solving skills.", text_mr: "नक्कीच! मी शिकण्याची आवड असलेला आणि उत्तम संवाद कौशल्य असलेला व्यक्ती आहे.", text_hi: "ज़रूर! मैं सीखने का इच्छुक हूँ और मेरे पास बेहतरीन संवाद कौशल है।", pron: "सर्टनली! आय एम अ पॅशनेट लर्नर विथ स्ट्रॉंग कम्युनिकेशन स्किल्स." }
    ],
    content: [
      { en: "Experience", mr: "कामाचा अनुभव", hi: "कार्य अनुभव", pron: "एक्सपिरियन्स", example_en: "I have 3 years of work experience.", example_mr: "मला ३ वर्षांचा कामाचा अनुभव आहे.", example_hi: "मुझे ३ साल का कार्य अनुभव है।" },
      { en: "Strengths", mr: "माझी बलस्थाने / क्षमता", hi: "ताकत / खूबियाँ", pron: "स्ट्रेंग्थ्स", example_en: "My greatest strength is adaptability.", example_mr: "माझी सर्वात मोठी ताकद म्हणजे परिस्थितीशी जुळवून घेणे.", example_hi: "मेरी सबसे बड़ी ताकत अनुकूलन क्षमता है।" },
      { en: "Problem solving", mr: "समस्या निवारण कौशल्य", hi: "समस्या समाधान", pron: "प्रॉब्लेम सॉल्व्हिंग", example_en: "I enjoy solving complex challenges.", example_mr: "मला अवघड आव्हाने सोडवायला आवडतात.", example_hi: "मुझे कठिन चुनौतियों को हल करना पसंद है।" },
      { en: "Goal", mr: "ध्येय / उद्दिष्ट", hi: "लक्ष्य", pron: "गोल", example_en: "My goal is to achieve fluency in English.", example_mr: "माझे ध्येय इंग्रजीत अस्खलित बोलणे हे आहे.", example_hi: "मेरा लक्ष्य धाराप्रवाह अंग्रेजी बोलना है।" }
    ],
    quiz: [
      {
        question_mr: "'कामाचा अनुभव' साठी योग्य इंग्रजी शब्द कोणता?",
        question_hi: "'कार्य अनुभव' के लिए सही शब्द कौन सा है?",
        question_en: "Which term means 'Work Experience'?",
        options: ["Holiday", "Experience", "Weakness", "Problem"],
        correct: 1,
        explanation_mr: "कामाचा अनुभव = Work Experience",
        explanation_hi: "कार्य अनुभव = Work Experience"
      }
    ],
    is_completed: false
  }
];
