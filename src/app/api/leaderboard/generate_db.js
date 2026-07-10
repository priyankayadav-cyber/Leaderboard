const fs = require('fs');
const path = require('path');

// Helper to generate dynamic stats
const randomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomGrowth = () => parseFloat((Math.random() * (480 - 15) + 15).toFixed(1));

// Sequential random walk helper for realistic trend lines
const generateWalk = (length, start) => {
  const walk = [start];
  for (let i = 1; i < length; i++) {
    const change = randomInRange(-10, 15); // slight upward bias
    walk.push(Math.max(5, walk[i - 1] + change));
  }
  return walk;
};

// ==========================================
// 1. DATASETS DEFINITIONS
// ==========================================

const RAW_TOOLS = [
  // Code Assistants
  { name: "Cursor", category: "Code Assistant", pricing: "Freemium", url: "https://cursor.com", tags: ["IDE", "Editor", "Autocomplete"], description: "AI-first code editor built on top of VS Code with deep model integration." },
  { name: "GitHub Copilot", category: "Code Assistant", pricing: "Paid", url: "https://github.com", tags: ["Autocomplete", "Refactoring", "Extension"], description: "The world's most widely adopted AI developer tool, embedded in standard IDEs." },
  { name: "bolt.new", category: "Code Assistant", pricing: "Freemium", url: "https://bolt.new", tags: ["Web Dev", "Fullstack", "StackBlitz"], description: "In-browser development agent that builds, runs, and deploys full-stack web applications." },
  { name: "v0.dev", category: "UI/UX Design", pricing: "Freemium", url: "https://v0.dev", tags: ["React", "Tailwind", "Vercel"], description: "Generative UI system by Vercel producing production-ready React components." },
  { name: "Replit Agent", category: "Code Assistant", pricing: "Paid", url: "https://replit.com", tags: ["Mobile", "Sandbox", "Fullstack"], description: "Autonomously builds applications from scratch directly in the Replit workspace." },
  { name: "WebSim AI", category: "Code Assistant", pricing: "Free", url: "https://websim.ai", tags: ["Simulation", "Generative Web", "Creative"], description: "Sandbox that simulates fully functional websites, systems, and retro apps from simple URL prompts." },
  { name: "Lovable.dev", category: "Code Assistant", pricing: "Freemium", url: "https://lovable.dev", tags: ["No-Code", "GPT-Engineer", "Frontend"], description: "Fullstack web app builder designed to turn plain English prompts into production code." },
  { name: "Tabnine", category: "Code Assistant", pricing: "Freemium", url: "https://tabnine.com", tags: ["Autocomplete", "Local Model", "Privacy"], description: "AI code assistant focusing on enterprise privacy, local deployment options, and security." },
  { name: "Cody AI", category: "Code Assistant", pricing: "Freemium", url: "https://sourcegraph.com", tags: ["Sourcegraph", "Context Search", "Repo Indexing"], description: "AI assistant that reads your entire repository to write and explain code with codebase context." },
  { name: "Phind", category: "Code Assistant", pricing: "Free", url: "https://phind.com", tags: ["Search", "Developer", "Reference"], description: "Search engine specifically tailored for developers to locate programming references and solutions." },
  { name: "Devin", category: "Code Assistant", pricing: "Paid", url: "https://cognition.ai", tags: ["Agent", "Autonomous", "Fullstack"], description: "The world's first fully autonomous AI software engineer developed by Cognition." },
  { name: "Sweeper", category: "Code Assistant", pricing: "Paid", url: "https://sweep.dev", tags: ["PR Agent", "GitHub", "Refactoring"], description: "AI junior developer that addresses GitHub issues and opens pull requests automatically." },
  { name: "Codeium", category: "Code Assistant", pricing: "Free", url: "https://codeium.com", tags: ["Autocomplete", "Free Tier", "IDE Extension"], description: "Lightning-fast code autocomplete tool providing free, unlimited single-developer tiers." },
  { name: "Supermaven", category: "Code Assistant", pricing: "Freemium", url: "https://supermaven.com", tags: ["Fast", "300k Context", "Autocomplete"], description: "Ultra-fast code autocomplete with a massive 300k-token context window." },
  { name: "Anysphere", category: "Code Assistant", pricing: "Paid", url: "https://anysphere.co", tags: ["Editor", "Research", "Security"], description: "Research group behind Cursor, advancing custom developer experience models." },
  
  // Image & Design
  { name: "Midjourney", category: "Image Generation", pricing: "Paid", url: "https://midjourney.com", tags: ["Art", "Vibe", "Discord"], description: "Cinematic, high-fidelity generative art creator running primarily inside Discord." },
  { name: "DALL-E 3", category: "Image Generation", pricing: "Freemium", url: "https://openai.com", tags: ["OpenAI", "ChatGPT", "Adherence"], description: "OpenAI's state-of-the-art text-to-image engine with exact prompt instruction adherence." },
  { name: "Stable Diffusion XL", category: "Image Generation", pricing: "Free", url: "https://stability.ai", tags: ["Open Source", "Self-Hosted", "Customizable"], description: "Stability AI's open-weights image generator supporting custom checkpoints and LoRAs." },
  { name: "FLUX.1", category: "Image Generation", pricing: "Free", url: "https://blackforestlabs.ai", tags: ["Black Forest Labs", "Open Weights", "Detail"], description: "Leading open image generation model producing photorealistic skin textures and text rendering." },
  { name: "Canva AI", category: "Image Generation", pricing: "Freemium", url: "https://canva.com", tags: ["Design", "Templates", "Magic Design"], description: "Suite of AI design tools built into Canva, including Magic Edit and image generators." },
  { name: "Adobe Firefly", category: "Image Generation", pricing: "Freemium", url: "https://adobe.com", tags: ["Enterprise", "Vector", "Copyright-Safe"], description: "Adobe's creative generative model designed to be safe for commercial enterprise usage." },
  { name: "Photoroom", category: "Image Generation", pricing: "Freemium", url: "https://photoroom.com", tags: ["E-commerce", "Background Remover", "Product Photos"], description: "AI photo editor specializing in clean background removal and commercial product shots." },
  { name: "Leonardo AI", category: "Image Generation", pricing: "Freemium", url: "https://leonardo.ai", tags: ["Art", "Assets", "Gaming"], description: "Feature-rich platform generating consistent assets and items for game developers." },
  { name: "Recraft.ai", category: "Image Generation", pricing: "Freemium", url: "https://recraft.ai", tags: ["Vector", "SVG", "Branding"], description: "Generative canvas specifically designed to output clean vector SVGs and branding icons." },
  { name: "Magnific AI", category: "Image Generation", pricing: "Paid", url: "https://magnific.ai", tags: ["Upscaling", "Enhancer", "Detail"], description: "Ultra-premium AI image upscaler that reimagines and injects extreme details into images." },
  { name: "Krea AI", category: "Image Generation", pricing: "Freemium", url: "https://krea.ai", tags: ["Real-time", "Upscale", "Video"], description: "Real-time generative canvas that updates images instantly as you sketch." },
  { name: "Luma Dream Machine", category: "Video Editing", pricing: "Freemium", url: "https://lumalabs.ai", tags: ["Video Gen", "3D", "Luma"], description: "Generative video model creating cinematic, physics-aware 5-second video clips." },

  // Video & Motion
  { name: "Runway Gen-3 Alpha", category: "Video Editing", pricing: "Paid", url: "https://runwayml.com", tags: ["Cinematic", "Video Gen", "Runway"], description: "Next-generation video engine producing high-fidelity camera motions and human movements." },
  { name: "Sora", category: "Video Editing", pricing: "Paid", url: "https://openai.com", tags: ["OpenAI", "Video Gen", "Hyperrealism"], description: "OpenAI's text-to-video model generating up to 60 seconds of complex, physics-realistic scenes." },
  { name: "Pika 2.0", category: "Video Editing", pricing: "Freemium", url: "https://pika.art", tags: ["Effects", "Video Edit", "Animation"], description: "Interactive video generation tool allowing users to inflate, crush, or edit objects in videos." },
  { name: "Kling AI", category: "Video Editing", pricing: "Freemium", url: "https://klingai.com", tags: ["Video Gen", "Asia", "Long Form"], description: "High-performance text-to-video tool capable of generating long, cinematic videos." },
  { name: "HeyGen", category: "Video Editing", pricing: "Freemium", url: "https://heygen.com", tags: ["Avatars", "Localization", "Cloning"], description: "Creates realistic, synthetic talking avatars and translates videos with voice-cloned lip sync." },
  { name: "Synthesia", category: "Video Editing", pricing: "Paid", url: "https://synthesia.io", tags: ["Enterprise", "Avatars", "Training"], description: "Corporate-focused video creator turning presentation slides and training manuals into avatar videos." },
  { name: "Descript", category: "Video Editing", pricing: "Freemium", url: "https://descript.com", tags: ["Podcast", "Audio Edit", "Transcription"], description: "Audio and video editor that lets you edit videos by simply editing the text transcripts." },
  { name: "Opus Clip", category: "Video Editing", pricing: "Freemium", url: "https://opus.pro", tags: ["Shorts", "TikTok", "Repurposing"], description: "Cuts long podcasts or YouTube webinars into high-engagement vertical shorts for TikTok." },
  { name: "CapCut AI", category: "Video Editing", pricing: "Free", url: "https://capcut.com", tags: ["Templates", "Mobile Edit", "Subtitles"], description: "ByteDance's mobile editor with advanced AI features for keyframing, tracking, and subtitles." },
  { name: "Munch", category: "Video Editing", pricing: "Paid", url: "https://getmunch.com", tags: ["Social Analytics", "Shorts", "Keywords"], description: "Extracts short clips from long videos based on viral social analytics and trending keywords." },
  { name: "Veed.io", category: "Video Editing", pricing: "Freemium", url: "https://veed.io", tags: ["Subtitles", "Online Editor", "Screen Record"], description: "In-browser video editor designed for quick edits, auto-subtitles, and social content." },
  { name: "Captions", category: "Video Editing", pricing: "Paid", url: "https://captions.ai", tags: ["Mobile", "Teleprompter", "Subtitles"], description: "Studio-quality camera app with AI-powered eye contact correction, teleprompter, and dynamic text." },
  
  // Audio & Voice
  { name: "ElevenLabs", category: "Audio & Voice", pricing: "Freemium", url: "https://elevenlabs.io", tags: ["Speech", "Voice Cloning", "Sound Effects"], description: "Leading audio generation model creating ultra-realistic text-to-speech in dozens of languages." },
  { name: "Suno AI", category: "Audio & Voice", pricing: "Freemium", url: "https://suno.com", tags: ["Music", "Songs", "Lyrics"], description: "Generates complete 2-minute songs with vocals, instruments, and custom lyrics from prompts." },
  { name: "Udio", category: "Audio & Voice", pricing: "Freemium", url: "https://udio.com", tags: ["Music", "Hi-Fi", "Songwriting"], description: "High-fidelity music generation platform that excels at complex harmonies and vocals." },
  { name: "Murf AI", category: "Audio & Voice", pricing: "Freemium", url: "https://murf.ai", tags: ["Voiceover", "Studio", "Corporate"], description: "Professional studio voiceover generator optimized for training, advertisements, and presentations." },
  { name: "Speechify", category: "Audio & Voice", pricing: "Freemium", url: "https://speechify.com", tags: ["TTS", "Reader", "Audiobooks"], description: "Leading text-to-speech reader capable of turning articles and PDFs into audiobooks." },
  { name: "Otter.ai", category: "Audio & Voice", pricing: "Freemium", url: "https://otter.ai", tags: ["Transcription", "Meeting", "Notes"], description: "AI meeting assistant that records, transcribes, and summarizes meeting notes in real-time." },
  { name: "Fathom", category: "Audio & Voice", pricing: "Free", url: "https://fathom.video", tags: ["Zoom", "Meeting", "Free Tier"], description: "Highly praised meeting summarizer that integrates with Zoom, Teams, and Google Meet for free." },
  { name: "Fireflies.ai", category: "Audio & Voice", pricing: "Freemium", url: "https://fireflies.ai", tags: ["Meeting Note", "CRM Sync", "Search"], description: "AI notes assistant that automatically logs meetings and synchronizes action items to CRMs." },
  { name: "Riverside.fm AI", category: "Audio & Voice", pricing: "Freemium", url: "https://riverside.fm", tags: ["Recording", "Podcast", "Transcription"], description: "Local audio/video recorder with built-in AI transcription and clip-generating features." },
  { name: "Auphonic", category: "Audio & Voice", pricing: "Freemium", url: "https://auphonic.com", tags: ["Mastering", "Leveler", "Loudness"], description: "Web-based audio mastering service that balances levels, removes hums, and normalizes volume." },
  { name: "Voicemod", category: "Audio & Voice", pricing: "Freemium", url: "https://voicemod.net", tags: ["Real-time", "Voice Changer", "Gaming"], description: "Real-time AI voice changer and soundboard software popular with gamers and streamers." },
  { name: "Podcastle", category: "Audio & Voice", pricing: "Freemium", url: "https://podcastle.ai", tags: ["Podcast", "In-Browser", "Enhancer"], description: "All-in-one web recording and editing platform with AI background noise removal." },

  // Search & Knowledge
  { name: "Perplexity AI", category: "Search & Answer", pricing: "Freemium", url: "https://perplexity.ai", tags: ["Search", "Answers", "Citations"], description: "Conversational answer engine providing real-time search combined with clean source citations." },
  { name: "Consensus", category: "Search & Answer", pricing: "Freemium", url: "https://consensus.app", tags: ["Research", "Science", "Paper Search"], description: "AI search engine that queries scientific research papers to extract evidence-backed answers." },
  { name: "Phind Search", category: "Search & Answer", pricing: "Free", url: "https://phind.com", tags: ["Developer", "Programming", "API"], description: "Direct developer search tool that reads code documents to provide complete coding answers." },
  { name: "Elicit", category: "Search & Answer", pricing: "Freemium", url: "https://elicit.com", tags: ["Research", "Literature", "Data Extraction"], description: "Automates literature reviews by searching, summarizing, and mapping research concepts." },
  { name: "SciSpace", category: "Search & Answer", pricing: "Freemium", url: "https://typeset.io", tags: ["PDF Explainer", "Research", "Math Loader"], description: "Interactive reading copilot that explains complex scientific PDFs, equations, and tables." },
  { name: "Julius AI", category: "Data Analysis", pricing: "Freemium", url: "https://julius.ai", tags: ["Math", "Data Analytics", "Python"], description: "AI data scientist that writes and runs Python scripts to build charts and clean CSVs." },
  { name: "ChatPDF", category: "Data Analysis", pricing: "Freemium", url: "https://chatpdf.com", tags: ["PDF", "Productivity", "Reader"], description: "Simple interface allowing users to upload any PDF and chat with its content instantly." },
  { name: "NotebookLM", category: "Productivity", pricing: "Free", url: "https://notebooklm.google", tags: ["Google", "Podcast Gen", "Note Taking"], description: "Google's personalized AI notes tool that converts source documents into audio discussions." },
  { name: "Gamma App", category: "Productivity", pricing: "Freemium", url: "https://gamma.app", tags: ["Slides", "Presentations", "Websites"], description: "Generates beautiful presentation slides, documents, and web pages from text prompts." },
  { name: "Tome", category: "Productivity", pricing: "Freemium", url: "https://tome.app", tags: ["Slides", "Storytelling", "Design"], description: "AI-driven storytelling canvas producing structured presentations with generated images." },
  { name: "Notion AI", category: "Productivity", pricing: "Paid", url: "https://notion.so", tags: ["Notes", "Workspace", "Writing"], description: "Integrates AI features directly into the Notion workspace to summarize, draft, and query notes." },
  { name: "Heptabase", category: "Productivity", pricing: "Paid", url: "https://heptabase.com", tags: ["Mindmap", "Note Taking", "Visual"], description: "Visual note-taking tool that helps researchers map out complex connections with AI cards." },
  
  // Writing & Copy
  { name: "Jasper", category: "Copywriting", pricing: "Freemium", url: "https://jasper.ai", tags: ["Marketing", "SEO", "Enterprise"], description: "Enterprise-grade AI copywriter designed for creative teams, SEO, and marketing campaigns." },
  { name: "Copy.ai", category: "Copywriting", pricing: "Freemium", url: "https://copy.ai", tags: ["Sales", "Email", "Automation"], description: "Generates automated GTM sales campaigns, emails, and social media copy." },
  { name: "Writesonic", category: "Copywriting", pricing: "Freemium", url: "https://writesonic.com", tags: ["SEO", "Blog Writer", "Chatbot"], description: "AI writing platform specializing in SEO-optimized articles, blogs, and ad templates." },
  { name: "Grammarly", category: "Copywriting", pricing: "Freemium", url: "https://grammarly.com", tags: ["Spelling", "Tone", "Editor"], description: "Ubiquitous writing assistant that corrects grammar, styling, and tone in real-time." },
  { name: "Quillbot", category: "Copywriting", pricing: "Freemium", url: "https://quillbot.com", tags: ["Paraphraser", "Grammar", "Summarizer"], description: "Popular paraphrasing and summarization tool widely used by students and content writers." },
  { name: "Rytr", category: "Copywriting", pricing: "Freemium", url: "https://rytr.me", tags: ["Short Copy", "Email", "Free Tier"], description: "Budget-friendly, fast copywriting assistant producing short-form text and emails." },
  { name: "Sudowrite", category: "Copywriting", pricing: "Freemium", url: "https://sudowrite.com", tags: ["Creative", "Novel", "Fiction"], description: "Specialized writing assistant built for fiction writers, assisting with plot structures and prose." },
  { name: "NovelAI", category: "Copywriting", pricing: "Paid", url: "https://novelai.net", tags: ["Story Gen", "Anime Art", "Text Adventure"], description: "Subscription-based sandbox model for creative storytelling and anime illustration generation." },
  { name: "Hemingway Editor", category: "Copywriting", pricing: "Free", url: "https://hemingwayapp.com", tags: ["Simplicity", "Tone", "Readability"], description: "AI-enhanced editor highlighting complex sentences to maximize reading clarity." },
  { name: "Typefully", category: "Copywriting", pricing: "Freemium", url: "https://typefully.com", tags: ["Twitter", "Scheduling", "Analytics"], description: "AI writing assistant and compiler designed to schedule Twitter/X threads." },
  { name: "Wordtune", category: "Copywriting", pricing: "Freemium", url: "https://wordtune.com", tags: ["Rephraser", "Spelling", "AI Reader"], description: "AI companion that expands, shortens, or translates text as you type." },
  { name: "Anyword", category: "Copywriting", pricing: "Paid", url: "https://anyword.com", tags: ["Performance", "Analytics", "Copywriting"], description: "Performance-oriented copywriter that predicts click-through rates before publishing." },
  
  // Chatbots & Companions
  { name: "ChatGPT", category: "Chatbot", pricing: "Freemium", url: "https://chatgpt.com", tags: ["OpenAI", "Conversational", "Voice Mode"], description: "OpenAI's flagship assistant and the world's most widely used conversational AI." },
  { name: "Claude AI", category: "Chatbot", pricing: "Freemium", url: "https://claude.ai", tags: ["Anthropic", "Artifacts", "Coding"], description: "Anthropic's conversational chatbot featuring top-tier coding assistance and interactive Artifacts." },
  { name: "Gemini", category: "Chatbot", pricing: "Freemium", url: "https://gemini.google.com", tags: ["Google", "Workspace", "Extensions"], description: "Google's conversational assistant, integrated deeply with Google Search and Workspace." },
  { name: "Character.ai", category: "Chatbot", pricing: "Free", url: "https://character.ai", tags: ["Roleplay", "Companions", "Entertainment"], description: "Conversational playground hosting millions of user-defined virtual personalities and historical figures." },
  { name: "Replika", category: "Chatbot", pricing: "Freemium", url: "https://replika.ai", tags: ["Companion", "Therapy", "Avatar"], description: "The original virtual AI companion designed to provide friendship, support, and active listening." },
  { name: "Poe", category: "Chatbot", pricing: "Freemium", url: "https://poe.com", tags: ["Quora", "Multi-model", "Bots"], description: "Quora's multi-model chatbot hub allowing users to query multiple models in one interface." },
  { name: "Chai AI", category: "Chatbot", pricing: "Freemium", url: "https://chai-research.com", tags: ["Mobile Chat", "Gaming", "Entertainment"], description: "Highly engaging mobile roleplay chatbot hosting millions of custom AI characters." },
  { name: "JanitorAI", category: "Chatbot", pricing: "Free", url: "https://janitorai.com", tags: ["Roleplay", "Custom API", "Niche"], description: "Web-based companion platform supporting custom API integrations for advanced anime roleplay." },
  { name: "Inworld AI", category: "Chatbot", pricing: "Paid", url: "https://inworld.ai", tags: ["Gaming", "NPCs", "Unity"], description: "Provides real-time interactive brains to non-player characters (NPCs) in game engines." },
  { name: "Convai", category: "Chatbot", pricing: "Freemium", url: "https://convai.com", tags: ["Voice", "NPCs", "Omniverse"], description: "Specializes in low-latency conversational AI for virtual worlds and digital twins." },
  { name: "Pi AI", category: "Chatbot", pricing: "Free", url: "https://pi.ai", tags: ["Inflection", "Support", "Friendly"], description: "Inflection AI's supportive, emotionally intelligent chatbot designed for natural dialogue." },
  { name: "HugginChat", category: "Chatbot", pricing: "Free", url: "https://huggingface.co", tags: ["Open Source", "Llama", "Community"], description: "Hugging Face's open-source conversational interface running top open-weights models." },

  // Productivity Tools
  { name: "OtterPilot", category: "Productivity", pricing: "Freemium", url: "https://otter.ai", tags: ["Meeting Assistant", "Zoom", "Summarizer"], description: "AI meeting assistant that automatically joins calls to write notes and capture screen slides." },
  { name: "tl;dv", category: "Productivity", pricing: "Freemium", url: "https://tldv.io", tags: ["Meeting Notes", "Google Meet", "Timestamps"], description: "Transcribes and cuts key meeting moments with searchable timestamp bookmarks." },
  { name: "Supernormal", category: "Productivity", pricing: "Freemium", url: "https://supernormal.com", tags: ["Meeting Note", "Templates", "Notes"], description: "Generates structured corporate meeting notes matching preset project templates." },
  { name: "Fellow.app", category: "Productivity", pricing: "Freemium", url: "https://fellow.app", tags: ["Manager", "1-on-1s", "Agenda"], description: "AI agenda builder and feedback tracker designed for managers and collaborative teams." },
  { name: "Avoma", category: "Productivity", pricing: "Paid", url: "https://avoma.com", tags: ["Sales meeting", "CRM Sync", "Analytics"], description: "Sales intelligence assistant that analyzes customer conversation topics and updates pipelines." },
  { name: "MeetGeek", category: "Productivity", pricing: "Freemium", url: "https://meetgeek.ai", tags: ["Slack Integration", "Highlights", "Notes"], description: "Meeting assistant that sends key meeting highlight audio files directly into Slack channels." },
  { name: "Jamie AI", category: "Productivity", pricing: "Paid", url: "https://meetjamie.ai", tags: ["Privacy", "Offline Notes", "Executive"], description: "Privacy-focused meeting notes generator that operates across custom calendar setups." },
  { name: "Rewind AI", category: "Productivity", pricing: "Freemium", url: "https://rewind.ai", tags: ["Memory", "Mac App", "Search History"], description: "Personal local memory engine recording screen/audio to let you query your history." },
  { name: "Notion Q&A", category: "Productivity", pricing: "Paid", url: "https://notion.so", tags: ["Workspace", "Wiki Search", "Notion"], description: "Instantly retrieves answers from across all connected pages in your Notion workspaces." },
  { name: "Taskade AI", category: "Productivity", pricing: "Freemium", url: "https://taskade.com", tags: ["Mindmap", "Agents", "Task Board"], description: "Collaborative task manager utilizing custom agent teams to outline project roadmaps." },
  { name: "ClickUp Brain", category: "Productivity", pricing: "Paid", url: "https://clickup.com", tags: ["Tasks", "Search", "Wiki"], description: "AI search companion that answers questions from across all ClickUp docs, tasks, and members." },
  { name: "SaneBox", category: "Productivity", pricing: "Free Trial", url: "https://sanebox.com", tags: ["Email", "Inbound", "Folder Organizer"], description: "AI email assistant that sorts incoming newsletters and low-priority emails into distinct folders." },

  // Data & Translation
  { name: "DeepL Translate", category: "Translation", pricing: "Freemium", url: "https://deepl.com", tags: ["Translation", "Context", "Corporate"], description: "Top-tier translator utilizing contextual accuracy to translate files and texts." },
  { name: "Whisper API", category: "Translation", pricing: "Paid", url: "https://openai.com", tags: ["Speech-to-Text", "OpenAI", "Transcription"], description: "High-accuracy speech recognition API with support for translation and translation alignments." },
  { name: "Consensus Paper Search", category: "Search & Answer", pricing: "Freemium", url: "https://consensus.app", tags: ["Research", "Citations", "Science"], description: "Specialized academic search engine that extracts consensus summaries from scientific journals." },
  { name: "ChatPDF.com", category: "Data Analysis", pricing: "Free", url: "https://chatpdf.com", tags: ["PDF Loader", "Productivity", "Chat"], description: "Allows students and analysts to query large PDF structures and slide decks." },
  { name: "Julius Data Scientist", category: "Data Analysis", pricing: "Freemium", url: "https://julius.ai", tags: ["Python execution", "Graphs", "CSVs"], description: "Generates custom Python code to perform regression analysis and output spreadsheets." },
  { name: "Heptabase Boards", category: "Productivity", pricing: "Paid", url: "https://heptabase.com", tags: ["Mindmap", "Notes", "Whiteboard"], description: "Visual map system organizing card notes into infinite layout whiteboards." },
  { name: "Tome Slide Creator", category: "Productivity", pricing: "Freemium", url: "https://tome.app", tags: ["Slideshow", "Presentation", "AI Pitch"], description: "Builds high-impact visual pitch decks and structured stories from outlines." },
  { name: "Otter Notes", category: "Productivity", pricing: "Freemium", url: "https://otter.ai", tags: ["Transcriber", "Corporate", "Audio Notes"], description: "Automated note taker capturing transcripts and generating bullet points for conferences." }
];

