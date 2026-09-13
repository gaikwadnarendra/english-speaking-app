const https = require('https');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const SCENARIOS = [
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
    suggested_starter: ['I am doing good, thank you.', 'I was busy at work today.', 'I am learning English right now.']
  },
  {
    id: 'interview',
    title_mr: 'नोकरी मुलाखत सराव (Job Interview Practice)',
    title_hi: 'नौकरी साक्षात्कार अभ्यास (Job Interview Practice)',
    title_en: 'Job Interview Simulation',
    description_mr: 'तुमची ओळख, अनुभव, कौशल्ये आणि ताकदीबद्दल सराव.',
    description_hi: 'अपना परिचय, अनुभव, कौशल और खूबियों के बारे में अभ्यास।',
    description_en: 'Practice your introduction, work experience, strengths and career goals.',
    initial_ai_en: 'Welcome to the interview! Could you please introduce yourself briefly?',
    initial_ai_mr: 'मुलाखतीत आपले स्वागत आहे! कृपया तुमची थोडक्यात ओळख करून द्याल का?',
    initial_ai_hi: 'साक्षात्कार में आपका स्वागत है! क्या आप कृपया संक्षेप में अपना परिचय देंगे?',
    suggested_starter: ['My name is Rahul and I have 2 years of experience.', 'I am passionate about learning new skills.', 'Thank you for this opportunity.']
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
    suggested_starter: ['How much does this shirt cost?', 'Do you have this in a larger size?', 'Is there any discount available?']
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
    suggested_starter: ['I would like to order coffee and sandwich, please.', 'What is the special dish today?', 'Could you please bring the bill?']
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
    suggested_starter: ['I want to book a ticket to Mumbai.', 'Which platform does the train arrive on?', 'How long will the flight take?']
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
    suggested_starter: ['I have a mild fever and headache since yesterday.', 'My throat is paining when I swallow.', 'Could you please suggest some medicine?']
  }
];

// Single model request helper
function sendGeminiRequest(apiKey, modelName, requestBody) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            return reject(new Error(parsed.error.message || 'Gemini API Error'));
          }

          const candidateText = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!candidateText) {
            return reject(new Error('AI response is empty.'));
          }

          const cleanJsonStr = candidateText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
          const tutorResponse = JSON.parse(cleanJsonStr);
          resolve(tutorResponse);
        } catch (err) {
          reject(new Error(`Failed to parse AI response: ${err.message}`));
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.write(requestBody);
    req.end();
  });
}

// Helper to call Gemini Generative AI API with multi-model fallback
async function callGeminiAI(userText, conversationHistory, scenarioId, userLang = 'mr') {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing.');
  }

  const scenario = SCENARIOS.find(s => s.id === scenarioId) || SCENARIOS[0];
  const langName = userLang === 'hi' ? 'Hindi' : userLang === 'en' ? 'English' : 'Marathi';

  const systemInstruction = `
You are a warm, encouraging, friendly, and expert English speaking tutor named "Antigravity English Guru" talking to an Indian learner whose interface language is ${langName}.
The learner is practicing speaking in the scenario: "${scenario.title_en}".

Guidelines:
1. Speak in natural, beginner-friendly conversational English (1-2 sentences max per response).
2. Keep the conversation moving forward by asking a friendly follow-up question or making an encouraging statement.
3. Analyze the user's input:
   - If user's English has grammar, spelling, or tense mistakes (e.g. "I is going", "Yesterday I go"), provide a gentle correction explained in simple ${langName} under 'grammarFeedback'.
   - If the user's sentence is grammatically correct and natural, set 'grammarFeedback' to null or give short positive praise in ${langName}.
4. Translate your English reply into simple, natural ${langName} under 'aiReplyTranslation'.
5. Provide 2-3 sample English suggested responses the user could say back under 'suggestedResponses'.

OUTPUT FORMAT:
You MUST reply ONLY with a valid JSON object matching this schema (do NOT use markdown backticks or any extra text):
{
  "aiReplyEnglish": "English reply here",
  "aiReplyTranslation": "${langName} translation here",
  "grammarFeedback": "${langName} grammar guidance or null",
  "suggestedResponses": ["Option 1", "Option 2", "Option 3"]
}
`;

  const formattedHistory = conversationHistory.map(item => ({
    role: item.role === 'user' ? 'user' : 'model',
    parts: [{ text: item.text }]
  }));

  formattedHistory.push({
    role: 'user',
    parts: [{ text: userText }]
  });

  const requestBody = JSON.stringify({
    contents: formattedHistory,
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 600,
      responseMimeType: "application/json"
    }
  });

  const modelCandidates = ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash', 'gemini-1.5-flash-8b'];
  let lastError = null;

  for (const model of modelCandidates) {
    try {
      const response = await sendGeminiRequest(apiKey, model, requestBody);
      return response;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini models failed.');
}

// GET /api/speaking/scenarios
exports.getScenarios = (req, res) => {
  res.json({ success: true, data: SCENARIOS });
};

// POST /api/speaking/ai-conversation
exports.chatWithAI = async (req, res) => {
  try {
    const { userText, conversationHistory = [], scenarioId = 'daily', language = 'mr' } = req.body;

    if (!userText || !userText.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a sentence to speak or text.' });
    }

    try {
      const aiReply = await callGeminiAI(userText.trim(), conversationHistory, scenarioId, language);
      return res.json({
        success: true,
        data: {
          ...aiReply,
          aiReplyMarathi: aiReply.aiReplyTranslation || aiReply.aiReplyMarathi || '',
          aiReplyHindi: aiReply.aiReplyTranslation || aiReply.aiReplyHindi || ''
        }
      });
    } catch (apiErr) {
      console.warn('Gemini API call notice:', apiErr.message);

      // Graceful conversational fallback
      const scenario = SCENARIOS.find(s => s.id === scenarioId) || SCENARIOS[0];
      const fallbackResponse = {
        aiReplyEnglish: `That sounds great! What else would you like to share about that?`,
        aiReplyMarathi: `हे छान वाटले! आपण याबद्दल आणखी काय सांगू इच्छिता?`,
        aiReplyHindi: `यह बहुत अच्छा लगा! आप इस बारे में और क्या बताना चाहेंगे?`,
        grammarFeedback: userText.length < 5 ? (language === 'hi' ? 'सरल वाक्यों में उत्तर देने का प्रयास करें।' : 'सोप्या वाक्यात उत्तर देण्याचा प्रयत्न करा.') : null,
        suggestedResponses: [
          `I would like to tell you more.`,
          `Yes, of course!`,
          `Could you please ask another question?`
        ]
      };

      return res.json({
        success: true,
        data: fallbackResponse,
        notice: 'Offline/Fallback mode active'
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
