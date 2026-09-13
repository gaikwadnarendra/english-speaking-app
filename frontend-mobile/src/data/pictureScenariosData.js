export const PICTURE_SCENARIOS = [
  {
    id: 'cafe',
    title_en: 'At the Busy Cafe',
    title_mr: 'कॅफेमधील दृश्य (Coffee Shop)',
    title_hi: 'कॉफी शॉप का दृश्य',
    category: 'Daily Life',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    prompt_mr: 'या चित्राचे निरीक्षण करा आणि २-३ इंग्रजी वाक्यांत वर्णन करा. (उदा. लोक काय करत आहेत?)',
    prompt_hi: 'इस चित्र को देखें और २-३ अंग्रेजी वाक्यों में वर्णन करें।',
    prompt_en: 'Look at the picture and describe what people are doing in 2-3 sentences.',
    keywords: [
      { en: 'coffee cup', mr: 'कॉफीचा कप' },
      { en: 'barista', mr: 'कॉफी बनवणारा' },
      { en: 'sitting', mr: 'बसलेले' },
      { en: 'laptop', mr: 'लॅपटॉप' },
      { en: 'ordering', mr: 'ऑर्डर देत आहेत' },
      { en: 'cozy atmosphere', mr: 'शांत व सुखद वातावरण' }
    ],
    grammarFocus_mr: 'Present Continuous Tense वापरा (is/are + verb-ing) उदा: "People are drinking coffee."',
    modelAnswer_en: 'In this picture, people are sitting comfortably in a cozy cafe. A barista is making coffee behind the counter while some customers are working on their laptops.',
    modelAnswer_mr: 'या चित्रात लोक एका सुंदर कॅफेमध्ये बसले आहेत. काउंटरवर कॉफी बनवली जात आहे आणि काही ग्राहक त्यांच्या लॅपटॉपवर काम करत आहेत.'
  },
  {
    id: 'park_picnic',
    title_en: 'Family Picnic in the Park',
    title_mr: 'बागेतील कौटुंबिक पिकनिक',
    title_hi: 'पार्क में फैमिली पिकनिक',
    category: 'Leisure',
    imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80',
    prompt_mr: 'कुटुंब बागेत काय करत आहे आणि वातावरण कसे आहे ते इंग्रजीत सांगा.',
    prompt_hi: 'परिवार पार्क में क्या कर रहा है इसे अंग्रेजी में बताएं।',
    prompt_en: 'Describe how the family is enjoying their picnic on a sunny day.',
    keywords: [
      { en: 'sunny day', mr: 'उन्हाचा दिवस' },
      { en: 'green grass', mr: 'हिरवे गवत' },
      { en: 'picnic mat', mr: 'चटई' },
      { en: 'laughing', mr: 'हसत आहेत' },
      { en: 'healthy snacks', mr: 'खाद्यपदार्थ' },
      { en: 'spending time', mr: 'वेळ घालवत आहेत' }
    ],
    grammarFocus_mr: 'विषय + क्रियापद योग्य वापरा (The family is enjoying... Children are playing...)',
    modelAnswer_en: 'The family is enjoying a lovely picnic on the green grass under a clear blue sky. They are eating delicious snacks and laughing together happily.',
    modelAnswer_mr: 'कुटुंब हिरव्यागार गवतावर आनंददायी पिकनिकचा आनंद घेत आहे. ते चवदार नाश्ता खात आहेत आणि एकत्र हसत आहेत.'
  },
  {
    id: 'railway_station',
    title_en: 'Railway Station Platform',
    title_mr: 'रेल्वे स्टेशन प्लॅटफॉर्म',
    title_hi: 'रेलवे स्टेशन प्लेटफॉर्म',
    category: 'Travel',
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
    prompt_mr: 'प्लॅटफॉर्मवरील प्रवाशांची हालचाल आणि ट्रेनबद्दल सांगा.',
    prompt_hi: 'प्लेटफॉर्म पर यात्रियों और ट्रेन के बारे में बताइए।',
    prompt_en: 'Describe the scene at the train station platform.',
    keywords: [
      { en: 'passengers', mr: 'प्रवासी' },
      { en: 'luggage / bags', mr: 'सामान / बॅगा' },
      { en: 'waiting', mr: 'वाट पाहत आहेत' },
      { en: 'train arriving', mr: 'ट्रेन येत आहे' },
      { en: 'platform', mr: 'प्लॅटफॉर्म' },
      { en: 'ticket counter', mr: 'तिकीट खिडकी' }
    ],
    grammarFocus_mr: 'Prepositions (on the platform, at the station, with bags) चा योग्य वापर करा.',
    modelAnswer_en: 'Many passengers are waiting on the railway platform with their luggage bags. The train is slowly arriving at the station.',
    modelAnswer_mr: 'अनेक प्रवासी आपल्या सामानासह रेल्वे प्लॅटफॉर्मवर वाट पाहत आहेत. ट्रेन हळूहळू स्टेशनवर येत आहे.'
  },
  {
    id: 'doctor_clinic',
    title_en: 'Doctor’s Consultation Room',
    title_mr: 'डॉक्टरांचा दवाखाना / तपासणी',
    title_hi: 'डॉक्टर का क्लिनिक',
    category: 'Health',
    imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
    prompt_mr: 'डॉक्टर आणि रुग्ण यांच्यातील प्रसंग इंग्रजीत वर्णन करा.',
    prompt_hi: 'डॉक्टर और मरीज के बीच के दृश्य का वर्णन करें।',
    prompt_en: 'Describe the conversation and medical checkup between the doctor and patient.',
    keywords: [
      { en: 'stethoscope', mr: 'स्टेथॉस्कोप' },
      { en: 'patient', mr: 'रुग्ण / पेशंट' },
      { en: 'examining', mr: 'तपासत आहेत' },
      { en: 'prescription', mr: 'औषधांची चिठ्ठी' },
      { en: 'advice', mr: 'सल्ला' },
      { en: 'friendly smile', mr: 'प्रेमळ हास्य' }
    ],
    grammarFocus_mr: 'Present Tense व Help verbs (is checking, gives advice) चा योग्य वापर करा.',
    modelAnswer_en: 'The doctor is examining the patient with a stethoscope and listening carefully. She is giving helpful health advice and writing a prescription.',
    modelAnswer_mr: 'डॉक्टर स्टेथॉस्कोपच्या साहाय्याने रुग्णाची तपासणी करत आहेत आणि प्रेमळपणे आरोग्याचा सल्ला देत आहेत.'
  },
  {
    id: 'supermarket',
    title_en: 'Supermarket Grocery Shopping',
    title_mr: 'सुपरमार्केटमध्ये खरेदी',
    title_hi: 'सुपरमार्केट में खरीदारी',
    category: 'Shopping',
    imageUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80',
    prompt_mr: 'सुपरमार्केटमधील वस्तू, ट्रॉली आणि ग्राहकांबद्दल इंग्रजीत सांगा.',
    prompt_hi: 'सुपरमार्केट के फलों, सब्जियों और ग्राहकों का वर्णन करें।',
    prompt_en: 'Describe the people shopping for fresh groceries in the supermarket.',
    keywords: [
      { en: 'shopping cart / trolley', mr: 'खरेदीची ट्रॉली' },
      { en: 'fresh vegetables', mr: 'ताजी भाजी' },
      { en: 'fruits section', mr: 'फळांचा विभाग' },
      { en: 'choosing items', mr: 'वस्तू निवडत आहेत' },
      { en: 'shelves', mr: 'कपाटे / रॅक' },
      { en: 'price tags', mr: 'किंमतीचे लेबल' }
    ],
    grammarFocus_mr: 'Plural nouns (vegetables, items, shelves) आणि Pronouns अचूक वापरा.',
    modelAnswer_en: 'A customer is pushing a shopping cart down the grocery aisle. The shelves are neatly arranged with colorful fresh fruits and vegetables.',
    modelAnswer_mr: 'ग्राहक भाजीपाल्याच्या विभागात खरेदीची ट्रॉली घेऊन जात आहे. रॅकवर ताजी फळे आणि भाज्या व्यवस्थित मांडलेल्या आहेत.'
  }
];

