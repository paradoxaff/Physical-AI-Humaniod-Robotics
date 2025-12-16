const fs = require('fs');
const path = require('path');
const { createWorker } = require('tesseract.js');

// Simple in-memory storage for document content
let documentContent = '';

// Load all book content
function loadBookContent() {
    // Load the summary file
    const summaryPath = path.join(__dirname, '..', 'docs', 'physical-ai-humanoid-robotics-summary.mdx');
    if (fs.existsSync(summaryPath)) {
        documentContent += fs.readFileSync(summaryPath, 'utf8') + '\n';
    }

    // Load all module content
    const modulesDir = path.join(__dirname, '..', 'docs', 'modules');
    if (fs.existsSync(modulesDir)) {
        const modules = fs.readdirSync(modulesDir);
        for (const moduleDir of modules) {
            const modulePath = path.join(modulesDir, moduleDir);
            if (fs.statSync(modulePath).isDirectory()) {
                const moduleFiles = fs.readdirSync(modulePath);
                for (const file of moduleFiles) {
                    if (file.endsWith('.mdx')) {
                        const filePath = path.join(modulePath, file);
                        documentContent += fs.readFileSync(filePath, 'utf8') + '\n';
                    }
                }
            }
        }
    }

    console.log(`Loaded ${documentContent.length} characters of book content`);
}

// Simple search function to find relevant content based on keywords
function findRelevantContent(question) {
    const questionLower = question.toLowerCase();
    const paragraphs = documentContent.split('\n\n');

    // Score each paragraph based on keyword matches
    const scoredParagraphs = paragraphs.map(paragraph => {
        let score = 0;
        const paragraphLower = paragraph.toLowerCase();

        // Split question into words and check for matches
        const questionWords = questionLower.split(/\W+/).filter(word => word.length > 2);
        for (const word of questionWords) {
            if (paragraphLower.includes(word)) {
                score++;
            }
        }

        // Boost score for headers
        if (paragraphLower.includes('# ')) {
            score *= 2;
        }

        return { content: paragraph, score };
    });

    // Sort by score and return top results
    scoredParagraphs.sort((a, b) => b.score - a.score);
    const topResults = scoredParagraphs.filter(item => item.score > 0).slice(0, 3);

    if (topResults.length === 0) {
        return "I couldn't find relevant content in the book for your question. Please try rephrasing or ask about a specific topic like ROS 2, Gazebo, Isaac, or Vision-Language-Action.";
    }

    return topResults.map(result => result.content).join('\n\n');
}

// Main chatbot function
function getChatbotResponse(userQuestion) {
    if (!documentContent) {
        loadBookContent();
    }

    // Handle greetings and simple questions
    const lowerQuestion = userQuestion.toLowerCase();
    if (lowerQuestion.includes('hello') || lowerQuestion.includes('hi') || lowerQuestion.includes('hey')) {
        return "Hello! I'm your Physical AI & Humanoid Robotics textbook assistant. You can ask me questions about any of the modules in the book, such as ROS 2, Gazebo, Unity, Isaac, Vision-Language-Action, or the capstone project.";
    }

    if (lowerQuestion.includes('help') || lowerQuestion.includes('what can you do')) {
        return "I can answer questions about the Physical AI & Humanoid Robotics textbook. The book covers 4 modules:\n1. The Robotic Nervous System (ROS 2)\n2. Simulation Environments (Gazebo & Unity)\n3. NVIDIA Isaac\n4. Vision-Language-Action and Capstone\n\nAsk me anything about these topics!";
    }

    if (lowerQuestion.includes('thank') || lowerQuestion.includes('bye') || lowerQuestion.includes('thanks')) {
        return "You're welcome! Feel free to ask more questions about the Physical AI & Humanoid Robotics textbook.";
    }

    // Find and return relevant content
    const relevantContent = findRelevantContent(userQuestion);
    return relevantContent;
}

module.exports = {
    getChatbotResponse,
    loadBookContent
};