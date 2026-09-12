
// Comprehensive Trilingual Marathi-English-Hindi dataset for English Learning App

const seedVocab = [
  // Basics / Level 1
  {
    id: 1,
    word: "Water",
    marathi: "पाणी",
    hindi: "पानी",
    pronunciation: "वॉटर",
    type: "noun",
    category: "Food & Daily",
    level: 1,
    srs_box: "new",
    is_favorite: false,
    is_difficult: false,
    examples: [
      { english: "I want water.", marathi: "मला पाणी पाहिजे.", hindi: "मुझे पानी चाहिए।" },
      { english: "Drink clean water.", marathi: "स्वच्छ पाणी प्या.", hindi: "साफ पानी पियो।" }
    ]
  },
  {
    id: 2,
    word: "House / Home",
    marathi: "घर",
    hindi: "मकान / घर",
    pronunciation: "हाऊस / होम",
    type: "noun",
    category: "Home",
    level: 1,
    srs_box: "new",
    is_favorite: false,
    is_difficult: false,
    examples: [
      { english: "This is my house.", marathi: "हे माझे घर आहे.", hindi: "यह मेरा घर है।" },
      { english: "Let's go home.", marathi: "चला घरी जाऊया.", hindi: "चलो घर चलते हैं।" }
    ]
  },
  {
    id: 3,
    word: "Book",
    marathi: "पुस्तक",
    hindi: "किताब",
    pronunciation: "बुक",
    type: "noun",
    category: "Education",
    level: 1,
    srs_box: "learning",
    is_favorite: true,
    is_difficult: false,
    examples: [
      { english: "I am reading a book.", marathi: "मी पुस्तक वाचत आहे.", hindi: "मैं किताब पढ़ रहा हूँ।" }
    ]
  },
  {
    id: 4,
    word: "Friend",
    marathi: "मित्र / मैत्रीण",
    hindi: "दोस्त / मित्र",
    pronunciation: "फ्रेंड",
    type: "noun",
    category: "Family & Social",
    level: 1,
    srs_box: "reviewing",
    is_favorite: true,
    is_difficult: false,
    examples: [
      { english: "He is my best friend.", marathi: "तो माझा सर्वात चांगला मित्र आहे.", hindi: "वह मेरा सबसे अच्छा दोस्त है।" }
    ]
  },
  {
    id: 5,
    word: "Time",
    marathi: "वेळ",
    hindi: "समय / वक्त",
    pronunciation: "टाईम",
    type: "noun",
    category: "Time & Weather",
    level: 1,
    srs_box: "new",
    is_favorite: false,
    is_difficult: false,
    examples: [
      { english: "What time is it?", marathi: "किती वाजले आहेत? / काय वेळ झाली?", hindi: "क्या समय हुआ है?" },
      { english: "I need some time.", marathi: "मला थोडा वेळ हवा आहे.", hindi: "मुझे थोड़ा समय चाहिए।" }
    ]
  },
  {
    id: 6,
    word: "Food",
    marathi: "अन्न / जेवण",
    hindi: "खाना / भोजन",
    pronunciation: "फूड",
    type: "noun",
    category: "Food & Daily",
    level: 1,
    srs_box: "new",
    is_favorite: false,
    is_difficult: false,
    examples: [
      { english: "The food is delicious.", marathi: "जेवण खूप चवदार आहे.", hindi: "खाना बहुत स्वादिष्ट है।" }
    ]
  },
  {
    id: 7,
    word: "Mother",
    marathi: "आई",
    hindi: "माँ / माताजी",
    pronunciation: "मदर",
    type: "noun",
    category: "Family & Social",
    level: 1,
    srs_box: "mastered",
    is_favorite: true,
    is_difficult: false,
    examples: [
      { english: "My mother is cooking.", marathi: "माझी आई स्वयंपाक करत आहे.", hindi: "मेरी माँ खाना बना रही हैं।" }
    ]
  },
  {
    id: 8,
    word: "Father",
    marathi: "वडील / बाबा",
    hindi: "पिताजी / पापा",
    pronunciation: "फादर",
    type: "noun",
    category: "Family & Social",
    level: 1,
    srs_box: "mastered",
    is_favorite: false,
    is_difficult: false,
    examples: [
      { english: "My father is at work.", marathi: "माझे बाबा कामावर आहेत.", hindi: "मेरे पिताजी काम पर हैं।" }
    ]
  },
  {
    id: 9,
    word: "Money",
    marathi: "पैसे",
    hindi: "पैसे / धन",
    pronunciation: "मनी",
    type: "noun",
    category: "Shopping & Money",
    level: 2,
    srs_box: "new",
    is_favorite: false,
    is_difficult: false,
    examples: [
      { english: "How much money is needed?", marathi: "किती पैशांची गरज आहे?", hindi: "कितने पैसों की जरूरत है?" }
    ]
  },
  {
    id: 10,
    word: "Help",
    marathi: "मदत",
    hindi: "मदद / सहायता",
    pronunciation: "हेल्प",
    type: "verb",
    category: "Common Actions",
    level: 1,
    v1: "Help",
    v2: "Helped",
    v3: "Helped",
    ving: "Helping",
    srs_box: "learning",
    is_favorite: true,
    is_difficult: false,
    examples: [
      { english: "Can you help me?", marathi: "तुम्ही मला मदत करू शकता का?", hindi: "क्या आप मेरी मदद कर सकते हैं?" }
    ]
  },
  {
    id: 11,
    word: "Hospital",
    marathi: "दवाखाना / रुग्णालय",
    hindi: "अस्पताल",
    pronunciation: "हॉस्पिटल",
    type: "noun",
    category: "Hospital & Health",
    level: 2,
    srs_box: "new",
    is_favorite: false,
    is_difficult: false,
    examples: [
      { english: "Where is the nearest hospital?", marathi: "जवळचा दवाखाना कुठे आहे?", hindi: "नजदीकी अस्पताल कहाँ है?" }
    ]
  },
  {
    id: 12,
    word: "Office",
    marathi: "कार्यालय / ऑफिस",
    hindi: "कार्यालय / दफ़्तर",
    pronunciation: "ऑफिस",
    type: "noun",
    category: "Work & Office",
    level: 2,
    srs_box: "new",
    is_favorite: false,
    is_difficult: false,
    examples: [
      { english: "I am going to the office.", marathi: "मी ऑफिसला जात आहे.", hindi: "मैं ऑफिस जा रहा हूँ।" }
    ]
  },
  {
    id: 13,
    word: "Travel / Journey",
    marathi: "प्रवास",
    hindi: "सफ़र / यात्रा",
    pronunciation: "ट्रॅव्हल / जर्नी",
    type: "noun",
    category: "Travel & Transport",
    level: 2,
    srs_box: "new",
    is_favorite: false,
    is_difficult: false,
    examples: [
      { english: "Have a safe travel.", marathi: "तुमचा प्रवास सुखकर होवो.", hindi: "आपकी यात्रा मंगलमय हो।" }
    ]
  },
  {
    id: 14,
    word: "Phone / Mobile",
    marathi: "फोन / मोबाईल",
    hindi: "फ़ोन / मोबाइल",
    pronunciation: "फोन / मोबाईल",
    type: "noun",
    category: "Technology",
    level: 1,
    srs_box: "mastered",
    is_favorite: false,
    is_difficult: false,
    examples: [
      { english: "Where is my phone?", marathi: "माझा फोन कुठे आहे?", hindi: "मेरा फ़ोन कहाँ है?" }
    ]
  },
  {
    id: 15,
    word: "Happy",
    marathi: "आनंदी / खुश",
    hindi: "खुश / प्रसन्न",
    pronunciation: "हॅपी",
    type: "adjective",
    category: "Emotions",
    level: 1,
    srs_box: "mastered",
    is_favorite: false,
    is_difficult: false,
    examples: [
      { english: "I am very happy today.", marathi: "मी आज खूप आनंदी आहे.", hindi: "मैं आज बहुत खुश हूँ।" }
    ]
  },
  {
    id: 16,
    word: "Tired",
    marathi: "थकलेला / थकलेली",
    hindi: "थका हुआ / थकी हुई",
    pronunciation: "टायर्ड",
    type: "adjective",
    category: "Emotions",
    level: 1,
    srs_box: "learning",
    is_favorite: false,
    is_difficult: true,
    examples: [
      { english: "I am feeling tired.", marathi: "मला थकवा जाणवत आहे.", hindi: "मुझे थकान महसूस हो रही है।" }
    ]
  },
  {
    id: 17,
    word: "Busy",
    marathi: "व्यस्त / कामात गुंतलेला",
    hindi: "व्यस्त / मशगूल",
    pronunciation: "बिझी",
    type: "adjective",
    category: "Work & Office",
    level: 1,
    srs_box: "learning",
    is_favorite: false,
    is_difficult: false,
    examples: [
      { english: "I am busy right now.", marathi: "मी सध्या कामात व्यस्त आहे.", hindi: "मैं अभी व्यस्त हूँ।" }
    ]
  },
  {
    id: 18,
    word: "Speak",
    marathi: "बोलणे",
    hindi: "बोलना",
    pronunciation: "स्पीक",
    type: "verb",
    category: "Common Actions",
    level: 1,
    v1: "Speak",
    v2: "Spoke",
    v3: "Spoken",
    ving: "Speaking",
    srs_box: "reviewing",
    is_favorite: true,
    is_difficult: false,
    examples: [
      { english: "Please speak slowly.", marathi: "कृपया हळू बोला.", hindi: "कृपया धीरे बोलें।" },
      { english: "I speak basic English.", marathi: "मी थोडेफार इंग्लिश बोलतो.", hindi: "मैं थोड़ी इंग्लिश बोलता हूँ।" }
    ]
  },
  {
    id: 19,
    word: "Understand",
    marathi: "समजणे",
    hindi: "समझना",
    pronunciation: "अंडरस्टँड",
    type: "verb",
    category: "Common Actions",
    level: 1,
    v1: "Understand",
    v2: "Understood",
    v3: "Understood",
    ving: "Understanding",
    srs_box: "learning",
    is_favorite: true,
    is_difficult: true,
    examples: [
      { english: "I understand now.", marathi: "मला आता समजले.", hindi: "मुझे अब समझ आया।" },
      { english: "Did you understand?", marathi: "तुम्हाला समजले का?", hindi: "क्या आपको समझ आया?" }
    ]
  },
  {
    id: 20,
    word: "Learn",
    marathi: "शिकणे",
    hindi: "सीखना",
    pronunciation: "लर्न",
    type: "verb",
    category: "Education",
    level: 1,
    v1: "Learn",
    v2: "Learnt / Learned",
    v3: "Learnt / Learned",
    ving: "Learning",
    srs_box: "mastered",
    is_favorite: true,
    is_difficult: false,
    examples: [
      { english: "I want to learn English.", marathi: "मला इंग्रजी शिकायचे आहे.", hindi: "मुझे अंग्रेजी सीखनी है।" }
    ]
  }
];

