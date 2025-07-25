/**
 * CMR Resume Builder Script - Enhanced Version
 * Fixes preview issues, adds cover letter, ATS optimizer, auto-save, and more
 */

// --- ENHANCED STATE MANAGEMENT ---
let resumeData = {
  personal: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    summary: "",
    photo: "",
  },
  experience: [],
  education: [],
  skills: {
    technical: "",
    soft: "",
    languages: "",
  },
  additional: {
    certifications: "",
    projects: "",
    awards: "",
    volunteer: "",
  },
}

let coverLetterData = {
  jobTitle: "",
  company: "",
  manager: "",
  fit: "",
  additional: "",
}

let uiSettings = {
  template: "modern",
  color: "#6366f1",
  font: "inter",
  atsMode: false,
  previewSize: "normal",
  theme: "light",
  language: "en",
  showCoverLetter: false,
}

let atsScore = 0
let debounceTimer = null

// Add these variables at the top of the file after existing state variables
const quitBotTimer = null
let userInactiveTimer = null
let exitIntentTriggered = false
let lastActivity = Date.now()
let currentPreviewedResume = null

// Selected Resumes Data
const selectedResumes = {
  tcs: {
    personal: {
      fullName: "Rajesh Kumar",
      jobTitle: "Software Engineer",
      email: "rajesh.kumar@email.com",
      phone: "+91 98765 43210",
      location: "Bangalore, Karnataka",
      linkedin: "linkedin.com/in/rajeshkumar",
      summary:
        "Dedicated Software Engineer with 3+ years of experience in full-stack development using Java, Spring Boot, React, and AWS. Proven track record of delivering scalable applications and optimizing system performance. Strong problem-solving skills with expertise in agile methodologies and collaborative development.",
      photo: "",
    },
    experience: [
      {
        id: "exp-1",
        title: "Software Engineer",
        company: "Tech Solutions Pvt Ltd",
        startDate: "2021-07",
        endDate: "",
        description:
          "• Developed and maintained 5+ web applications using Java Spring Boot and React\n• Improved application performance by 35% through code optimization and database tuning\n• Collaborated with cross-functional teams to deliver features on time\n• Implemented RESTful APIs serving 10,000+ daily requests\n• Mentored 2 junior developers and conducted code reviews",
      },
      {
        id: "exp-2",
        title: "Junior Software Developer",
        company: "StartupTech India",
        startDate: "2020-06",
        endDate: "2021-06",
        description:
          "• Built responsive web interfaces using React and JavaScript\n• Integrated third-party APIs and payment gateways\n• Participated in agile development cycles and daily standups\n• Fixed 50+ bugs and implemented new features based on user feedback",
      },
    ],
    education: [
      {
        id: "edu-1",
        degree: "B.Tech in Computer Science",
        school: "VIT University",
        year: "2020",
      },
    ],
    skills: {
      technical: "Java, Spring Boot, React, JavaScript, Node.js, MySQL, MongoDB, AWS, Docker, Git, Jenkins",
      soft: "Problem Solving, Team Collaboration, Communication, Leadership, Time Management, Adaptability",
      languages: "English (Fluent), Hindi (Native), Tamil (Conversational)",
    },
    additional: {
      certifications: "AWS Certified Developer Associate (2022)\nOracle Java SE 11 Certified (2021)",
      projects:
        "E-commerce Platform - Built full-stack application with 1000+ users\nTask Management System - React-based project management tool",
      awards: "Best Performer Award 2022\nEmployee of the Month (March 2022)",
      volunteer: "",
    },
  },

  infosys: {
    personal: {
      fullName: "Priya Sharma",
      jobTitle: "System Analyst",
      email: "priya.sharma@email.com",
      phone: "+91 87654 32109",
      location: "Pune, Maharashtra",
      linkedin: "linkedin.com/in/priyasharma",
      summary:
        "Results-driven System Analyst with 4+ years of experience in business analysis, requirements gathering, and process optimization. Expertise in SQL, Python, and data visualization tools. Successfully led 10+ projects improving operational efficiency by 25%. Strong analytical and communication skills with ability to bridge technical and business teams.",
      photo: "",
    },
    experience: [
      {
        id: "exp-1",
        title: "System Analyst",
        company: "Global Tech Services",
        startDate: "2022-01",
        endDate: "",
        description:
          "• Analyzed business requirements and translated them into technical specifications\n• Led requirements gathering sessions with 15+ stakeholders across departments\n• Designed and optimized database schemas improving query performance by 40%\n• Created comprehensive documentation and process flows\n• Managed end-to-end testing and user acceptance testing phases",
      },
      {
        id: "exp-2",
        title: "Business Analyst",
        company: "DataCorp Solutions",
        startDate: "2020-03",
        endDate: "2021-12",
        description:
          "• Conducted gap analysis and recommended process improvements\n• Developed SQL queries and reports for business intelligence\n• Collaborated with development teams to ensure requirement alignment\n• Facilitated workshops and training sessions for end users\n• Reduced manual processes by 30% through automation recommendations",
      },
    ],
    education: [
      {
        id: "edu-1",
        degree: "MBA in Information Systems",
        school: "Symbiosis Institute",
        year: "2020",
      },
      {
        id: "edu-2",
        degree: "B.Sc in Computer Science",
        school: "Pune University",
        year: "2018",
      },
    ],
    skills: {
      technical: "SQL, Python, Tableau, Power BI, JIRA, Confluence, MS Excel, Visio, Salesforce, SAP",
      soft: "Business Analysis, Requirements Gathering, Process Optimization, Stakeholder Management, Documentation, Training",
      languages: "English (Fluent), Hindi (Native), Marathi (Native)",
    },
    additional: {
      certifications:
        "Certified Business Analysis Professional (CBAP)\nTableau Desktop Specialist\nAgile Analysis Certification",
      projects:
        "ERP Implementation - Led analysis phase for company-wide ERP system\nData Migration Project - Managed requirements for legacy system migration",
      awards: "Excellence in Analysis Award 2023\nProject Delivery Excellence 2022",
      volunteer: "Tech Mentor at Women in Tech Community",
    },
  },

  zoho: {
    personal: {
      fullName: "Arjun Patel",
      jobTitle: "Product Manager",
      email: "arjun.patel@email.com",
      phone: "+91 76543 21098",
      location: "Chennai, Tamil Nadu",
      linkedin: "linkedin.com/in/arjunpatel",
      summary:
        "Strategic Product Manager with 5+ years of experience driving user-centric product development and cross-functional team leadership. Proven track record of launching 8+ successful products with 95% user satisfaction. Expertise in product strategy, roadmap planning, and data-driven decision making. Strong background in SaaS products and agile methodologies.",
      photo: "",
    },
    experience: [
      {
        id: "exp-1",
        title: "Senior Product Manager",
        company: "InnovateTech Solutions",
        startDate: "2021-08",
        endDate: "",
        description:
          "• Led product strategy and roadmap for 3 SaaS products serving 50,000+ users\n• Increased user engagement by 45% through feature optimization and UX improvements\n• Managed cross-functional teams of 12+ members including developers, designers, and QA\n• Conducted market research and competitive analysis to identify growth opportunities\n• Launched 5 major features resulting in 25% revenue growth",
      },
      {
        id: "exp-2",
        title: "Product Manager",
        company: "CloudFirst Technologies",
        startDate: "2019-06",
        endDate: "2021-07",
        description:
          "• Defined product requirements and user stories for development teams\n• Collaborated with UX designers to create intuitive user experiences\n• Analyzed user feedback and metrics to prioritize feature development\n• Managed product launches and go-to-market strategies\n• Reduced customer churn by 20% through product improvements",
      },
    ],
    education: [
      {
        id: "edu-1",
        degree: "MBA in Product Management",
        school: "IIM Bangalore",
        year: "2019",
      },
      {
        id: "edu-2",
        degree: "B.Tech in Electronics",
        school: "NIT Trichy",
        year: "2017",
      },
    ],
    skills: {
      technical:
        "Product Strategy, Roadmap Planning, Analytics, A/B Testing, JIRA, Figma, SQL, Google Analytics, Mixpanel",
      soft: "Strategic Thinking, Leadership, Communication, Stakeholder Management, Problem Solving, User Empathy",
      languages: "English (Fluent), Hindi (Fluent), Tamil (Native), Gujarati (Native)",
    },
    additional: {
      certifications:
        "Certified Scrum Product Owner (CSPO)\nGoogle Analytics Certified\nProduct Management Certificate - Stanford",
      projects:
        "Mobile App Launch - Led end-to-end launch of mobile app with 100K+ downloads\nAI Feature Integration - Managed integration of ML capabilities increasing user retention by 30%",
      awards: "Product Innovation Award 2023\nLeadership Excellence Award 2022\nBest Product Launch 2021",
      volunteer: "Product Mentor at Startup Incubator",
    },
  },
}

