// Resume Generator JavaScript

// Base resume data with detailed career information
const baseResumeData = {
  name: RESUME_CONFIG.personalInfo.name,
  title: RESUME_CONFIG.personalInfo.title,
  email: RESUME_CONFIG.personalInfo.email,
  phone: RESUME_CONFIG.personalInfo.phone,
  location: RESUME_CONFIG.personalInfo.location,
  linkedin: RESUME_CONFIG.personalInfo.linkedin,
  summary: RESUME_CONFIG.summary,
  
  // Detailed experience data for GPT analysis
  detailedExperience: RESUME_CONFIG.detailedExperience,
  
  // Base skills list
  skills: RESUME_CONFIG.baseSkills,
  
  // Education
  education: RESUME_CONFIG.education,
  
  // Certifications
  certifications: RESUME_CONFIG.certifications
};

// GPT API Integration for AI-powered resume optimization
class GPTResumeOptimizer {
  constructor() {
    this.apiKey = null; // Will be set by user
    this.apiEndpoint = 'https://api.openai.com/v1/chat/completions';
  }

  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  async generateTailoredResume(jobDescription, detailedExperience) {
    if (!this.apiKey) {
      throw new Error('API key not provided. Please set your GPT API key.');
    }

    const prompt = this.createPrompt(jobDescription, detailedExperience);
    
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert resume writer and ATS optimization specialist. Generate tailored resume bullet points that match job requirements while maintaining authenticity.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return this.parseGPTResponse(data.choices[0].message.content);
    } catch (error) {
      console.error('GPT API Error:', error);
      throw error;
    }
  }

  createPrompt(jobDescription, detailedExperience) {
    return `
Job Description:
${jobDescription}

Candidate's Detailed Experience:
${detailedExperience.map(exp => `
Position: ${exp.title} at ${exp.company} (${exp.duration})
${exp.detailedInfo}
`).join('\n')}

IMPORTANT RESTRICTIONS AND GUIDELINES:
${AI_CONFIG.styleGuidelines.map(guideline => `- ${guideline}`).join('\n')}

Content Limits:
- Maximum ${AI_CONFIG.maxWordsPerPoint} words per bullet point
- Maximum ${AI_CONFIG.maxPointsPerExperience} bullet points per experience
- Minimum ${AI_CONFIG.minPointsPerExperience} bullet points per experience

Instructions:
1. Analyze the job description and identify key requirements, skills, and keywords
2. For each position, generate tailored bullet points that:
   - Match the job requirements and keywords
   - Use specific metrics and achievements from the detailed experience
   - Are ATS-friendly and professional
   - Maintain authenticity to the candidate's actual experience
   - Follow the word and point limits strictly
3. Prioritize the most relevant experiences for the job
4. Use action verbs and quantify achievements where possible
5. DO NOT change job titles, companies, locations, or durations
6. ONLY modify the achievements/bullet points and skills section

Please respond with a JSON object in this format:
{
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name", 
      "location": "Location",
      "duration": "Duration",
      "achievements": [
        "Tailored bullet point 1 (under ${AI_CONFIG.maxWordsPerPoint} words)",
        "Tailored bullet point 2 (under ${AI_CONFIG.maxWordsPerPoint} words)",
        "Tailored bullet point 3 (under ${AI_CONFIG.maxWordsPerPoint} words)",
        "Tailored bullet point 4 (under ${AI_CONFIG.maxWordsPerPoint} words)"
      ]
    }
  ],
  "skills": [
    "Relevant skill 1",
    "Relevant skill 2",
    "Relevant skill 3"
  ]
}
`;
  }

  parseGPTResponse(response) {
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in GPT response');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed;
    } catch (error) {
      console.error('Error parsing GPT response:', error);
      throw new Error('Failed to parse GPT response. Please try again.');
    }
  }
}