const RAW_MODELS = [
  { name: "Claude 3.5 Sonnet", provider: "Anthropic", category: "LLM", contextWindow: "200k tokens", pricing: "$3.00 / M input | $15.00 / M output", eloRating: 1324, benchmarkScore: 88.7, openSource: false, description: "Anthropic's flagship model setting industry standards for logical reasoning, coding, and tone." },
  { name: "GPT-4o", provider: "OpenAI", category: "Multi-modal", contextWindow: "128k tokens", pricing: "$2.50 / M input | $10.00 / M output", eloRating: 1315, benchmarkScore: 88.2, openSource: false, description: "OpenAI's high-speed multimodal model supporting native speech, video, and text reasoning." },
  { name: "o1-pro", provider: "OpenAI", category: "Reasoning LLM", contextWindow: "128k tokens", pricing: "$15.00 / M input | $60.00 / M output", eloRating: 1360, benchmarkScore: 92.4, openSource: false, description: "Advanced reasoning model using reinforcement learning to think before answering complex science/math problems." },
  { name: "Gemini 1.5 Pro", provider: "Google", category: "Multi-modal", contextWindow: "2M tokens", pricing: "$1.25 / M input | $5.00 / M output", eloRating: 1290, benchmarkScore: 86.5, openSource: false, description: "Google's ultra-long context model with native multi-modality across hours of video or audio." },
  { name: "Llama 3.1 405B", provider: "Meta", category: "LLM", contextWindow: "128k tokens", pricing: "Free / Self-Hosted", eloRating: 1286, benchmarkScore: 87.1, openSource: true, description: "Meta's open-weights model matching top-tier proprietary models in capabilities and math." },
  { name: "o1-mini", provider: "OpenAI", category: "Reasoning LLM", contextWindow: "128k tokens", pricing: "$3.00 / M input | $12.00 / M output", eloRating: 1292, benchmarkScore: 86.8, openSource: false, description: "Cost-efficient reasoning model optimized for developer coding and mathematics questions." },
  { name: "Claude 3.5 Haiku", provider: "Anthropic", category: "LLM", contextWindow: "200k tokens", pricing: "$1.00 / M input | $5.00 / M output", eloRating: 1224, benchmarkScore: 82.5, openSource: false, description: "Anthropic's fastest model, combining intelligence and low latency for agentic workflows." },
  { name: "Mistral Large 2", provider: "Mistral AI", category: "LLM", contextWindow: "128k tokens", pricing: "$2.00 / M input | $6.00 / M output", eloRating: 1220, benchmarkScore: 84.0, openSource: false, description: "European high-performance model tailored for multilingual understanding and complex agent tasks." },
  { name: "Qwen 2.5 72B", provider: "Alibaba Cloud", category: "LLM", contextWindow: "128k tokens", pricing: "Free / Self-Hosted", eloRating: 1245, benchmarkScore: 85.3, openSource: true, description: "Highly advanced open-weights model with excellent Chinese and coding benchmarks." },
  { name: "DeepSeek-Coder-V2", provider: "DeepSeek", category: "Code Model", contextWindow: "128k tokens", pricing: "$0.14 / M input | $0.28 / M output", eloRating: 1278, benchmarkScore: 86.1, openSource: true, description: "Mixture-of-Experts coder model outperforming proprietary systems on code benchmarks." },
  { name: "Gemini 1.5 Flash", provider: "Google", category: "Multi-modal", contextWindow: "1M tokens", pricing: "$0.075 / M input | $0.30 / M output", eloRating: 1238, benchmarkScore: 81.2, openSource: false, description: "Google's lightweight model optimized for speed, high-frequency queries, and efficiency." },
  { name: "Grok 2", provider: "xAI", category: "LLM", contextWindow: "128k tokens", pricing: "$2.00 / M input | $10.00 / M output", eloRating: 1294, benchmarkScore: 87.5, openSource: false, description: "xAI's flagship model integrated with real-time X information streams." },
  { name: "GPT-4 Turbo", provider: "OpenAI", category: "LLM", contextWindow: "128k tokens", pricing: "$10.00 / M input | $30.00 / M output", eloRating: 1254, benchmarkScore: 85.4, openSource: false, description: "Previous generation flagship model widely integrated into legacy tools." },
  { name: "Llama 3.1 70B", provider: "Meta", category: "LLM", contextWindow: "128k tokens", pricing: "Free / Self-Hosted", eloRating: 1210, benchmarkScore: 82.0, openSource: true, description: "Meta's highly popular intermediate open-weights model designed for general chatbot systems." },
  { name: "Llama 3.1 8B", provider: "Meta", category: "LLM", contextWindow: "128k tokens", pricing: "Free / Self-Hosted", eloRating: 1140, benchmarkScore: 73.5, openSource: true, description: "Meta's lightweight model designed for localized edge devices and browser runtimes." },
  { name: "Command R+", provider: "Cohere", category: "LLM", contextWindow: "128k tokens", pricing: "$2.50 / M input | $10.00 / M output", eloRating: 1205, benchmarkScore: 81.0, openSource: true, description: "Enterprise-grade model optimized for Retrieval-Augmented Generation (RAG) and tool usage." },
  { name: "Codestral", provider: "Mistral AI", category: "Code Model", contextWindow: "32k tokens", pricing: "$1.00 / M input | $3.00 / M output", eloRating: 1198, benchmarkScore: 80.5, openSource: true, description: "Mistral's open weights code-focused model optimized for inline IDE completions." },
  { name: "Gemma 2 27B", provider: "Google", category: "LLM", contextWindow: "8k tokens", pricing: "Free / Self-Hosted", eloRating: 1202, benchmarkScore: 81.3, openSource: true, description: "Google's highly efficient open-weights model with excellent parameter performance ratios." },
  { name: "Gemma 2 9B", provider: "Google", category: "LLM", contextWindow: "8k tokens", pricing: "Free / Self-Hosted", eloRating: 1148, benchmarkScore: 74.2, openSource: true, description: "Google's small-footprint open-weights model designed for lightweight tasks." },
  { name: "Mixtral 8x22B", provider: "Mistral AI", category: "LLM", contextWindow: "64k tokens", pricing: "$2.00 / M input | $6.00 / M output", eloRating: 1182, benchmarkScore: 78.4, openSource: true, description: "Mistral's high-capacity sparse Mixture-of-Experts model supporting multi-lingual tasks." },
  { name: "Qwen 2.5 32B", provider: "Alibaba Cloud", category: "LLM", contextWindow: "128k tokens", pricing: "Free / Self-Hosted", eloRating: 1194, benchmarkScore: 79.5, openSource: true, description: "Intermediate Qwen model balancing compute footprint and reasoning skills." },
  { name: "Phi-3.5 Mini", provider: "Microsoft", category: "LLM", contextWindow: "128k tokens", pricing: "Free / Self-Hosted", eloRating: 1115, benchmarkScore: 71.4, openSource: true, description: "Microsoft's lightweight model optimized for local reasoning and low-memory tasks." },
  { name: "Command R", provider: "Cohere", category: "LLM", contextWindow: "128k tokens", pricing: "$0.50 / M input | $1.50 / M output", eloRating: 1162, benchmarkScore: 75.3, openSource: true, description: "Cohere's lighter model designed for scaling RAG tasks in enterprise databases." },
  { name: "DeepSeek-V2.5", provider: "DeepSeek", category: "LLM", contextWindow: "128k tokens", pricing: "$0.14 / M input | $0.28 / M output", eloRating: 1260, benchmarkScore: 84.8, openSource: false, description: "High-performance general reasoning model running on dynamic MoE infrastructure." },
  { name: "Mixtral 8x7B", provider: "Mistral AI", category: "LLM", contextWindow: "32k tokens", pricing: "$0.70 / M input | $2.10 / M output", eloRating: 1145, benchmarkScore: 72.8, openSource: true, description: "The original sparse MoE model that proved the viability of multi-expert systems." },
  { name: "Phi-3.5 MoE", provider: "Microsoft", category: "LLM", contextWindow: "128k tokens", pricing: "Free / Self-Hosted", eloRating: 1184, benchmarkScore: 78.9, openSource: true, description: "Microsoft's multi-expert model specializing in programming and logical deduction." },
  { name: "Qwen 2.5 14B", provider: "Alibaba Cloud", category: "LLM", contextWindow: "128k tokens", pricing: "Free / Self-Hosted", eloRating: 1172, benchmarkScore: 76.5, openSource: true, description: "Medium scale open model showing top efficiency on Chinese language benchmarks." },
  { name: "Claude 3 Opus", provider: "Anthropic", category: "LLM", contextWindow: "200k tokens", pricing: "$15.00 / M input | $75.00 / M output", eloRating: 1248, benchmarkScore: 83.2, openSource: false, description: "Anthropic's classic model known for rich prose and deep, empathetic conversational tones." },
  { name: "GPT-4", provider: "OpenAI", category: "LLM", contextWindow: "8k tokens", pricing: "$30.00 / M input | $60.00 / M output", eloRating: 1215, benchmarkScore: 81.8, openSource: false, description: "The landmark LLM that initialized the modern generative AI boom." },
  { name: "o1-preview", provider: "OpenAI", category: "Reasoning LLM", contextWindow: "128k tokens", pricing: "$15.00 / M input | $60.00 / M output", eloRating: 1318, benchmarkScore: 89.0, openSource: false, description: "OpenAI's early preview of reasoning models, displaying long-thinking patterns before replies." },
  { name: "GPT-3.5 Turbo", provider: "OpenAI", category: "LLM", contextWindow: "16k tokens", pricing: "$0.50 / M input | $1.50 / M output", eloRating: 1080, benchmarkScore: 68.0, openSource: false, description: "Legacy model that first powered early implementations of ChatGPT." },
  { name: "Mistral 7B", provider: "Mistral AI", category: "LLM", contextWindow: "32k tokens", pricing: "Free / Self-Hosted", eloRating: 1102, benchmarkScore: 70.1, openSource: true, description: "The compact model that revolutionized local deployment configurations." },
  { name: "Grok 2 Mini", provider: "xAI", category: "LLM", contextWindow: "128k tokens", pricing: "$0.60 / M input | $2.40 / M output", eloRating: 1234, benchmarkScore: 80.4, openSource: false, description: "Fast, cost-efficient Grok model optimized for quick conversational replies." },
  { name: "Claude 3 Sonnet", provider: "Anthropic", category: "LLM", contextWindow: "200k tokens", pricing: "$3.00 / M input | $15.00 / M output", eloRating: 1195, benchmarkScore: 79.0, openSource: false, description: "Anthropic's mid-tier model from the Claude 3 launch window." },
  { name: "Claude 3 Haiku", provider: "Anthropic", category: "LLM", contextWindow: "200k tokens", pricing: "$0.25 / M input | $1.25 / M output", eloRating: 1130, benchmarkScore: 72.0, openSource: false, description: "High-speed light model widely used for database preprocessing." }
];