// --- TRANSLATIONS ---
const translations = {
  en: {
    "resume-builder": "Resume Builder",
    "cover-letter": "Cover Letter",
    templates: "Templates",
    builder: "Builder",
    "personal-info": "Personal Information",
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    additional: "Additional",
    "download-pdf": "Download PDF",
    "ats-score": "ATS Score",
    "offline-message": "You are offline - Your work is saved locally",
  },
  ta: {
    "resume-builder": "விண்ணப்ப கட்டுமானம்",
    "cover-letter": "கவர் கடிதம்",
    templates: "வார்ப்புருக்கள்",
    builder: "கட்டுமானம்",
    "personal-info": "தனிப்பட்ட தகவல்",
    experience: "அனுபவம்",
    education: "கல்வி",
    skills: "திறன்கள்",
    additional: "கூடுதல்",
    "download-pdf": "PDF பதிவிறக்கம்",
    "ats-score": "ATS மதிப்பெண்",
    "offline-message": "நீங்கள் ஆஃப்லைனில் உள்ளீர்கள் - உங்கள் வேலை உள்ளூரில் சேமிக்கப்பட்டுள்ளது",
  },
  hi: {
    "resume-builder": "रिज्यूमे बिल्डर",
    "cover-letter": "कवर लेटर",
    templates: "टेम्प्लेट्स",
    builder: "बिल्डर",
    "personal-info": "व्यक्तिगत जानकारी",
    experience: "अनुभव",
    education: "शिक्षा",
    skills: "कौशल",
    additional: "अतिरिक्त",
    "download-pdf": "PDF डाउनलोड करें",
    "ats-score": "ATS स्कोर",
    "offline-message": "आप ऑफ़लाइन हैं - आपका काम स्थानीय रूप से सहेजा गया है",
  },
}

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".builder-container")) {
    initializeApp("builder")
  } else if (document.querySelector(".cover-container")) {
    initializeApp("cover")
  } else {
    initializeApp("landing")
  }

  // Initialize offline detection
  initializeOfflineDetection()

  // Load saved data
  loadAutoSavedData()

  // Initialize ATS scoring
  updateATSScore()
})

// Initialize quit bot functionality
function initializeQuitBot() {
  // Track user activity
  document.addEventListener("mousemove", resetInactivityTimer)
  document.addEventListener("keypress", resetInactivityTimer)
  document.addEventListener("scroll", resetInactivityTimer)
  document.addEventListener("click", resetInactivityTimer)

  // Exit intent detection
  document.addEventListener("mouseout", handleExitIntent)

  // Page visibility change
  document.addEventListener("visibilitychange", handleVisibilityChange)

  // Before unload
  window.addEventListener("beforeunload", handleBeforeUnload)

  // Start inactivity timer
  resetInactivityTimer()
}

function resetInactivityTimer() {
  lastActivity = Date.now()
  clearTimeout(userInactiveTimer)

  // Show quit bot after 3 minutes of inactivity
  userInactiveTimer = setTimeout(() => {
    if (!exitIntentTriggered && document.visibilityState === "visible") {
      showQuitBot("inactivity")
    }
  }, 180000) // 3 minutes
}

function handleExitIntent(e) {
  if (e.clientY <= 0 && !exitIntentTriggered) {
    exitIntentTriggered = true
    showQuitBot("exit-intent")
  }
}

function handleVisibilityChange() {
  if (document.visibilityState === "hidden") {
    // User switched tabs or minimized
    setTimeout(() => {
      if (document.visibilityState === "hidden" && !exitIntentTriggered) {
        exitIntentTriggered = true
        showQuitBot("tab-switch")
      }
    }, 5000) // 5 seconds delay
  }
}

function handleBeforeUnload(e) {
  // Auto-save before leaving
  autoSaveData()
}

function showQuitBot(trigger) {
  const modal = document.getElementById("quitBotModal")
  const tipsContainer = document.getElementById("quitBotTips")

  if (!modal || exitIntentTriggered) return

  // Generate personalized tips based on current form data
  const tips = generatePersonalizedTips(trigger)

  tipsContainer.innerHTML = `
    <div class="quit-bot-message">
      <h4>🎯 ${tips.title}</h4>
      <ul class="tips-list">
        ${tips.suggestions.map((tip) => `<li>${tip}</li>`).join("")}
      </ul>
    </div>
  `

  modal.style.display = "flex"
  exitIntentTriggered = true

  // Auto-hide after 30 seconds if no interaction
  setTimeout(() => {
    if (modal.style.display === "flex") {
      closeQuitBot()
    }
  }, 30000)
}

function generatePersonalizedTips(trigger) {
  collectDataFromForm()
  const tips = {
    title: "Let's make your resume stand out!",
    suggestions: [],
  }

  // Analyze current form data and provide specific tips
  if (!resumeData.personal.fullName) {
    tips.suggestions.push("📝 Start with your full name - it's the first thing recruiters see")
  }

  if (!resumeData.personal.summary || resumeData.personal.summary.length < 50) {
    tips.suggestions.push("✨ Add a compelling professional summary (2-3 sentences about your expertise)")
  }

  if (resumeData.experience.length === 0) {
    tips.suggestions.push("💼 Add your work experience with specific achievements and numbers")
  }

  if (!resumeData.skills.technical && !resumeData.skills.soft) {
    tips.suggestions.push("⚡ List your key skills - both technical and soft skills matter")
  }

  if (resumeData.experience.length > 0) {
    const hasNumbers = resumeData.experience.some((exp) => exp.description && /\d+/.test(exp.description))
    if (!hasNumbers) {
      tips.suggestions.push("📊 Add numbers to your achievements (e.g., 'Increased sales by 25%')")
    }
  }

  if (!coverLetterData.jobTitle && !coverLetterData.company) {
    tips.suggestions.push("📄 Create a matching cover letter to double your interview chances")
  }

  // Default tips if form is mostly complete
  if (tips.suggestions.length === 0) {
    tips.suggestions = [
      "🎨 Try different templates to find the perfect style for your industry",
      "📱 Your resume is mobile-optimized and ATS-friendly",
      "💾 Your work is automatically saved - no need to worry about losing progress",
    ]
  }

  return tips
}