// ATS keyword matching and optimization (fallback)
class ResumeOptimizer {
  constructor() {
    this.keywordWeights = {};
    this.skillSynonyms = {
      'python': ['python', 'pandas', 'matplotlib', 'data analysis', 'programming'],
      'sql': ['sql', 'database', 'mysql', 'postgresql', 'query'],
      'tableau': ['tableau', 'data visualization', 'dashboard', 'reporting'],
      'erp': ['erp', 'oracle netsuite', 'sap', 'enterprise resource planning'],
      'supply chain': ['supply chain', 'logistics', 'inventory', 'demand planning'],
      'project management': ['project management', 'pmp', 'agile', 'scrum', 'leadership'],
      'data analytics': ['data analytics', 'data analysis', 'business intelligence', 'insights'],
      'automation': ['automation', 'integration', 'api', 'edi', 'suitescripts']
    };
  }

  extractKeywords(jobDescription) {
    const text = jobDescription.toLowerCase();
    const keywords = {};
    
    // Extract technical skills
    Object.keys(this.skillSynonyms).forEach(skill => {
      this.skillSynonyms[skill].forEach(synonym => {
        const regex = new RegExp(`\\b${synonym}\\b`, 'gi');
        const matches = text.match(regex);
        if (matches) {
          keywords[skill] = (keywords[skill] || 0) + matches.length;
        }
      });
    });
    
    // Extract common job requirements
    const commonTerms = [
      'leadership', 'team', 'management', 'analytics', 'optimization',
      'implementation', 'integration', 'automation', 'reporting',
      'dashboard', 'visualization', 'database', 'cloud', 'aws', 'azure'
    ];
    
    commonTerms.forEach(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        keywords[term] = (keywords[term] || 0) + matches.length;
      }
    });
    
    return keywords;
  }

  optimizeResume(jobDescription) {
    const keywords = this.extractKeywords(jobDescription);
    const optimizedResume = JSON.parse(JSON.stringify(baseResumeData));
    
    // Keep summary as is - don't modify it
    // optimizedResume.summary = this.optimizeSummary(optimizedResume.summary, keywords);
    
    // Only optimize the bullet points (achievements) for each job
    // Keep job titles, companies, locations, and dates unchanged
    optimizedResume.experience = optimizedResume.experience.map(exp => ({
      ...exp, // Keep all original job details (title, company, location, duration)
      achievements: exp.achievements.map(achievement => 
        this.optimizeAchievement(achievement, keywords)
      )
    }));
    
    // Reorder skills based on relevance
    optimizedResume.skills = this.optimizeSkills(optimizedResume.skills, keywords);
    
    return optimizedResume;
  }

  optimizeSummary(summary, keywords) {
    // Add relevant keywords to summary if not present
    let optimizedSummary = summary;
    
    Object.keys(keywords).forEach(keyword => {
      if (keywords[keyword] > 0 && !optimizedSummary.toLowerCase().includes(keyword)) {
        // Add keyword naturally to summary
        if (keyword === 'leadership' && !optimizedSummary.includes('leadership')) {
          optimizedSummary = optimizedSummary.replace('team leadership', 'team leadership and strategic planning');
        }
      }
    });
    
    return optimizedSummary;
  }

  optimizeAchievement(achievement, keywords) {
    // Enhance achievements with relevant keywords
    let optimized = achievement;
    
    Object.keys(keywords).forEach(keyword => {
      if (keywords[keyword] > 1) {
        // High-frequency keywords get priority
        if (keyword === 'analytics' && !optimized.toLowerCase().includes('analytics')) {
          optimized = optimized.replace('data', 'data analytics');
        }
        if (keyword === 'automation' && !optimized.toLowerCase().includes('automation')) {
          optimized = optimized.replace('developed', 'developed and automated');
        }
      }
    });
    
    return optimized;
  }

  optimizeSkills(skills, keywords) {
    // Reorder skills based on keyword relevance
    const skillScores = skills.map(skill => {
      let score = 0;
      Object.keys(keywords).forEach(keyword => {
        if (skill.toLowerCase().includes(keyword)) {
          score += keywords[keyword];
        }
      });
      return { skill, score };
    });
    
    return skillScores
      .sort((a, b) => b.score - a.score)
      .map(item => item.skill);
  }
}

