export const commonQuestion = [
  {
    question: "What was your sex assigned at birth?",
    answers: ["Male", "Female"],
    nextQuestionnaire: {
      0: "maleCommonQuestion",
      1: "femaleCommonQuestion",
    },
  },
];

export const maleCommonQuestion = [
  {
    question: "What are you looking to treat?",
    answers: ["Erectile dysfunction", "Premature ejaculation", "Other issues"],
    nextQuestionnaire: {
      0: "maleErectileDysfunctionQuestions",
      1: "malePrematureEjaculationQuestions",
      2: "maleOtherIssues",
    },
  },
];

export const femaleCommonQuestion = [
  {
    question: "What are you looking to treat?",
    answers: [
      "Low Libido – low sex drive",
      "Vaginal Dryness",
      "Orgasm Issues",
      "Vaginismus - Painful Intercourse or Penetration",
      "Other issues",
    ],
    nextQuestionnaire: {
      0: "lowLobido",
      1: "vaginalDryness",
      2: "orgasmIssues",
      3: "vaginismus",
      4: "femaleOtherIssues",
    },
  },
];

export const lowLobido = [
  {
    id: 1,
    question: "How often do you have intercourse?",
    answers: [
      "Regularly",
      "several times a week",
      "Once a week",
      "Every couple of weeks",
      "Rarely (once in a couple of months)",
      "Never",
    ],
  },
  {
    id: 2,
    question: "How satisfied are you with your current sexual life?",
    answers: [
      "Very satisfied",
      "Satisfied",
      "Neutral",
      "Dissatisfied",
      "Very dissatisfied",
    ],
  },
  {
    id: 3,
    question: "Have you noticed any changes in your sexual desire?",
    answers: ["It has increased", "It has decreased", "No change"],
  },
  {
    id: 4,
    question: "Is the sexual activity consensual and comfortable for you?",
    answers: ["Yes", "No", "Sometimes"],
  },
  {
    id: 5,
    question:
      "Do you experience any pain or discomfort during sexual intercourse?",
    answers: ["Yes, always", "No, never", "Occasionally"],
    skip: { onSelected: 1, next: 7 },
  },
  {
    id: 6,
    question:
      "Can you describe the location and nature of the pain or discomfort?",
    answers: ["Lower abdomen", "Vaginal area", "Other (please specify)"],
    skip: { onSelected: [0, 1], next: 7 },
  },

  {
    id: 7,
    question:
      "Please specify the location and describe the nature of the pain or discomfort.",
  },
  {
    id: 8,
    question: "Are your menstrual cycles usually regular?",
    answers: [
      "Yes, always",
      "	No, never",
      "Sometimes",
      "I am experiencing menopause",
    ],
    skip: { onSelected: 3, next: 10 },
  },
  {
    id: 9,
    question:
      "Do you experience severe pain or discomfort during your menstrual cycle?",
    answers: ["Yes, always", "No, never", "Occasionally"],
  },
  {
    id: 10,
    question: "Are you currently using any form of contraception?",
    answers: ["Yes", "No"],
  },
  {
    id: 11,
    question: "What type of contraception are you using?",
    answers: [
      "Oral contraceptives (Pills)",
      "Condoms",
      "Intrauterine device (IUD)",
      "Other ",
    ],
  },
  {
    id: 12,
    question: "Have you experienced any changes in vaginal discharge or odor?",
    answers: ["Yes, always", "No, never", "Occasionally"],
  },
  {
    id: 13,
    question:
      "Do you experience any itching or irritation in the genital area?",
    answers: ["Yes, always", "No, never", "Occasionally"],
  },
  {
    id: 14,
    question: "Have you had any pregnancies or childbirths?",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 16 },
  },
  {
    id: 15,
    question:
      "Please specify the number of pregnancies, including any miscarriages, if any.",
  },
  {
    id: 16,
    question:
      "Do you experience stress, anxiety, or depression that may be impacting your sex life? ",
    answers: ["Often", "Sometimes", "Rarely"],
  },
  {
    id: 17,
    question:
      "Are there any other emotional or psychological factors affecting your sexual health?",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 19 },
  },
  {
    id: 18,
    question: "Please explain your emotional or psychological issues.",
  },
  {
    id: 19,
    question:
      "Are you currently taking any medications that may affect sexual function?",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 21 },
  },
  {
    id: 20,
    question: "Please give the doctor more information.",
  },
  {
    id: 21,
    question:
      "Do you have any pre-existing medical conditions that may be relevant?",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 23 },
  },
  {
    id: 22,
    question:
      "Please give the doctor more information about your medical condition.",
  },
  {
    id: 23,
    question:
      "Is there a history of any other medical illness or disorder that has run within your family?",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 25 },
  },
  {
    id: 24,
    question:
      "Please explain the medical illness that has run within your family.",
  },
  {
    id: 25,
    question: "What is your age?",
  },
  {
    id: 26,
    question: "What is your height? (in feet)",
  },
  {
    id: 27,
    question: "What is your weight? (in Kg)",
  },
  {
    id: 28,
    question: "How often do you exercise?",
    answers: [
      "3-5 times per week",
      "2-3 times per week",
      "Once a week",
      "Not a priority",
    ],
  },
  {
    id: 29,
    question: "How would you describe your diet?",
    answers: [
      "Very healthy",
      "Pretty healthy but could do with improvement",
      "Not very healthy",
      "Don't care for healthy food",
    ],
  },
  {
    id: 30,
    question: "How would you rate your average nights sleep?",
    answers: ["Excellent", "Good", "Average", "Poor", "Very poor"],
  },

  {
    id: 31,
    question: "Anything else your doctor needs to consider?",
  },
  {
    id: 32,
    question: "How did you hear about VigourMe?",
    answers: [
      "Facebook",
      "Instagram",
      "TikTok",
      "Google",
      "Friends or Family",
      "Other",
    ],
  },
];