function continueBuilding() {
  closeQuitBot()
  // Focus on the first empty required field
  const emptyFields = document.querySelectorAll(
    ".form-input[required]:not([value]), .form-textarea[required]:not([value])",
  )
  if (emptyFields.length > 0) {
    emptyFields[0].focus()
    emptyFields[0].scrollIntoView({ behavior: "smooth", block: "center" })
  }
}

function generateCoverLetter() {
  closeQuitBot()
  showTab("coverletter")
  // Scroll to cover letter section
  document.getElementById("coverletter").scrollIntoView({ behavior: "smooth" })
}

function loadQuickTips() {
  closeQuitBot()
  // Show analyzer modal with tips
  analyzeResume()
}

function closeQuitBot() {
  const modal = document.getElementById("quitBotModal")
  if (modal) {
    modal.style.display = "none"
  }
  // Reset exit intent after 5 minutes
  setTimeout(() => {
    exitIntentTriggered = false
  }, 300000)
}

function initializeApp(page) {
  loadState()
  setupEventListeners(page)
  updateTheme()
  setupLanguage()

  switch (page) {
    case "builder":
      populateForm()
      updatePreview()
      updateProgress()
      updateATSScore()
      break
    case "cover":
      updateCoverPreview()
      break
    case "landing":
      // Landing page specific initializations
      break
  }
}

// --- ENHANCED EVENT LISTENERS ---
function setupEventListeners(page) {
  // Global listeners
  document.querySelectorAll(".theme-toggle").forEach((btn) => (btn.onclick = toggleTheme))

  if (page === "builder") {
    // Enhanced builder listeners with debouncing
    const debouncedUpdate = debounce(updatePreview, 300)

    document.getElementById("templateSelect").onchange = changeTemplate
    document.getElementById("fontSelect").onchange = changeFont
    document
      .querySelectorAll(".color-btn")
      .forEach((btn) => (btn.onclick = (e) => changeColor(e.currentTarget.dataset.color)))
    document.getElementById("atsToggle").onclick = toggleATSMode
    document.getElementById("download-pdf").onclick = downloadPDF
    document.getElementById("export-data").onclick = exportData
    document.getElementById("import-data-btn").onclick = () => document.getElementById("import-data-input").click()
    document.getElementById("import-data-input").onchange = importData
    document.getElementById("analyze-resume").onclick = analyzeResume
    document.getElementById("load-sample").onclick = loadSampleData
    document.getElementById("photo").onchange = handlePhotoUpload

    // Enhanced form input listeners with auto-save
    document.querySelector(".builder-main").addEventListener("input", (e) => {
      debouncedUpdate()
      autoSaveData()
      updateATSScore()
    })

    // Tab switching
    document.querySelectorAll(".tab-btn").forEach((btn) => (btn.onclick = (e) => showTab(e.currentTarget.dataset.tab)))

    // Dynamic form elements
    setupDynamicFormListeners()

    // Cover letter listeners
    setupCoverLetterListeners()
  }

  if (page === "cover") {
    // Cover letter specific listeners
    document.querySelector(".cover-form").oninput = updateCoverPreview
    document.getElementById("download-cover-pdf").onclick = downloadCoverLetterPDF
    document.getElementById("generate-ai-cover").onclick = generateAICover
  }

  if (page === "landing") {
    setupLandingPageListeners()
  }
}

function setupDynamicFormListeners() {
  // Experience and education management
  document.addEventListener("click", (e) => {
    if (e.target.matches('[onclick*="addExperience"]')) {
      addExperience()
    }
    if (e.target.matches('[onclick*="addEducation"]')) {
      addEducation()
    }
    if (e.target.matches('[onclick*="removeExperience"]')) {
      const id = e.target.getAttribute("onclick").match(/'([^']+)'/)[1]
      removeExperience(id)
    }
    if (e.target.matches('[onclick*="removeEducation"]')) {
      const id = e.target.getAttribute("onclick").match(/'([^']+)'/)[1]
      removeEducation(id)
    }
  })
}

function setupCoverLetterListeners() {
  const coverInputs = ["coverJobTitle", "coverCompany", "coverManager", "coverFit", "coverAdditional"]
  coverInputs.forEach((id) => {
    const element = document.getElementById(id)
    if (element) {
      element.addEventListener("input", debounce(updateCoverPreview, 300))
    }
  })
}

function setupLandingPageListeners() {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelector(".filter-btn.active").classList.remove("active")
      btn.classList.add("active")
      const filter = btn.dataset.filter
      document.querySelectorAll(".template-card").forEach((card) => {
        if (filter === "all" || card.dataset.category.includes(filter)) {
          card.style.display = "block"
        } else {
          card.style.display = "none"
        }
      })
    })
  })
}

// --- ENHANCED DATA MANAGEMENT ---
function collectDataFromForm() {
  // Personal
  resumeData.personal.fullName = getValue("fullName")
  resumeData.personal.jobTitle = getValue("jobTitle")
  resumeData.personal.email = getValue("email")
  resumeData.personal.phone = getValue("phone")
  resumeData.personal.location = getValue("location")
  resumeData.personal.linkedin = getValue("linkedin")
  resumeData.personal.summary = getValue("summary")

  // Experience - Enhanced collection
  resumeData.experience = Array.from(document.querySelectorAll("#experienceList .experience-item")).map((item) => ({
    id: item.dataset.id,
    title: item.querySelector('[data-field="title"]')?.value || "",
    company: item.querySelector('[data-field="company"]')?.value || "",
    startDate: item.querySelector('[data-field="startDate"]')?.value || "",
    endDate: item.querySelector('[data-field="endDate"]')?.value || "",
    description: item.querySelector('[data-field="description"]')?.value || "",
  }))

  // Education - Enhanced collection
  resumeData.education = Array.from(document.querySelectorAll("#educationList .education-item")).map((item) => ({
    id: item.dataset.id,
    degree: item.querySelector('[data-field="degree"]')?.value || "",
    school: item.querySelector('[data-field="school"]')?.value || "",
    year: item.querySelector('[data-field="year"]')?.value || "",
  }))

  // Skills - Enhanced collection
  resumeData.skills.technical = getValue("technicalSkills")
  resumeData.skills.soft = getValue("softSkills")
  resumeData.skills.languages = getValue("languages")

  // Additional - Enhanced collection
  resumeData.additional.certifications = getValue("certifications")
  resumeData.additional.projects = getValue("projects")
  resumeData.additional.awards = getValue("awards")
  resumeData.additional.volunteer = getValue("volunteer")

  // Cover Letter
  coverLetterData.jobTitle = getValue("coverJobTitle")
  coverLetterData.company = getValue("coverCompany")
  coverLetterData.manager = getValue("coverManager")
  coverLetterData.fit = getValue("coverFit")
  coverLetterData.additional = getValue("coverAdditional")
}