const seedVerbs = [
  {
    id: 1,
    english: "Go",
    marathi: "जाणे",
    hindi: "जाना",
    pronunciation: "गो",
    v1: "Go",
    v2: "Went",
    v3: "Gone",
    ving: "Going",
    example_en: "I go to work by bus.",
    example_mr: "मी बसने कामावर जातो.",
    example_hi: "मैं बस से काम पर जाता हूँ।"
  },
  {
    id: 2,
    english: "Eat",
    marathi: "खाणे",
    hindi: "खाना",
    pronunciation: "ईट",
    v1: "Eat",
    v2: "Ate",
    v3: "Eaten",
    ving: "Eating",
    example_en: "He is eating mango.",
    example_mr: "तो आंबा खात आहे.",
    example_hi: "वह आम खा रहा है।"
  },
  {
    id: 3,
    english: "Speak",
    marathi: "बोलणे",
    hindi: "बोलना",
    pronunciation: "स्पीक",
    v1: "Speak",
    v2: "Spoke",
    v3: "Spoken",
    ving: "Speaking",
    example_en: "She spoke very politely.",
    example_mr: "ती खूप नम्रपणे बोलली.",
    example_hi: "वह बहुत विनम्रता से बोली।"
  },
  {
    id: 4,
    english: "Come",
    marathi: "येणे",
    hindi: "आना",
    pronunciation: "कम",
    v1: "Come",
    v2: "Came",
    v3: "Come",
    ving: "Coming",
    example_en: "Please come inside.",
    example_mr: "कृपया आत या.",
    example_hi: "कृपया अंदर आइए।"
  },
  {
    id: 5,
    english: "Take",
    marathi: "घेणे",
    hindi: "लेना",
    pronunciation: "टेक",
    v1: "Take",
    v2: "Took",
    v3: "Taken",
    ving: "Taking",
    example_en: "Take this medicine.",
    example_mr: "हे औषध घ्या.",
    example_hi: "यह दवा लीजिए।"
  },
  {
    id: 6,
    english: "Give",
    marathi: "देणे",
    hindi: "देना",
    pronunciation: "गिव्ह",
    v1: "Give",
    v2: "Gave",
    v3: "Given",
    ving: "Giving",
    example_en: "Give me your pen.",
    example_mr: "मला तुझा पेन दे.",
    example_hi: "मुझे अपना पेन दो।"
  },
  {
    id: 7,
    english: "Read",
    marathi: "वाचणे",
    hindi: "पढ़ना",
    pronunciation: "रीड",
    v1: "Read",
    v2: "Read (रेड)",
    v3: "Read (रेड)",
    ving: "Reading",
    example_en: "Read this message.",
    example_mr: "हा निरोप/मेसेज वाचा.",
    example_hi: "यह संदेश पढ़ें।"
  },
  {
    id: 8,
    english: "Write",
    marathi: "लिहिणे",
    hindi: "लिखना",
    pronunciation: "राईट",
    v1: "Write",
    v2: "Wrote",
    v3: "Written",
    ving: "Writing",
    example_en: "Write your name here.",
    example_mr: "येथे तुमचे नाव लिहा.",
    example_hi: "यहाँ अपना नाम लिखिए।"
  },
  {
    id: 9,
    english: "Buy",
    marathi: "खरेदी करणे / विकत घेणे",
    hindi: "खरीदना",
    pronunciation: "बाय",
    v1: "Buy",
    v2: "Bought",
    v3: "Bought",
    ving: "Buying",
    example_en: "I bought fresh vegetables.",
    example_mr: "मी ताज्या भाज्या विकत घेतल्या.",
    example_hi: "मैंने ताज़ी सब्जियाँ खरीदीं।"
  },
  {
    id: 10,
    english: "Ask",
    marathi: "विचारणे",
    hindi: "पूछना",
    pronunciation: "आस्क",
    v1: "Ask",
    v2: "Asked",
    v3: "Asked",
    ving: "Asking",
    example_en: "Ask him the address.",
    example_mr: "त्याला पत्ता विचारा.",
    example_hi: "उससे पता पूछिए।"
  }
];