export const vaginalDryness = [
  {
    id: 1,
    question: "How often do you experience vaginal dryness?",
    answers: ["Always", "Most of the time", "Sometime", "Rarely", "Never"],
  },
  {
    id: 2,
    question: "How severe is the vaginal dryness?",
    answers: ["Severe", "Moderate", "Mild"],
  },
  {
    id: 3,
    question: "How long have you been experiencing vaginal dryness?",
    answers: [
      "Less than 1 month",
      "1-3 months",
      "3-6 months",
      "More than 6 months",
      "Since always",
    ],
  },
  {
    id: 4,
    question: "Does vaginal dryness interfere with your sexual activity?",
    answers: ["Yes, always", "No, never", "Sometimes"],
  },
  {
    id: 5,
    question:
      "Do you experience any pain or discomfort during sexual activity due to vaginal dryness?",
    answers: ["Yes, always", "No, never", "Occasionally"],
    skip: { onSelected: 1, next: 7 },
  },
  {
    id: 6,
    question: "Can you describe the location and nature of the discomfort?",
    answers: ["Lower abdomen", "Vaginal area", "Clitoral area", "Other"],
    skip: { onSelected: [0, 1, 2], next: 8 },
  },

  {
    id: 7,
    question: "Please specify the location and nature of the discomfort.",
  },
  {
    id: 8,
    question:
      "Do you experience any other sexual issues? (( e.g. Low sex drive, orgasm issues, etc. ))",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 10 },
  },
  {
    id: 9,
    question: "Please describe the other sexual issues you are experiencing.",
  },
  {
    id: 10,
    question: "Have you noticed any changes in your vaginal discharge?",
    answers: ["Yes, always", "No, never", "Occasionally"],
  },
  {
    id: 11,
    question:
      "Do you experience itching, burning, or irritation in the vaginal area?",
    answers: ["Yes, always", "No, never", "Occasionally"],
  },
  {
    id: 12,
    question: "Do you use any products to relieve vaginal dryness?",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 14 },
  },
  {
    id: 13,
    question:
      "Please describe the products you are using and whether they are helpful.",
  },
  {
    id: 14,
    question:
      "Are you currently taking any medications that may contribute to vaginal dryness?",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 16 },
  },
  {
    id: 15,
    question:
      "Please provide more information about the medications you are taking.",
  },
  {
    id: 16,
    question: "Are you currently experiencing menopause or perimenopause?",
    answers: ["Yes", "No"],
  },
  {
    id: 17,
    question:
      "Do you experience stress, anxiety, or depression that you think may be impacting your vaginal health? ",
    answers: ["Often", "Sometimes", "Rarely"],
  },
  {
    id: 18,
    question: "What is your age?",
  },
  {
    id: 19,
    question: "What is your height? (in feet)",
  },
  {
    id: 20,
    question: "What is your weight? (in Kg)",
  },
  {
    id: 21,
    question: "How often do you exercise?",
    answers: [
      "3-5 times per week",
      "2-3 times per week",
      "Once a week",
      "Not a priority",
    ],
  },
  {
    id: 22,
    question: "How would you describe your diet?",
    answers: [
      "Very healthy",
      "Pretty healthy but could do with improvement",
      "Not very healthy",
      "Don't care for healthy food",
    ],
  },
  {
    id: 23,
    question: "How would you rate your average nights sleep?",
    answers: ["Excellent", "Good", "Average", "Poor", "Very poor"],
  },

  {
    id: 24,
    question: "Anything else your doctor needs to consider?",
  },
  {
    id: 25,
    question: "How did you hear about VigourMe?",
    answers: [
      "Facebook",
      "Instagram",
      "TikTok",
      "Google",
      "Friends or Family",
      "Other",
    ],
  },
];