function getValue(id) {
  const element = document.getElementById(id)
  return element ? element.value : ""
}

function populateForm() {
  // Personal
  setValue("fullName", resumeData.personal.fullName)
  setValue("jobTitle", resumeData.personal.jobTitle)
  setValue("email", resumeData.personal.email)
  setValue("phone", resumeData.personal.phone)
  setValue("location", resumeData.personal.location)
  setValue("linkedin", resumeData.personal.linkedin)
  setValue("summary", resumeData.personal.summary)

  if (resumeData.personal.photo) {
    const preview = document.getElementById("photoPreview")
    if (preview) {
      preview.style.backgroundImage = `url(${resumeData.personal.photo})`
      preview.classList.add("has-image")
    }
  }

  // Experience & Education
  const expList = document.getElementById("experienceList")
  const eduList = document.getElementById("educationList")

  if (expList) {
    expList.innerHTML = ""
    resumeData.experience.forEach((exp) => addExperience(exp))
  }

  if (eduList) {
    eduList.innerHTML = ""
    resumeData.education.forEach((edu) => addEducation(edu))
  }

  // Skills
  setValue("technicalSkills", resumeData.skills.technical)
  setValue("softSkills", resumeData.skills.soft)
  setValue("languages", resumeData.skills.languages)

  // Additional
  setValue("certifications", resumeData.additional.certifications)
  setValue("projects", resumeData.additional.projects)
  setValue("awards", resumeData.additional.awards)
  setValue("volunteer", resumeData.additional.volunteer)

  // Cover Letter
  setValue("coverJobTitle", coverLetterData.jobTitle)
  setValue("coverCompany", coverLetterData.company)
  setValue("coverManager", coverLetterData.manager)
  setValue("coverFit", coverLetterData.fit)
  setValue("coverAdditional", coverLetterData.additional)
}

function setValue(id, value) {
  const element = document.getElementById(id)
  if (element) {
    element.value = value || ""
  }
}

// --- ENHANCED PREVIEW RENDERING ---
async function updatePreview() {
  collectDataFromForm()
  saveState()
  await renderPreview()
  updateProgress()
  updateATSScore()

  // Scroll to preview on mobile
  if (window.innerWidth <= 768) {
    const preview = document.getElementById("previewContent")
    if (preview) {
      preview.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }
  }
}

async function renderPreview() {
  const template = uiSettings.atsMode ? "ats-friendly" : uiSettings.template
  const templatePath = `templates/${template}.html`

  try {
    const response = await fetch(templatePath)
    if (!response.ok) throw new Error(`Template not found: ${templatePath}`)
    const templateHtml = await response.text()

    const previewContent = document.getElementById("previewContent")
    if (previewContent) {
      previewContent.innerHTML = templateHtml
      populateTemplate()
      applyCustomizations()
    }
  } catch (error) {
    console.error("Error loading template:", error)
    const previewContent = document.getElementById("previewContent")
    if (previewContent) {
      previewContent.innerHTML = `<div class="error-message">Could not load template: ${template}.html</div>`
    }
  }
}