const RAW_COMPANIES = [
  { name: "OpenAI", funding: "$13.0B", headquarters: "San Francisco, CA", productsCount: 4, modelsCount: 15, description: "Creators of ChatGPT, GPT-4, and pioneers of the generative AI consumer wave." },
  { name: "Anthropic", funding: "$7.3B", headquarters: "San Francisco, CA", productsCount: 2, modelsCount: 9, description: "AI safety and research company building the Claude family of LLMs with constitutional design." },
  { name: "Google DeepMind", funding: "Parent Backed", headquarters: "London, UK", productsCount: 8, modelsCount: 22, description: "Research division of Google responsible for AlphaGo, AlphaFold, and Gemini LLMs." },
  { name: "Mistral AI", funding: "$640M", headquarters: "Paris, France", productsCount: 3, modelsCount: 6, description: "Fast-growing European startup building efficient, competitive open and commercial models." },
  { name: "Meta AI", funding: "Parent Backed", headquarters: "Menlo Park, CA", productsCount: 5, modelsCount: 8, description: "Meta's AI research lab leading the open source AI revolution with the Llama series." },
  { name: "xAI", funding: "$6.0B", headquarters: "San Francisco, CA", productsCount: 2, modelsCount: 3, description: "Elon Musk's AI initiative developing the Grok series of chatbots linked directly to X." },
  { name: "DeepSeek", funding: "$200M", headquarters: "Hangzhou, China", productsCount: 2, modelsCount: 5, description: "Venture-funded Chinese quantitative research company building top-tier open weights models." },
  { name: "Hugging Face", funding: "$396M", headquarters: "New York, NY", productsCount: 6, modelsCount: 1500, description: "The central repository and community playground for hosting open machine learning weights and models." },
  { name: "Cohere", funding: "$970M", headquarters: "Toronto, Canada", productsCount: 4, modelsCount: 8, description: "Enterprise NLP platform specializing in multilingual embeddings and search optimization." },
  { name: "Scale AI", funding: "$1.6B", headquarters: "San Francisco, CA", productsCount: 5, modelsCount: 2, description: "Data labeling and curation platform driving dataset pipelines for LLM developers." },
  { name: "Together AI", funding: "$325M", headquarters: "San Francisco, CA", productsCount: 3, modelsCount: 4, description: "High-speed cloud cloud provider hosting open-weights models and training infrastructure." },
  { name: "Stability AI", funding: "$150M", headquarters: "London, UK", productsCount: 4, modelsCount: 10, description: "Developers of the Stable Diffusion image, audio, and video open weights framework." },
  { name: "Black Forest Labs", funding: "$31M", headquarters: "Freiburg, Germany", productsCount: 2, modelsCount: 3, description: "Leading research group behind FLUX.1 generative imagery models." },
  { name: "Perplexity AI", funding: "$250M", headquarters: "San Francisco, CA", productsCount: 2, modelsCount: 1, description: "AI search startup redefining conversational answers with citations." },
  { name: "Cursor (Anysphere)", funding: "$11M", headquarters: "San Francisco, CA", productsCount: 2, modelsCount: 1, description: "Fast-rising startup developer of the AI-first IDE Cursor." },
  { name: "Vercel", funding: "$313M", headquarters: "San Francisco, CA", productsCount: 6, modelsCount: 2, description: "Frontend deployment cloud behind Next.js and generative UI v0." },
  { name: "LangChain", funding: "$25M", headquarters: "San Francisco, CA", productsCount: 3, modelsCount: 0, description: "Open source framework providing developer components to chain LLM components." },
  { name: "LlamaIndex", funding: "$8M", headquarters: "San Francisco, CA", productsCount: 2, modelsCount: 0, description: "Data indexing framework that connects private files to LLMs." },
  { name: "Pinecone", funding: "$138M", headquarters: "New York, NY", productsCount: 2, modelsCount: 0, description: "Managed vector database supporting real-time similarity search." },
  { name: "Weaviate", funding: "$79M", headquarters: "Amsterdam, Netherlands", productsCount: 2, modelsCount: 0, description: "Open source vector search engine optimizing semantic data queries." },
  { name: "Qdrant", funding: "$37M", headquarters: "Berlin, Germany", productsCount: 2, modelsCount: 0, description: "Rust-based vector search engine designed for scale and developer speed." },
  { name: "Chroma DB", funding: "$18M", headquarters: "San Francisco, CA", productsCount: 1, modelsCount: 0, description: "Lightweight, embeddable vector database built specifically for Python development." },
  { name: "Weights & Biases", funding: "$250M", headquarters: "San Francisco, CA", productsCount: 4, modelsCount: 0, description: "Machine learning operations framework helping developers monitor training runs." },
  { name: "Replit", funding: "$290M", headquarters: "San Francisco, CA", productsCount: 4, modelsCount: 3, description: "Cloud IDE sandbox behind the Replit Agent autonomous app compiler." },
  { name: "Cognition AI", funding: "$196M", headquarters: "San Francisco, CA", productsCount: 1, modelsCount: 1, description: "Creators of Devin, the fully autonomous AI software developer." },
  { name: "ElevenLabs", funding: "$101M", headquarters: "London, UK", productsCount: 3, modelsCount: 4, description: "Research laboratory leading synthetic voice and multi-lingual speech generation." },
  { name: "Suno AI", funding: "$125M", headquarters: "Cambridge, MA", productsCount: 1, modelsCount: 2, description: "Music synthesis startup generating full-length songs from text description." },
  { name: "Udio Music", funding: "$10M", headquarters: "New York, NY", productsCount: 1, modelsCount: 1, description: "Founded by ex-DeepMind researchers, specializing in high-fidelity musical audio." },
  { name: "Runway", funding: "$237M", headquarters: "New York, NY", productsCount: 3, modelsCount: 5, description: "Creative tools developer leading generative video and camera research." },
  { name: "Luma Labs", funding: "$70M", headquarters: "San Francisco, CA", productsCount: 3, modelsCount: 3, description: "3D capture and video generation startup behind Dream Machine." },
  { name: "Pika Labs", funding: "$55M", headquarters: "San Francisco, CA", productsCount: 1, modelsCount: 2, description: "Video editing platform specializing in custom visual effect animations." },
  { name: "HeyGen Avatars", funding: "$60M", headquarters: "Los Angeles, CA", productsCount: 2, modelsCount: 2, description: "AI video generation startup creating digital actors and clones." },
  { name: "Synthesia Video", funding: "$156M", headquarters: "London, UK", productsCount: 2, modelsCount: 3, description: "Enterprise video synthesis startup utilizing actors for corporate training." },
  { name: "Midjourney Inc", funding: "Bootstrapped", headquarters: "San Francisco, CA", productsCount: 1, modelsCount: 6, description: "Independent bootstrapped lab producing state-of-the-art text-to-image software." },
  { name: "Character AI", funding: "$193M", headquarters: "Palo Alto, CA", productsCount: 1, modelsCount: 4, description: "Chatbot companion network founded by transformer inventors." },
  { name: "Inflection AI", funding: "$1.5B", headquarters: "Palo Alto, CA", productsCount: 2, modelsCount: 2, description: "AI studio behind the conversational supportive assistant Pi." },
  { name: "CoreWeave", funding: "$12.0B", headquarters: "Roseland, NJ", productsCount: 4, modelsCount: 0, description: "Specialized GPU cloud provider powering training jobs for LLM laboratories." },
  { name: "Lambda Labs", funding: "$500M", headquarters: "San Jose, CA", productsCount: 4, modelsCount: 0, description: "GPU cloud and hardware compiler tailored for machine learning developers." },
  { name: "RunPod", funding: "$20M", headquarters: "Mount Laurel, NJ", productsCount: 3, modelsCount: 0, description: "Serverless GPU deployment platform popular for image and video synthesis APIs." },
  { name: "Braintrust", funding: "$5M", headquarters: "San Francisco, CA", productsCount: 2, modelsCount: 0, description: "Evaluation framework helping engineering teams track, log, and benchmark prompt completions." },
  { name: "Langfuse", funding: "$4M", headquarters: "Berlin, Germany", productsCount: 2, modelsCount: 0, description: "Open source LLM engineering analytics, tracing, and prompt management console." },
  { name: "Julius AI Inc", funding: "$5M", headquarters: "San Francisco, CA", productsCount: 1, modelsCount: 0, description: "AI mathematical analysis startup compiling Python execution cells." },
  { name: "Photoroom SAS", funding: "$62M", headquarters: "Paris, France", productsCount: 2, modelsCount: 2, description: "E-commerce photography editors optimizing commercial backdrops." },
  { name: "Consensus App", funding: "$3M", headquarters: "Boston, MA", productsCount: 1, modelsCount: 0, description: "Scientific evidence synthesizer querying literature repositories." },
  { name: "Gamma App Inc", funding: "$7M", headquarters: "San Francisco, CA", productsCount: 1, modelsCount: 0, description: "Presentation slide generation canvas transforming prompts to page structures." },
  { name: "Tome Inc", funding: "$81M", headquarters: "San Francisco, CA", productsCount: 1, modelsCount: 0, description: "Creative presentation canvas focusing on structured layouts." },
  { name: "Descript Inc", funding: "$100M", headquarters: "San Francisco, CA", productsCount: 2, modelsCount: 2, description: "Text-based video and audio editing platform." },
  { name: "DeepL SE", funding: "$400M", headquarters: "Cologne, Germany", productsCount: 3, modelsCount: 4, description: "European translation technology giants specializing in cognitive translations." },
  { name: "AssemblyAI", funding: "$118M", headquarters: "San Francisco, CA", productsCount: 2, modelsCount: 3, description: "High-speed audio intelligence and transcription API platform." },
  { name: "Otter.ai Inc", funding: "$63M", headquarters: "Mountain View, CA", productsCount: 2, modelsCount: 1, description: "Leading note capturing transcribers recording corporate calls." },
  { name: "Fathom Video", funding: "$5M", headquarters: "San Francisco, CA", productsCount: 1, modelsCount: 0, description: "Free meeting helper providing detailed timestamps and summaries." },
  { name: "Fireflies AI", funding: "$13M", headquarters: "Boston, MA", productsCount: 1, modelsCount: 0, description: "Searchable meeting logs automatically synchronized to sales CRM pipelines." },
  { name: "Anyscale", funding: "$250M", headquarters: "San Francisco, CA", productsCount: 2, modelsCount: 0, description: "Developers of Ray, the compute framework powering distributed training runs." },
  { name: "Hugging Face Inc", funding: "$396M", headquarters: "New York, NY", productsCount: 5, modelsCount: 1, description: "Collaborative developer center hosting datasets and open weight checkpoints." },
  { name: "Mistral AI SAS", funding: "$640M", headquarters: "Paris, France", productsCount: 3, modelsCount: 6, description: "Parisian lab optimizing large language model models for parameters." },
  { name: "Scale AI Inc", funding: "$1.6B", headquarters: "San Francisco, CA", productsCount: 4, modelsCount: 1, description: "Data labeling provider curating multi-modal files for autonomous vehicle models." }
];

