# Resume Update Guide

## 📝 Where to Update Your Resume Details

### 1. **Main Configuration File**: `assets/js/resume-config.js`

This is the **ONLY** file you need to edit to update your resume information. All your detailed career data is stored here.

#### **Personal Information**
```javascript
personalInfo: {
  name: "Your Name",
  title: "Your Professional Title",
  email: "your.email@example.com",
  phone: "your-phone-number",
  location: "Your City, State",
  linkedin: "linkedin.com/in/yourprofile"
}
```

#### **Professional Summary**
```javascript
summary: "Your professional summary paragraph..."
```

#### **Detailed Experience** (This is the most important section)
For each job, add comprehensive details:

```javascript
{
  title: "Your Job Title",
  company: "Company Name",
  location: "City, State",
  duration: "Start Date – End Date",
  detailedInfo: `
    Role: Brief description of your role
    
    Key Responsibilities:
    - Responsibility 1
    - Responsibility 2
    - Responsibility 3
    
    Technical Skills Used:
    - Skill 1
    - Skill 2
    - Skill 3
    
    Achievements:
    - Achievement 1 with metrics
    - Achievement 2 with metrics
    - Achievement 3 with metrics
    
    Industry Knowledge:
    - Industry knowledge 1
    - Industry knowledge 2
  `,
  currentAchievements: [
    "Current bullet point 1",
    "Current bullet point 2",
    "Current bullet point 3"
  ]
}
```

#### **Skills List**
```javascript
baseSkills: [
  "Skill 1",
  "Skill 2",
  "Skill 3"
]
```

#### **Education**
```javascript
education: [
  {
    degree: "Your Degree",
    school: "University Name",
    location: "City, State",
    year: "Start Year – End Year",
    gpa: "Your GPA"
  }
]
```

#### **Certifications**
```javascript
certifications: [
  "Certification 1",
  "Certification 2",
  "Certification 3"
]
```

## 🤖 AI Configuration and Restrictions

### **Content Limits** (in `resume-config.js`)
```javascript
const AI_CONFIG = {
  maxWordsPerPoint: 100,        // Maximum words per bullet point
  maxPointsPerExperience: 5,    // Maximum bullet points per job
  minPointsPerExperience: 3,    // Minimum bullet points per job
}
```

### **Style Guidelines**
```javascript
styleGuidelines: [
  "Keep each bullet point concise and under 100 words",
  "Limit each experience to maximum 5 bullet points",
  "Do not embellish or exaggerate achievements",
  "Use specific metrics and numbers when available",
  "Focus on quantifiable results and impact",
  "Use action verbs to start each bullet point",
  "Maintain professional tone throughout",
  "Ensure authenticity - only include verifiable achievements"
]
```

## 🎯 What Gets Modified vs. What Stays the Same

### **✅ ONLY These Sections Change:**
- **Skills section** - Reordered and filtered based on job requirements
- **Experience bullet points** - Tailored to match job description
- **Job titles, companies, locations, durations** - **NEVER CHANGE**

### **🔒 These Sections NEVER Change:**
- Personal information (name, email, phone, location)
- Professional summary
- Education details
- Certifications
- Job titles, companies, locations, durations

## 📋 How to Add New Job Experience

1. **Open** `assets/js/resume-config.js`
2. **Find** the `detailedExperience` array
3. **Add** a new job object with all the detailed information:

```javascript
{
  title: "New Job Title",
  company: "New Company",
  location: "New Location",
  duration: "New Duration",
  detailedInfo: `
    // Add comprehensive details here
    // Include responsibilities, skills, achievements, industry knowledge
  `,
  currentAchievements: [
    // Add current bullet points here
  ]
}
```

## 🔧 How to Modify AI Restrictions

To change how the AI generates your resume:

1. **Open** `assets/js/resume-config.js`
2. **Find** the `AI_CONFIG` section
3. **Modify** the values:

```javascript
const AI_CONFIG = {
  maxWordsPerPoint: 150,        // Increase word limit
  maxPointsPerExperience: 6,    // Allow more bullet points
  minPointsPerExperience: 2,    // Allow fewer bullet points
  
  styleGuidelines: [
    // Add or modify style guidelines
    "Your custom guideline here"
  ]
}
```

## 🚀 Testing Your Changes

1. **Save** the `resume-config.js` file
2. **Refresh** your browser at `http://localhost:8000/resume/`
3. **Paste** a job description
4. **Generate** the resume to see your changes

## 💡 Pro Tips

1. **Be Detailed**: The more information you provide in `detailedInfo`, the better the AI can tailor your resume
2. **Include Metrics**: Always include specific numbers, percentages, and quantifiable results
3. **Update Regularly**: Keep your experience details current as you gain new skills and achievements
4. **Test Different Jobs**: Try generating resumes for different types of positions to see how the AI adapts

## 🔍 Example of Comprehensive Job Details

```javascript
{
  title: "Senior Data Analyst",
  company: "Tech Company Inc",
  location: "San Francisco, CA",
  duration: "Jan 2020 – Present",
  detailedInfo: `
    Role: Lead data analytics initiatives for a fast-growing tech company, managing a team of 3 analysts and driving data-driven decision making across multiple departments.
    
    Key Responsibilities:
    - Lead cross-functional analytics projects involving product, marketing, and operations teams
    - Develop and maintain automated reporting dashboards using Tableau and Python
    - Manage data pipeline architecture and ensure data quality and integrity
    - Mentor junior analysts and establish best practices for data analysis
    - Present insights and recommendations to C-level executives
    
    Technical Skills Used:
    - Python (Pandas, NumPy, Scikit-learn, Matplotlib, Seaborn)
    - SQL (PostgreSQL, MySQL, BigQuery)
    - Tableau and Power BI for data visualization
    - Apache Airflow for workflow orchestration
    - Git for version control
    - AWS (S3, Redshift, EC2) for cloud computing
    
    Achievements:
    - Increased data processing efficiency by 40% through automation
    - Reduced report generation time from 8 hours to 30 minutes
    - Identified $2M in cost savings opportunities through data analysis
    - Improved customer retention by 15% through predictive modeling
    - Led migration of legacy systems to cloud-based architecture
    
    Industry Knowledge:
    - SaaS business models and metrics
    - Customer lifecycle analytics
    - A/B testing and experimentation
    - Machine learning model deployment
    - Data governance and compliance (GDPR, CCPA)
  `,
  currentAchievements: [
    "Led cross-functional analytics projects that increased data processing efficiency by 40% and reduced report generation time from 8 hours to 30 minutes",
    "Developed predictive models that improved customer retention by 15% and identified $2M in cost savings opportunities",
    "Managed migration of legacy data systems to cloud-based architecture, improving scalability and reducing maintenance costs",
    "Mentored team of 3 junior analysts and established data analysis best practices across the organization"
  ]
}
```

This comprehensive approach ensures the AI has all the context it needs to create highly tailored, professional resume bullet points that match any job description while maintaining authenticity to your actual experience.