export const orgasmIssues = [
  {
    id: 1,
    question: "How often do you experience orgasms during sexual activity?",
    answers: ["Always", "Most of the time", "Sometime", "Rarely", "Never"],
  },
  {
    id: 2,
    question: "How satisfied are you with your ability to achieve orgasm?",
    answers: [
      "Very satisfied",
      "Satisfied",
      "Neutral",
      "Dissatisfied",
      "Very dissatisfied",
    ],
  },
  {
    id: 3,
    question: "How long have you been experiencing issues with orgasm.",
    answers: [
      "Less than 1 month",
      "1-3 months",
      "3-6 months",
      "More than 6 months",
      "Since always",
    ],
  },

  {
    id: 4,
    question: "How would you describe your overall sexual satisfaction?",
    answers: [
      "Very satisfied",
      "Satisfied",
      "Neutral",
      "Dissatisfied",
      "Very dissatisfied",
    ],
  },
  {
    id: 5,
    question:
      "Do you experience any physical discomfort or pain during sexual activity?",
    answers: ["Yes, always", "No, never", "Occasionally"],
    skip: { onSelected: 1, next: 8 },
  },
  {
    id: 6,
    question: "Can you describe the location and nature of the discomfort?",
    answers: ["Lower abdomen", "Vaginal area", "Clitoral area", "Other"],
    skip: { onSelected: [0, 1, 2], next: 8 },
  },
  {
    id: 7,
    question: "lease specify the location and nature of the discomfort.",
  },
  {
    id: 8,
    question:
      "Do you experience any other sexual issues? ((e.g. Low sex drive, vaginal dryness, etc.))",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 10 },
  },
  {
    id: 9,
    question: "Please describe the other sexual issues you are experiencing.",
  },
  {
    id: 10,
    question:
      "Do you experience any significant emotional or psychological stress that you think might impact your sexual health?",
    answers: ["Often", "Sometimes", "Rarely", "Never"],
  },
  {
    id: 11,
    question:
      "Are there any emotional or psychological factors that you believe are affecting your ability to achieve orgasm?",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 13 },
  },
  { id: 12, question: "Please describe these factors." },
  {
    id: 13,
    question:
      "Do you communicate your sexual needs and desires with your partner?",
    answers: ["Always", "Sometimes", "Rarely", "Never"],
  },
  {
    id: 14,
    question:
      "Is your sexual activity consensual and enjoyable for both you and your partner?",
    answers: ["Yes, always", "No, never", "Sometimes"],
  },
  {
    id: 15,
    question: "Are your menstrual cycles usually regular?",
    answers: [
      "Yes, always",
      "	No, never",
      "Sometimes",
      "I am experiencing menopause",
    ],
    skip: { onSelected: 3, next: 17 },
  },
  {
    id: 16,
    question:
      "Do you experience severe pain or discomfort during your menstrual cycle?",
    answers: ["Yes, always", "No, never", "Occasionally"],
  },
  {
    id: 17,
    question: "Are you currently using any form of contraception?",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 20 },
  },
  {
    id: 18,
    question: "what type of contraception are you using?",
    answers: [
      "Oral contraceptives (pills)",
      "Condoms",
      "Intrauterine device (IUD)",
      "Other",
    ],
    skip: { onSelected: [0, 1, 2], next: 20 },
  },

  {
    id: 19,
    question: "Describe the contraception you are using.",
  },
  {
    id: 20,
    question: "Have you experienced any changes in vaginal discharge or odor?",
    answers: ["Yes, always", "No, never", "Occasionally"],
  },

  {
    id: 21,
    question:
      "Do you experience any itching or irritation in the genital area?",
    answers: ["Yes, always", "No, never", "Occasionally"],
  },
  {
    id: 22,
    question:
      "Are you currently taking any medications that may affect sexual function?",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 24 },
  },
  {
    id: 23,
    question: "Please give the doctor more information.",
  },
  {
    id: 24,
    question:
      "Do you have any pre-existing medical conditions that may be relevant?",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 26 },
  },

  {
    id: 25,
    question: "Please provide information about your medical condition.",
  },
  {
    id: 26,
    question: "What is your age?",
  },
  {
    id: 27,
    question: "What is your height? (in feet)",
  },
  {
    id: 28,
    question: "What is your weight? (in Kg)",
  },
  {
    id: 29,
    question: "How often do you exercise?",
    answers: [
      "3-5 times per week",
      "2-3 times per week",
      "Once a week",
      "Not a priority",
    ],
  },
  {
    id: 30,
    question: "How would you describe your diet?",
    answers: [
      "Very healthy",
      "Pretty healthy but could do with improvement",
      "Not very healthy",
      "Don't care for healthy food",
    ],
  },
  {
    id: 31,
    question: "How would you rate your average nights sleep?",
    answers: ["Excellent", "Good", "Average", "Poor", "Very poor"],
  },
  {
    id: 32,
    question: "Is there anything else you would like to tell your doctor? ",
  },
  {
    id: 33,
    question: "How did you hear about VigourMe?",
    answers: [
      "Facebook",
      "Instagram",
      "TikTok",
      "Google",
      "Friends or Family",
      "Other",
    ],
  },
];