// LaTeX generator
class LaTeXGenerator {
  generateResume(resumeData) {
    // Helper function to escape LaTeX special characters
    const escapeLatex = (text) => {
      return text
        .replace(/\\/g, '\\textbackslash{}')
        .replace(/%/g, '\\%')
        .replace(/\$/g, '\\$')
        .replace(/&/g, '\\&')
        .replace(/#/g, '\\#')
        .replace(/\^/g, '\\textasciicircum{}')
        .replace(/_/g, '\\_')
        .replace(/\{/g, '\\{')
        .replace(/\}/g, '\\}')
        .replace(/~/g, '\\textasciitilde{}');
    };

    let latex = `\\documentclass[10pt, letterpaper]{article}

% Packages:
\\usepackage[
    ignoreheadfoot, % set margins without considering header and footer
    top=2 cm, % seperation between body and page edge from the top
    bottom=2 cm, % seperation between body and page edge from the bottom
    left=2 cm, % seperation between body and page edge from the left
    right=2 cm, % seperation between body and page edge from the right
    footskip=1.0 cm, % seperation between body and footer
    % showframe % for debugging 
]{geometry} % for adjusting page geometry
\\usepackage{titlesec} % for customizing section titles
\\usepackage{tabularx} % for making tables with fixed width columns
\\usepackage{array} % tabularx requires this
\\usepackage[dvipsnames]{xcolor} % for coloring text
\\definecolor{primaryColor}{RGB}{0, 0, 0} % define primary color
\\usepackage{enumitem} % for customizing lists
\\usepackage{fontawesome5} % for using icons
\\usepackage{amsmath} % for math
\\usepackage{multicol}
\\usepackage[
    pdftitle={${resumeData.name}'s CV},
    pdfauthor={${resumeData.name}},
    pdfcreator={LaTeX with RenderCV},
    colorlinks=true,
    urlcolor=primaryColor
]{hyperref} % for links, metadata and bookmarks
\\usepackage[pscoord]{eso-pic} % for floating text on the page
\\usepackage{calc} % for calculating lengths
\\usepackage{bookmark} % for bookmarks
\\usepackage{lastpage} % for getting the total number of pages
\\usepackage{changepage} % for one column entries (adjustwidth environment)
\\usepackage{paracol} % for two and three column entries
\\usepackage{ifthen} % for conditional statements
\\usepackage{needspace} % for avoiding page brake right after the section title
\\usepackage{iftex} % check if engine is pdflatex, xetex or luatex

% Ensure that generate pdf is machine readable/ATS parsable:
\\ifPDFTeX
    \\input{glyphtounicode}
    \\pdfgentounicode=1
    \\usepackage[T1]{fontenc}
    \\usepackage[utf8]{inputenc}
    \\usepackage{lmodern}
\\fi

\\usepackage{charter}

% Some settings:
\\raggedright
\\AtBeginEnvironment{adjustwidth}{\\partopsep0pt} % remove space before adjustwidth environment
\\pagestyle{empty} % no header or footer
\\setcounter{secnumdepth}{0} % no section numbering
\\setlength{\\parindent}{0pt} % no indentation
\\setlength{\\topskip}{0pt} % no top skip
\\setlength{\\columnsep}{0.15cm} % set column seperation
\\pagenumbering{gobble} % no page numbering

\\titleformat{\\section}{\\needspace{4\\baselineskip}\\bfseries\\large}{}{0pt}{}[\\vspace{1pt}\\titlerule]

\\titlespacing{\\section}{
    % left space:
    -1pt
}{
    % top space:
    0.25 cm
}{
    % bottom space:
    0.15 cm
} % section title spacing

\\renewcommand\\labelitemi{$\\vcenter{\\hbox{\\small$\\bullet$}}$} % custom bullet points
\\newenvironment{highlights}{
    \\begin{itemize}[
        topsep=0.10 cm,
        parsep=0.10 cm,
        partopsep=0pt,
        itemsep=0pt,
        leftmargin=0 cm + 10pt
    ]
}{
    \\end{itemize}
} % new environment for highlights

\\newenvironment{highlightsforbulletentries}{
    \\begin{itemize}[
        topsep=0.10 cm,
        parsep=0.10 cm,
        partopsep=0pt,
        itemsep=0pt,
        leftmargin=10pt
    ]
}{
    \\end{itemize}
} % new environment for highlights for bullet entries

\\newenvironment{onecolentry}{
    \\begin{adjustwidth}{
        0 cm + 0.00001 cm
    }{
        0 cm + 0.00001 cm
    }
}{
    \\end{adjustwidth}
} % new environment for one column entries

\\newenvironment{twocolentry}[2][]{
    \\onecolentry
    \\def\\secondColumn{#2}
    \\setcolumnwidth{\\fill, 4.5 cm}
    \\begin{paracol}{2}
}{
    \\switchcolumn \\raggedleft \\secondColumn
    \\end{paracol}
    \\endonecolentry
} % new environment for two column entries

\\newenvironment{threecolentry}[3][]{
    \\onecolentry
    \\def\\thirdColumn{#3}
    \\setcolumnwidth{, \\fill, 4.5 cm}
    \\begin{paracol}{3}
    {\\raggedright #2} \\switchcolumn
}{
    \\switchcolumn \\raggedleft \\thirdColumn
    \\end{paracol}
    \\endonecolentry
} % new environment for three column entries

\\newenvironment{header}{
    \\setlength{\\topsep}{0pt}\\par\\kern\\topsep\\centering\\linespread{1.5}
}{
    \\par\\kern\\topsep
} % new environment for the header

% save the original href command in a new command:
\\let\\hrefWithoutArrow\\href

\\begin{document}
    \\newcommand{\\AND}{\\unskip
        \\cleaders\\copy\\ANDbox\\hskip\\wd\\ANDbox
        \\ignorespaces
    }
    \\newsavebox\\ANDbox
    \\sbox\\ANDbox{$|$}

    \\begin{header}
        \\fontsize{25 pt}{25 pt}\\selectfont ${escapeLatex(resumeData.name)}

        \\vspace{5 pt}

        \\normalsize
        \\mbox{${escapeLatex(resumeData.location)}}%
        \\kern 5.0 pt%
        \\AND%
        \\kern 5.0 pt%
        \\mbox{\\hrefWithoutArrow{mailto:${resumeData.email}}{${escapeLatex(resumeData.email)}}}%
        \\kern 5.0 pt%
        \\AND%
        \\kern 5.0 pt%
        \\mbox{\\hrefWithoutArrow{tel:+1-${resumeData.phone.replace(/[^0-9]/g, '')}}{${escapeLatex(resumeData.phone)}}}%
        \\kern 5.0 pt%
        \\AND%
        \\kern 5.0 pt%
        \\mbox{\\hrefWithoutArrow{https://${resumeData.linkedin}}{https://${escapeLatex(resumeData.linkedin)}}}%
        \\kern 5.0 pt%
        \\AND%
    \\end{header}

    \\vspace{5 pt - 0.3 cm}

    \\section{Summary}
        \\begin{onecolentry}
            ${escapeLatex(resumeData.summary)}
        \\end{onecolentry}   
        
    \\section{Skills}
        \\begin{onecolentry}
            \\begin{multicols}{2}
                \\begin{highlightsforbulletentries}`;

    // Add skills in two columns
    const skills = resumeData.skills;
    const midPoint = Math.ceil(skills.length / 2);
    
    for (let i = 0; i < midPoint; i++) {
      latex += `
                    \\item ${escapeLatex(skills[i])}`;
    }
    
    latex += `
                \\columnbreak`;
    
    for (let i = midPoint; i < skills.length; i++) {
      latex += `
                    \\item ${escapeLatex(skills[i])}`;
    }
    
    latex += `
                \\end{highlightsforbulletentries}
            \\end{multicols}            
        \\end{onecolentry}

    \\section{Education}`;

    // Add education
    resumeData.education.forEach(edu => {
      latex += `      
        \\begin{twocolentry}{
            ${escapeLatex(edu.year)}
        }
            \\textbf{${escapeLatex(edu.school)}}, ${escapeLatex(edu.degree)}\\end{twocolentry}

        \\vspace{0.10 cm}
        \\begin{onecolentry}
            \\begin{highlights}
                \\item ${escapeLatex(edu.gpa ? `GPA: ${edu.gpa}` : 'Relevant coursework in Data Analytics, Supply Chain Management, and ERP Systems')}
            \\end{highlights}
        \\end{onecolentry}`;
    });

    latex += `

    \\section{Experience}`;

    // Add experience
    resumeData.experience.forEach(exp => {
      latex += `      
        \\begin{twocolentry}{
            ${escapeLatex(exp.duration)}
        }
            \\textbf{${escapeLatex(exp.title)}}, ${escapeLatex(exp.company)} - ${escapeLatex(exp.location)}\\end{twocolentry}
        \\vspace{0.10 cm}
        \\begin{onecolentry}
            \\begin{highlights}`;
      
      exp.achievements.forEach(achievement => {
        latex += `
                \\item ${escapeLatex(achievement)}`;
      });
      
      latex += `
            \\end{highlights}
        \\end{onecolentry}
        \\vspace{0.2 cm}`;
    });

    // Add certifications as a section
    if (resumeData.certifications && resumeData.certifications.length > 0) {
      latex += `
    \\section{Certifications}
        \\begin{onecolentry}
            \\begin{highlightsforbulletentries}`;
      
      resumeData.certifications.forEach(cert => {
        latex += `
                \\item ${escapeLatex(cert)}`;
      });
      
      latex += `
            \\end{highlightsforbulletentries}
        \\end{onecolentry}`;
    }

    latex += `

\\end{document}`;

    return latex;
  }
}

// Main application class
class ResumeEditor {
  constructor() {
    this.gptOptimizer = new GPTResumeOptimizer();
    this.optimizer = new ResumeOptimizer(); // Fallback
    this.latexGenerator = new LaTeXGenerator();
    this.initializeEventListeners();
    this.initializeBackendApiKey();
  }

