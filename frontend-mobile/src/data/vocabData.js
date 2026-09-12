// Master Offline Vocabulary and Verbs Dataset for English Shikha Mobile App

export const INITIAL_VOCAB = [
  {
    id: 1,
    word: "Water",
    marathi: "पाणी",
    hindi: "पानी",
    pronunciation: "वॉटर",
    type: "noun",
    category: "Food & Daily",
    level: 1,
    is_favorite: false,
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
    is_favorite: false,
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
    is_favorite: true,
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
    is_favorite: true,
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
    is_favorite: false,
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
    is_favorite: false,
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
    is_favorite: true,
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
    is_favorite: false,
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
    is_favorite: false,
    examples: [
      { english: "How much money is needed?", marathi: "किती पैशांची गरज आहे?", hindi: "कितने पैसों की जरूरत है?" }
    ]
  },
  {
    id: 10,
    word: "Job / Work",
    marathi: "नोकरी / काम",
    hindi: "नौकरी / काम",
    pronunciation: "जॉब / वर्क",
    type: "noun",
    category: "Work & Office",
    level: 2,
    is_favorite: false,
    examples: [
      { english: "I am going to work.", marathi: "मी कामावर जात आहे.", hindi: "मैं काम पर जा रहा हूँ।" }
    ]
  },
  {
    id: 11,
    word: "Happy",
    marathi: "आनंदी",
    hindi: "खुश / प्रसन्न",
    pronunciation: "हॅपी",
    type: "adjective",
    category: "Emotions",
    level: 1,
    is_favorite: false,
    examples: [
      { english: "I am very happy today.", marathi: "मी आज खूप आनंदी आहे.", hindi: "मैं आज बहुत खुश हूँ।" }
    ]
  },
  {
    id: 12,
    word: "Tired",
    marathi: "थकलेला / थकलेली",
    hindi: "थका हुआ / थकी हुई",
    pronunciation: "टायर्ड",
    type: "adjective",
    category: "Emotions",
    level: 1,
    is_favorite: false,
    examples: [
      { english: "I am feeling tired.", marathi: "मला थकवा जाणवत आहे.", hindi: "मुझे थकान महसूस हो रही है।" }
    ]
  },
  {
    id: 13,
    word: "Busy",
    marathi: "व्यस्त / कामात गुंतलेला",
    hindi: "व्यस्त / मशगूल",
    pronunciation: "बिझी",
    type: "adjective",
    category: "Work & Office",
    level: 1,
    is_favorite: false,
    examples: [
      { english: "I am busy right now.", marathi: "मी सध्या कामात व्यस्त आहे.", hindi: "मैं अभी व्यस्त हूँ।" }
    ]
  },
  {
    id: 14,
    word: "Understand",
    marathi: "समजणे",
    hindi: "समझना",
    pronunciation: "अंडरस्टँड",
    type: "verb",
    category: "Common Actions",
    level: 1,
    is_favorite: true,
    examples: [
      { english: "I understand now.", marathi: "मला आता समजले.", hindi: "मुझे अब समझ आया।" },
      { english: "Did you understand?", marathi: "तुम्हाला समजले का?", hindi: "क्या आपको समझ आया?" }
    ]
  },
  {
    id: 15,
    word: "Learn",
    marathi: "शिकणे",
    hindi: "सीखना",
    pronunciation: "लर्न",
    type: "verb",
    category: "Education",
    level: 1,
    is_favorite: true,
    examples: [
      { english: "I want to learn English.", marathi: "मला इंग्रजी शिकायचे आहे.", hindi: "मुझे अंग्रेजी सीखनी है।" }
    ]
  },
  {
    id: 16,
    word: "Hospital",
    marathi: "दवाखाना / रुग्णालय",
    hindi: "अस्पताल",
    pronunciation: "हॉस्पिटल",
    type: "noun",
    category: "Health & Body",
    level: 2,
    is_favorite: false,
    examples: [
      { english: "Where is the nearest hospital?", marathi: "जवळचा दवाखाना कुठे आहे?", hindi: "नज़दीकी अस्पताल कहाँ है?" }
    ]
  },
  {
    id: 17,
    word: "Market",
    marathi: "बाजार",
    hindi: "बाज़ार",
    pronunciation: "मार्केट",
    type: "noun",
    category: "Shopping & Money",
    level: 1,
    is_favorite: false,
    examples: [
      { english: "I am going to the market.", marathi: "मी बाजारात जात आहे.", hindi: "मैं बाज़ार जा रहा हूँ।" }
    ]
  },
  {
    id: 18,
    word: "Beautiful",
    marathi: "सुंदर / देखणे",
    hindi: "सुंदर / खूबसूरत",
    pronunciation: "ब्युटीफुल",
    type: "adjective",
    category: "Emotions",
    level: 1,
    is_favorite: true,
    examples: [
      { english: "This flower is very beautiful.", marathi: "हे फूल खूप सुंदर आहे.", hindi: "यह फूल बहुत सुंदर है।" }
    ]
  },
  {
    id: 19,
    word: "Always",
    marathi: "नेहमी / सदैव",
    hindi: "हमेशा / सदा",
    pronunciation: "ऑलवेज",
    type: "adverb",
    category: "Time & Weather",
    level: 2,
    is_favorite: false,
    examples: [
      { english: "Always speak the truth.", marathi: "नेहमी खरे बोला.", hindi: "हमेशा सच बोलो।" }
    ]
  },
  {
    id: 20,
    word: "Together",
    marathi: "एकत्र / सोबत",
    hindi: "साथ में / एक साथ",
    pronunciation: "टुगेदर",
    type: "adverb",
    category: "Family & Social",
    level: 2,
    is_favorite: false,
    examples: [
      { english: "We study English together.", marathi: "आम्ही एकत्र इंग्रजीचा अभ्यास करतो.", hindi: "हम साथ में अंग्रेजी पढ़ते हैं।" }
    ]
  }
];