// ==========================================
// 2. COMPILE DATABASES & ASSIGN METRICS
// ==========================================

const finalTools = [];
RAW_TOOLS.forEach((t, i) => {
  const votes = 28000 - i * 220 - randomInRange(0, 150);
  const rating = parseFloat((4.9 - (i * 0.005) - (Math.random() * 0.08)).toFixed(1));
  finalTools.push({
    id: `tool-${i + 1}`,
    name: t.name,
    category: t.category,
    tags: t.tags,
    rank: 0, // Assigned later
    growth: randomGrowth(),
    votes: Math.max(100, votes),
    rating: Math.max(3.8, Math.min(5.0, rating)),
    saves: Math.max(50, Math.floor(votes * (0.15 + Math.random() * 0.2))),
    url: t.url,
    description: t.description,
    pricing: t.pricing,
    history: generateWalk(7, randomInRange(20, 60)),
    addedDate: `2025-0${randomInRange(1, 6)}-${randomInRange(10, 28)}`
  });
});

const additionalToolTemplates = [
  { name: "CapCut Online", category: "Video Editing", pricing: "Free", url: "https://capcut.com", tags: ["Web Video", "Simple", "Effects"], description: "Web browser companion version of the CapCut video creation suite." },
  { name: "Udio AI Beta", category: "Audio & Voice", pricing: "Free", url: "https://udio.com", tags: ["Music", "Vocals", "Instruments"], description: "Beta music synthesis workspace with advanced lyric models." },
  { name: "v0 component search", category: "UI/UX Design", pricing: "Free", url: "https://v0.dev", tags: ["React", "UI search", "Tailwind"], description: "Public search database of generated React and Tailwind UI components." },
  { name: "GitHub Copilot Chat", category: "Code Assistant", pricing: "Paid", url: "https://github.com", tags: ["Chat", "IDE extension", "Coding"], description: "Sidebar chat assistant in VS Code providing explanations, unit tests, and bug fixes." },
  { name: "Claude Project Workspace", category: "Productivity", pricing: "Paid", url: "https://claude.ai", tags: ["Workspace", "Projects", "Context"], description: "Allows teams to group Claude chats and files into shared project contexts." },
  { name: "NotebookLM Podcaster", category: "Productivity", pricing: "Free", url: "https://notebooklm.google", tags: ["Audio Gen", "Podcast", "Google"], description: "Converts documents into highly realistic two-host conversational podcast audio files." },
  { name: "DALL-E Editor", category: "Image Generation", pricing: "Freemium", url: "https://openai.com", tags: ["Inpainting", "Editing", "ChatGPT"], description: "Inpainting and outpainting tool integrated directly inside ChatGPT's image canvas." },
  { name: "Otter Web Reader", category: "Productivity", pricing: "Freemium", url: "https://otter.ai", tags: ["Transcript", "Browser Extension", "Meetings"], description: "Captures and transcribes audio directly from web browser tabs." },
  { name: "DeepL Write", category: "Copywriting", pricing: "Free", url: "https://deepl.com", tags: ["Proofreader", "Grammar", "Tone Changer"], description: "AI writing companion that refines phrasing, corrects grammar, and changes tone." },
  { name: "Consensus Search API", category: "Search & Answer", pricing: "Paid", url: "https://consensus.app", tags: ["Scientific API", "Research", "Database"], description: "Integrates scientific consensus lookup directly into custom research apps." },
  { name: "Taskade Agents", category: "Productivity", pricing: "Freemium", url: "https://taskade.com", tags: ["Custom Agents", "Teamwork", "Workflow"], description: "Configures teams of autonomous AI agents to manage project tasks." },
  { name: "Loom AI Add-On", category: "Productivity", pricing: "Paid", url: "https://loom.com", tags: ["Video notes", "Screen record", "Loom"], description: "Generates chapters, titles, and video emails automatically from recorded screen captures." },
  { name: "SaneBox Email Folder", category: "Productivity", pricing: "Free Trial", url: "https://sanebox.com", tags: ["Inbox Cleaner", "Gmail helper", "Spam"], description: "Scans email headers to isolate newsletters, keeping primary folders clean." },
  { name: "Speechify Reader Extension", category: "Audio & Voice", pricing: "Freemium", url: "https://speechify.com", tags: ["Chrome extension", "TTS", "Speech Reader"], description: "Browser reader that speaks text in web articles aloud." },
  { name: "Heptabase Map Canvas", category: "Productivity", pricing: "Paid", url: "https://heptabase.com", tags: ["Workspace", "Visual map", "Notes"], description: "Visual map canvas managing note connections with deep PDF annotators." },
  { name: "Anyword Copy Analyzer", category: "Copywriting", pricing: "Paid", url: "https://anyword.com", tags: ["Copywriting", "Performance score", "SEO"], description: "Scores writing copies on expected target-audience click through conversions." },
  { name: "Captions Video Teleprompter", category: "Video Editing", pricing: "Paid", url: "https://captions.ai", tags: ["Mobile App", "Teleprompter", "Voice sync"], description: "Syncs text templates with spoken vocal tracks in recorded mobile clips." },
  { name: "ElevenLabs Sound Effects", category: "Audio & Voice", pricing: "Freemium", url: "https://elevenlabs.io", tags: ["Sound FX", "Audio", "Creation"], description: "Generates high-fidelity sound clips and foley audio files from prompts." },
  { name: "Suno Song Remix", category: "Audio & Voice", pricing: "Freemium", url: "https://suno.com", tags: ["Music edit", "Vocals", "Harmony"], description: "Allows song editing by modifying track descriptions or lyric selections." },
  { name: "Descript Voice Cloning", category: "Audio & Voice", pricing: "Freemium", url: "https://descript.com", tags: ["Voiceover", "Overdub", "Clone"], description: "Clones user vocals to write corrections directly into audio files." },
  { name: " v0 dev page", category: "UI/UX Design", pricing: "Free", url: "https://v0.dev", tags: ["HTML", "Vercel", "Tailwind CSS"], description: "Public browser engine reviewing components before export." },
  { name: "Phind Developer API", category: "Code Assistant", pricing: "Paid", url: "https://phind.com", tags: ["Developer search", "API", "Documentation"], description: "Developer documentation search endpoint providing clean code chunks." },
  { name: "Otter Meeting Bot", category: "Productivity", pricing: "Freemium", url: "https://otter.ai", tags: ["Calendar Sync", "Zoom Bot", "Teams"], description: "Integrates with Outlook or Google Calendars to join corporate webinars." }
];