function populateTemplate() {
  const { personal, experience, education, skills, additional } = resumeData
  const doc = document.getElementById("previewContent")
  if (!doc) return

  const setText = (id, text) => {
    const el = doc.querySelector(`#${id}`)
    if (el) el.textContent = text || ""
  }

  const setHtml = (id, html) => {
    const el = doc.querySelector(`#${id}`)
    if (el) el.innerHTML = html || ""
  }

  // Personal Information
  setText("previewName", personal.fullName)
  setText("previewJobTitle", personal.jobTitle)
  setText("previewEmail", personal.email)
  setText("previewPhone", personal.phone)
  setText("previewLocation", personal.location)
  setText("previewSummary", personal.summary)

  // LinkedIn
  const linkedInEl = doc.querySelector("#previewLinkedIn")
  if (linkedInEl && personal.linkedin) {
    const cleanUrl = personal.linkedin.replace(/^https?:\/\//, "")
    linkedInEl.innerHTML = `<a href="https://${cleanUrl}" target="_blank">${cleanUrl}</a>`
  }

  // Profile Photo
  const photoEl = doc.querySelector("#profilePhoto")
  if (photoEl && personal.photo) {
    photoEl.style.backgroundImage = `url(${personal.photo})`
    photoEl.style.backgroundSize = "cover"
    photoEl.style.backgroundPosition = "center"
  }

  // Experience - FIXED
  const expHtml = experience
    .map((exp) => {
      const startDate = exp.startDate ? formatDate(exp.startDate) : ""
      const endDate = exp.endDate ? formatDate(exp.endDate) : "Present"
      const dateRange = startDate ? `${startDate} - ${endDate}` : ""

      return `
      <div class="experience-entry">
        <div class="entry-header">
          <h4 class="entry-title">${exp.title || ""}</h4>
          <span class="entry-company">${exp.company || ""}</span>
          <span class="entry-dates">${dateRange}</span>
        </div>
        <div class="entry-description">${formatDescription(exp.description || "")}</div>
      </div>
    `
    })
    .join("")
  setHtml("previewExperience", expHtml)

  // Education - FIXED
  const eduHtml = education
    .map(
      (edu) => `
    <div class="education-entry">
      <div class="entry-header">
        <h4 class="entry-title">${edu.degree || ""}</h4>
        <span class="entry-school">${edu.school || ""}</span>
        <span class="entry-dates">${edu.year || ""}</span>
      </div>
    </div>
  `,
    )
    .join("")
  setHtml("previewEducation", eduHtml)

  // Skills - FIXED
  const technicalSkills = skills.technical
    ? skills.technical
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : []
  const softSkills = skills.soft
    ? skills.soft
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : []
  const allSkills = [...technicalSkills, ...softSkills]

  const skillsHtml = allSkills.map((skill) => `<span class="skill-tag">${skill}</span>`).join("")
  setHtml("previewSkills", skillsHtml)

  // Languages - FIXED
  const languagesHtml = skills.languages
    ? skills.languages
        .split(",")
        .map((lang) => `<span class="skill-tag">${lang.trim()}</span>`)
        .join("")
    : ""
  setHtml("previewLanguages", languagesHtml)

  // Additional Sections - FIXED
  const createListHtml = (text) =>
    text
      ? text
          .split("\n")
          .filter(Boolean)
          .map((item) => `<li>${item.trim()}</li>`)
          .join("")
      : ""

  setHtml("previewCertifications", createListHtml(additional.certifications))
  setHtml("previewProjects", createListHtml(additional.projects))
  setHtml("previewAwards", createListHtml(additional.awards))
  setHtml("previewVolunteer", createListHtml(additional.volunteer))
}

function formatDate(dateString) {
  if (!dateString) return ""
  const date = new Date(dateString + "-01") // Add day for month input
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

function formatDescription(description) {
  return description.replace(/\n/g, "<br>")
}

function applyCustomizations() {
  const preview = document.querySelector("#previewContent .resume-template")
  if (!preview) return

  preview.style.setProperty("--primary-color", uiSettings.color)

  const fontMap = {
    inter: "'Inter', sans-serif",
    playfair: "'Playfair Display', serif",
    system: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
  }
  preview.style.fontFamily = fontMap[uiSettings.font] || fontMap.inter
}

// --- COVER LETTER FUNCTIONALITY ---
function updateCoverPreview() {
  collectDataFromForm()

  const { personal } = resumeData
  const { jobTitle, company, manager, fit, additional } = coverLetterData

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const managerName = manager || "Hiring Manager"
  const greeting = manager ? `Dear ${manager},` : "Dear Hiring Team,"

  const coverPreview = document.getElementById("coverPreview")
  if (coverPreview) {
    coverPreview.innerHTML = `
      <div class="cover-letter-content">
        <div class="cover-header">
          <h2>${personal.fullName || "Your Name"}</h2>
          <div class="cover-contact">
            ${personal.email || "your.email@example.com"} | 
            ${personal.phone || "(555) 555-5555"} | 
            ${personal.location || "Your Location"}
          </div>
        </div>
        
        <div class="cover-date">${currentDate}</div>
        
        <div class="cover-recipient">
          <p>${managerName}</p>
          <p>${company || "Company Name"}</p>
        </div>
        
        <div class="cover-subject">
          <p><strong>RE: Application for ${jobTitle || "Position Title"}</strong></p>
        </div>
        
        <div class="cover-body">
          <p>${greeting}</p>
          
          <p>I am writing to express my strong interest in the ${jobTitle || "position"} role at ${company || "your company"}. ${fit || "Please add why you're a perfect fit for this role."}</p>
          
          ${additional ? `<p>${additional}</p>` : ""}
          
          <p>I would welcome the opportunity to discuss how my background and enthusiasm can contribute to ${company || "your team"}'s continued success. Thank you for considering my application.</p>
          
          <p>Sincerely,<br>${personal.fullName || "Your Name"}</p>
        </div>
      </div>
    `
  }
}

function downloadCoverLetterPDF() {
  const element = document.getElementById("coverPreview")
  if (!element) {
    alert("Please generate cover letter preview first")
    return
  }

  const name = resumeData.personal.fullName || "Your Name"
  const company = coverLetterData.company || "Company"

  const opt = {
    margin: 0.5,
    filename: `${name} - Cover Letter - ${company}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  }

  loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js").then(() => {
    window.html2pdf().set(opt).from(element).save()
  })
}

function generateAICover() {
  alert("AI Assist feature coming soon!")
}

function toggleCoverLetter() {
  uiSettings.showCoverLetter = !uiSettings.showCoverLetter
  const button = document.getElementById("coverLetterToggle")

  if (uiSettings.showCoverLetter) {
    showTab("coverletter")
    if (button) button.textContent = "Hide Cover Letter"
  } else {
    showTab("personal")
    if (button) button.textContent = "Generate Cover Letter"
  }

  saveState()
}

// Selected Resumes Functions
function loadTCSResume() {
  loadSelectedResume("tcs")
}

function loadInfosysResume() {
  loadSelectedResume("infosys")
}

function loadZohoResume() {
  loadSelectedResume("zoho")
}

function loadSelectedResume(resumeKey) {
  if (!selectedResumes[resumeKey]) return

  const selectedData = selectedResumes[resumeKey]

  // Confirm before overwriting existing data
  if (hasExistingData()) {
    if (!confirm("This will replace your current resume data. Are you sure you want to continue?")) {
      return
    }
  }

  // Load the selected resume data
  resumeData = JSON.parse(JSON.stringify(selectedData)) // Deep copy

  // Navigate to form page if on landing page
  if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
    window.location.href = "form.html"
    return
  }

  // Populate form and update preview
  populateForm()
  updatePreview()
  updateCoverPreview()

  // Show success message
  showSuccessMessage(`✅ Resume template loaded successfully! You can now customize it with your details.`)

  // Scroll to top of form
  document.querySelector(".form-container").scrollIntoView({ behavior: "smooth" })
}

function previewResume(resumeKey) {
  if (!selectedResumes[resumeKey]) return

  currentPreviewedResume = resumeKey
  const resumeData = selectedResumes[resumeKey]

  // Generate preview HTML
  const previewHTML = generateResumePreviewHTML(resumeData)

  // Show in modal
  const modal = document.getElementById("resumePreviewModal")
  const content = document.getElementById("resumePreviewContent")

  if (modal && content) {
    content.innerHTML = previewHTML
    modal.style.display = "block"
  }
}

function generateResumePreviewHTML(data) {
  return `
    <div class="resume-preview-wrapper">
      <div class="resume-template modern-template">
        <div class="resume-header">
          <div class="profile-section">
            <div class="profile-info">
              <h1 class="name">${data.personal.fullName}</h1>
              <div class="job-title">${data.personal.jobTitle}</div>
              <div class="contact-info">
                <span>${data.personal.email}</span>
                <span>${data.personal.phone}</span>
                <span>${data.personal.location}</span>
              </div>
            </div>
          </div>
          <div class="summary-section">
            <p class="summary-text">${data.personal.summary}</p>
          </div>
        </div>
        
        <div class="resume-body">
          <div class="resume-section">
            <h2 class="section-title">Experience</h2>
            ${data.experience
              .map(
                (exp) => `
              <div class="experience-entry">
                <div class="entry-header">
                  <h4 class="entry-title">${exp.title}</h4>
                  <span class="entry-company">${exp.company}</span>
                  <span class="entry-dates">${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : "Present"}</span>
                </div>
                <div class="entry-description">${exp.description.replace(/\n/g, "<br>")}</div>
              </div>
            `,
              )
              .join("")}
          </div>
          
          <div class="resume-section">
            <h2 class="section-title">Education</h2>
            ${data.education
              .map(
                (edu) => `
              <div class="education-entry">
                <div class="entry-header">
                  <h4 class="entry-title">${edu.degree}</h4>
                  <span class="entry-school">${edu.school}</span>
                  <span class="entry-dates">${edu.year}</span>
                </div>
              </div>
            `,
              )
              .join("")}
          </div>
          
          <div class="resume-section">
            <h2 class="section-title">Skills</h2>
            <div class="skills-list">
              ${data.skills.technical
                .split(",")
                .map((skill) => `<span class="skill-tag">${skill.trim()}</span>`)
                .join("")}
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

function usePreviewedResume() {
  if (currentPreviewedResume) {
    closeResumePreview()
    loadSelectedResume(currentPreviewedResume)
  }
}

function closeResumePreview() {
  const modal = document.getElementById("resumePreviewModal")
  if (modal) {
    modal.style.display = "none"
  }
  currentPreviewedResume = null
}

function hasExistingData() {
  return (
    resumeData.personal.fullName ||
    resumeData.personal.email ||
    resumeData.experience.length > 0 ||
    resumeData.education.length > 0
  )
}

function showSuccessMessage(message) {
  // Create and show success toast
  const toast = document.createElement("div")
  toast.className = "success-toast"
  toast.textContent = message
  document.body.appendChild(toast)

  // Show toast
  setTimeout(() => toast.classList.add("show"), 100)

  // Hide and remove toast
  setTimeout(() => {
    toast.classList.remove("show")
    setTimeout(() => document.body.removeChild(toast), 300)
  }, 4000)
}

// Enhanced auto-save with better error handling
function enhancedAutoSave() {
  try {
    const saveData = {
      resumeData,
      coverLetterData,
      uiSettings,
      timestamp: Date.now(),
      version: "2.0",
    }

    localStorage.setItem("cmr_autosave", JSON.stringify(saveData))
    localStorage.setItem("cmr_backup", JSON.stringify(saveData)) // Backup copy

    // Show subtle save indicator
    showSaveIndicator()
  } catch (error) {
    console.warn("Auto-save failed:", error)
    // Try to free up space by removing old data
    try {
      localStorage.removeItem("cmr_old_data")
      localStorage.setItem(
        "cmr_autosave",
        JSON.stringify({
          resumeData,
          coverLetterData,
          uiSettings,
          timestamp: Date.now(),
        }),
      )
    } catch (secondError) {
      console.error("Critical: Unable to save data", secondError)
    }
  }
}

function showSaveIndicator() {
  const indicator = document.createElement("div")
  indicator.className = "save-indicator"
  indicator.innerHTML = "💾 Saved"
  document.body.appendChild(indicator)

  setTimeout(() => indicator.classList.add("show"), 100)
  setTimeout(() => {
    indicator.classList.remove("show")
    setTimeout(() => {
      if (document.body.contains(indicator)) {
        document.body.removeChild(indicator)
      }
    }, 300)
  }, 2000)
}

// Override the existing autoSaveData function
function autoSaveData() {
  enhancedAutoSave()
}

// Initialize quit bot when page loads
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".builder-container")) {
    initializeQuitBot()
  }
})