export const INITIAL_VERBS = [
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
    is_irregular: true,
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
    is_irregular: true,
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
    is_irregular: true,
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
    is_irregular: true,
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
    is_irregular: true,
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
    is_irregular: true,
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
    is_irregular: true,
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
    is_irregular: true,
    example_en: "Write your name here.",
    example_mr: "येथे तुमचे नाव लिहा.",
    example_hi: "यहाँ अपना नाम लिखिए।"
  },
  {
    id: 9,
    english: "Buy",
    marathi: "खरेदी करणे",
    hindi: "खरीदना",
    pronunciation: "बाय",
    v1: "Buy",
    v2: "Bought",
    v3: "Bought",
    ving: "Buying",
    is_irregular: true,
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
    is_irregular: false,
    example_en: "Ask him the address.",
    example_mr: "त्याला पत्ता विचारा.",
    example_hi: "उससे पता पूछिए।"
  },
  {
    id: 11,
    english: "Call",
    marathi: "फोन करणे / हाक मारणे",
    hindi: "फोन करना / बुलाना",
    pronunciation: "कॉल",
    v1: "Call",
    v2: "Called",
    v3: "Called",
    ving: "Calling",
    is_irregular: false,
    example_en: "I will call you in the evening.",
    example_mr: "मी तुला संध्याकाळी फोन करेन.",
    example_hi: "मैं तुम्हें शाम को कॉल करूँगा।"
  },
  {
    id: 12,
    english: "Help",
    marathi: "मदत करणे",
    hindi: "मदद करना",
    pronunciation: "हेल्प",
    v1: "Help",
    v2: "Helped",
    v3: "Helped",
    ving: "Helping",
    is_irregular: false,
    example_en: "She helped the old man.",
    example_mr: "तिने त्या वृद्ध गृहस्थाला मदत केली.",
    example_hi: "उसने उस बुजुर्ग व्यक्ति की मदद की।"
  },
  {
    id: 13,
    english: "Play",
    marathi: "खेळणे",
    hindi: "खेलना",
    pronunciation: "प्ले",
    v1: "Play",
    v2: "Played",
    v3: "Played",
    ving: "Playing",
    is_irregular: false,
    example_en: "Children are playing cricket.",
    example_mr: "मुले क्रिकेट खेळत आहेत.",
    example_hi: "बच्चे क्रिकेट खेल रहे हैं।"
  },
  {
    id: 14,
    english: "Cook",
    marathi: "स्वयंपाक करणे",
    hindi: "खाना पकाना",
    pronunciation: "कुक",
    v1: "Cook",
    v2: "Cooked",
    v3: "Cooked",
    ving: "Cooking",
    is_irregular: false,
    example_en: "My mother is cooking dinner.",
    example_mr: "माझी आई रात्रीचे जेवण बनवत आहे.",
    example_hi: "मेरी माँ रात का खाना बना रही हैं।"
  },
  {
    id: 15,
    english: "Drive",
    marathi: "गाडी चालवणे",
    hindi: "गाड़ी चलाना",
    pronunciation: "ड्राईव्ह",
    v1: "Drive",
    v2: "Drove",
    v3: "Driven",
    ving: "Driving",
    is_irregular: true,
    example_en: "He drives very carefully.",
    example_mr: "तो खूप काळजीपूर्वक गाडी चालवतो.",
    example_hi: "वह बहुत सावधानी से गाड़ी चलाता है।"
  }
];