let toolCount = finalTools.length;
for (const temp of additionalToolTemplates) {
  if (toolCount >= 115) break;
  const votes = 5000 - toolCount * 40 - randomInRange(0, 50);
  const rating = parseFloat((4.5 - (toolCount * 0.003) - (Math.random() * 0.05)).toFixed(1));
  finalTools.push({
    id: `tool-${toolCount + 1}`,
    name: temp.name,
    category: temp.category,
    tags: temp.tags,
    rank: 0,
    growth: randomGrowth(),
    votes: Math.max(50, votes),
    rating: Math.max(3.5, Math.min(5.0, rating)),
    saves: Math.max(10, Math.floor(votes * (0.1 + Math.random() * 0.15))),
    url: temp.url,
    description: temp.description,
    pricing: temp.pricing,
    history: generateWalk(7, randomInRange(15, 45)),
    addedDate: `2025-0${randomInRange(1, 6)}-${randomInRange(10, 28)}`
  });
  toolCount++;
}

finalTools.sort((a, b) => {
  if (b.rating === a.rating) return b.votes - a.votes;
  return b.rating - a.rating;
});
finalTools.forEach((item, idx) => {
  item.rank = idx + 1;
});


const finalModels = [];
RAW_MODELS.forEach((m, i) => {
  const votes = 22000 - i * 400 - randomInRange(0, 100);
  const rating = parseFloat((4.9 - (i * 0.01) - (Math.random() * 0.05)).toFixed(1));
  finalModels.push({
    id: `model-${i + 1}`,
    name: m.name,
    provider: m.provider,
    category: m.category,
    rank: 0, // Assigned later
    growth: randomGrowth(),
    contextWindow: m.contextWindow,
    pricing: m.pricing,
    eloRating: m.eloRating,
    benchmarkScore: m.benchmarkScore,
    openSource: m.openSource,
    votes: Math.max(100, votes),
    rating: Math.max(3.8, Math.min(5.0, rating)),
    saves: Math.max(20, Math.floor(votes * (0.12 + Math.random() * 0.18))),
    history: generateWalk(7, randomInRange(30, 80)),
    description: m.description
  });
});