// --- ATS OPTIMIZER ---
function updateATSScore() {
  let score = 0
  const tips = []

  // Personal information scoring
  if (resumeData.personal.fullName) score += 10
  else tips.push("Add your full name")

  if (resumeData.personal.email) score += 10
  else tips.push("Add your email address")

  if (resumeData.personal.phone) score += 10
  else tips.push("Add your phone number")

  if (resumeData.personal.location) score += 5
  else tips.push("Add your location")

  // Summary scoring
  if (resumeData.personal.summary) {
    if (resumeData.personal.summary.length > 50) score += 15
    else tips.push("Write a longer professional summary (50+ characters)")
  } else {
    tips.push("Add a professional summary")
  }

  // Experience scoring
  if (resumeData.experience.length > 0) {
    score += 20
    if (resumeData.experience.length >= 2) score += 5
  } else {
    tips.push("Add at least one work experience")
  }

  // Education scoring
  if (resumeData.education.length > 0) score += 15
  else tips.push("Add your education background")

  // Skills scoring
  if (resumeData.skills.technical) score += 10
  else tips.push("Add technical skills")

  if (resumeData.skills.soft) score += 5
  else tips.push("Add soft skills")

  // Additional content scoring
  if (resumeData.additional.certifications) score += 5
  if (resumeData.additional.projects) score += 5

  // Bonus points
  if (resumeData.personal.linkedin) score += 5
  if (resumeData.skills.languages) score += 5

  atsScore = Math.min(score, 100)

  // Update UI
  const scoreElement = document.getElementById("atsScore")
  const tipsElement = document.getElementById("atsTips")

  if (scoreElement) {
    scoreElement.textContent = atsScore
    scoreElement.parentElement.className = `ats-score-circle ${getScoreClass(atsScore)}`
  }

  if (tipsElement) {
    if (tips.length === 0) {
      tipsElement.innerHTML = '<div class="ats-tip success">Great! Your resume is ATS optimized</div>'
    } else {
      tipsElement.innerHTML = tips
        .slice(0, 3)
        .map((tip) => `<div class="ats-tip">${tip}</div>`)
        .join("")
    }
  }
}

function getScoreClass(score) {
  if (score >= 80) return "excellent"
  if (score >= 60) return "good"
  if (score >= 40) return "fair"
  return "poor"
}

// --- AUTO-SAVE FUNCTIONALITY ---
// function autoSaveData() {
//   enhancedAutoSave()
// }

function loadAutoSavedData() {
  try {
    const saved = localStorage.getItem("cmr_autosave")
    if (saved) {
      const data = JSON.parse(saved)

      // Only load if data is less than 7 days old
      if (Date.now() - data.timestamp < 7 * 24 * 60 * 60 * 1000) {
        resumeData = { ...resumeData, ...data.resumeData }
        coverLetterData = { ...coverLetterData, ...data.coverLetterData }
        uiSettings = { ...uiSettings, ...data.uiSettings }
      }
    }
  } catch (error) {
    console.warn("Failed to load auto-saved data:", error)
  }
}

function clearDraft() {
  if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
    localStorage.removeItem("cmr_autosave")
    localStorage.removeItem("resumeData")
    localStorage.removeItem("uiSettings")
    localStorage.removeItem("coverLetterData")
    location.reload()
  }
}

// --- ENHANCED DYNAMIC FORM ELEMENTS ---
function addExperience(data = {}) {
  const id = data.id || `exp-${Date.now()}`
  const list = document.getElementById("experienceList")
  if (!list) return

  const item = document.createElement("div")
  item.className = "experience-item animate-slide-in"
  item.dataset.id = id
  item.innerHTML = `
    <div class="item-header">
      <h4 class="item-title">${data.title || "New Experience"}</h4>
      <button type="button" class="btn-remove" onclick="removeExperience('${id}')">&times;</button>
    </div>
    <div class="form-grid">
      <div class="form-group">
        <label>Job Title *</label>
        <input type="text" data-field="title" value="${data.title || ""}" required>
      </div>
      <div class="form-group">
        <label>Company *</label>
        <input type="text" data-field="company" value="${data.company || ""}" required>
      </div>
      <div class="form-group">
        <label>Start Date *</label>
        <input type="month" data-field="startDate" value="${data.startDate || ""}" required>
      </div>
      <div class="form-group">
        <label>End Date (leave empty for current)</label>
        <input type="month" data-field="endDate" value="${data.endDate || ""}">
      </div>
      <div class="form-group full-width">
        <label>Description (use bullet points) *</label>
        <textarea data-field="description" placeholder="• Achieved X by doing Y&#10;• Improved Z by N%&#10;• Led team of N people" required>${data.description || ""}</textarea>
      </div>
    </div>
  `
  list.appendChild(item)

  // Add input listeners to new elements
  item.querySelectorAll("input, textarea").forEach((input) => {
    input.addEventListener("input", debounce(updatePreview, 300))
  })
}

function removeExperience(id) {
  const item = document.querySelector(`.experience-item[data-id="${id}"]`)
  if (item) {
    item.remove()
    updatePreview()
  }
}

