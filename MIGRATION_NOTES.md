# Portfolio Migration Notes - Shivam Singh

## Summary
This document outlines the changes made to migrate the portfolio from Kartik Labhshetwar to Shivam Singh based on the provided LaTeX resume.

## Key Details Extracted from LaTeX Resume

### Personal Information
- **Name**: Shivam Singh
- **Location**: Patna, Bihar
- **Phone**: +91-9264920613
- **Email**: shivamatvit@gmail.com
- **GitHub**: [@Shivam909058](https://github.com/Shivam909058)
- **LinkedIn**: [shivam-singh-94835224a](https://linkedin.com/in/shivam-singh-94835224a)
- **Website**: [ingineerpro.tech](https://ingineerpro.tech)
- **Age**: 22 (calculated from 2022-2026 graduation)

### Professional Summary
AI Engineer with expertise in multi-agent systems, financial AI, and production ML. Specialized in building parallel agents with tool-calling architecture, optimizing RAG pipelines (65% latency reduction), and deploying systems with 90%+ uptime. Architected financial intelligence platform processing 100+ data sources with 95%+ accuracy; scaled systems to 2500+ concurrent users.

### Professional Experience

#### 1. Valura.AI (Aug 2025 - Present)
**Position**: AI Engineer  
**Key Achievements**:
- Architected multi-agent financial intelligence system processing 100+ data sources with 95%+ accuracy
- Designed parallel AI agents using tool-calling for independent analysis
- Scaled async pipelines handling concurrent queries at sub-100ms latency per agent
- Maintained 90%+ system uptime

#### 2. Shakty.AI (Mar 2025 - Jul 2025)
**Position**: AI Engineer (Intern)  
**Key Achievements**:
- Designed production-grade multimodal RAG system
- Built automated ingestion, parsing, chunking, and embedding pipelines
- Optimized retrieval achieving 65% latency reduction

#### 3. Xpendable Labs (Jan 2025 - Mar 2025)
**Position**: AI Research Engineer (Intern)  
**Key Achievements**:
- Fine-tuned small language model for SEO-optimized blog generation
- Achieved 94% structural consistency
- Reduced content revisions by 40%

### Key Projects

#### 1. Neo Clouds - GPU-Native AI Compute Platform (2025)
- Built Kubernetes-based GPU scheduling and VM-level isolation
- Increased GPU utilization by 35-40%
- Stress-tested with dozens of concurrent GPU jobs

#### 2. Yoom - AI Meeting Assistant (2024)
- Built full video conferencing platform with AI-powered summaries
- Generates summaries within 5-10 seconds of meeting completion
- RAG-based conversational memory with sub-2s response latency

#### 3. AGNO - Modular AI Agent Platform (2024)
- RAG-powered agent creation platform
- Users can create multi-agent systems through natural language
- No configuration files or code required

### Education
- **Institution**: Jaypee University of Engineering & Technology
- **Degree**: B.Tech Computer Science and Engineering
- **Duration**: 2022 - 2026
- **Location**: Guna, MP

### Technical Skills

**Languages**: Python, C++, Rust, JavaScript, SQL, CUDA

**AI/ML**: Multi-Agent Systems, Large Language Models, Retrieval-Augmented Generation (RAG), Prompt Engineering, Fine-tuning (LoRA), Diffusion Models, GANs, NLP, Computer Vision

**Frameworks**: PyTorch, TensorFlow, Hugging Face Transformers, LangChain, FastAPI, Anthropic API

**Cloud/DevOps**: AWS (Lambda, EC2, S3), Docker, Kubernetes, CI/CD, Terraform, MLflow

**Data & Tools**: PostgreSQL, Vector Databases (Pinecone, Milvus), Redis, Pandas, NumPy, Apache Spark

### Achievements & Certifications
- Published Research: Knowledge Distillation in Image Generation Models (IRE Journal Q1, 2024)
- MLH Hackathon Finalist '23
- Code Cubicle Top 10 '24
- Technical Speaker (3+ meetups, 200+ attendees)
- NVIDIA CUDA Programming
- DeepLearning.AI GANs Specialization
- Udemy MLOps & Data Analytics

## Files Modified

### Core Components
1. **src/components/ProfileHeader.tsx**
   - Updated name, age, title, and social links

2. **src/components/HomeContent.tsx**
   - Updated profile information
   - Changed professional summary
   - Updated GitHub username references
   - Updated sponsor links

3. **src/components/Reachout.tsx**
   - Updated social links and email
   - Updated copyright footer

4. **src/components/ExperienceContent.tsx**
   - Replaced all experience entries with Shivam's 3 positions

5. **src/data/projects.ts**
   - Replaced projects with Neo Clouds, Yoom, and AGNO

### Tech Stack
6. **src/components/TechStackMarquee.tsx**
   - Updated to focus on AI/ML technologies
   - Added PyTorch, TensorFlow, LangChain, Kubernetes, CUDA
   - Removed web-focused technologies

### API Routes
7. **src/app/api/github-contributions/route.ts**
   - Updated default username to Shivam909058

8. **src/app/api/github-stars/route.ts**
   - Updated default owner to Shivam909058

### Other Components
9. **src/components/ContributionCard.tsx**
   - Updated GitHub username

10. **src/components/PortfolioStars.tsx**
    - Updated repo reference to Shivam909058/portfoliotest

11. **src/components/SponsorShowcase.tsx**
    - Updated sponsor URL

12. **src/components/SponsorsListClient.tsx**
    - Updated sponsor button link

### Metadata & SEO
13. **src/app/layout.tsx**
    - Updated site title, description, and Open Graph data
    - Changed metadata base URL to ingineerpro.tech

14. **src/app/projects/[id]/page.tsx**
    - Updated page title format

15. **src/app/projects/page.tsx**
    - Updated metadata

16. **src/app/sponsors/page.tsx**
    - Updated metadata

17. **src/app/blogs/metadata.ts**
    - Updated all blog metadata

18. **src/app/blogs/[id]/page.tsx**
    - Updated blog post title format

### Documentation
19. **README.md**
    - Completely rewritten with Shivam's information
    - Added AI engineering focus

## Images That Need to be Replaced

The following image files should be replaced with Shivam's actual images:

### Profile Images
- `public/pfp.jpg` - Profile picture
- `public/banner.jpg` - Banner image
- `public/open-graph.png` - Social media preview image

### Old References (can be deleted)
- `public/kartik.jpg`
- `public/kartik_bw.png`
- `public/kartik_white.png`

### Company Logos
- `public/turboml.jpg` - No longer needed (removed from experience)
- Add these new logos:
  - `public/valura.jpg` - Valura.AI logo
  - `public/shakty.jpg` - Shakty.AI logo
  - `public/xpendable.jpg` - Xpendable Labs logo

### Project Images
Add project screenshots/images:
- `public/images/neoclouds.png` - Neo Clouds project
- `public/images/yoom.png` - Yoom project
- `public/images/agno.png` - AGNO project

### Social Media Screenshots
Update these if they contain old information:
- `public/github.png`
- `public/linkedin.png`
- `public/twitter.png`
- `public/resume.png`

## Testing Results

### TypeScript Compilation
✅ Passed - No type errors

### ESLint
✅ Passed - No linting errors

### Build Test
⚠️ Could not complete due to network restrictions (Google Fonts access)
- Code is syntactically correct
- Build should work in a normal environment with internet access

## Next Steps for Complete Migration

1. **Replace Images**:
   - Upload Shivam's profile picture as `/public/pfp.jpg`
   - Upload banner image as `/public/banner.jpg`
   - Upload company logos (valura.jpg, shakty.jpg, xpendable.jpg)
   - Upload project images (neoclouds.png, yoom.png, agno.png)
   - Update social media screenshot images if needed
   - Create new Open Graph image with Shivam's branding

2. **Update Resume Link**:
   - The resume link in ProfileHeader.tsx currently points to a placeholder
   - Upload Shivam's resume and update the link

3. **Optional Enhancements**:
   - Add a dedicated "Achievements & Certifications" section
   - Update blogs/posts if any
   - Update sponsors list if applicable
   - Consider adding education section to the main page

4. **Deployment**:
   - Update deployment configuration for ingineerpro.tech domain
   - Set up DNS records
   - Configure environment variables if needed
   - Update any analytics or tracking codes

## Verification Checklist

- [x] All personal information updated
- [x] Professional experience reflects LaTeX resume
- [x] Projects match resume (3 main projects)
- [x] Tech stack updated for AI/ML focus
- [x] All GitHub references updated
- [x] Metadata and SEO updated
- [x] TypeScript compilation successful
- [x] ESLint passing
- [ ] Images replaced with actual photos
- [ ] Resume PDF uploaded and linked
- [ ] Domain configured (ingineerpro.tech)
- [ ] Build successful in production environment
- [ ] Live site tested and verified

## Notes

- The portfolio now reflects an AI Engineering focus rather than full-stack development
- All three professional experiences are AI-focused roles
- Projects emphasize multi-agent systems, RAG, and GPU infrastructure
- Tech stack highlights production ML tools and frameworks
- The tone and descriptions emphasize scalability, performance metrics, and production readiness