  initializeEventListeners() {
    document.getElementById('generateResume').addEventListener('click', () => {
      this.generateResume();
    });

    document.getElementById('clearForm').addEventListener('click', () => {
      this.clearForm();
    });

    document.getElementById('copyLatex').addEventListener('click', () => {
      this.copyLatex();
    });

    document.getElementById('downloadLatex').addEventListener('click', () => {
      this.downloadLatex();
    });

    document.getElementById('previewResume').addEventListener('click', () => {
      this.previewResume();
    });

    document.getElementById('generatePDF').addEventListener('click', () => {
      this.generatePDF();
    });

    document.getElementById('openOverleaf').addEventListener('click', () => {
      this.openInOverleaf();
    });
  }

  async initializeBackendApiKey() {
    try {
      // Fetch API key from backend
      const response = await fetch('/api/get-api-key');
      if (response.ok) {
        const data = await response.json();
        if (data.apiKey) {
          this.gptOptimizer.setApiKey(data.apiKey);
          console.log('API key loaded from backend');
        }
      }
    } catch (error) {
      console.log('No API key available from backend, will use local optimization');
    }
  }

  async generateResume() {
    const jobDescription = document.getElementById('jobDescription').value.trim();
    
    if (!jobDescription) {
      this.showMessage('Please enter a job description first.', 'error');
      return;
    }

    this.showLoading(true);
    
    try {
      let optimizedResume;
      
      // Try GPT API first if API key is available
      if (this.gptOptimizer.apiKey) {
        try {
          console.log('Using GPT API for resume optimization...');
          const gptResult = await this.gptOptimizer.generateTailoredResume(jobDescription, baseResumeData.detailedExperience);
          
          // Merge GPT results with base resume data - ONLY modify skills and experience points
          optimizedResume = {
            ...baseResumeData,
            // Keep all personal info, summary, education, certifications unchanged
            name: baseResumeData.name,
            title: baseResumeData.title,
            email: baseResumeData.email,
            phone: baseResumeData.phone,
            location: baseResumeData.location,
            linkedin: baseResumeData.linkedin,
            summary: baseResumeData.summary,
            education: baseResumeData.education,
            certifications: baseResumeData.certifications,
            
            // Only modify skills and experience points
            skills: gptResult.skills || baseResumeData.skills,
            experience: gptResult.experience || baseResumeData.detailedExperience.map(exp => ({
              title: exp.title,
              company: exp.company,
              location: exp.location,
              duration: exp.duration,
              achievements: exp.currentAchievements
            }))
          };
          
          console.log('GPT optimization completed successfully');
        } catch (gptError) {
          console.warn('GPT API failed, falling back to local optimization:', gptError);
          // Fallback to local optimization
          optimizedResume = this.optimizer.optimizeResume(jobDescription);
        }
      } else {
        console.log('No API key provided, using local optimization...');
        // Use fallback optimization
        optimizedResume = this.optimizer.optimizeResume(jobDescription);
      }
      
      // Generate LaTeX
      const latex = this.latexGenerator.generateResume(optimizedResume);
      
      // Display result
      document.getElementById('latexOutput').value = latex;
      
      // Show success message
      const method = this.gptOptimizer.apiKey ? 'AI-powered' : 'local';
      this.showMessage(`Resume generated successfully using ${method} optimization! You can now copy, download, or preview it.`, 'success');
      
    } catch (error) {
      console.error('Error generating resume:', error);
      this.showMessage('Error generating resume. Please try again.', 'error');
    } finally {
      this.showLoading(false);
    }
  }