const { seedLessons } = require('./seedLessons');


const seedQuizzes = [
  {
    id: 1,
    type: "mcq",
    question_mr: "'पाणी' या शब्दाला इंग्रजीत काय म्हणतात?",
    question_hi: "'पानी' को अंग्रेजी में क्या कहते हैं?",
    question_en: "What is the English word for 'Water'?",
    options: ["Food", "Water", "House", "Friend"],
    correctAnswer: "Water",
    explanation_mr: "पाणी = Water (उच्चार: वॉटर)",
    explanation_hi: "पानी = Water (उच्चारण: वॉटर)",
    vocabId: 1
  },
  {
    id: 2,
    type: "mcq",
    question_mr: "'मला समजले नाही' चे योग्य इंग्रजी भाषांतर कोणते?",
    question_hi: "'मुझे समझ नहीं आया' का सही अंग्रेजी अनुवाद कौन सा है?",
    question_en: "Choose correct English translation for 'I didn't understand':",
    options: [
      "I don't know",
      "I didn't understand",
      "I am not coming",
      "I need help"
    ],
    correctAnswer: "I didn't understand",
    explanation_mr: "मला समजले नाही = I didn't understand (आय डिडंट अंडरस्टँड)",
    explanation_hi: "मुझे समझ नहीं आया = I didn't understand",
    vocabId: 19
  },
  {
    id: 3,
    type: "mcq",
    question_mr: "'Go' (जाणे) चे भूतकाळी रूप (V2 - Past Form) काय आहे?",
    question_hi: "'Go' (जाना) का Past Form (V2) क्या है?",
    question_en: "What is the V2 Past Tense form of the verb 'Go'?",
    options: ["Gone", "Went", "Going", "Goes"],
    correctAnswer: "Went",
    explanation_mr: "Go (V1) -> Went (V2) -> Gone (V3)",
    explanation_hi: "Go (V1) -> Went (V2) -> Gone (V3)",
    vocabId: 51
  },
  {
    id: 4,
    type: "mcq",
    question_mr: "'शुभ सकाळ' ला इंग्रजीत कसे अभिवादन करतात?",
    question_hi: "'शुभ प्रभात' को अंग्रेजी में क्या कहते हैं?",
    question_en: "How do you say 'Good Morning' in English?",
    options: ["Good Evening", "Good Night", "Good Morning", "Goodbye"],
    correctAnswer: "Good Morning",
    explanation_mr: "शुभ सकाळ = Good Morning (गुड मॉर्निंग)",
    explanation_hi: "शुभ प्रभात = Good Morning (गुड मॉर्निंग)",
    vocabId: 11
  },
  {
    id: 5,
    type: "mcq",
    question_mr: "'Take' (घेणे) चे तिसरे रूप (V3 - Past Participle) कोणते?",
    question_hi: "'Take' (लेना) का V3 रूप क्या है?",
    question_en: "What is the V3 (Past Participle) form of 'Take'?",
    options: ["Took", "Taking", "Taken", "Takes"],
    correctAnswer: "Taken",
    explanation_mr: "Take (V1) -> Took (V2) -> Taken (V3)",
    explanation_hi: "Take (V1) -> Took (V2) -> Taken (V3)",
    vocabId: 54
  },
  {
    id: 6,
    type: "mcq",
    question_mr: "'मला तुमची मदत हवी आहे' इंग्रजीत कसे बोलाल?",
    question_hi: "'मुझे आपकी मदद चाहिए' अंग्रेजी में कैसे बोलेंगे?",
    question_en: "How do you say 'I need your help' in English?",
    options: ["I am happy", "I need your help", "Where are you?", "Thank you"],
    correctAnswer: "I need your help",
    explanation_mr: "मला तुमची मदत हवी आहे = I need your help (आय नीड युवर हेल्प)",
    explanation_hi: "मुझे आपकी मदद चाहिए = I need your help",
    vocabId: 16
  },
  {
    id: 7,
    type: "mcq",
    question_mr: "'पुस्तकालय / वाचनालय' ला इंग्रजीत काय म्हणतात?",
    question_hi: "'पुस्तकालय' को अंग्रेजी में क्या कहते हैं?",
    question_en: "What is the English term for 'Library'?",
    options: ["Hospital", "Library", "School", "Market"],
    correctAnswer: "Library",
    explanation_mr: "वाचनालय = Library (लायब्ररी)",
    explanation_hi: "पुस्तकालय = Library (लाइब्रेरी)",
    vocabId: 6
  },
  {
    id: 8,
    type: "mcq",
    question_mr: "'Eat' (खाणे) चे भूतकाळ (V2) रूप काय आहे?",
    question_hi: "'Eat' (खाना) का Past Tense (V2) क्या है?",
    question_en: "What is the V2 past form of 'Eat'?",
    options: ["Eaten", "Ate", "Eating", "Eats"],
    correctAnswer: "Ate",
    explanation_mr: "Eat (V1) -> Ate (V2) -> Eaten (V3)",
    explanation_hi: "Eat (V1) -> Ate (V2) -> Eaten (V3)",
    vocabId: 56
  },
  {
    id: 9,
    type: "mcq",
    question_mr: "'तुम्ही कसे आहात?' याचे इंग्रजीत भाषांतर काय?",
    question_hi: "'आप कैसे हैं?' का अंग्रेजी अनुवाद क्या होगा?",
    question_en: "What is the English for 'How are you?'?",
    options: ["Who are you?", "How are you?", "Where are you?", "What is this?"],
    correctAnswer: "How are you?",
    explanation_mr: "तुम्ही कसे आहात? = How are you? (हाऊ आर यू?)",
    explanation_hi: "आप कैसे हैं? = How are you? (हाउ आर यू?)",
    vocabId: 13
  },
  {
    id: 10,
    type: "mcq",
    question_mr: "'Write' (लिहिणे) चे V3 (Past Participle) रूप कोणते आहे?",
    question_hi: "'Write' (लिखना) का V3 रूप क्या है?",
    question_en: "What is the V3 form of 'Write'?",
    options: ["Wrote", "Writing", "Written", "Writes"],
    correctAnswer: "Written",
    explanation_mr: "Write (V1) -> Wrote (V2) -> Written (V3)",
    explanation_hi: "Write (V1) -> Wrote (V2) -> Written (V3)",
    vocabId: 59
  },
  {
    id: 11,
    type: "mcq",
    question_mr: "'धन्यवाद / आभार' मानण्यासाठी इंग्रजीत काय म्हणतात?",
    question_hi: "'धन्यवाद' कहने के लिए अंग्रेजी में क्या बोलते हैं?",
    question_en: "How do you express gratitude in English?",
    options: ["Sorry", "Excuse me", "Thank you", "Please"],
    correctAnswer: "Thank you",
    explanation_mr: "धन्यवाद = Thank you (थँक्यू)",
    explanation_hi: "धन्यवाद = Thank you (थैंक यू)",
    vocabId: 12
  },
  {
    id: 12,
    type: "mcq",
    question_mr: "'आनंदी / आनंदीत' ला इंग्रजीत कोणता शब्द वापरतात?",
    question_hi: "'खुश / प्रसन्न' के लिए अंग्रेजी में कौन सा शब्द है?",
    question_en: "Which English word means 'Happy'?",
    options: ["Angry", "Sad", "Happy", "Tired"],
    correctAnswer: "Happy",
    explanation_mr: "आनंदी = Happy (हॅपी)",
    explanation_hi: "खुश = Happy (हैप्पी)",
    vocabId: 8
  },
  {
    id: 13,
    type: "matching",
    title_mr: "योग्य जोड्या जुळवा (Match the Pairs)",
    pairs: [
      { left: "घर (Home)", right: "House" },
      { left: "मित्र (Friend)", right: "Friend" },
      { left: "शिकणे (Learn)", right: "Learn" },
      { left: "वेळ (Time)", right: "Time" },
      { left: "पाणी (Water)", right: "Water" }
    ]
  }
];

module.exports = {
  seedVocab,
  seedVerbs,
  seedLessons,
  seedQuizzes
};