function addEducation(data = {}) {
  const id = data.id || `edu-${Date.now()}`
  const list = document.getElementById("educationList")
  if (!list) return

  const item = document.createElement("div")
  item.className = "education-item animate-slide-in"
  item.dataset.id = id
  item.innerHTML = `
    <div class="item-header">
      <h4 class="item-title">${data.degree || "New Education"}</h4>
      <button type="button" class="btn-remove" onclick="removeEducation('${id}')">&times;</button>
    </div>
    <div class="form-grid">
      <div class="form-group">
        <label>Degree / Certificate *</label>
        <input type="text" data-field="degree" value="${data.degree || ""}" required>
      </div>
      <div class="form-group">
        <label>School / Institution *</label>
        <input type="text" data-field="school" value="${data.school || ""}" required>
      </div>
      <div class="form-group">
        <label>Year of Completion *</label>
        <input type="text" data-field="year" value="${data.year || ""}" placeholder="2023" required>
      </div>
    </div>
  `
  list.appendChild(item)

  // Add input listeners to new elements
  item.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", debounce(updatePreview, 300))
  })
}

function removeEducation(id) {
  const item = document.querySelector(`.education-item[data-id="${id}"]`)
  if (item) {
    item.remove()
    updatePreview()
  }
}

// --- ENHANCED ACTIONS ---
function downloadPDF() {
  const element = document.querySelector("#previewContent .resume-template")
  if (!element) {
    alert("Please wait for the preview to load")
    return
  }

  const filename = `${resumeData.personal.fullName || "Resume"}.pdf`
  const opt = {
    margin: 0.2,
    filename: filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  }

  loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js").then(() => {
    window.html2pdf().set(opt).from(element).save()
  })
}

function exportData() {
  const exportData = {
    resumeData,
    coverLetterData,
    uiSettings,
    exportDate: new Date().toISOString(),
  }

  const dataStr = JSON.stringify(exportData, null, 2)
  const blob = new Blob([dataStr], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${resumeData.personal.fullName || "resume"}-data.json`
  a.click()
  URL.revokeObjectURL(url)
}

function importData(event) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const importedData = JSON.parse(e.target.result)

      if (importedData.resumeData) {
        resumeData = { ...resumeData, ...importedData.resumeData }
      }
      if (importedData.coverLetterData) {
        coverLetterData = { ...coverLetterData, ...importedData.coverLetterData }
      }
      if (importedData.uiSettings) {
        uiSettings = { ...uiSettings, ...importedData.uiSettings }
      }

      populateForm()
      updatePreview()
      updateCoverPreview()
      alert("Data imported successfully!")
    } catch (err) {
      alert("Error importing file. Please ensure it's a valid JSON file.")
    }
  }
  reader.readAsText(file)
}

function loadSampleData() {
  if (!confirm("This will replace your current data. Are you sure?")) return

  resumeData = {
    personal: {
      fullName: "Jane Doe",
      jobTitle: "Senior Product Manager",
      email: "jane.doe@example.com",
      phone: "(123) 456-7890",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/janedoe",
      summary:
        "Results-driven Senior Product Manager with over 8 years of experience in delivering innovative and user-centric products from conception to launch. Proven ability to lead cross-functional teams and manage product lifecycles in fast-paced, agile environments.",
      photo: "",
    },
    experience: [
      {
        id: "exp-1",
        title: "Senior Product Manager",
        company: "Tech Solutions Inc.",
        startDate: "2018-06",
        endDate: "",
        description:
          "• Led the development of a new SaaS platform, resulting in a 30% increase in user engagement\n• Managed a team of 5 product managers and designers\n• Defined product strategy and roadmap based on market research and user feedback",
      },
      {
        id: "exp-2",
        title: "Product Manager",
        company: "StartupCorp",
        startDate: "2016-03",
        endDate: "2018-05",
        description:
          "• Launched 3 major product features that increased user retention by 25%\n• Collaborated with engineering teams to deliver products on time and within budget\n• Conducted user research and A/B testing to optimize product performance",
      },
    ],
    education: [
      {
        id: "edu-1",
        degree: "MBA, Business Administration",
        school: "Stanford University",
        year: "2016",
      },
      {
        id: "edu-2",
        degree: "BS, Computer Science",
        school: "UC Berkeley",
        year: "2014",
      },
    ],
    skills: {
      technical: "Agile Methodologies, JIRA, Confluence, SQL, Market Research, A/B Testing",
      soft: "Leadership, Strategic Planning, Communication, User-Centered Design, Team Management",
      languages: "English (Native), Spanish (Conversational), French (Basic)",
    },
    additional: {
      certifications: "Certified Scrum Product Owner (CSPO)\nGoogle Analytics Certified",
      projects:
        "E-commerce Platform - Led development of full-stack platform serving 10k+ users\nMobile App - Designed and launched iOS/Android app with 4.8 star rating",
      awards: "Product of the Year Award 2021\nEmployee Excellence Award 2020",
      volunteer: "Volunteer Web Developer at Local Non-profit (2022-Present)",
    },
  }

  coverLetterData = {
    jobTitle: "Senior Product Manager",
    company: "Google",
    manager: "Sarah Johnson",
    fit: "With over 8 years of product management experience and a proven track record of launching successful products, I am excited about the opportunity to contribute to Google's innovative product ecosystem. My experience in leading cross-functional teams and driving user-centric product development aligns perfectly with this role.",
    additional:
      "I am particularly drawn to Google's mission of organizing the world's information and making it universally accessible. I would love to discuss how my background in SaaS platforms and mobile applications can contribute to your team's success.",
  }

  populateForm()
  updatePreview()
  updateCoverPreview()
}

// --- UI & THEME ENHANCEMENTS ---
function toggleTheme() {
  uiSettings.theme = uiSettings.theme === "light" ? "dark" : "light"
  updateTheme()
  saveState()
}

function updateTheme() {
  document.documentElement.dataset.theme = uiSettings.theme
  document.querySelectorAll(".theme-icon").forEach((icon) => {
    icon.textContent = uiSettings.theme === "light" ? "🌙" : "☀️"
  })
}

function changeTemplate() {
  const select = document.getElementById("templateSelect")
  if (select) {
    uiSettings.template = select.value
    updatePreview()
    saveState()
  }
}

function changeFont() {
  const select = document.getElementById("fontSelect")
  if (select) {
    uiSettings.font = select.value
    updatePreview()
    saveState()
  }
}

function changeColor(color) {
  uiSettings.color = color
  document.querySelector(".color-btn.active")?.classList.remove("active")
  document.querySelector(`.color-btn[data-color="${color}"]`)?.classList.add("active")
  updatePreview()
  saveState()
}

function toggleATSMode() {
  uiSettings.atsMode = !uiSettings.atsMode
  const toggle = document.getElementById("atsToggle")
  if (toggle) {
    toggle.classList.toggle("active", uiSettings.atsMode)
  }
  updatePreview()
  saveState()
}

function showTab(tabName) {
  // Remove active class from all tabs and content
  document.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"))
  document.querySelectorAll(".tab-content").forEach((content) => content.classList.remove("active"))

  // Add active class to selected tab and content
  const tabBtn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`)
  const tabContent = document.getElementById(tabName)

  if (tabBtn) tabBtn.classList.add("active")
  if (tabContent) tabContent.classList.add("active")

  // Update form validation
  validateCurrentTab(tabName)
}