  clearForm() {
    document.getElementById('jobDescription').value = '';
    document.getElementById('latexOutput').value = '';
    document.getElementById('previewSection').style.display = 'none';
    this.hideMessages();
  }

  copyLatex() {
    const latexOutput = document.getElementById('latexOutput');
    
    if (!latexOutput.value.trim()) {
      this.showMessage('No LaTeX content to copy. Generate a resume first.', 'error');
      return;
    }

    latexOutput.select();
    latexOutput.setSelectionRange(0, 99999); // For mobile devices
    
    try {
      document.execCommand('copy');
      this.showMessage('LaTeX code copied to clipboard!', 'success');
    } catch (err) {
      // Fallback for modern browsers
      navigator.clipboard.writeText(latexOutput.value).then(() => {
        this.showMessage('LaTeX code copied to clipboard!', 'success');
      }).catch(() => {
        this.showMessage('Failed to copy. Please select and copy manually.', 'error');
      });
    }
  }

  downloadLatex() {
    const latexOutput = document.getElementById('latexOutput');
    
    if (!latexOutput.value.trim()) {
      this.showMessage('No LaTeX content to download. Generate a resume first.', 'error');
      return;
    }

    const blob = new Blob([latexOutput.value], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'abhilash_chandra_resume.tex';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    this.showMessage('LaTeX file downloaded successfully!', 'success');
  }

  generatePDF() {
    const latexOutput = document.getElementById('latexOutput');
    
    if (!latexOutput.value.trim()) {
      this.showMessage('No LaTeX content to convert to PDF. Generate a resume first.', 'error');
      return;
    }

    this.showMessage('PDF generation initiated. This will open a new tab with the PDF.', 'info');
    
    // Create a new window/tab with the LaTeX content for PDF generation
    const pdfWindow = window.open('', '_blank');
    pdfWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Resume PDF Generation</title>
        <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
        <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
        <script>
          window.MathJax = {
            tex: {
              inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
              displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']]
            }
          };
        </script>
        <style>
          body { 
            font-family: 'Times New Roman', serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px;
            line-height: 1.6;
            color: #333;
          }
          h1 { color: #002b5c; font-size: 2.2rem; margin-bottom: 10px; border-bottom: 2px solid #00bcd4; padding-bottom: 10px; }
          h2 { color: #002b5c; font-size: 1.4rem; margin-top: 25px; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
          h3 { color: #555; font-size: 1.1rem; margin-top: 20px; margin-bottom: 8px; }
          p { margin-bottom: 10px; }
          ul { margin-bottom: 15px; padding-left: 20px; }
          li { margin-bottom: 5px; }
          .contact-info { text-align: center; margin-bottom: 20px; }
          .contact-info a { color: #002b5c; text-decoration: none; }
          .contact-info a:hover { text-decoration: underline; }
          @media print {
            body { margin: 0; padding: 15px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="text-align: center; margin-bottom: 20px; padding: 10px; background: #f0f0f0; border-radius: 5px;">
          <h3>Resume Preview - Ready for PDF Generation</h3>
          <p>Use your browser's Print function (Ctrl+P / Cmd+P) and select "Save as PDF" to generate the PDF file.</p>
          <button onclick="window.print()" style="background: #002b5c; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 5px;">Print/Save as PDF</button>
          <button onclick="window.close()" style="background: #666; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 5px;">Close</button>
        </div>
        <div id="resume-content"></div>
        <script>
          // Convert LaTeX to HTML for preview
          function convertLatexToHTML(latex) {
            // Simple LaTeX to HTML conversion for resume formatting
            let html = latex
              .replace(/\\\\\\[0\\.5em\\]/g, '<br>')
              .replace(/\\\\\\[0\\.3em\\]/g, '<br>')
              .replace(/\\\\/g, '<br>')
              .replace(/\\textbf\\{([^}]+)\\}/g, '<strong>$1</strong>')
              .replace(/\\textit\\{([^}]+)\\}/g, '<em>$1</em>')
              .replace(/\\href\\{([^}]+)\\}\\{([^}]+)\\}/g, '<a href="$1">$2</a>')
              .replace(/\\color\\{primary\\}\\{([^}]+)\\}/g, '<span style="color: #002b5c;">$1</span>')
              .replace(/\\color\\{accent\\}\\{([^}]+)\\}/g, '<span style="color: #00bcd4;">$1</span>')
              .replace(/\\Large/g, '')
              .replace(/\\Huge/g, '')
              .replace(/\\bfseries/g, '')
              .replace(/\\item/g, '<li>')
              .replace(/\\begin\\{itemize\\}/g, '<ul>')
              .replace(/\\end\\{itemize\\}/g, '</ul>')
              .replace(/\\begin\\{center\\}/g, '<div class="contact-info">')
              .replace(/\\end\\{center\\}/g, '</div>')
              .replace(/\\section\\{([^}]+)\\}/g, '<h2>$1</h2>')
              .replace(/\\subsection\\{([^}]+)\\}/g, '<h3>$1</h3>')
              .replace(/\\$\\|\\$/g, ' | ')
              .replace(/\\$\\|\\$/g, ' | ')
              .replace(/\\$\\|\\$/g, ' | ');
            
            return html;
          }
          