export const vaginismus = [
  {
    answers: ["Always", "Most of the time", "Sometime", "Rarely", "Never"],
    id: 1,
    question:
      "How often do you experience pain or discomfort during intercourse or penetration?",
  },
  {
    answers: ["Severe", "Moderate", "Mild"],
    id: 2,
    question: "How would you describe the severity of the pain?",
  },
  {
    answers: [
      "Less than 1 month",
      "1-3 months",
      "3-6 months",
      "More than 6 months",
      "Since always",
    ],
    id: 3,
    question:
      "How long have you been experiencing pain or discomfort during intercourse or penetration?",
  },
  {
    answers: [
      "Vaginal opening",
      "Lower abdomen",
      "Cervix (the lower part of the uterus that opens into the vagina)",
      "Entire vaginal area",
      "Other",
    ],
    id: 4,
    question:
      "Can you identify the specific areas where you feel pain during penetration?",
    skip: { next: 6, onSelected: [0, 1, 2, 3] },
  },
  {
    answers: [
      "Oral contraceptives (pills)",
      "Condoms",
      "Intrauterine device (IUD)",
      "Other (please specify)",
      "Not applicable",
    ],
    id: 5,
    question: "Please specify the location and nature of the pain.",
  },
  {
    id: 6,
    question:
      "Does the pain occur with all forms of penetration (e.g., intercourse, tampon use, gynaecological exams)?",
    answers: ["Yes, always", "No, never", "Sometimes"],
  },
  {
    id: 7,
    question:
      "Do you experience involuntary muscle tightening or spasms in the vaginal area during penetration?",
    answers: ["Yes, always", "No, never", "Sometimes"],
  },
  {
    answers: ["Yes", "No"],
    id: 8,
    question:
      "Have you experienced any past trauma or negative sexual experiences that you believe might be related to your symptoms?",
    skip: { onSelected: 1, next: 10 },
  },
  {
    id: 9,
    question:
      "Please provide more details on your trauma or negative sexual experiences.",
  },
  {
    id: 10,
    question: "Do you experience vaginal dryness?",
    answers: ["Yes", "No"],
  },
  {
    id: 11,
    question:
      "Do you experience itching, burning, or irritation in the vaginal area?",
    answers: ["Yes, always", "No, never", "Occasionally"],
  },
  {
    answers: ["Yes", "No"],
    id: 12,
    question:
      "Have you tried any treatments or therapies to address the pain or discomfort?",
    skip: { onSelected: 1, next: 14 },
  },
  {
    id: 13,
    question:
      "Please describe the treatments or therapies you have tried and their effectiveness.",
  },
  {
    answers: ["Yes", "No"],
    id: 14,
    question:
      "Are you currently taking any medications that may affect your sexual health?",
    skip: { onSelected: 1, next: 16 },
  },
  {
    id: 15,
    question:
      "Please provide more information about the medications you are taking.",
  },
  {
    answers: ["Yes", "No"],
    id: 16,
    question: "Are you currently experiencing menopause or perimenopause?",
  },
  {
    answers: ["Often", "Sometimes", "Rarely"],
    id: 17,
    question:
      "Do you experience stress, anxiety, or depression that you think may be impacting your sexual health?",
  },
  {
    id: 18,
    question: "What is your age?",
  },
  {
    id: 19,
    question: "What is your height? (in feet)",
  },
  {
    id: 20,
    question: "What is your weight? (in Kg)",
  },
  {
    id: 21,
    question: "How often do you exercise?",
    answers: [
      "3-5 times per week",
      "2-3 times per week",
      "Once a week",
      "Not a priority",
    ],
  },
  {
    id: 22,
    question: "How would you describe your diet?",
    answers: [
      "Very healthy",
      "Pretty healthy but could do with improvement",
      "Not very healthy",
      "Don't care for healthy food",
    ],
  },
  {
    id: 23,
    question: "How would you rate your average nights sleep?",
    answers: ["Excellent", "Good", "Average", "Poor", "Very poor"],
  },
  {
    id: 24,
    question: "Is there anything else you would like to tell your doctor? ",
  },
  {
    id: 25,
    question: "How did you hear about VigourMe?",
    answers: [
      "Facebook",
      "Instagram",
      "TikTok",
      "Google",
      "Friends or Family",
      "Other",
    ],
  },
];