function validateCurrentTab(tabName) {
  const tabContent = document.getElementById(tabName)
  if (!tabContent) return

  const requiredFields = tabContent.querySelectorAll("[required]")
  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      field.classList.add("error")
    } else {
      field.classList.remove("error")
    }
  })
}

function handlePhotoUpload(event) {
  const file = event.target.files[0]
  if (file) {
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Photo size must be less than 2MB")
      return
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      resumeData.personal.photo = e.target.result
      const preview = document.getElementById("photoPreview")
      if (preview) {
        preview.style.backgroundImage = `url(${resumeData.personal.photo})`
        preview.classList.add("has-image")
      }
      updatePreview()
      autoSaveData()
    }
    reader.readAsDataURL(file)
  }
}

function updateProgress() {
  let completed = 0
  const total = 8 // Updated total sections

  if (resumeData.personal.fullName && resumeData.personal.email && resumeData.personal.phone) completed++
  if (resumeData.personal.summary && resumeData.personal.summary.length > 20) completed++
  if (resumeData.experience.length > 0) completed++
  if (resumeData.education.length > 0) completed++
  if (resumeData.skills.technical) completed++
  if (resumeData.skills.soft) completed++
  if (resumeData.skills.languages) completed++
  if (resumeData.additional.certifications || resumeData.additional.projects) completed++

  const percentage = Math.round((completed / total) * 100)
  const progressFill = document.getElementById("progressFill")
  const progressText = document.getElementById("progressText")

  if (progressFill) progressFill.style.width = `${percentage}%`
  if (progressText) progressText.textContent = `${percentage}% Complete`
}

// --- MULTILINGUAL SUPPORT ---
function setupLanguage() {
  const selector = document.getElementById("languageSelector")
  if (selector) {
    selector.value = uiSettings.language
    updateLanguage()
  }
}

function changeLanguage() {
  const selector = document.getElementById("languageSelector")
  if (selector) {
    uiSettings.language = selector.value
    updateLanguage()
    saveState()
  }
}

function updateLanguage() {
  const lang = uiSettings.language
  const elements = document.querySelectorAll("[data-i18n]")

  elements.forEach((element) => {
    const key = element.getAttribute("data-i18n")
    if (translations[lang] && translations[lang][key]) {
      element.textContent = translations[lang][key]
    }
  })
}

// --- OFFLINE SUPPORT ---
function initializeOfflineDetection() {
  const indicator = document.getElementById("offlineIndicator")

  function updateOnlineStatus() {
    if (indicator) {
      if (navigator.onLine) {
        indicator.classList.add("hidden")
      } else {
        indicator.classList.remove("hidden")
      }
    }
  }

  window.addEventListener("online", updateOnlineStatus)
  window.addEventListener("offline", updateOnlineStatus)
  updateOnlineStatus()
}

// --- UTILITY FUNCTIONS ---
function debounce(func, wait) {
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(debounceTimer)
      func(...args)
    }
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(later, wait)
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve()
      return
    }

    const script = document.createElement("script")
    script.src = src
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

function saveState() {
  try {
    localStorage.setItem("resumeData", JSON.stringify(resumeData))
    localStorage.setItem("uiSettings", JSON.stringify(uiSettings))
    localStorage.setItem("coverLetterData", JSON.stringify(coverLetterData))
  } catch (error) {
    console.warn("Failed to save state:", error)
  }
}

function loadState() {
  try {
    const savedResumeData = localStorage.getItem("resumeData")
    const savedUISettings = localStorage.getItem("uiSettings")
    const savedCoverData = localStorage.getItem("coverLetterData")

    if (savedResumeData) resumeData = { ...resumeData, ...JSON.parse(savedResumeData) }
    if (savedUISettings) uiSettings = { ...uiSettings, ...JSON.parse(savedUISettings) }
    if (savedCoverData) coverLetterData = { ...coverLetterData, ...JSON.parse(savedCoverData) }
  } catch (error) {
    console.warn("Failed to load state:", error)
  }
}

// --- ANALYZER FUNCTIONS (Enhanced) ---
function analyzeResume() {
  updateATSScore() // Update score first

  const modal = document.getElementById("analyzerModal")
  if (!modal) return

  const suggestions = []

  // Detailed analysis
  if (!resumeData.personal.fullName) suggestions.push("Add your full name")
  if (!resumeData.personal.email) suggestions.push("Add your email address")
  if (!resumeData.personal.phone) suggestions.push("Add your phone number")
  if (!resumeData.personal.summary || resumeData.personal.summary.length < 50) {
    suggestions.push("Write a compelling professional summary (50+ characters)")
  }
  if (resumeData.experience.length === 0) suggestions.push("Add at least one work experience")
  if (resumeData.education.length === 0) suggestions.push("Add your education background")
  if (!resumeData.skills.technical) suggestions.push("List your technical skills")
  if (!resumeData.skills.soft) suggestions.push("Add soft skills")
  if (!resumeData.personal.linkedin) suggestions.push("Add your LinkedIn profile")

  // Update modal content
  const scoreValue = document.getElementById("scoreValue")
  const suggestionsList = document.getElementById("suggestionsList")

  if (scoreValue) {
    scoreValue.textContent = atsScore
    const circle = scoreValue.closest(".score-circle")
    if (circle) {
      circle.style.background = `conic-gradient(var(--primary-color) ${atsScore}%, #e5e7eb ${atsScore}%)`
    }
  }

  if (suggestionsList) {
    suggestionsList.innerHTML =
      suggestions.length > 0
        ? suggestions.map((s) => `<li>${s}</li>`).join("")
        : "<li>Excellent! Your resume is well-optimized.</li>"
  }

  modal.style.display = "block"
}

function closeAnalyzer() {
  const modal = document.getElementById("analyzerModal")
  if (modal) {
    modal.style.display = "none"
  }
}

// Make functions globally available
window.toggleTheme = toggleTheme
window.changeTemplate = changeTemplate
window.changeFont = changeFont
window.changeColor = changeColor
window.toggleATSMode = toggleATSMode
window.showTab = showTab
window.addExperience = addExperience
window.removeExperience = removeExperience
window.addEducation = addEducation
window.removeEducation = removeEducation
window.handlePhotoUpload = handlePhotoUpload
window.downloadPDF = downloadPDF
window.exportData = exportData
window.importData = importData
window.loadSampleData = loadSampleData
window.analyzeResume = analyzeResume
window.closeAnalyzer = closeAnalyzer
window.updateCoverPreview = updateCoverPreview
window.downloadCoverLetterPDF = downloadCoverLetterPDF
window.toggleCoverLetter = toggleCoverLetter
window.changeLanguage = changeLanguage
window.clearDraft = clearDraft
window.loadTCSResume = loadTCSResume
window.loadInfosysResume = loadInfosysResume
window.loadZohoResume = loadZohoResume
window.previewResume = previewResume
window.usePreviewedResume = usePreviewedResume
window.closeResumePreview = closeResumePreview
window.continueBuilding = continueBuilding
window.generateCoverLetter = generateCoverLetter
window.loadQuickTips = loadQuickTips
window.closeQuitBot = closeQuitBot