/**
 * Intelligent client-side AI evaluator for Picture Description
 * Provides deep grammatical feedback, error pinpointing, score, and Marathi explanations.
 */
export function evaluatePictureDescription(userText, scenario) {
  const text = (userText || '').trim();
  if (!text || text.length < 5) {
    return {
      score: 40,
      badge: 'Needs Improvement',
      gradeColor: '#EF4444',
      feedback_mr: 'कृपया किमान १-२ पूर्ण वाक्ये लिहा किंवा बोला.',
      feedback_en: 'Please write or speak at least 1-2 complete sentences.',
      mistakes: ['Sentence is too short to evaluate properly.'],
      improved_en: scenario.modelAnswer_en,
      grammarTips_mr: 'नेहमी कर्ता (Subject) + क्रियापद (Verb) + कर्म (Object) अशी रचना करा.',
      vocabularyUsed: []
    };
  }

  const words = text.toLowerCase().split(/\s+/);
  const foundKeywords = scenario.keywords.filter(k => 
    text.toLowerCase().includes(k.en.toLowerCase())
  );

  let mistakes = [];
  let score = 75;

  // Check 1: Capitalization of first letter
  if (!/^[A-Z]/.test(text)) {
    mistakes.push("वाक्याची सुरुवात Capital Letter ने करा (Start sentences with a capital letter).");
    score -= 5;
  }

  // Check 2: Ending punctuation
  if (!/[.!?]$/.test(text)) {
    mistakes.push("वाक्याच्या शेवटी Full Stop (.) किंवा विरामचिन्ह द्या.");
    score -= 5;
  }

  // Check 3: Common tense mismatch in picture descriptions
  // e.g. "people is" -> "people are", "he are" -> "he is"
  if (/\b(people|they|children)\s+is\b/i.test(text)) {
    mistakes.push("❌ 'people is' ऐवजी 'people are' किंवा 'they are' वापरा (Plural Subject).");
    score -= 10;
  }
  if (/\b(he|she|doctor|man|woman)\s+are\b/i.test(text)) {
    mistakes.push("❌ Singular subject सोबत 'is' वापरा (उदा: 'The doctor is...').");
    score -= 10;
  }
  if (/\b(is|are)\s+(drink|eat|sit|stand|look|wait|walk)\b/i.test(text)) {
    mistakes.push("❌ Continuous Tense मध्ये क्रियापदाला '-ing' लावा (उदा: 'is drinking', 'are sitting').");
    score -= 12;
  }

  // Bonus for using scenario keywords
  if (foundKeywords.length >= 2) {
    score += 15;
  } else if (foundKeywords.length === 1) {
    score += 8;
  }

  // Bonus for sentence length & richness
  if (words.length >= 10) {
    score += 10;
  }

  // Clamp score between 60 and 98
  score = Math.max(55, Math.min(98, score));

  let badge = 'Good Effort 👍';
  let gradeColor = '#3B82F6';
  if (score >= 90) {
    badge = 'Outstanding! 🌟';
    gradeColor = '#10B981';
  } else if (score >= 75) {
    badge = 'Very Good! ✨';
    gradeColor = '#6366F1';
  } else {
    badge = 'Keep Practicing 💪';
    gradeColor = '#F59E0B';
  }

  // Generate polished enhanced version
  let polished = text;
  if (mistakes.length > 0) {
    polished = text
      .replace(/\bpeople is\b/gi, 'people are')
      .replace(/\bthey is\b/gi, 'they are')
      .replace(/\bthe doctor are\b/gi, 'the doctor is')
      .replace(/\bis drink\b/gi, 'is drinking')
      .replace(/\bare drink\b/gi, 'are drinking')
      .replace(/\bis sit\b/gi, 'is sitting')
      .replace(/\bare sit\b/gi, 'are sitting')
      .replace(/\bis wait\b/gi, 'is waiting')
      .replace(/\bare wait\b/gi, 'are waiting');
    if (!/^[A-Z]/.test(polished)) polished = polished.charAt(0).toUpperCase() + polished.slice(1);
    if (!/[.!?]$/.test(polished)) polished = polished + '.';
  }

  return {
    score,
    badge,
    gradeColor,
    feedback_mr: score >= 85 
      ? '🎉 अतिशय सुंदर वर्णन! तुम्ही योग्य शब्द आणि व्याकरण वापरले आहे.' 
      : '👍 छान प्रयत्न! खालील व्याकरण सुधारणा लक्षात ठेवा आणि पुन्हा सराव करा.',
    feedback_en: score >= 85 
      ? 'Excellent description! You structured the thoughts fluently.' 
      : 'Good attempt! Check the grammatical feedback below to make it native.',
    mistakes: mistakes.length > 0 ? mistakes : ['कोणतीही मोठी व्याकरण चूक आढळली नाही! उत्तम!'],
    improved_en: polished !== text ? polished : scenario.modelAnswer_en,
    grammarTips_mr: scenario.grammarFocus_mr,
    foundKeywords: foundKeywords.map(k => k.en)
  };
}