export const femaleOtherIssues = [
  {
    id: 1,
    question: "Please describe the main health concern you are experiencing.",
  },
  {
    id: 2,
    question: "How long have you been experiencing this issue?",
    answers: [
      "Less than a month ago ",
      "1-3 months ago",
      "3-6 months",
      "More than 6 months",
      "Since always",
    ],
  },
  {
    id: 3,
    question:
      "Are you experiencing any other symptoms along with this issue? ((e.g. Low sex drive, vaginal dryness, painful intercourse, etc.))",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 5 },
  },
  {
    id: 4,
    question: "Please describe any additional symptoms you are experiencing.",
  },
  {
    id: 5,
    question: "Have you taken any medications or supplements for this issue?",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 7 },
  },
  {
    id: 6,
    question:
      "Please list the medications or supplements you have taken, along with dosages and effectiveness.",
  },

  {
    id: 7,
    question:
      "Do you have any concerns about your menstrual cycle (e.g., irregular periods, heavy bleeding, or severe cramps)?",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 9 },
  },
  {
    id: 8,
    question: "Please describe your concerns about your menstrual cycle.",
  },
  {
    id: 9,
    question: "How frequently do you engage in sexual activity?",
    answers: [
      "Several times a week",
      "Once a week",
      "Less than once a week",
      "Not currently sexually active",
    ],
  },
  {
    id: 10,
    question:
      "Do you experience significant stress, anxiety, or depression that you think might be impacting your sexual or overall health?",
    answers: ["Often", "Sometimes", "Rarely", "Never"],
  },
  {
    id: 11,
    question:
      "Are you currently taking any medications or supplements that you believe may be affecting your sexual health?",
    answers: ["Yess", "No"],
    skip: { onSelected: 1, next: 13 },
  },
  {
    id: 12,
    question:
      "Please provide more information about the medications or supplements you are taking.",
  },
  {
    id: 13,
    question:
      "Do you have any chronic medical conditions (e.g., diabetes, hypertension, thyroid disorders) that might affect your sexual or overall health?",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 15 },
  },
  {
    id: 14,
    question: "Please provide more information about your medical condition.",
  },
  {
    id: 15,
    question:
      "Are you currently undergoing any medical treatments (e.g., chemotherapy, radiation, hormone therapy) that might impact your sexual health?",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 17 },
  },
  {
    id: 16,
    question: "Please describe the medical treatments you are undergoing.",
  },
  {
    id: 17,
    question: "How often do you engage in physical exercise?",
    answers: [
      "3-5 times per week",
      "2-3 times per week",
      "Once a week",
      "Not a priority",
    ],
  },
  {
    id: 18,
    question: "How would you describe your diet?",
    answers: [
      "Very healthy",
      "Pretty healthy but could do with improvement",
      "Not very healthy",
      "Don’t care for healthy food",
    ],
  },
  {
    id: 19,
    question: "How would you rate your average nights sleep?",
    answers: ["Excellent", "Good", "Average", "Poor", "Very poor"],
  },
  {
    id: 20,
    question: "Do you smoke, consume alcohol, or use recreational drugs?",
    answers: ["Yes, frequently", "Occasionally", "No"],
  },
  {
    id: 21,
    question:
      "Is there anything else you would like to tell your doctor regarding your sexual or overall health?",
  },
  {
    id: 22,
    question: "How did you hear about VigourMe?",
    answers: [
      "Facebook",
      "Instagram",
      "TikTok",
      "Google",
      "Friends or Family",
      "Other",
    ],
  },
];