finalModels.sort((a, b) => {
  if (b.benchmarkScore === a.benchmarkScore) return b.eloRating - a.eloRating;
  return b.benchmarkScore - a.benchmarkScore;
});
finalModels.forEach((item, idx) => {
  item.rank = idx + 1;
});


const finalCompanies = [];
RAW_COMPANIES.forEach((c, i) => {
  const votes = 48000 - i * 650 - randomInRange(0, 200);
  const rating = parseFloat((4.9 - (i * 0.008) - (Math.random() * 0.04)).toFixed(1));
  finalCompanies.push({
    id: `company-${i + 1}`,
    name: c.name,
    rank: 0, // Assigned later
    growth: randomGrowth(),
    funding: c.funding,
    headquarters: c.headquarters,
    productsCount: c.productsCount,
    modelsCount: c.modelsCount,
    votes: Math.max(200, votes),
    rating: Math.max(4.0, Math.min(5.0, rating)),
    saves: Math.max(50, Math.floor(votes * (0.18 + Math.random() * 0.22))),
    history: generateWalk(7, randomInRange(40, 90)),
    description: c.description
  });
});

finalCompanies.sort((a, b) => b.votes - a.votes);
finalCompanies.forEach((item, idx) => {
  item.rank = idx + 1;
});

const databaseObj = {
  tools: finalTools,
  models: finalModels,
  companies: finalCompanies
};

const targetPath = path.join(__dirname, 'data.json');
fs.writeFileSync(targetPath, JSON.stringify(databaseObj, null, 2), 'utf-8');

console.log(`Database generated successfully!`);
console.log(`- Tools: ${finalTools.length}`);
console.log(`- Models: ${finalModels.length}`);
console.log(`- Companies: ${finalCompanies.length}`);
console.log(`Location: ${targetPath}`);