          // Get the LaTeX content from parent window
          const latexContent = \`${latexOutput.value.replace(/`/g, '\\`')}\`;
          const htmlContent = convertLatexToHTML(latexContent);
          document.getElementById('resume-content').innerHTML = htmlContent;
        </script>
      </body>
      </html>
    `);
    pdfWindow.document.close();
  }

  openInOverleaf() {
    const latexOutput = document.getElementById('latexOutput');
    
    if (!latexOutput.value.trim()) {
      this.showMessage('No LaTeX content to open in Overleaf. Generate a resume first.', 'error');
      return;
    }

    // Create a form to submit to Overleaf
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://www.overleaf.com/docs';
    form.target = '_blank';
    
    // Add the LaTeX content as a hidden field
    const contentField = document.createElement('input');
    contentField.type = 'hidden';
    contentField.name = 'snip_uri';
    contentField.value = 'data:text/plain;base64,' + btoa(latexOutput.value);
    
    form.appendChild(contentField);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
    
    this.showMessage('Opening LaTeX in Overleaf for PDF compilation...', 'info');
  }

  previewResume() {
    const latexOutput = document.getElementById('latexOutput');
    
    if (!latexOutput.value.trim()) {
      this.showMessage('No LaTeX content to preview. Generate a resume first.', 'error');
      return;
    }

    // For now, show a simple HTML preview
    // In a real implementation, you might use a LaTeX-to-HTML converter
    this.showHTMLPreview();
  }

  showHTMLPreview() {
    const jobDescription = document.getElementById('jobDescription').value.trim();
    const optimizedResume = this.optimizer.optimizeResume(jobDescription);
    
    const previewHTML = `
      <h1>${optimizedResume.name}</h1>
      <p><strong>${optimizedResume.title}</strong></p>
      <p>${optimizedResume.email} | ${optimizedResume.phone} | ${optimizedResume.location} | ${optimizedResume.linkedin}</p>
      
      <h2>Professional Summary</h2>
      <p>${optimizedResume.summary}</p>
      
      <h2>Professional Experience</h2>
      ${optimizedResume.experience.map(exp => `
        <h3>${exp.title} - ${exp.company}</h3>
        <p><em>${exp.duration} | ${exp.location}</em></p>
        <ul>
          ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
        </ul>
      `).join('')}
      
      <h2>Technical Skills</h2>
      <ul>
        ${optimizedResume.skills.map(skill => `<li>${skill}</li>`).join('')}
      </ul>
      
      <h2>Education</h2>
      ${optimizedResume.education.map(edu => `
        <h3>${edu.degree}</h3>
        <p>${edu.school} | ${edu.location} | ${edu.year}</p>
      `).join('')}
      
      <h2>Certifications</h2>
      <ul>
        ${optimizedResume.certifications.map(cert => `<li>${cert}</li>`).join('')}
      </ul>
    `;
    
    document.getElementById('resumePreview').innerHTML = previewHTML;
    document.getElementById('previewSection').style.display = 'block';
    
    // Scroll to preview
    document.getElementById('previewSection').scrollIntoView({ behavior: 'smooth' });
  }

  showLoading(show) {
    const generateBtn = document.getElementById('generateResume');
    if (show) {
      generateBtn.classList.add('loading');
      generateBtn.disabled = true;
      generateBtn.textContent = 'Generating...';
    } else {
      generateBtn.classList.remove('loading');
      generateBtn.disabled = false;
      generateBtn.textContent = 'Generate Tailored Resume';
    }
  }

  showMessage(message, type) {
    this.hideMessages();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    const editor = document.querySelector('.resume-editor');
    editor.insertBefore(messageDiv, editor.firstChild);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.parentNode.removeChild(messageDiv);
      }
    }, 5000);
  }

  hideMessages() {
    const messages = document.querySelectorAll('.message');
    messages.forEach(msg => msg.remove());
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ResumeEditor();
});