export const maleErectileDysfunctionQuestions = [
  {
    id: 1,
    question:
      "Do you ever have a problem getting or maintaining an erection that's hard and satisfying enough for sex?",
    answers: [
      "Yes, every time",
      "Yes, more than half the time",
      "Yes, on occasion",
      "I never have a problem",
    ],
  },
  {
    id: 2,
    question:
      "Do you ever get an erection? For example in the mornings or when you masturbate.",
    answers: ["Yes", "No"],
  },
  {
    id: 3,
    question:
      "Are you experiencing any other symptoms relating to your erectile dysfunction? ((For example, pain, difficulty ejaculating, etc.))",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 5 },
  },
  {
    id: 4,
    question: "Please explain these symptoms for your doctor.",
  },
  {
    id: 5,
    question: "Generally, how often do you intend to have intercourse?",
    answers: [
      "Regularly (at least twice weekly)",
      "Weekly",
      "Every couple of weeks/less often",
    ],
  },
  {
    id: 6,
    question: "Which of the following best describes your desire to have sex?",
    answers: [
      "Less desire than before",
      "Less desire because of trouble with erections or ejaculating",
      "Unchanged",
    ],
  },
  {
    id: 7,
    question: "Do you prefer to have planned or spontaneous sex?",
    answers: ["Planned", "Spontaneous", "Both"],
  },
  {
    id: 8,
    question:
      "Have you ever taken or used any medications or supplements for erectileDysfunction before?",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 10 },
  },
  {
    id: 9,
    question:
      "Please list the medications or supplements you have taken, along with dosages and effectiveness.",
  },
  {
    id: 10,
    question: "Have you ever seen a specialist about your condition?",
    answers: ["Yes", "No"],
  },
  {
    id: 11,
    question: "Do you have any allergies?",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 13 },
  },
  {
    id: 12,
    question: "What allergies do you have?",
  },
  {
    id: 13,
    question:
      "Are you currently taking any medications, supplements or herbs? Important: Some combinations, especially with ED tablets, can cause severe reactions. Please confirm that you have disclosed all current medications.",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 15 },
  },
  {
    id: 14,
    question:
      "What medications or supplements do you currently use? Please state the name of medication and dosages.",
  },
  {
    id: 15,
    question: "Do you have any past medical conditions?",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 17 },
  },
  {
    id: 16,
    question: "Please give the doctor more information.",
  },
  {
    id: 17,
    question:
      "Is there a history of any other medical illness or disorder that has run within your family?",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 19 },
  },
  {
    id: 18,
    question:
      "Please explain the medical illness that has run within your family.",
  },
  {
    id: 19,
    question: "Have you ever had any major surgery?",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 21 },
  },
  {
    id: 20,
    question:
      "Please provide further information on the type of surgery, what it was for and when it occurred.",
  },
  {
    id: 21,
    question: "Have you had your blood pressure checked in the past 12 months?",
    answers: ["Yes, I know my blood pressure", "No, I don’t know it"],
    skip: { onSelected: 1, next: 24 },
  },
  {
    id: 22,
    question: "What is the top number? This is always the higher number",
    answers: [
      "Less than 95",
      "95-110",
      "110-125",
      "125-135",
      "135-150",
      "150 or higher",
    ],
  },
  {
    id: 23,
    question: "What is the bottom number? This is always the lower number",
    answers: ["Less than 70", "70-85", "85-100", "Higher than 100"],
  },
  {
    id: 24,
    question:
      "Have you had any blood pressure problems in the last 12 months, particularly low blood pressure?",
    answers: ["Yes, I have", "No, I haven’t", "I don’t know"],
    skip: { onSelected: [1, 2], next: 26 },
  },
  {
    id: 25,
    question:
      "If you are on blood pressure tablets, is your blood pressure well controlled?",
    answers: [
      "Yes, it is well-controlled",
      "No, it is not well-controlled",
      "I am not taking any blood pressure medicine",
    ],
  },
  {
    id: 26,
    question:
      "Have you had any cardiovascular (heart) problems or have you ever had a stroke?",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 28 },
  },
  {
    id: 27,
    question: "Please explain this for your doctor",
  },
  {
    id: 28,
    question:
      "Do you frequently feel lightheaded or dizzy if you stand up suddenly?",
    answers: ["Yes", "No"],
  },
  {
    id: 29,
    question:
      "Are you able to walk 1km in 15 minutes on the flat, and climb two flights of stairs in 10 seconds without chest discomfort, pain or undue breathlessness?",
    answers: ["Yes", "No"],
  },
  {
    id: 30,
    question:
      "Do any of the following apply to you? Please select all that apply.",
    answers: [
      "Cancer",
      "Kidney problems",
      "Liver problems",
      "Lung problems",
      "Nerve or neurological problems",
      "Using hormones or steroids",
      "None",
    ],
    isMultiSelect: true,
    skip: { onSelected: 6, next: 32 },
  },
  {
    id: 31,
    question: "Please provide further information for your doctor.",
  },
  {
    id: 32,
    question:
      "Have you in the past, or do you currently suffer from any mental disorders? Please select all that apply.",
    answers: ["Anxiety", "Bipolar", "Depression", "Psychotic disorder", "None"],
    skip: { onSelected: 4, next: 34 },
  },
  {
    id: 33,
    question:
      "Has your mental health disorder been stable over the past 6 months?",
    answers: ["Yes", "No"],
    skip: { onSelected: 0, next: 35 },
  },
  {
    id: 34,
    question: "Please explain this in more detail for your doctor.",
  },
  {
    id: 35,
    question:
      "Just to be overly cautious, do any of the following apply to you?",
    answers: [
      "Angina, chest pain or heart attack",
      "Severe heart disease",
      "Arrythmia or abnormal heartbeat",
      "Diabetes",
      "Paralysis",
      "None",
    ],
  },
  {
    id: 36,
    question:
      "Do you ever experience any of the following symptoms when passing urine? Please select all that apply.",
    answers: [
      "Problem with starting or stopping your stream",
      "Going more than you used to, especially at night",
      "Interrupted stream – stopping/starting/dribbling",
      "Urge to go more often and less ability to hold on",
      "None",
    ],
    isMultiSelect: true,
  },
  {
    id: 37,
    question: "What is your age?",
  },
  {
    id: 38,
    question: "What is your height? (in feet)",
  },
  {
    id: 39,
    question: "What is your weight? (in Kg)",
  },
  {
    id: 40,
    question: "How often do you exercise?",
    answers: [
      "3-5 times per week",
      "2-3 times per week",
      "Once a week",
      "Not a priority",
    ],
  },
  {
    id: 41,
    question: "How would you describe your diet?",
    answers: [
      "Very healthy",
      "Pretty healthy but could do with improvement",
      "Not very healthy",
      "Don't care for healthy food",
    ],
  },
  {
    id: 42,
    question: "How would you rate your average nights sleep?",
    answers: ["Excellent", "Good", "Average", "Poor", "Very poor"],
  },
  {
    id: 43,
    question: "How would you rate your mood recently?",
    answers: ["Excellent", "Good", "Average", "Bad", "Very bad"],
  },
  {
    id: 44,
    question: "How often do you drink alcohol?",
    answers: [
      "Not at all",
      "Rarely",
      "Once or twice per week",
      "More than twice per week",
    ],
  },
  {
    id: 45,
    question: "Do you smoke?",
    answers: ["No", "Yes", "Rarely"],
  },
  {
    id: 46,
    question:
      "Do you use any recreational drugs? ((Only your doctor will see this information.))",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 48 },
  },
  {
    id: 47,
    question: "What recreational drugs do you use?",
  },
  {
    id: 48,
    question: "Anything else your doctor needs to consider?",
  },
  {
    id: 49,
    question: "How did you hear about VigourMe?",
    answers: [
      "Facebook",
      "Instagram",
      "TikTok",
      "Google",
      "Friends or Family",
      "Other",
    ],
  },
];

