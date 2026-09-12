// Comprehensive Trilingual Lessons Dataset (20 Rich Lessons across 5 Levels)
// Level 1: Beginner Basics
// Level 2: Elementary / Daily Categories
// Level 3: Intermediate / Sentence Patterns & Tenses
// Level 4: Upper-Intermediate / Conversational Mastery
// Level 5: Advanced Fluency / Professional English

const seedLessons = [
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
      { en: "Thank you", mr: "धन्यवाद / आभारी आहे", hi: "धन्यवाद / शुक्रिया", pron: "थँक यू", example_en: "Thank you for your valuable help.", example_mr: "तुमच्या मोलाच्या मदतीबद्दल धन्यवाद.", example_hi: "आपकी मदद के लिए धन्यवाद।" },
      { en: "Excuse me", mr: "माफ करा / लक्ष द्या", hi: "माफ़ कीजिए / सुनिए", pron: "एक्सक्यूज मी", example_en: "Excuse me, where is the station?", example_mr: "माफ करा, रेल्वे स्टेशन कुठे आहे?", example_hi: "माफ़ कीजिए, स्टेशन कहाँ है?" }
    ],
    quiz: [
      {
        question_mr: "रात्री झोपायला जाताना कोणते अभिवादन करतात?",
        question_hi: "रात को सोने जाते समय क्या बोलते हैं?",
        question_en: "What do you say before going to sleep at night?",
        options: ["Good Morning", "Good Night", "Good Afternoon", "Goodbye"],
        correct: 1,
        explanation_mr: "रात्री झोपताना 'Good Night' म्हणतात.",
        explanation_hi: "रात को सोते समय 'Good Night' बोलते हैं।"
      },
      {
        question_mr: "मदत केल्याबद्दल आभार मानण्यासाठी काय म्हणतात?",
        question_hi: "मदद के लिए आभार व्यक्त करने के लिए क्या कहते हैं?",
        question_en: "How do you express gratitude for help in English?",
        options: ["Sorry", "Thank you", "Excuse me", "Please"],
        correct: 1,
        explanation_mr: "आभार मानण्यासाठी 'Thank you' म्हणतात.",
        explanation_hi: "आभार व्यक्त करने के लिए 'Thank you' बोलते हैं।"
      }
    ],
    is_completed: true
  },
  {
    id: 3,
    level: 1,
    category: "Numbers & Colors",
    category_mr: "संख्या आणि रंग",
    category_hi: "संख्याएं और रंग",
    category_en: "Numbers & Colors",
    title_en: "Numbers, Counting & Everyday Colors",
    title_mr: "संख्या, मोजणी आणि दैनंदिन रंग",
    title_hi: "संख्याएं, गिनती और आम रंग",
    description_mr: "१ ते १०० मोजणी, खरेदी करताना लागणाऱ्या संख्या आणि वस्तूंचे रंग.",
    description_hi: "१ से १०० तक गिनती, खरीदारी के लिए संख्याएं और रंगों के नाम।",
    description_en: "Master numbers for shopping and telling time, along with essential color names.",
    grammar_tip: {
      title_mr: "💡 संख्या आणि अनेकवचन (Singular vs Plural)",
      title_hi: "💡 संख्या और बहुवचन (Singular vs Plural)",
      title_en: "💡 Pluralization Basics",
      rule_mr: "संख्या १ पेक्षा जास्त असेल तर नामाच्या शेवटी 's' किंवा 'es' लावा. उदा. 'One book' -> 'Two books'.",
      rule_hi: "संख्या १ से ज्यादा होने पर शब्द के अंत में 's' या 'es' लगाएं। उदा. 'One pen' -> 'Three pens'।",
      rule_en: "Add 's' or 'es' when counting more than 1 item (e.g. 1 apple -> 5 apples).",
      example_en: "I bought three red apples.",
      example_mr: "मी तीन लाल सफरचंदे विकत घेतली.",
      example_hi: "मैंने तीन लाल सेब खरीदे।"
    },
    dialogue: [
      { speaker: "Customer", text_en: "How much are these two blue pens?", text_mr: "या दोन निळ्या पेनांची किंमत किती आहे?", text_hi: "इन दो नीले पेनों की कीमत क्या है?", pron: "हाऊ मच आर दीज टू ब्लू पेन्स?" },
      { speaker: "Shopkeeper", text_en: "They are twenty rupees total.", text_mr: "त्यांचे एकूण वीस रुपये झाले.", text_hi: "इनके कुल बीस रुपये हुए।", pron: "दे आर ट्वेंटी रुपीज टोटल." }
    ],
    content: [
      { en: "One / Two / Three", mr: "एक / दोन / तीन", hi: "एक / दो / तीन", pron: "वन / टू / थ्री", example_en: "I have two brothers.", example_mr: "मला दोन भाऊ आहेत.", example_hi: "मेरे दो भाई हैं।" },
      { en: "Red", mr: "लाल", hi: "लाल", pron: "रेड", example_en: "She wore a red dress.", example_mr: "तिने लाल रंगाचा ड्रेस घातला होता.", example_hi: "उसने लाल पोशाक पहनी थी।" },
      { en: "Blue", mr: "निळा", hi: "नीला", pron: "ब्लू", example_en: "The sky is bright blue today.", example_mr: "आज आकाश गडद निळे आहे.", example_hi: "आज आसमान नीला है।" },
      { en: "Green", mr: "हिरवा", hi: "हरा", pron: "ग्रीन", example_en: "Trees have green leaves.", example_mr: "झाडांना हिरवी पाने असतात.", example_hi: "पेड़ों पर हरी पत्तियां होती हैं।" },
      { en: "Hundred", mr: "शंभर (१००)", hi: "सौ (१००)", pron: "हंड्रेड", example_en: "This book has one hundred pages.", example_mr: "या पुस्तकात १०० पाने आहेत.", example_hi: "इस किताब में १०० पन्ने हैं।" }
    ],
    quiz: [
      {
        question_mr: "'Green' रंगाला मराठीत काय म्हणतात?",
        question_hi: "'Green' रंग को हिंदी में क्या कहते हैं?",
        question_en: "What color is 'Green'?",
        options: ["लाल (Red)", "हिरवा (Green)", "निळा (Blue)", "पिवळा (Yellow)"],
        correct: 1,
        explanation_mr: "Green = हिरवा / हरा",
        explanation_hi: "Green = हरा"
      }
    ],
    is_completed: false
  },
  {
    id: 4,
    level: 1,
    category: "Family & Relations",
    category_mr: "कुटुंब आणि नातेसंबंध",
    category_hi: "परिवार और रिश्ते",
    category_en: "Family & Relations",
    title_en: "Family Members & Introducing Relations",
    title_mr: "कुटुंबातील सदस्य आणि नात्यांची ओळख",
    title_hi: "परिवार के सदस्य और रिश्तों का परिचय",
    description_mr: "आई, वडील, भाऊ, बहीण आणि कुटुंबाविषयी इंग्रजीत बोलायला शिका.",
    description_hi: "माता, पिता, भाई, बहन और परिवार के बारे में अंग्रेजी में बात करना सीखें।",
    description_en: "Learn names of family members and how to introduce your family to others.",
    grammar_tip: {
      title_mr: "💡 'My' आणि 'This is' चा वापर",
      title_hi: "💡 'My' और 'This is' का प्रयोग",
      title_en: "💡 Using 'This is my...'",
      rule_mr: "कुटुंबातील सदस्यांची ओळख करून देताना 'This is my...' वापरा. उदा. 'This is my mother' (या माझ्या आई आहेत).",
      rule_hi: "परिवार के सदस्यों का परिचय देते समय 'This is my...' बोलें। उदा. 'This is my brother' (यह मेरा भाई है)।",
      rule_en: "Use 'This is my...' to introduce someone (e.g. 'This is my friend Rahul').",
      example_en: "This is my mother, she is a teacher.",
      example_mr: "या माझी आई आहेत, त्या शिक्षिका आहेत.",
      example_hi: "यह मेरी माँ हैं, वह एक शिक्षिका हैं।"
    },
    dialogue: [
      { speaker: "Rahul", text_en: "Who is that with you?", text_mr: "तुझ्यासोबत कोण आहे?", text_hi: "तुम्हारे साथ कौन है?", pron: "हू इज दॅट विथ यू?" },
      { speaker: "Sneha", text_en: "This is my elder brother, Rohan.", text_mr: "हा माझा मोठा भाऊ रोहन आहे.", text_hi: "यह मेरा बड़ा भाई रोहन है।", pron: "धिस इज माय एल्डर ब्रदर, रोहन." }
    ],
    content: [
      { en: "Father", mr: "वडील / बाबा", hi: "पिताजी / पापा", pron: "फादर", example_en: "My father is very hardworking.", example_mr: "माझे वडील खूप कष्टाळू आहेत.", example_hi: "मेरे पिताजी बहुत मेहनती हैं।" },
      { en: "Mother", mr: "आई", hi: "माँ / माताजी", pron: "मदर", example_en: "My mother cooks delicious food.", example_mr: "माझी आई चवदार जेवण बनवते.", example_hi: "मेरी माँ स्वादिष्ट खाना बनाती हैं।" },
      { en: "Brother", mr: "भाऊ", hi: "भाई", pron: "ब्रदर", example_en: "He is my younger brother.", example_mr: "तो माझा लहान भाऊ आहे.", example_hi: "वह मेरा छोटा भाई है।" },
      { en: "Sister", mr: "बहीण", hi: "बहन", pron: "सिस्टर", example_en: "My sister lives in Pune.", example_mr: "माझी बहीण पुण्यात राहते.", example_hi: "मेरी बहन पुणे में रहती है।" },
      { en: "Family", mr: "कुटुंब", hi: "परिवार", pron: "फॅमिली", example_en: "I love my family very much.", example_mr: "माझे माझ्या कुटुंबावर खूप प्रेम आहे.", example_hi: "मुझे अपने परिवार से बहुत प्यार है।" }
    ],
    quiz: [
      {
        question_mr: "'बहीण' ला इंग्रजीत काय म्हणतात?",
        question_hi: "'बहन' को अंग्रेजी में क्या कहते हैं?",
        question_en: "What is the English word for sister?",
        options: ["Mother", "Brother", "Sister", "Friend"],
        correct: 2,
        explanation_mr: "बहीण = Sister",
        explanation_hi: "बहन = Sister"
      }
    ],
    is_completed: false
  },

  // ==================== LEVEL 2: ELEMENTARY / EVERYDAY LIFE ====================
  {
    id: 5,
    level: 2,
    category: "Daily Questions",
    category_mr: "दैनिक प्रश्न व संभाषण",
    category_hi: "दैनिक प्रश्न और बातचीत",
    category_en: "Daily Questions",
    title_en: "Daily Conversation Starters & Question Words",
    title_mr: "दैनंदिन बोलण्यातील महत्त्वाची वाक्ये व प्रश्न",
    title_hi: "दैनिक बातचीत के मुख्य वाक्य और प्रश्न",
    description_mr: "दररोज घरी, कामावर आणि प्रवासात विचारले जाणारे ५W प्रश्न (What, Where, When, Who, Why).",
    description_hi: "घर, काम और सफर में पूछे जाने वाले 5W प्रश्न (What, Where, When, Who, Why)।",
    description_en: "Master asking questions with What, Where, When, Why, and How in everyday situations.",
    grammar_tip: {
      title_mr: "💡 'Wh-' प्रश्न विचारण्याचा नियम",
      title_hi: "💡 'Wh-' प्रश्न पूछने का नियम",
      title_en: "💡 Wh- Question Structure",
      rule_mr: "इंग्रजीत प्रश्न विचारताना 'Wh- शब्द + सहाय्यकारी क्रियापद (is/are/do) + कर्ता' असा क्रम असतो. उदा. 'Where are you going?'",
      rule_hi: "प्रश्न पूछते समय 'Wh- शब्द + Helper Verb (is/are/do) + Subject' क्रम रखें। उदा. 'What do you want?'",
      rule_en: "Structure: Wh- Word + Helping Verb (is/are/do/did) + Subject + Main Verb.",
      example_en: "Where do you live?",
      example_mr: "तुम्ही कुठे राहता?",
      example_hi: "आप कहाँ रहते हैं?"
    },
    dialogue: [
      { speaker: "Ajay", text_en: "Excuse me, what time is the next bus?", text_mr: "माफ करा, पुढची बस किती वाजता आहे?", text_hi: "माफ़ कीजिए, अगली बस कितने बजे है?", pron: "एक्सक्यूज मी, व्हॉट टाईम इज द नेक्स्ट बस?" },
      { speaker: "Passenger", text_en: "It arrives at ten o'clock sharp.", text_mr: "ती बरोबर दहा वाजता येते.", text_hi: "वह ठीक दस बजे आती है।", pron: "इट अराईव्हज अ‍ॅट टेन ओ क्लॉक शार्प." }
    ],
    content: [
      { en: "How are you?", mr: "तुम्ही कसे आहात?", hi: "आप कैसे हैं?", pron: "हाऊ आर यू?", example_en: "Hello, how are you today?", example_mr: "हॅलो, आज तुम्ही कसे आहात?", example_hi: "नमस्ते, आज आप कैसे हैं?" },
      { en: "Where is the place?", mr: "ती जागा कुठे आहे?", hi: "वह जगह कहाँ है?", pron: "व्हेअर इज द प्लेस?", example_en: "Where is the hospital nearby?", example_mr: "जवळचे रुग्णालय कुठे आहे?", example_hi: "पास का अस्पताल कहाँ है?" },
      { en: "What are you doing?", mr: "तुम्ही काय करत आहात?", hi: "आप क्या कर रहे हैं?", pron: "व्हॉट आर यू डुइंग?", example_en: "What are you doing right now?", example_mr: "तुम्ही आता सध्या काय करत आहात?", example_hi: "आप अभी क्या कर रहे हैं?" },
      { en: "I didn't understand.", mr: "मला समजले नाही.", hi: "मुझे समझ नहीं आया।", pron: "आय डिडंट अंडरस्टँड.", example_en: "Please repeat, I didn't understand.", example_mr: "कृपया पुन्हा सांगा, मला समजले नाही.", example_hi: "कृपया दोहराएं, मुझे समझ नहीं आया।" },
      { en: "Can you help me?", mr: "तुम्ही मला मदत करू शकता का?", hi: "क्या आप मेरी मदद कर सकते हैं?", pron: "कॅन यू हेल्प मी?", example_en: "Can you help me with this heavy bag?", example_mr: "तुम्ही मला ही जड बॅग उचलायला मदत करू शकता का?", example_hi: "क्या आप इस भारी बैग में मेरी मदद कर सकते हैं?" }
    ],
    quiz: [
      {
        question_mr: "'मला समजले नाही' चे योग्य इंग्रजी वाक्य कोणते?",
        question_hi: "'मुझे समझ नहीं आया' का सही अंग्रेजी वाक्य कौन सा है?",
        question_en: "Which sentence means 'I didn't understand'?",
        options: ["I don't know", "I didn't understand", "I am going", "I need water"],
        correct: 1,
        explanation_mr: "I didn't understand = मला समजले नाही.",
        explanation_hi: "I didn't understand = मुझे समझ नहीं आया।"
      }
    ],
    is_completed: false
  },
  {
    id: 6,
    level: 2,
    category: "Food & Dining",
    category_mr: "अन्न आणि जेवण",
    category_hi: "भोजन और खान-पान",
    category_en: "Food & Dining",
    title_en: "Food, Ordering & Kitchen Vocabulary",
    title_mr: "अन्न, जेवणाची ऑर्डर आणि स्वयंपाकघरातील शब्द",
    title_hi: "खाना, ऑर्डर देना और रसोई की शब्दावली",
    description_mr: "हॉटेलमध्ये ऑर्डर देणे, पाण्याची मागणी करणे आणि जेवणाबद्दल इंग्रजीत संभाषण.",
    description_hi: "होटल में खाना ऑर्डर करना, पानी मांगना और भोजन के बारे में बातचीत।",
    description_en: "Learn words and sentences for ordering at restaurants, describing taste, and kitchen essentials.",
    grammar_tip: {
      title_mr: "💡 'I would like...' चा वापर",
      title_hi: "💡 'I would like...' का प्रयोग",
      title_en: "💡 Polite Ordering with 'I would like'",
      rule_mr: "ऑर्डर करताना किंवा काही मागताना 'I want' ऐवजी अधिक नम्रपणे 'I would like...' (मला हवे आहे) वापरा.",
      rule_hi: "होटल या दुकान में कुछ मांगते समय 'I would like...' बोलें। यह 'I want' से ज्यादा विनम्र होता है।",
      rule_en: "Say 'I would like tea, please' instead of 'Give me tea' for polite English.",
      example_en: "I would like a cup of hot tea, please.",
      example_mr: "मला एक कप गरम चहा हवा आहे, कृपया.",
      example_hi: "मुझे एक कप गर्म चाय चाहिए, कृपया।"
    },
    dialogue: [
      { speaker: "Waiter", text_en: "Good evening! Are you ready to order?", text_mr: "शुभ संध्याकाळ! तुम्ही ऑर्डर द्यायला तयार आहात का?", text_hi: "शुभ संध्या! क्या आप ऑर्डर देने के लिए तैयार हैं?", pron: "गुड इव्हिनिंग! आर यू रेडी टू ऑर्डर?" },
      { speaker: "Customer", text_en: "Yes, I would like vegetarian thali and water.", text_mr: "हो, मला एक शाकाहारी थाळी आणि पाणी हवे आहे.", text_hi: "हाँ, मुझे एक शाकाहारी थाली और पानी चाहिए।", pron: "येस, आय वुड लाईक व्हेज थाली अँड वॉटर." }
    ],
    content: [
      { en: "Delicious", mr: "खूप चवदार / स्वादिष्ट", hi: "बहुत स्वादिष्ट", pron: "डिलिशिअस", example_en: "The food here is delicious.", example_mr: "येथील जेवण खूप चवदार आहे.", example_hi: "यहाँ का खाना बहुत स्वादिष्ट है।" },
      { en: "Hungry", mr: "भुकेलेला", hi: "भूखा", pron: "हंग्री", example_en: "I am feeling very hungry.", example_mr: "मला खूप भूक लागली आहे.", example_hi: "मुझे बहुत भूख लगी है।" },
      { en: "Thirsty", mr: "तहानलेला", hi: "प्यासा", pron: "थर्स्टी", example_en: "He is thirsty, give him water.", example_mr: "तो तहानलेला आहे, त्याला पाणी द्या.", example_hi: "वह प्यासा है, उसे पानी दीजिए।" },
      { en: "Check / Bill", mr: "बिल / हिशोब", hi: "बिल / हिसाब", pron: "चेक / बिल", example_en: "Could we have the bill, please?", example_mr: "कृपया आम्हाला बिल मिळेल का?", example_hi: "कृपया हमें बिल दे दीजिए?" },
      { en: "Breakfast", mr: "सकाळचा नाश्ता", hi: "सुबह का नाश्ता", pron: "ब्रेकफास्ट", example_en: "I eat poha for breakfast.", example_mr: "मी नाश्त्याला पोहे खातो.", example_hi: "मैं नाश्ते में पोहा खाता हूँ।" }
    ],
    quiz: [
      {
        question_mr: "'Delicious' या शब्दाचा अर्थ काय आहे?",
        question_hi: "'Delicious' शब्द का अर्थ क्या है?",
        question_en: "What does 'Delicious' mean?",
        options: ["कडू (Bitter)", "चवदार / स्वादिष्ट (Tasty)", "तिखट (Spicy)", "थंड (Cold)"],
        correct: 1,
        explanation_mr: "Delicious म्हणजे खूप चवदार किंवा स्वादिष्ट.",
        explanation_hi: "Delicious का अर्थ बहुत स्वादिष्ट होता है।"
      }
    ],
    is_completed: false
  },
  {
    id: 7,
    level: 2,
    category: "Travel & Places",
    category_mr: "प्रवास आणि ठिकाणे",
    category_hi: "यात्रा और स्थान",
    category_en: "Travel & Places",
    title_en: "Travel, Directions & Asking the Way",
    title_mr: "प्रवास, दिशा आणि रस्ता विचारणे",
    title_hi: "यात्रा, दिशाएं और रास्ता पूछना",
    description_mr: "बस स्टँड, रेल्वे स्टेशन, रस्ता विचारणे आणि दिशा समजून घेणे.",
    description_hi: "बस स्टैंड, रेलवे स्टेशन, रास्ता पूछना और दिशाएं समझना।",
    description_en: "Essential phrases for navigating public transport, asking directions, and finding locations.",
    grammar_tip: {
      title_mr: "💡 दिशानिर्देश (Prepositions of Direction)",
      title_hi: "💡 दिशा निर्देश (Prepositions of Direction)",
      title_en: "💡 Giving Directions",
      rule_mr: "'Turn left' (डावीकडे वळा), 'Turn right' (उजवीकडे वळा), आणि 'Go straight' (सरळ जा) हे शब्द रस्ता सांगताना वापरले जातात.",
      rule_hi: "'Turn left' (बाएं मुड़ें), 'Turn right' (दाएं मुड़ें), और 'Go straight' (सीधे जाएं) का प्रयोग दिशा बताने में होता है।",
      rule_en: "Key phrases: Go straight, Turn left, Turn right, It is on the corner.",
      example_en: "Go straight and turn left at the traffic signal.",
      example_mr: "सरळ जा आणि ट्रॅफिक सिग्नलजवळ डावीकडे वळा.",
      example_hi: "सीधे जाएं और ट्रैफिक सिग्नल पर बाएं मुड़ें।"
    },
    dialogue: [
      { speaker: "Tourist", text_en: "Excuse me, where is the railway station?", text_mr: "माफ करा, रेल्वे स्टेशन कुठे आहे?", text_hi: "माफ़ कीजिए, रेलवे स्टेशन कहाँ है?", pron: "एक्सक्यूज मी, व्हेअर इज द रेल्वे स्टेशन?" },
      { speaker: "Local", text_en: "Go straight for 500 meters, it is on your right.", text_mr: "५०० मीटर सरळ जा, ते तुमच्या उजव्या बाजूला आहे.", text_hi: "५०० मीटर सीधे जाएं, वह आपकी दाईं ओर है।", pron: "गो स्ट्रेट फॉर फाइव्ह हंड्रेड मीटर्स, इट इज ऑन युवर राईट." }
    ],
    content: [
      { en: "Turn Left", mr: "डावीकडे वळा", hi: "बाएं मुड़ें", pron: "टर्न लेफ्ट", example_en: "Turn left after the temple.", example_mr: "मंदिराच्या पुढे डावीकडे वळा.", example_hi: "मंदिर के बाद बाएं मुड़ें।" },
      { en: "Turn Right", mr: "उजवीकडे वळा", hi: "दाएं मुड़ें", pron: "टर्न राईट", example_en: "Turn right at the crossroad.", example_mr: "चौकाजवळ उजवीकडे वळा.", example_hi: "चौराहे पर दाएं मुड़ें।" },
      { en: "Go Straight", mr: "सरळ पुढे जा", hi: "सीधे आगे जाएं", pron: "गो स्ट्रेट", example_en: "Go straight until you see the hospital.", example_mr: "रुग्णालय दिसेपर्यंत सरळ पुढे जा.", example_hi: "अस्पताल दिखने तक सीधे आगे जाएं।" },
      { en: "Ticket Counter", mr: "तिकीट खिडकी", hi: "टिकट खिड़की", pron: "तिकीट काउंटर", example_en: "Where is the platform ticket counter?", example_mr: "प्लॅटफॉर्म तिकीट खिडकी कुठे आहे?", example_hi: "प्लेटफॉर्म टिकट खिड़की कहाँ है?" },
      { en: "Arrival / Departure", mr: "आगमन / प्रस्थान (येणे / सुटणे)", hi: "आगमन / प्रस्थान", pron: "अरायव्हल / डिपार्चर", example_en: "What is the train departure time?", example_mr: "ट्रेन सुटण्याची वेळ कोणती आहे?", example_hi: "ट्रेन छूटने का समय क्या है?" }
    ],
    quiz: [
      {
        question_mr: "'सरळ पुढे जा' ला इंग्रजीत काय म्हणतात?",
        question_hi: "'सीधे आगे जाएं' को अंग्रेजी में क्या कहते हैं?",
        question_en: "How do you say 'Go straight' in English?",
        options: ["Turn left", "Go straight", "Turn right", "Stop here"],
        correct: 1,
        explanation_mr: "Go straight = सरळ पुढे जा.",
        explanation_hi: "Go straight = सीधे आगे जाएं।"
      }
    ],
    is_completed: false
  },
  {
    id: 8,
    level: 2,
    category: "Time & Weather",
    category_mr: "वेळ, वार आणि हवामान",
    category_hi: "समय, दिन और मौसम",
    category_en: "Time & Weather",
    title_en: "Telling Time, Days, Months & Weather",
    title_mr: "वेळ सांगणे, वार, महिने आणि हवामान",
    title_hi: "समय बताना, दिन, महीने और मौसम",
    description_mr: "घड्याळातील वेळ सांगणे, आठवड्याचे वार आणि हवामानाविषयी इंग्रजीत बोलणे.",
    description_hi: "घड़ी का समय बताना, सप्ताह के दिन और मौसम के बारे में बात करना।",
    description_en: "Learn how to ask and tell time, name days and months, and describe weather conditions.",
    grammar_tip: {
      title_mr: "💡 वेळ सांगताना 'It is...' चा वापर",
      title_hi: "💡 समय बताते समय 'It is...' का प्रयोग",
      title_en: "💡 Telling Time with 'It is'",
      rule_mr: "वेळ सांगताना नेहमी 'It is + वेळ' वापरा. उदा. 'It is 5:30 PM' (संध्याकाळचे साडेपाच वाजले आहेत).",
      rule_hi: "समय बताने के लिए 'It is + time' बोलें। उदा. 'It is 7 o'clock' (सात बजे हैं)।",
      rule_en: "Use 'It is' to state the time or weather (e.g. 'It is raining', 'It is 4 PM').",
      example_en: "What time is it? - It is half past eight.",
      example_mr: "किती वाजले आहेत? - साडेआठ वाजले आहेत.",
      example_hi: "क्या समय हुआ है? - साढ़े आठ बजे हैं।"
    },
    dialogue: [
      { speaker: "Vikas", text_en: "What is the weather like today?", text_mr: "आजचे हवामान कसे आहे?", text_hi: "आज मौसम कैसा है?", pron: "व्हॉट इज द वेदर लाईक टुडे?" },
      { speaker: "Sunita", text_en: "It is very sunny and hot outside.", text_mr: "बाहेर खूप कडक ऊन आणि उष्णता आहे.", text_hi: "बाहर बहुत तेज धूप और गर्मी है।", pron: "इट इज व्हेरी सनी अँड हॉट आऊटसाईट." }
    ],
    content: [
      { en: "What time is it?", mr: "किती वाजले आहेत?", hi: "क्या समय हुआ है?", pron: "व्हॉट टाईम इज इट?", example_en: "Excuse me, what time is it now?", example_mr: "माफ करा, आता किती वाजले आहेत?", example_hi: "माफ़ कीजिए, अभी क्या समय हुआ है?" },
      { en: "Morning / Evening", mr: "सकाळ / संध्याकाळ", hi: "सुबह / शाम", pron: "मॉर्निंग / इव्हिनिंग", example_en: "I go for a walk in the evening.", example_mr: "मी संध्याकाळी चालायला जातो.", example_hi: "मैं शाम को टहलने जाता हूँ।" },
      { en: "Sunny / Rainy", mr: "उन्हाळा / पावसाळी (ऊन / पाऊस)", hi: "धूप वाला / बरसाती", pron: "सनी / रेनी", example_en: "Take an umbrella, it is rainy today.", example_mr: "छत्री घ्या, आज पाऊस पडत आहे.", example_hi: "छाता ले लो, आज बारिश हो रही है।" },
      { en: "Yesterday / Tomorrow", mr: "काल / उद्या", hi: "कल (बीता) / कल (आने वाला)", pron: "यस्टरडे / टुमॉरो", example_en: "I will call you tomorrow morning.", example_mr: "मी तुम्हाला उद्या सकाळी फोन करेन.", example_hi: "मैं आपको कल सुबह कॉल करूँगा।" }
    ],
    quiz: [
      {
        question_mr: "'Tomorrow' या शब्दाचा अर्थ कोणता?",
        question_hi: "'Tomorrow' शब्द का अर्थ क्या है?",
        question_en: "What does 'Tomorrow' mean?",
        options: ["काल (Yesterday)", "आज (Today)", "उद्या (Tomorrow)", "परवा (Day after tomorrow)"],
        correct: 2,
        explanation_mr: "Tomorrow म्हणजे उद्या (आगामी दिवस).",
        explanation_hi: "Tomorrow का अर्थ आने वाला कल होता है।"
      }
    ],
    is_completed: false
  },

  // ==================== LEVEL 3: INTERMEDIATE / SENTENCE PATTERNS & TENSES ====================
  {
    id: 9,
    level: 3,
    category: "Sentence Patterns",
    category_mr: "वाक्यरचना पॅटर्न",
    category_hi: "वाक्य संरचना पैटर्न",
    category_en: "Sentence Patterns",
    title_en: "Sentence Patterns (I am / I have / I want / I need)",
    title_mr: "वाक्य रचना पॅटर्न (I am / I have / I want / I need)",
    title_hi: "वाक्य संरचना पैटर्न (I am / I have / I want / I need)",
    description_mr: "व्याकरणाचे अवघड नियम न पाठ करता ४ सोप्या पॅटर्नद्वारे शेकडो इंग्रजी वाक्ये बनवा.",
    description_hi: "कठिन नियम याद किए बिना 4 आसान पैटर्न से सैकड़ों अंग्रेजी वाक्य बनाएं।",
    description_en: "Supercharge your fluency with high-frequency sentence formula patterns.",
    grammar_tip: {
      title_mr: "💡 'I am' विरुद्ध 'I have' मधील फरक",
      title_hi: "💡 'I am' और 'I have' में अंतर",
      title_en: "💡 I am vs I have",
      rule_mr: "'I am' म्हणजे स्वतःची स्थिती/ओळख (उदा. I am happy, I am a doctor). 'I have' म्हणजे मालकीची वस्तू (उदा. I have a car, I have time). कधीही 'I am car' म्हणू नका!",
      rule_hi: "'I am' का प्रयोग खुद की स्थिति बताने में होता है (I am tired)। 'I have' का प्रयोग अपने पास की वस्तु के लिए होता है (I have a bike)।",
      rule_en: "Use 'I am' for identity/state, and 'I have' for possession/relationships.",
      example_en: "I am ready, and I have all my documents.",
      example_mr: "मी तयार आहे, आणि माझ्याजवळ माझी सर्व कागदपत्रे आहेत.",
      example_hi: "मैं तैयार हूँ, और मेरे पास मेरे सभी दस्तावेज़ हैं।"
    },
    dialogue: [
      { speaker: "Manager", text_en: "Are you ready for the meeting?", text_mr: "तुम्ही मिटींगसाठी तयार आहात का?", text_hi: "क्या आप मीटिंग के लिए तैयार हैं?", pron: "आर यू रेडी फॉर द मीटिंग?" },
      { speaker: "Employee", text_en: "Yes, I have the presentation and I am ready.", text_mr: "होय, माझ्याजवळ प्रेझेंटेशन आहे आणि मी तयार आहे.", text_hi: "हाँ, मेरे पास प्रेजेंटेशन है और मैं तैयार हूँ।", pron: "येस, आय हॅव द प्रेझेंटेशन अँड आय एम रेडी." }
    ],
    content: [
      { en: "I am happy / tired", mr: "मी आनंदी / थकलेला आहे", hi: "मैं खुश / थका हुआ हूँ", pron: "आय एम हॅपी / टायर्ड", example_en: "I am happy to meet you.", example_mr: "तुम्हाला भेटून मला खूप आनंद झाला.", example_hi: "आपसे मिलकर मुझे बहुत खुशी हुई।" },
      { en: "I have a question", mr: "माझ्याकडे एक प्रश्न आहे", hi: "मेरा एक सवाल है", pron: "आय हॅव अ क्वेश्चन", example_en: "Sir, I have a doubt regarding this.", example_mr: "सर, मला याबद्दल एक शंका आहे.", example_hi: "सर, मुझे इस बारे में एक संदेह है।" },
      { en: "I want to learn English", mr: "मला इंग्रजी शिकायचे आहे", hi: "मुझे अंग्रेजी सीखनी है", pron: "आय वॉन्ट टू लर्न इंग्लिश", example_en: "I want to speak fluent English.", example_mr: "मला अस्खलित इंग्रजी बोलायचे आहे.", example_hi: "मुझे फर्राटेदार अंग्रेजी बोलनी है।" },
      { en: "I need your advice", mr: "मला तुमच्या सल्ल्याची गरज आहे", hi: "मुझे आपकी सलाह की ज़रूरत है", pron: "आय नीड युवर अ‍ॅडव्हाइस", example_en: "I need your help with this work.", example_mr: "मला या कामात तुमच्या मदतीची गरज आहे.", example_hi: "मुझे इस काम में आपकी मदद की ज़रूरत है।" }
    ],
    quiz: [
      {
        question_mr: "'माझ्याकडे कार आहे' याचे योग्य इंग्रजी भाषांतर कोणते?",
        question_hi: "'मेरे पास एक कार है' का सही अंग्रेजी अनुवाद कौन सा है?",
        question_en: "Which is the correct sentence for 'I have a car'?",
        options: ["I am a car", "I have a car", "I want a car", "I need car"],
        correct: 1,
        explanation_mr: "मालकी दर्शवण्यासाठी 'I have a car' वापरतात.",
        explanation_hi: "स्वामित्व दर्शाने के लिए 'I have a car' का प्रयोग होता है।"
      }
    ],
    is_completed: false
  },
  {
    id: 10,
    level: 3,
    category: "Present Routines",
    category_mr: "वर्तमानकाळ व दिनक्रम",
    category_hi: "वर्तमान काल और दिनचर्या",
    category_en: "Present Routines",
    title_en: "Daily Routine & Simple Present Tense",
    title_mr: "दैनंदिन दिनक्रम आणि साधा वर्तमानकाळ",
    title_hi: "दैनिक दिनचर्या और सामान्य वर्तमान काल",
    description_mr: "सकाळी उठल्यापासून रात्री झोपेपर्यंत तुमचा रोजचा दिनक्रम अस्खलित इंग्रजीत सांगा.",
    description_hi: "सुबह उठने से लेकर रात सोने तक अपनी दिनचर्या अंग्रेजी में बताएं।",
    description_en: "Describe your habits, daily routines, and actions using the Simple Present Tense.",
    grammar_tip: {
      title_mr: "💡 He/She/It सोबत 's/es' चा नियम",
      title_hi: "💡 He/She/It के साथ 's/es' का नियम",
      title_en: "💡 Third-person singular 's/es'",
      rule_mr: "साध्या वर्तमानकाळात 'I / You / We / They' सोबत मूळ क्रियापद (V1) येते. पण 'He / She / It / नाव' असल्यास क्रियापदाला 's' किंवा 'es' लागते. उदा. 'I speak' पण 'He speaks'.",
      rule_hi: "Present Tense में He/She/It के साथ क्रिया में 's/es' लगाएं। उदा. 'I go to office' लेकिन 'He goes to office'।",
      rule_en: "Add 's' or 'es' to the verb for He/She/It in the Simple Present (e.g. She works, He reads).",
      example_en: "He wakes up at 6 AM and goes for a morning run.",
      example_mr: "तो सकाळी ६ वाजता उठतो आणि धावायला जातो.",
      example_hi: "वह सुबह ६ बजे उठता है और दौड़ने जाता है।"
    },
    dialogue: [
      { speaker: "Friend", text_en: "What time do you wake up every day?", text_mr: "तू रोज किती वाजता उठतोस?", text_hi: "तुम रोज़ कितने बजे उठते हो?", pron: "व्हॉट टाईम डू यू वेक अप एव्हरी डे?" },
      { speaker: "You", text_en: "I wake up at 6:30 AM, drink warm water, and exercise.", text_mr: "मी सकाळी ६:३० ला उठतो, कोमट पाणी पितो आणि व्यायाम करतो.", text_hi: "मैं सुबह ६:३० बजे उठता हूँ, गुनगुना पानी पीता हूँ और कसरत करता हूँ।", pron: "आय वेक अप अ‍ॅट सिक्स थर्टी एएम, ड्रिंक वॉर्म वॉटर, अँड एक्सरसाइज." }
    ],
    content: [
      { en: "I wake up early", mr: "मी लवकर उठतो", hi: "मैं जल्दी उठता हूँ", pron: "आय वेक अप अर्ली", example_en: "I wake up at 6 o'clock every morning.", example_mr: "मी रोज सकाळी ६ वाजता उठतो.", example_hi: "मैं रोज़ सुबह ६ बजे उठता हूँ।" },
      { en: "He goes to office", mr: "तो ऑफिसला जातो", hi: "वह दफ़्तर जाता है", pron: "ही गोज टू ऑफिस", example_en: "He goes to office by train.", example_mr: "तो लोकल ट्रेनने ऑफिसला जातो.", example_hi: "वह ट्रेन से ऑफिस जाता है।" },
      { en: "She cooks dinner", mr: "ती रात्रीचे जेवण बनवते", hi: "वह रात का खाना बनाती है", pron: "शी कुक्स डिनर", example_en: "She cooks delicious dinner for family.", example_mr: "ती कुटुंबासाठी स्वादिष्ट जेवण बनवते.", example_hi: "वह परिवार के लिए स्वादिष्ट खाना बनाती है।" },
      { en: "We study together", mr: "आम्ही एकत्र अभ्यास करतो", hi: "हम साथ में पढ़ाई करते हैं", pron: "वी स्टडी टुगेदर", example_en: "We study English together every evening.", example_mr: "आम्ही रोज संध्याकाळी एकत्र इंग्रजी शिकतो.", example_hi: "हम रोज़ शाम को साथ में अंग्रेजी पढ़ते हैं।" }
    ],
    quiz: [
      {
        question_mr: "'He ______ to school every day.' गाळलेली जागा भरा:",
        question_hi: "'He ______ to school every day.' रिक्त स्थान भरें:",
        question_en: "Fill in the blank: 'He ______ to school every day.'",
        options: ["go", "goes", "going", "gone"],
        correct: 1,
        explanation_mr: "He सोबत क्रियापदाला 'es' लागून 'goes' होते.",
        explanation_hi: "He के साथ क्रिया में 'es' लगकर 'goes' होता है।"
      }
    ],
    is_completed: false
  },
  {
    id: 11,
    level: 3,
    category: "Past Events",
    category_mr: "भूतकाळ व अनुभव",
    category_hi: "भूतकाल और अनुभव",
    category_en: "Past Events",
    title_en: "Talking About Past Events (Simple Past Tense)",
    title_mr: "भूतकाळातील घटना आणि अनुभव सांगणे",
    title_hi: "भूतकाल की घटनाएं और अनुभव बताना",
    description_mr: "काल काय झाले, तुम्ही कुठे गेला होतात आणि भूतकाळातील क्रियापद रूपे (V2) वापरणे.",
    description_hi: "कल क्या हुआ, आप कहाँ गए थे और भूतकाल के क्रिया रूप (V2) का प्रयोग करना।",
    description_en: "Master past tense verbs (went, ate, saw, visited) to share past memories and stories.",
    grammar_tip: {
      title_mr: "💡 भूतकाळात V2 चा वापर",
      title_hi: "💡 भूतकाल में V2 का प्रयोग",
      title_en: "💡 Past Tense (V2) Form",
      rule_mr: "भूतकाळातील साध्या वाक्यांत नेहमी क्रियापदाचे दुसरे रूप (V2) वापरा. उदा. Go -> Went, Eat -> Ate, See -> Saw.",
      rule_hi: "भूतकाल की सामान्य बातों में Verb का दूसरा रूप (V2) लगाएं। उदा. 'I went to Mumbai yesterday'।",
      rule_en: "Use Verb 2 (Past form) for completed past actions (e.g. I watched a movie).",
      example_en: "I met my school friend yesterday in the market.",
      example_mr: "मी काल बाजारात माझ्या शाळेतील मित्राला भेटलो.",
      example_hi: "मैं कल बाज़ार में अपने स्कूल के दोस्त से मिला।"
    },
    dialogue: [
      { speaker: "Colleague", text_en: "How was your weekend?", text_mr: "तुझा शनिवार-रविवार कसा गेला?", text_hi: "तुम्हारा वीकेंड कैसा रहा?", pron: "हाऊ वॉज युवर वीकेंड?" },
      { speaker: "You", text_en: "It was great! I visited my grandparents in the village.", text_mr: "खूप छान गेला! मी गावी आजी-आजोबांना भेटायला गेलो होतो.", text_hi: "बहुत अच्छा रहा! मैं गाँव में दादा-दादी से मिलने गया था।", pron: "इट वॉज ग्रेट! आय व्हिजिटेड माय ग्रँडपेरंट्स इन द व्हिलेज." }
    ],
    content: [
      { en: "I went to Mumbai", mr: "मी मुंबईला गेलो होतो", hi: "मैं मुंबई गया था", pron: "आय वेंट टू मुंबई", example_en: "I went to Mumbai for an exam.", example_mr: "मी परीक्षेसाठी मुंबईला गेलो होतो.", example_hi: "मैं परीक्षा के लिए मुंबई गया था।" },
      { en: "I saw a movie", mr: "मी एक चित्रपट पाहिला", hi: "मैंने एक फिल्म देखी", pron: "आय सॉ अ मुव्ही", example_en: "We saw an interesting movie last night.", example_mr: "आम्ही काल रात्री एक रंजक चित्रपट पाहिला.", example_hi: "हमने कल रात एक दिलचस्प फिल्म देखी।" },
      { en: "She called me", mr: "तिने मला फोन केला", hi: "उसने मुझे फोन किया", pron: "शी कॉल्ड मी", example_en: "She called me to share the good news.", example_mr: "तिने आनंदाची बातमी सांगण्यासाठी मला फोन केला.", example_hi: "उसने खुशखबरी देने के लिए मुझे फोन किया।" },
      { en: "Did you finish the work?", mr: "तुम्ही काम पूर्ण केले का?", hi: "क्या आपने काम पूरा किया?", pron: "डिड यू फिनिश द वर्क?", example_en: "Did you complete the homework?", example_mr: "तुम्ही गृहपाठ पूर्ण केला का?", example_hi: "क्या आपने होमवर्क पूरा किया?" }
    ],
    quiz: [
      {
        question_mr: "'Go' (जाणे) चे भूतकाळी रूप (V2) कोणते आहे?",
        question_hi: "'Go' (जाना) का Past form (V2) क्या है?",
        question_en: "What is the V2 past form of 'Go'?",
        options: ["Gone", "Went", "Going", "Goes"],
        correct: 1,
        explanation_mr: "Go चे V2 रूप 'Went' आहे.",
        explanation_hi: "Go का V2 रूप 'Went' होता है।"
      }
    ],
    is_completed: false
  },
  {
    id: 12,
    level: 3,
    category: "Future Plans",
    category_mr: "भविष्यकाळ आणि योजना",
    category_hi: "भविष्य काल और योजनाएं",
    category_en: "Future Plans",
    title_en: "Future Plans & Intentions (Will / Going to)",
    title_mr: "भविष्यातील योजना आणि हेतू (Will / Going to)",
    title_hi: "भविष्य की योजनाएं और इरादे (Will / Going to)",
    description_mr: "उद्या काय करणार आहात, पुढील महिन्याच्या योजना आणि स्वप्नांविषयी इंग्रजीत बोला.",
    description_hi: "कल क्या करेंगे, अगले महीने की योजनाएं और भविष्य के बारे में बात करें।",
    description_en: "Talk about your future ambitions, weekend plans, and decisions using Will and Going to.",
    grammar_tip: {
      title_mr: "💡 'Will' आणि 'Going to' चा वापर",
      title_hi: "💡 'Will' और 'Going to' का प्रयोग",
      title_en: "💡 Future Tense (Will / Going to)",
      rule_mr: "त्वरित निर्णयासाठी 'Will + V1' वापरा (I will help you). आधीच ठरवलेल्या योजनेसाठी 'am/is/are going to + V1' वापरा (I am going to buy a car).",
      rule_hi: "तुरंत लिए गए निर्णय के लिए 'Will' और पहले से तय योजना के लिए 'going to' का प्रयोग करें।",
      rule_en: "Use 'Will' for spontaneous decisions and promises; use 'Going to' for pre-planned intentions.",
      example_en: "I am going to start a new business next year.",
      example_mr: "मी पुढच्या वर्षी नवीन व्यवसाय सुरू करणार आहे.",
      example_hi: "मैं अगले साल एक नया व्यवसाय शुरू करने जा रहा हूँ।"
    },
    dialogue: [
      { speaker: "Boss", text_en: "When will you submit the project report?", text_mr: "तुम्ही प्रोजेक्ट रिपोर्ट कधी सबमिट कराल?", text_hi: "आप प्रोजेक्ट रिपोर्ट कब जमा करेंगे?", pron: "व्हेन विल यू सबमिट द प्रोजेक्ट रिपोर्ट?" },
      { speaker: "You", text_en: "I will finish it by 5 PM today.", text_mr: "मी आज संध्याकाळी ५ वाजेपर्यंत पूर्ण करेन.", text_hi: "मैं इसे आज शाम ५ बजे तक पूरा कर दूँगा।", pron: "आय विल फिनिश इट बाय फाईव्ह पीएम टुडे." }
    ],
    content: [
      { en: "I will call you later", mr: "मी तुला नंतर फोन करेन", hi: "मैं तुम्हें बाद में कॉल करूँगा", pron: "आय विल कॉल यू लेटर", example_en: "I am busy now, I will call you later.", example_mr: "मी आता व्यस्त आहे, नंतर फोन करेन.", example_hi: "मैं अभी व्यस्त हूँ, बाद में कॉल करूँगा।" },
      { en: "I am going to travel", mr: "मी प्रवासाला जाणार आहे", hi: "मैं यात्रा करने जा रहा हूँ", pron: "आय एम गोइंग टू ट्रॅव्हल", example_en: "I am going to visit Goa next month.", example_mr: "मी पुढच्या महिन्यात गोव्याला जाणार आहे.", example_hi: "मैं अगले महीने गोवा जाने वाला हूँ।" },
      { en: "We will win the match", mr: "आम्ही सामना जिंकू", hi: "हम मैच जीतेंगे", pron: "वी विल विन द मॅच", example_en: "With hard work, we will win.", example_mr: "कष्टाने आपण नक्की जिंकू.", example_hi: "कड़ी मेहनत से हम ज़रूर जीतेंगे।" },
      { en: "It will rain tomorrow", mr: "उद्या पाऊस पडेल", hi: "कल बारिश होगी", pron: "इट विल रेन टुमॉरो", example_en: "The weather forecast says it will rain.", example_mr: "हवामान अंदाजानुसार उद्या पाऊस पडेल.", example_hi: "मौसम विभाग के अनुसार कल बारिश होगी।" }
    ],
    quiz: [
      {
        question_mr: "'मी तुला उद्या नक्की मदत करेन' चे इंग्रजी वाक्य कोणते?",
        question_hi: "'मैं कल तुम्हारी ज़रूर मदद करूँगा' का अंग्रेजी वाक्य कौन सा है?",
        question_en: "Which sentence expresses future promise?",
        options: ["I helped you yesterday", "I will definitely help you tomorrow", "I am helping you", "I was helping you"],
        correct: 1,
        explanation_mr: "भविष्यासाठी 'I will definitely help you tomorrow' बरोबर आहे.",
        explanation_hi: "भविष्य के लिए 'I will definitely help you tomorrow' सही है।"
      }
    ],
    is_completed: false
  },

  // ==================== LEVEL 4: UPPER-INTERMEDIATE / CONVERSATIONAL MASTERY ====================
  {
    id: 13,
    level: 4,
    category: "Shopping & Negotiation",
    category_mr: "खरेदी आणि घासाघीस",
    category_hi: "खरीदारी और मोलभाव",
    category_en: "Shopping & Negotiation",
    title_en: "Shopping, Bargaining & Price Inquiries",
    title_mr: "खरेदी, किंमत विचारणे आणि संभाषण",
    title_hi: "खरीदारी, कीमत पूछना और बातचीत",
    description_mr: "कपड्यांच्या दुकानात, सुपरमार्केटमध्ये किंमत विचारणे आणि सवलतीबद्दल इंग्रजीत बोला.",
    description_hi: "कपड़ों की दुकान या सुपरमार्केट में कीमत पूछना और छूट के बारे में बात करना।",
    description_en: "Confidently ask for discounts, try on clothes, and handle cashiers or shopping assistants in English.",
    grammar_tip: {
      title_mr: "💡 'How much does this cost?' चा वापर",
      title_hi: "💡 'How much is this?' का प्रयोग",
      title_en: "💡 Inquiring about Price",
      rule_mr: "किंमत विचारण्यासाठी 'How much is this?' किंवा 'What is the price of this item?' म्हणा. सवलतीसाठी 'Is there any discount available?' विचारा.",
      rule_hi: "दाम पूछने के लिए 'How much is this?' बोलें। छूट के लिए 'Can you give me a discount?' पूछें।",
      rule_en: "Use 'How much is this?' for singular items and 'How much are these?' for plurals.",
      example_en: "Do you have this shirt in a medium size and blue color?",
      example_mr: "तुमच्याकडे हा शर्ट मीडियम साईज आणि निळ्या रंगात आहे का?",
      example_hi: "क्या आपके पास यह शर्ट मीडियम साइज और नीले रंग में है?"
    },
    dialogue: [
      { speaker: "Customer", text_en: "Excuse me, can I try this jacket on?", text_mr: "माफ करा, मी हे जॅकेट घालून पाहू शकतो का?", text_hi: "माफ़ कीजिए, क्या मैं यह जैकेट पहनकर देख सकता हूँ?", pron: "एक्सक्यूज मी, कॅन आय ट्राय धिस जॅकेट ऑन?" },
      { speaker: "Salesperson", text_en: "Sure, the trial room is right over there on your left.", text_mr: "नक्कीच, ट्रायल रूम डाव्या बाजूला समोरच आहे.", text_hi: "बिल्कुल, ट्रायल रूम बाईं ओर ठीक सामने है।", pron: "शुअर, द ट्रायल रूम इज राईट ओव्हर देअर ऑन युवर लेफ्ट." }
    ],
    content: [
      { en: "How much is this?", mr: "याची किंमत किती आहे?", hi: "इसकी कीमत क्या है?", pron: "हाऊ मच इज धिस?", example_en: "How much is this watch?", example_mr: "या घड्याळाची किंमत किती आहे?", example_hi: "इस घड़ी की कीमत क्या है?" },
      { en: "Can I get a discount?", mr: "काही सवलत (डिस्काउंट) मिळेल का?", hi: "क्या कुछ छूट मिल सकती है?", pron: "कॅन आय गेट अ डिस्काउंट?", example_en: "Is there any festival discount available?", example_mr: "काही सणांची सवलत उपलब्ध आहे का?", example_hi: "क्या कोई त्यौहारी छूट उपलब्ध है?" },
      { en: "Do you accept UPI or cards?", mr: "तुम्ही UPI किंवा कार्ड स्वीकारता का?", hi: "क्या आप UPI या कार्ड लेते हैं?", pron: "डू यू अ‍ॅक्सेप्ट यूपीआय ऑर कार्ड्स?", example_en: "Can I pay through Google Pay / UPI?", example_mr: "मी गुगल पे द्वारे पैसे देऊ शकतो का?", example_hi: "क्या मैं गूगल पे से भुगतान कर सकता हूँ?" },
      { en: "Can I exchange this?", mr: "मी हे बदलून घेऊ शकतो का?", hi: "क्या मैं इसे बदल सकता हूँ?", pron: "कॅन आय एक्सचेंज धिस?", example_en: "The size is small, can I exchange it?", example_mr: "हा आकार लहान आहे, मी बदलू शकतो का?", example_hi: "साइज छोटा है, क्या मैं बदल सकता हूँ?" }
    ],
    quiz: [
      {
        question_mr: "दुकानदाराला 'काही सवलत मिळेल का?' विचारण्यासाठी काय बोलाल?",
        question_hi: "दुकानदार से 'क्या कुछ छूट मिलेगी?' पूछने के लिए क्या कहेंगे?",
        question_en: "How do you ask for a discount?",
        options: ["Where is the shop?", "Can I get a discount?", "How are you?", "Give me bill"],
        correct: 1,
        explanation_mr: "सवलतीसाठी 'Can I get a discount?' वापरतात.",
        explanation_hi: "छूट के लिए 'Can I get a discount?' बोला जाता है।"
      }
    ],
    is_completed: false
  },
  {
    id: 14,
    level: 4,
    category: "Health & Medical",
    category_mr: "आरोग्य आणि डॉक्टर",
    category_hi: "स्वास्थ्य और डॉक्टर",
    category_en: "Health & Medical",
    title_en: "At the Doctor: Describing Symptoms & Health",
    title_mr: "डॉक्टरकडे: आजाराची लक्षणे आणि आरोग्याविषयी बोलणे",
    title_hi: "डॉक्टर के पास: बीमारी के लक्षण और स्वास्थ्य",
    description_mr: "डोकेदुखी, ताप, सर्दी किंवा इतर तक्रारी डॉक्टरांना अचूक इंग्रजीत समजावून सांगा.",
    description_hi: "सिरदर्द, बुखार, सर्दी या अन्य स्वास्थ्य समस्याएं डॉक्टर को अंग्रेजी में समझाएं।",
    description_en: "Explain symptoms, pain levels, allergies, and understand doctor's prescriptions in English.",
    grammar_tip: {
      title_mr: "💡 आजार सांगताना 'I have a...' चा वापर",
      title_hi: "💡 लक्षण बताते समय 'I have a...' का प्रयोग",
      title_en: "💡 Expressing Pain & Symptoms",
      rule_mr: "दुखणे सांगताना 'I have a headache' (डोकेदुखी), 'I have a fever' (ताप), 'I have a sore throat' (घसा खवखवणे) असे वाक्य बनवा.",
      rule_hi: "बीमारी बताने के लिए 'I have a + लक्षण' बोलें (उदा. 'I have a stomach ache')।",
      rule_en: "Use 'I have a headache / stomach ache / cough / fever' to report health issues.",
      example_en: "I have had a severe cough and headache since yesterday morning.",
      example_mr: "मला काल सकाळपासून तीव्र खोकला आणि डोकेदुखीचा त्रास होत आहे.",
      example_hi: "मुझे कल सुबह से तेज खांसी और सिरदर्द है।"
    },
    dialogue: [
      { speaker: "Doctor", text_en: "Good morning! What seems to be the problem?", text_mr: "शुभ सकाळ! तुम्हाला काय त्रास होत आहे?", text_hi: "सुप्रभात! आपको क्या तकलीफ है?", pron: "गुड मॉर्निंग! व्हॉट सीम्स टू बी द प्रॉब्लेम?" },
      { speaker: "Patient", text_en: "Doctor, I have a high fever and body ache since last night.", text_mr: "डॉक्टर, मला काल रात्रीपासून खूप ताप आणि अंगदुखी आहे.", text_hi: "डॉक्टर, मुझे कल रात से तेज बुखार और बदन दर्द है।", pron: "डॉक्टर, आय हॅव अ हाय फिव्हर अँड बॉडी एक सिन्स लास्ट नाईट." }
    ],
    content: [
      { en: "I have a headache", mr: "माझे डोके दुखत आहे", hi: "मेरे सिर में दर्द है", pron: "आय हॅव अ हेडएक", example_en: "I have a terrible headache today.", example_mr: "आज माझे डोके खूप जास्त दुखत आहे.", example_hi: "आज मेरे सिर में बहुत तेज दर्द है।" },
      { en: "High fever", mr: "तीव्र ताप", hi: "तेज बुखार", pron: "हाय फिव्हर", example_en: "He has a high fever of 102 degrees.", example_mr: "त्याला १०२ अंश तीव्र ताप आला आहे.", example_hi: "उसे १०२ डिग्री तेज बुखार है।" },
      { en: "Take medicine twice a day", mr: "दिवसातून दोनदा औषध घ्या", hi: "दिन में दो बार दवाई लें", pron: "टेक मेडिसिन ट्वाईस अ डे", example_en: "Take this tablet after meals twice a day.", example_mr: "जेवणानंतर दिवसातून दोनदा ही गोळी घ्या.", example_hi: "खाने के बाद दिन में दो बार यह गोली लें।" },
      { en: "Get well soon!", mr: "लवकर बरे व्हा!", hi: "जल्द स्वस्थ हों!", pron: "गेट वेल सून!", example_en: "Wishing you a speedy recovery, get well soon!", example_mr: "तुम्हाला उत्तम आरोग्य लाभो, लवकर बरे व्हा!", example_hi: "आप जल्द ठीक हों, गेट वेल सून!" }
    ],
    quiz: [
      {
        question_mr: "'माझे डोके दुखत आहे' हे डॉक्टरांना कसे सांगाल?",
        question_hi: "'मेरे सिर में दर्द है' डॉक्टर को कैसे बताएंगे?",
        question_en: "How do you tell the doctor you have a headache?",
        options: ["I am headache", "I have a headache", "My head is out", "I need water"],
        correct: 1,
        explanation_mr: "I have a headache हे अचूक इंग्रजी वाक्य आहे.",
        explanation_hi: "I have a headache सही वाक्य है।"
      }
    ],
    is_completed: false
  },
  {
    id: 15,
    level: 4,
    category: "Phone Calls",
    category_mr: "फोनवरील संभाषण",
    category_hi: "फ़ोन पर बातचीत",
    category_en: "Phone Calls",
    title_en: "Phone Calls, Inquiries & Professional Etiquette",
    title_mr: "फोनवर बोलणे, चौकशी आणि फोनवरील शिष्टाचार",
    title_hi: "फ़ोन पर बात करना, पूछताछ और शिष्टाचार",
    description_mr: "फोनवर स्वतःची ओळख करून देणे, दुसऱ्या व्यक्तीशी बोलण्याची विनंती करणे आणि मेसेज देणे.",
    description_hi: "फ़ोन पर अपना परिचय देना, किसी से बात करने का अनुरोध और संदेश छोड़ना।",
    description_en: "Handle incoming and outgoing telephone calls with polished professionalism and clarity.",
    grammar_tip: {
      title_mr: "💡 फोनवर स्वतःची ओळख करून देण्याचा नियम",
      title_hi: "💡 फ़ोन पर पहचान बताने का नियम",
      title_en: "💡 Phone Introduction Rule",
      rule_mr: "फोनवर बोलताना 'I am Suresh' ऐवजी नेहमी 'This is Suresh speaking' किंवा 'Hello, Suresh here' वापरा.",
      rule_hi: "फ़ोन पर बात करते समय 'This is [नाम] speaking' बोलें, यह सबसे सही तरीका माना जाता है।",
      rule_en: "On calls, say 'This is [Name] speaking' rather than 'I am [Name]'.",
      example_en: "Hello, this is Rahul speaking from ABC Company. May I speak with Mr. Sharma?",
      example_mr: "हॅलो, मी एबीसी कंपनीतून राहुल बोलत आहे. मी शर्मा सरांशी बोलू शकतो का?",
      example_hi: "नमस्ते, मैं एबीसी कंपनी से राहुल बोल रहा हूँ। क्या मैं शर्मा जी से बात कर सकता हूँ?"
    },
    dialogue: [
      { speaker: "Caller", text_en: "Hello, may I speak to Mr. Patil, please?", text_mr: "हॅलो, मी पाटील सरांशी बोलू शकतो का?", text_hi: "नमस्ते, क्या मैं पाटिल जी से बात कर सकता हूँ?", pron: "हॅलो, मे आय स्पीक टू मिस्टर पाटील, प्लीज?" },
      { speaker: "Receiver", text_en: "Please hold on for a moment, I will connect your call.", text_mr: "कृपया एक क्षण थांबा, मी तुमचा कॉल जोडतो.", text_hi: "कृपया एक पल रुकिए, मैं आपका कॉल जोड़ता हूँ।", pron: "प्लीज होल्ड ऑन फॉर अ मोमेंट, आय विल कनेक्ट युवर कॉल." }
    ],
    content: [
      { en: "This is Rahul speaking", mr: "मी राहुल बोलत आहे", hi: "मैं राहुल बोल रहा हूँ", pron: "धिस इज राहुल स्पीकिंग", example_en: "Hello, this is Priya speaking.", example_mr: "हॅलो, मी प्रिया बोलत आहे.", example_hi: "नमस्ते, मैं प्रिया बोल रही हूँ।" },
      { en: "May I speak with...?", mr: "मी ... यांच्याशी बोलू शकतो का?", hi: "क्या मैं ... से बात कर सकता हूँ?", pron: "मे आय स्पीक विथ...?", example_en: "May I speak with the manager, please?", example_mr: "मी मॅनेजर सरांशी बोलू शकतो का?", example_hi: "क्या मैं मैनेजर साहब से बात कर सकता हूँ?" },
      { en: "Could you please hold on?", mr: "तुम्ही कृपया थोडा वेळ थांबू शकता का?", hi: "क्या आप कृपया थोड़ी देर रुक सकते हैं?", pron: "कुड यू प्लीज होल्ड ऑन?", example_en: "Please hold on while I check the file.", example_mr: "मी फाईल तपासेपर्यंत कृपया थांबा.", example_hi: "जब तक मैं फाइल देखूँ, कृपया रुकिए।" },
      { en: "Your voice is breaking", mr: "तुमचा आवाज कट होत आहे", hi: "आपकी आवाज़ कट रही है", pron: "युवर व्हॉईस इज ब्रेकिंग", example_en: "Sorry, your voice is breaking due to network.", example_mr: "माफ करा, नेटवर्कमुळे तुमचा आवाज कट होत आहे.", example_hi: "माफ़ कीजिए, नेटवर्क की वजह से आपकी आवाज़ कट रही है।" }
    ],
    quiz: [
      {
        question_mr: "फोनवर स्वतःचे नाव सांगताना योग्य वाक्य कोणते?",
        question_hi: "फ़ोन पर अपना नाम बताने के लिए सबसे सही वाक्य कौन सा है?",
        question_en: "What is the polite phone greeting?",
        options: ["Who are you?", "This is Amit speaking", "I am speaking Amit", "Tell me fast"],
        correct: 1,
        explanation_mr: "'This is [नाव] speaking' हे फोनवरील योग्य वाक्य आहे.",
        explanation_hi: "'This is [नाम] speaking' सबसे उपयुक्त वाक्य है।"
      }
    ],
    is_completed: false
  },
  {
    id: 16,
    level: 4,
    category: "Workplace English",
    category_mr: "कामाचे ठिकाण व ऑफिस",
    category_hi: "कार्यस्थल और ऑफिस",
    category_en: "Workplace English",
    title_en: "Workplace English & Professional Meetings",
    title_mr: "ऑफिसमधील संवाद, मिटींग्स आणि सहकाऱ्यांशी बोलणे",
    title_hi: "ऑफिस में बातचीत, मीटिंग्स और सहकर्मियों से संवाद",
    description_mr: "ऑफिस मिटींग्स, कामाचे अपडेट्स देणे आणि वरिष्ठ अधिकाऱ्यांशी आदरयुक्त इंग्रजी संभाषण.",
    description_hi: "ऑफिस मीटिंग्स, काम के अपडेट देना और सीनियर्स से सम्मानजनक अंग्रेजी बातचीत।",
    description_en: "Collaborate effectively with team members, participate in meetings, and discuss project deadlines.",
    grammar_tip: {
      title_mr: "💡 फॉर्मल इंग्रजीचा नियम (Could / Would / May)",
      title_hi: "💡 औपचारिक अंग्रेजी का नियम (Could / Would / May)",
      title_en: "💡 Professional Modal Verbs",
      rule_mr: "ऑफिसमध्ये सहकाऱ्यांशी किंवा वरिष्ठांशी बोलताना 'Can' ऐवजी 'Could you please...' किंवा 'Would it be possible...' वापरा.",
      rule_hi: "ऑफिस में विनम्र अनुरोध के लिए 'Could you please help me with this?' बोलें।",
      rule_en: "Use 'Could' and 'Would' in professional requests for a polished and respectful tone.",
      example_en: "Could you please send me the updated quarterly report by 3 PM?",
      example_mr: "तुम्ही कृपया मला दुपारी ३ वाजेपर्यंत अपडेट केलेला अहवाल पाठवू शकता का?",
      example_hi: "क्या आप कृपया दोपहर ३ बजे तक मुझे अपडेट रिपोर्ट भेज सकते हैं?"
    },
    dialogue: [
      { speaker: "Team Lead", text_en: "Let's begin the daily standup meeting. Rahul, what is your update?", text_mr: "चला रोजची मिटींग सुरू करूया. राहुल, तुझे आजचे अपडेट काय आहे?", text_hi: "चलिए दैनिक बैठक शुरू करते हैं। राहुल, आपका अपडेट क्या है?", pron: "लेट्स बिगिन द डेली स्टँडअप मीटिंग. राहुल, व्हॉट इज युवर अपडेट?" },
      { speaker: "Rahul", text_en: "I completed the design module yesterday and will start testing today.", text_mr: "मी काल डिझाइन पूर्ण केले आणि आज चाचणी सुरू करणार आहे.", text_hi: "मैंने कल डिज़ाइन पूरा कर लिया और आज टेस्टिंग शुरू करूँगा।", pron: "आय कम्प्लिटेड द डिझाईन मॉड्युल यस्टरडे अँड विल स्टार्ट टेस्टिंग टुडे." }
    ],
    content: [
      { en: "Let's schedule a meeting", mr: "आपण एक बैठक (मिटींग) ठरवूया", hi: "चलिए एक मीटिंग तय करते हैं", pron: "लेट्स शेड्युल अ मीटिंग", example_en: "Let's schedule a quick call tomorrow.", example_mr: "आपण उद्या एक छोटा कॉल ठरवूया.", example_hi: "हम कल एक छोटी कॉल रख लेते हैं।" },
      { en: "The deadline is tomorrow", mr: "काम पूर्ण करण्याची शेवटची मुदत उद्या आहे", hi: "डेडलाइन कल की है", pron: "द डेडलाईन इज टुमॉरो", example_en: "Please submit files before the deadline.", example_mr: "कृपया मुदत संपण्यापूर्वी फाईल्स सबमिट करा.", example_hi: "कृपया समय सीमा से पहले फाइलें जमा करें।" },
      { en: "I agree with your point", mr: "मी तुमच्या मुद्द्याशी सहमत आहे", hi: "मैं आपकी बात से सहमत हूँ", pron: "आय अग्री विथ युवर पॉईंट", example_en: "I completely agree with this proposal.", example_mr: "मी या प्रस्तावाशी पूर्णपणे सहमत आहे.", example_hi: "मैं इस प्रस्ताव से पूरी तरह सहमत हूँ।" },
      { en: "I will get back to you", mr: "मी माहिती घेऊन तुम्हाला लवकरच कळवतो", hi: "मैं जानकारी लेकर आपको बताता हूँ", pron: "आय विल गेट बॅक टू यू", example_en: "Let me check with the team and get back to you.", example_mr: "मी टीमशी चर्चा करून तुम्हाला कळवतो.", example_hi: "मैं टीम से बात करके आपको बताता हूँ।" }
    ],
    quiz: [
      {
        question_mr: "'मी तुमच्या मताशी सहमत आहे' इंग्रजीत कसे बोलाल?",
        question_hi: "'मैं आपकी बात से सहमत हूँ' अंग्रेजी में कैसे बोलेंगे?",
        question_en: "How do you express agreement politely?",
        options: ["I am agree with you", "I agree with your point", "I am agreement", "I know everything"],
        correct: 1,
        explanation_mr: "'I agree with your point' हे अचूक वाक्य आहे ('I am agree' चुकीचे असते).",
        explanation_hi: "'I agree with your point' सही है ('I am agree' गलत होता है)।"
      }
    ],
    is_completed: false
  },

  // ==================== LEVEL 5: ADVANCED FLUENCY & PROFESSIONAL MASTERY ====================
  {
    id: 17,
    level: 5,
    category: "Interview Mastery",
    category_mr: "नोकरीची मुलाखत (Job Interview)",
    category_hi: "नौकरी का इंटरव्यू",
    category_en: "Interview Mastery",
    title_en: "Job Interview Excellence & Confident Introduction",
    title_mr: "नोकरीच्या मुलाखतीतील अस्खलित इंग्रजी आणि स्वतःची प्रभावी ओळख",
    title_hi: "नौकरी के इंटरव्यू में आत्मविश्वास से परिचय और जवाब",
    description_mr: "Tell me about yourself, तुमच्या ताकदी, अनुभव आणि मुलाखतीतील कठीण प्रश्नांची उत्तरे देणे.",
    description_hi: "Tell me about yourself, अपनी ताकत, अनुभव और इंटरव्यू के सवालों के सटीक जवाब।",
    description_en: "Ace job interviews with structured storytelling, discussing strengths, and answering situational questions.",
    grammar_tip: {
      title_mr: "💡 STAR पद्धत (Situation, Task, Action, Result)",
      title_hi: "💡 STAR तकनीक (Situation, Task, Action, Result)",
      title_en: "💡 The STAR Method for Interviews",
      rule_mr: "मुलाखतीत अनुभवाबद्दल बोलताना प्रथम प्रसंग सांगा (Situation), तुमचे काम काय होते (Task), तुम्ही काय केले (Action), आणि त्याचा काय चांगला निकाल लागला (Result) हे स्पष्ट सांगा!",
      rule_hi: "इंटरव्यू में अनुभव बताते समय Situation, Task, Action और Result का क्रम अपनाएं।",
      rule_en: "Structure behavioral interview answers using Situation, Task, Action, and Result for maximum impact.",
      example_en: "I faced a tight deadline, reorganized our workflow, and delivered the project two days early.",
      example_mr: "माझ्यासमोर कठीण मुदत होती, मी कामाचे नियोजन बदलले आणि प्रकल्प दोन दिवस आधी पूर्ण केला.",
      example_hi: "मेरे सामने कम समय था, मैंने काम की योजना बदली और प्रोजेक्ट दो दिन पहले पूरा किया।"
    },
    dialogue: [
      { speaker: "Interviewer", text_en: "Could you please introduce yourself and highlight your experience?", text_mr: "तुम्ही कृपया तुमची ओळख करून द्याल आणि तुमच्या अनुभवाबद्दल सांगाल का?", text_hi: "क्या आप अपना परिचय देंगे और अपने अनुभव के बारे में बताएंगे?", pron: "कुड यू प्लीज इंट्रोड्यूस युवरसेल्फ अँड हायलाईट युवर एक्सपिरियन्स?" },
      { speaker: "Candidate", text_en: "Certainly! I have three years of experience in sales, with a strong passion for problem-solving.", text_mr: "नक्कीच! मला विक्री क्षेत्रात ३ वर्षांचा अनुभव आहे आणि अडचणी सोडवण्यात मला आवड आहे.", text_hi: "जरूर! मुझे सेल्स में 3 साल का अनुभव है और चुनौतियों को हल करने में मेरी गहरी रुचि है।", pron: "सर्टनली! आय हॅव थ्री इयर्स ऑफ एक्सपिरियन्स इन सेल्स, विथ अ स्ट्रॉंग पॅशन फॉर प्रॉब्लेम सॉल्व्हिंग." }
    ],
    content: [
      { en: "Tell me about yourself", mr: "तुमच्याबद्दल सांगा (स्वतःची ओळख)", hi: "अपने बारे में बताएं", pron: "टेल मी अबाऊट युवरसेल्फ", example_en: "My name is Priya, and I graduated in Computer Science.", example_mr: "माझे नाव प्रिया आहे आणि मी कॉम्प्युटर सायन्स पदवीधर आहे.", example_hi: "मेरा नाम प्रिया है और मैंने कंप्यूटर साइंस में ग्रेजुएशन किया है।" },
      { en: "My key strengths are...", mr: "माझ्या मुख्य ताकदी / गुण ... हे आहेत", hi: "मेरी मुख्य ताकतें ... हैं", pron: "माय की स्ट्रेंग्थ्स आर...", example_en: "My strengths are quick learning and team collaboration.", example_mr: "लवकर शिकणे आणि टीमसोबत काम करणे हे माझे गुण आहेत.", example_hi: "जल्दी सीखना और टीम के साथ काम करना मेरी ताकत है।" },
      { en: "Why should we hire you?", mr: "आम्ही तुम्हाला ही नोकरी का द्यावी?", hi: "हम आपको यह नौकरी क्यों दें?", pron: "व्हाय शुड वी हायर यू?", example_en: "I bring dedication, relevant skills, and passion for growth.", example_mr: "मी कामावरील निष्ठा, आवश्यक कौशल्ये आणि प्रगतीची जिद्द आणतो.", example_hi: "मैं समर्पण, जरूरी कौशल और विकास का जज़्बा लाता हूँ।" },
      { en: "Thank you for this opportunity", mr: "या सुवर्णसंधीबद्दल धन्यवाद", hi: "इस अवसर के लिए बहुत धन्यवाद", pron: "थँक यू फॉर धिस अपॉर्च्युनिटी", example_en: "Thank you for your time and this great opportunity.", example_mr: "तुमच्या वेळेबद्दल आणि या संधीबद्दल मनापासून धन्यवाद.", example_hi: "आपके समय और इस बेहतरीन अवसर के लिए धन्यवाद।" }
    ],
    quiz: [
      {
        question_mr: "मुलाखतकाराने 'Tell me about yourself' विचारल्यावर सर्वात आधी काय सांगावे?",
        question_hi: "इंटरव्यूअर के 'Tell me about yourself' पूछने पर सबसे पहले क्या बताना चाहिए?",
        question_en: "What should you focus on during 'Tell me about yourself'?",
        options: ["फक्त कौटुंबिक इतिहास", "शिक्षण, कौशल्ये आणि कामाचा अनुभव (Education, Skills & Experience)", "मित्रांची नावे", "हॉबीज आणि खेळ"],
        correct: 1,
        explanation_mr: "स्वतःचे शिक्षण, मुख्य कौशल्ये आणि अनुभव थोडक्यात सांगावा.",
        explanation_hi: "शिक्षा, मुख्य कौशल और प्रासंगिक अनुभव संक्षेप में बताएं।"
      }
    ],
    is_completed: false
  },
  {
    id: 18,
    level: 5,
    category: "Formal Email & Writing",
    category_mr: "फॉर्मल ईमेल आणि लेखन",
    category_hi: "औपचारिक ईमेल और लेखन",
    category_en: "Formal Email & Writing",
    title_en: "Professional Email Writing & Business Communication",
    title_mr: "व्यावसायिक ईमेल लेखन आणि कॉर्पोरेट संभाषण",
    title_hi: "प्रोफेशनल ईमेल लेखन और बिज़नेस कम्युनिकेशन",
    description_mr: "रजेचा अर्ज, कामाचा पाठपुरावा (Follow-up), आणि फॉर्मल ईमेल लिहिण्याचे तंत्र.",
    description_hi: "छुट्टी का आवेदन, काम का फॉलो-अप और प्रोफेशनल ईमेल लिखने की कला।",
    description_en: "Draft clear, courteous, and impactful business emails with proper subject lines and sign-offs.",
    grammar_tip: {
      title_mr: "💡 फॉर्मल ईमेलची रचना (Salutation, Body, Sign-off)",
      title_hi: "💡 फॉर्मल ईमेल का ढांचा (Salutation, Body, Sign-off)",
      title_en: "💡 Professional Email Architecture",
      rule_mr: "सुरुवातीला 'Dear Sir/Madam' किंवा 'Dear [Name]', मध्ये मुख्य विषय (I am writing to...), आणि शेवटी 'Best regards' किंवा 'Warm regards' लिहून नाव लिहावे.",
      rule_hi: "ईमेल की शुरुआत 'Dear [Name]' से करें, बीच में स्पष्ट संदेश दें, और अंत में 'Best regards' लिखें।",
      rule_en: "Standard format: Formal Salutation + Clear Purpose Statement + Action Items + Professional Sign-off.",
      example_en: "Please find attached the updated project report for your kind review.",
      example_mr: "कृपया तुमच्या अवलोकनासाठी सोबत जोडलेला प्रकल्प अहवाल पहा.",
      example_hi: "कृपया अपने अवलोकन के लिए संलग्न प्रोजेक्ट रिपोर्ट देखें।"
    },
    dialogue: [
      { speaker: "Manager", text_en: "Did you email the client regarding the contract?", text_mr: "तू क्लायंटला कराराबाबत ईमेल पाठवलास का?", text_hi: "क्या तुमने क्लाइंट को अनुबंध के संबंध में ईमेल भेजा?", pron: "डिड यू ईमेल द क्लायंट रिगार्डिंग द कॉन्ट्रॅक्ट?" },
      { speaker: "Executive", text_en: "Yes, I sent a formal follow-up email along with the quotation.", text_mr: "होय, मी कोटेशनसह एक फॉर्मल फॉलो-अप ईमेल पाठवला आहे.", text_hi: "हाँ, मैंने कोटेशन के साथ एक औपचारिक फॉलो-अप ईमेल भेज दिया है।", pron: "येस, आय सेंट अ फॉर्मल फॉलो-अप ईमेल अलॉंग विथ द कोटेशन." }
    ],
    content: [
      { en: "I am writing to inform you...", mr: "मी आपल्याला कळवण्यासाठी हा ईमेल लिहीत आहे...", hi: "मैं आपको सूचित करने के लिए यह लिख रहा हूँ...", pron: "आय एम रायटिंग टू इन्फॉर्म यू...", example_en: "I am writing to apply for the position.", example_mr: "मी या पदासाठी अर्ज करण्यासाठी लिहीत आहे.", example_hi: "मैं इस पद के लिए आवेदन करने हेतु लिख रहा हूँ।" },
      { en: "Please find attached the file", mr: "कृपया सोबत जोडलेली फाईल पहा", hi: "कृपया संलग्न फाइल देखें", pron: "प्लीज फाईंड अटॅच्ड द फाईल", example_en: "Please find attached my resume.", example_mr: "कृपया माझा रेझ्युमे सोबत जोडला आहे तो पहा.", example_hi: "कृपया मेरा रिज्यूमे संलग्न है, उसे देखें।" },
      { en: "Looking forward to your reply", mr: "आपल्या उत्तराची वाट पाहत आहे", hi: "आपके उत्तर की प्रतीक्षा में", pron: "लुकिंग फॉरवर्ड टू युवर रिप्लाय", example_en: "Looking forward to hearing from you soon.", example_mr: "आपल्याकडून लवकरच उत्तराची अपेक्षा आहे.", example_hi: "आपकी ओर से जल्द जवाब मिलने की उम्मीद है।" },
      { en: "Best regards / Sincerely", mr: "आपला नम्र / सस्नेह", hi: "सादर / भवदीय", pron: "बेस्ट रिगार्ड्स / सिन्सिअरली", example_en: "Best regards, Ramesh Patil.", example_mr: "आपला नम्र, रमेश पाटील.", example_hi: "सादर, रमेश पाटिल।" }
    ],
    quiz: [
      {
        question_mr: "फॉर्मल ईमेलच्या शेवटी कोणता आदरयुक्त शब्द वापरतात?",
        question_hi: "औपचारिक ईमेल के अंत में कौन सा सम्मानजनक शब्द लिखते हैं?",
        question_en: "Which sign-off is best for a formal business email?",
        options: ["Bye Bye", "Best regards", "See ya", "OK Tata"],
        correct: 1,
        explanation_mr: "'Best regards' किंवा 'Sincerely' हे फॉर्मल ईमेलसाठी योग्य आहे.",
        explanation_hi: "'Best regards' या 'Sincerely' औपचारिक ईमेल के लिए सही है।"
      }
    ],
    is_completed: false
  },
  {
    id: 19,
    level: 5,
    category: "Debates & Opinions",
    category_mr: "मत मांडणे आणि चर्चा",
    category_hi: "राय रखना और वाद-विवाद",
    category_en: "Debates & Opinions",
    title_en: "Expressing Opinions, Agreeing & Disagreeing Politely",
    title_mr: "स्वतःचे मत ठामपणे मांडणे आणि आदरपूर्वक असहमती दर्शवणे",
    title_hi: "अपनी राय रखना और सम्मानपूर्वक असहमति जताना",
    description_mr: "ग्रुप डिस्कशन, मिटींग्समध्ये मत मांडणे आणि दुसऱ्यांच्या मताचा आदर करत चर्चा पुढे नेणे.",
    description_hi: "ग्रुप डिस्कशन और बैठकों में अपनी बात रखना और शालीनता से चर्चा करना।",
    description_en: "Confidently express viewpoints, handle counterarguments, and navigate group discussions diplomatically.",
    grammar_tip: {
      title_mr: "💡 आदरपूर्वक असहमती कशी दर्शवावी? (Polite Disagreement)",
      title_hi: "💡 शालीनता से असहमति कैसे जताएं? (Polite Disagreement)",
      title_en: "💡 Polite Disagreement Techniques",
      rule_mr: "थेट 'You are wrong' म्हणू नका; त्याऐवजी 'I see your point, however I look at it differently' (मला तुमचे म्हणणे समजले, पण माझा दृष्टिकोन थोडा वेगळा आहे) असे नम्रपणे म्हणा.",
      rule_hi: "सीधे 'You are wrong' न बोलें; 'I respect your view, but I think...' बोलकर अपनी बात रखें।",
      rule_en: "Disagree gracefully with 'I understand your perspective, but have we considered...?'",
      example_en: "In my opinion, investing in digital skills is the most crucial step today.",
      example_mr: "माझ्या मते, डिजिटल कौशल्यांमध्ये गुंतवणूक करणे ही आजची सर्वात महत्त्वाची गरज आहे.",
      example_hi: "मेरी राय में, डिजिटल कौशल सीखना आज की सबसे बड़ी जरूरत है।"
    },
    dialogue: [
      { speaker: "Speaker A", text_en: "Remote work is much more productive than working from an office.", text_mr: "ऑफिसपेक्षा घरून काम करणे अधिक उत्पादक आहे.", text_hi: "ऑफिस की तुलना में वर्क फ्रॉम होम ज्यादा प्रोडक्टिव है।", pron: "रिमोट वर्क इज मच मोर प्रॉडक्टिव्ह दॅन वर्किंग फ्रॉम अ‍ॅन ऑफिस." },
      { speaker: "Speaker B", text_en: "I see your point, but in-person collaboration builds better team bonding.", text_mr: "मला तुमचा मुद्दा समजला, पण प्रत्यक्ष एकत्र काम केल्याने टीम बॉन्डिंग जास्त चांगले होते.", text_hi: "मैं आपकी बात समझता हूँ, लेकिन आमने-सामने काम करने से टीम भावना मजबूत होती है।", pron: "आय सी युवर पॉईंट, बट इन-पर्सन कोलॅबोरेशन बिल्ड्स बेटर टीम बॉन्डिंग." }
    ],
    content: [
      { en: "In my opinion...", mr: "माझ्या मते...", hi: "मेरी राय में...", pron: "इन माय ओपिनियन...", example_en: "In my opinion, consistency is key to success.", example_mr: "माझ्या मते, सातत्य हीच यशाची गुरुकिल्ली आहे.", example_hi: "मेरी राय में, निरंतरता ही सफलता की कुंजी है।" },
      { en: "From my perspective...", mr: "माझ्या दृष्टिकोनातून...", hi: "मेरे नज़रिए से...", pron: "फ्रॉम माय परस्पेक्टिव्ह...", example_en: "From my perspective, this solution is very cost-effective.", example_mr: "माझ्या दृष्टिकोनातून, हा उपाय अत्यंत परवडणारा आहे.", example_hi: "मेरे नज़रिए से, यह उपाय काफी किफायती है।" },
      { en: "I respectfully disagree", mr: "मी आदरपूर्वक असहमती दर्शवतो", hi: "मैं सम्मानपूर्वक असहमत हूँ", pron: "आय रिस्पेक्टफुली डिसअग्री", example_en: "I respectfully disagree with that conclusion.", example_mr: "मी त्या निष्कर्षाशी आदरपूर्वक असहमती दर्शवतो.", example_hi: "मैं उस निष्कर्ष से सम्मानपूर्वक असहमत हूँ।" },
      { en: "To summarize the discussion", mr: "चर्चेचा सारांश मांडायचा झाल्यास", hi: "चर्चा का सारांश कहें तो", pron: "टू समराईज द डिस्कशन", example_en: "To summarize, we all agree on the main objective.", example_mr: "थोडक्यात सांगायचे तर, आपण सर्वजण मुख्य ध्येयावर सहमत आहोत.", example_hi: "संक्षेप में कहें तो, हम सभी मुख्य लक्ष्य पर सहमत हैं।" }
    ],
    quiz: [
      {
        question_mr: "चर्चेत नम्रपणे स्वतःचे मत मांडण्यासाठी कोणती सुरुवात कराल?",
        question_hi: "चर्चा में शालीनता से अपनी राय रखने के लिए क्या बोलेंगे?",
        question_en: "Which phrase is best for sharing your view politely?",
        options: ["Listen to me only", "In my opinion / From my perspective", "You are wrong", "I don't care"],
        correct: 1,
        explanation_mr: "'In my opinion...' किंवा 'From my perspective...' हे सर्वात आदरयुक्त आहे.",
        explanation_hi: "'In my opinion...' या 'From my perspective...' सबसे विनम्र तरीका है।"
      }
    ],
    is_completed: false
  },
  {
    id: 20,
    level: 5,
    category: "Idioms & Fluency Secrets",
    category_mr: "वाक्प्रचार आणि अस्खलित इंग्रजी",
    category_hi: "मुहावरे और फर्राटेदार अंग्रेजी",
    category_en: "Idioms & Fluency Secrets",
    title_en: "Everyday Idioms, Phrasal Verbs & Native Expressions",
    title_mr: "दैनंदिन वाक्प्रचार, Phrasal Verbs आणि अस्खलित इंग्रजीची रहस्ये",
    title_hi: "दैनिक मुहावरे, Phrasal Verbs और फर्राटेदार अंग्रेजी के राज",
    description_mr: "मूळ इंग्रजी भाषकांसारखे (Native Speakers) अस्खलित आणि प्रभावी बोलण्यासाठीचे लोकप्रिय वाक्प्रचार.",
    description_hi: "अंग्रेजी के लोकप्रिय मुहावरे और कहावतें सीखकर अपनी बातचीत को प्रभावशाली बनाएं।",
    description_en: "Sound like a native English speaker by incorporating idioms and dynamic phrasal verbs naturally.",
    grammar_tip: {
      title_mr: "💡 वाक्प्रचार (Idioms) चा शब्दशः अर्थ घेऊ नका!",
      title_hi: "💡 मुहावरों (Idioms) का शाब्दिक अर्थ न निकालें!",
      title_en: "💡 Understanding Figurative Meaning",
      rule_mr: "वाक्प्रचारांचा शब्दशः भाषांतर केल्यास वेगळा अर्थ निघतो. उदा. 'Piece of cake' म्हणजे 'खूप सोपे काम' (केकचा तुकडा नव्हे!).",
      rule_hi: "Idioms का शाब्दिक अर्थ न लें। उदा. 'Break a leg' का अर्थ 'शुभकामनाएं' होता है (पैर तोड़ना नहीं!)।",
      rule_en: "Idioms carry figurative meanings. Learn them in situational context rather than literal translation.",
      example_en: "Passing this English speaking exam will be a piece of cake for you!",
      example_mr: "ही इंग्रजी बोलण्याची परीक्षा उत्तीर्ण होणे तुमच्यासाठी अगदी सोपे काम असेल!",
      example_hi: "यह अंग्रेजी बोलने की परीक्षा पास करना आपके लिए बहुत आसान होगा!"
    },
    dialogue: [
      { speaker: "Mentor", text_en: "How are you preparing for tomorrow's big presentation?", text_mr: "उद्याच्या मोठ्या प्रेझेंटेशनची तयारी कशी सुरू आहे?", text_hi: "कल के बड़े प्रेजेंटेशन की तैयारी कैसी चल रही है?", pron: "हाऊ आर यू प्रिपेरिंग फॉर टुमॉरोज बिग प्रेझेंटेशन?" },
      { speaker: "Protégé", text_en: "I have practiced thoroughly. It will be a piece of cake!", text_mr: "मी खूप कसून सराव केला आहे. ते काम अगदी सहज आणि सोपे होईल!", text_hi: "मैंने जमकर अभ्यास किया है। यह बहुत आसान रहेगा!", pron: "आय हॅव प्रॅक्टिस्ड थरोली. इट विल बी अ पीस ऑफ केक!" }
    ],
    content: [
      { en: "A piece of cake", mr: "अतिशय सोपे काम (अगदी सहज होणारे)", hi: "बहुत आसान काम (बाएं हाथ का खेल)", pron: "अ पीस ऑफ केक", example_en: "The test was a piece of cake for me.", example_mr: "ती परीक्षा माझ्यासाठी अगदी सोपी होती.", example_hi: "वह परीक्षा मेरे लिए बहुत आसान थी।" },
      { en: "Once in a blue moon", mr: "कधीतरीच (अगदी दुर्मिळ)", hi: "कभी-कभार (ईद का चाँद)", pron: "वन्स इन अ ब्लू मून", example_en: "He visits his hometown once in a blue moon.", example_mr: "तो गावी कधीतरीच चक्कर मारतो.", example_hi: "वह कभी-कभार ही अपने गाँव जाता है।" },
      { en: "Break the ice", mr: "संभाषणाची सुरुवात करणे / मोकळेपणा निर्माण करणे", hi: "बातचीत की शुरुआत करना", pron: "ब्रेक द आईस", example_en: "A friendly smile helps to break the ice.", example_mr: "एक हसतमुख चेहरा संभाषणाची छान सुरुवात करतो.", example_hi: "एक मुस्कुराहट बातचीत शुरू करने में मदद करती है।" },
      { en: "Hit the nail on the head", mr: "मुद्द्यावर बोट ठेवणे / अचूक बोलणे", hi: "सटीक बात कहना", pron: "हिट द नेल ऑन द हेड", example_en: "You hit the nail on the head with your analysis.", example_mr: "तुमच्या विश्लेषणाने थेट मूळ मुद्द्यावर अचूक बोट ठेवले आहे.", example_hi: "आपके विश्लेषण ने बिल्कुल सटीक बात कही है।" }
    ],
    quiz: [
      {
        question_mr: "'A piece of cake' या इंग्रजी वाक्प्रचाराचा खरा अर्थ काय?",
        question_hi: "'A piece of cake' मुहावरे का सही अर्थ क्या है?",
        question_en: "What does the idiom 'A piece of cake' mean?",
        options: ["गोड केक खाणे", "अतिशय सोपे काम (Very easy task)", "कठीण आव्हान", "वाढदिवसाची पार्टी"],
        correct: 1,
        explanation_mr: "'A piece of cake' म्हणजे अतिशय सोपे आणि सहज होणारे काम.",
        explanation_hi: "'A piece of cake' का अर्थ बहुत आसान काम होता है।"
      }
    ],
    is_completed: false
  }
];

module.exports = {
  seedLessons
};