export const malePrematureEjaculationQuestions = [
  {
    id: 1,
    question:
      "Do you ever have a problem ejaculating sooner than you or your partner would like?",
    answers: [
      "Yes, I always ejaculate too soon",
      "Yes, more than half the time I ejaculate too soon",
      "Yes, less than half the time I ejaculate too soon",
      "No, I never ejaculate too soon",
    ],
  },
  {
    id: 2,
    question: "What is the average duration of time before you ejaculate?",
    answers: [
      "Within 1 minute",
      "Within 1 - 5 minutes",
      "Within 5 - 10 minutes",
      "More than 10 minutes",
    ],
  },
  {
    id: 3,
    question:
      "Are you experiencing any other symptoms relating to your premature ejaculation? ((For example, painful ejaculation, unsatisfying erection, etc.))",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 5 },
  },

  {
    id: 4,
    question: "Please explain these symptoms for your doctor.",
  },
  {
    id: 5,
    question: "Generally, how often do you intend to have intercourse?",
    answers: [
      "Regularly (at least twice weekly)",
      "Weekly",
      "Every couple of weeks/less often",
    ],
  },
  {
    id: 6,
    question: "Which of the following best describes your desire to have sex?",
    answers: [
      "Less desire than before",
      "Less desire because of trouble with erections or ejaculating",
      "Unchanged",
    ],
  },
  {
    id: 7,
    question: "For premature ejaculation, what treatment would you consider?",
    answers: [
      "Whatever works best",
      "I prefer tablets",
      "I prefer numbing gel",
    ],
  },
  {
    id: 8,
    question:
      "Have you ever taken or used any medications or supplements for premature ejaculation before?",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 10 },
  },
  {
    id: 9,
    question:
      "Please note the name of medication, dosages and the effectiveness.",
  },
  {
    id: 10,
    question: "Have you ever seen a specialist about your condition?",
    answers: ["Yes", "No"],
  },
  {
    id: 11,
    question: "Do you have any allergies?",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 13 },
  },
  { id: 12, question: "What allergies do you have?" },
  {
    id: 13,
    question:
      "Are you currently taking any medications, supplements or herbs? ((Important: Some combinations, especially with ED tablets, can cause severe reactions. Please confirm that you have disclosed all current medications.))",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 15 },
  },
  {
    id: 14,
    question:
      "What medications or supplements do you currently use? ((Please state the name of medication and dosages.))",
  },
  {
    id: 15,
    question: "Do you have any past medical conditions?",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 17 },
  },
  { id: 16, question: "Please give the doctor more information." },
  {
    id: 17,
    question:
      "Is there a history of any other medical illness or disorder that has run within your family?",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 19 },
  },
  {
    id: 18,
    question:
      "Please explain the medical illness that has run within your family.",
  },

  {
    id: 19,
    question: "Have you ever had any major surgery?",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 21 },
  },
  {
    id: 20,
    question:
      "Please provide further information on the type of surgery, what it was for and when it occurred.",
  },

  {
    id: 21,
    question: "Have you had your blood pressure checked in the past 12 months?",
    answers: ["Yes, I know my blood pressure", "Not sure"],
    skip: { onSelected: 1, next: 24 },
  },
  {
    id: 22,
    question: "What is the top number? ((This is always the higher number.))",
    answers: [
      "Less than 95",
      "95-110",
      "110-125",
      "125-135",
      "135-40",
      "150 or higher",
    ],
  },
  {
    id: 23,
    question: "What is the bottom number? ((This is always the lower number.))",
    answers: ["Less than 70", "70-85", "85-100", "Higher than 100"],
  },
  {
    id: 24,
    question:
      "Have you had any blood pressure problems in the last 12 months, particularly low blood pressure?",
    answers: ["Yes, I have", "No, I haven't", "I don't know"],
    skip: { onSelected: [1, 2], next: 26 },
  },

  {
    id: 25,
    question:
      "If you are on blood pressure tablets, is your blood pressure well controlled?",
    answers: ["Yes, it is", "No, it isn't", "I am not taking any medicine"],
  },
  {
    id: 26,
    question:
      "Have you had any cardiovascular (heart) problems or have you ever had a stroke?",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 28 },
  },
  {
    id: 27,
    question: "Please explain this for your doctor.",
  },
  {
    id: 28,
    question:
      "Do you frequently feel lightheaded or dizzy if you stand up suddenly?",
    answers: ["Yes", "No"],
  },

  {
    id: 29,
    question:
      "Are you able to walk 1km in 15 minutes on the flat, and climb two flights of stairs in 10 seconds without chest discomfort, pain or undue breathlessness?",
    answers: ["Yes", "No"],
  },
  {
    id: 30,
    question:
      "Do any of the following apply to you? ((Please select all that apply.))",
    answers: [
      "Cancer",
      "Kidney problems",
      "Liver problems",
      "Lung or pulmonary problems",
      "Nerve or neurological problems",
      "Using hormones or steroids",
      "None",
    ],
    isMultiSelect: true,
    skip: { onSelected: 6, next: 32 },
  },
  {
    id: 31,
    question: "Please provide further information for your doctor.",
  },
  {
    id: 32,
    question:
      "Have you in the past, or do you currently suffer from any mental disorders? ((Please select all that apply.))",
    answers: ["Anxiety", "Bipolar", "Depression", "Psychotic disorder", "None"],
    isMultiSelect: true,
    skip: { onSelected: 4, next: 34 },
  },
  {
    id: 33,
    question:
      "Has your mental health disorder been stable over the past 6 months?",
    answers: ["Yes", "No"],
    skip: { onSelected: 0, next: 35 },
  },
  { id: 34, question: "Please explain this in more detail for your doctor." },

  {
    id: 35,
    question:
      "Just to be overly cautious, do any of the following apply to you?",
    answers: [
      "Angina, chest pain or heart attack",
      "Severe heart disease",
      "Arrhythmia or abnormal heartbeat",
      "Diabetes",
      "Paralysis",
      "None",
    ],
  },
  {
    id: 36,
    question:
      "Do you ever experience any of the following symptoms when passing urine? ((Please select all that apply.))",
    answers: [
      "Problems with starting or stopping your stream",
      "Going more than you used to, especially at night",
      "Interrupted stream - stopping/starting/dribbling",
      "Urge to go more often and less ability to hold on",
      "None",
    ],
    isMultiSelect: true,
  },
  {
    id: 37,
    question: "What is your age?",
  },
  {
    id: 38,
    question: "What is your height? (in feet)",
  },
  {
    id: 39,
    question: "What is your weight? (in Kg)",
  },
  {
    id: 40,
    question: "How often do you exercise?",
    answers: [
      "3-5 times per week",
      "2-3 times per week",
      "Once a week",
      "Not a priority",
    ],
  },
  {
    id: 41,
    question: "How would you describe your diet?",
    answers: [
      "Very healthy",
      "Pretty healthy but could do with improvement",
      "Not very healthy",
      "Don't care for healthy food",
    ],
  },
  {
    id: 42,
    question: "How would you rate your average nights sleep?",
    answers: ["Excellent", "Good", "Average", "Poor", "Very poor"],
  },
  {
    id: 43,
    question: "How would you rate your mood recently?",
    answers: ["Excellent", "Good", "Average", "Bad", "Very bad"],
  },
  {
    id: 44,
    question: "How often do you drink alcohol?",
    answers: [
      "Not at all",
      "Rarely",
      "Once or twice per week",
      "More than twice per week",
    ],
  },
  {
    id: 45,
    question:
      "Do you use any recreational drugs? ((Only your doctor will see this information.))",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 47 },
  },
  {
    id: 46,
    question: "What recreational drugs do you use?",
  },
  {
    id: 47,
    question: "Do you smoke?",
    answers: ["No", "Yes", "Rarely"],
  },
  {
    id: 48,
    question: "Anything else your doctor needs to consider?",
  },
  {
    id: 49,
    question: "How did you hear about VigourMe?",
    answers: [
      "Facebook",
      "Instagram",
      "TikTok",
      "Google",
      "Friends or Family",
      "Other",
    ],
  },
];

export const maleOtherIssues = [
  {
    id: 1,
    question: "Please describe the main health concern you are experiencing.",
  },
  {
    id: 2,
    question: "How long have you been experiencing this issue?",
    answers: [
      "Less than a month",
      "1-3 months",
      "3-6 months",
      "More than 6 months",
    ],
  },
  {
    id: 3,
    question: "Are you experiencing any other symptoms along with this issue?",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 5 },
  },
  {
    id: 4,
    question: "Please describe any additional symptoms you are experiencing.",
  },
  {
    id: 5,
    question: "Have you taken any medications or supplements for this issue?",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 7 },
  },
  {
    id: 6,
    question:
      "Please list the medications or supplements you have taken, along with dosages and effectiveness.",
  },
  {
    id: 7,
    question: "How often do you exercise?",
    answers: ["3-5 times per week", "1-2 times per week", "Rarely or never"],
  },
  {
    id: 8,
    question: "Do you smoke or use any recreational drugs?",
    answers: ["Yes", "No"],
  },
  {
    id: 9,
    question: "Do you consume alcohol?",
    answers: ["Yes", "No"],
  },
  {
    id: 10,
    question:
      "Do you have any chronic conditions (e.g., diabetes, hypertension)?",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 12 },
  },
  {
    id: 11,
    question: "Please list any chronic conditions you have.",
  },
  {
    id: 12,
    question: "Are you currently taking any medications for other conditions?",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 14 },
  },
  {
    id: 13,
    question:
      "Please list your current medications, including names and dosages.",
  },
  {
    id: 14,
    question:
      "Is there a history of any significant medical conditions in your family?",
    answers: ["Yes", "No"],
    skip: { onSelected: 1, next: 16 },
  },
  {
    id: 15,
    question: "Please describe the family medical history.",
  },
  {
    id: 16,
    question:
      "Is there anything else your doctor needs to know about your health concern?",
  },
  {
    id: 17,
    question: "How did you hear about VigourMe?",
    answers: [
      "Facebook",
      "Instagram",
      "TikTok",
      "Google",
      "Friends or Family",
      "Other",
    ],
  },
];
