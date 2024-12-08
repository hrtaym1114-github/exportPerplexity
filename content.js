console.log('Perplexity会話抽出ツール: コンテンツスクリプトが読み込まれました');

function extractConversation() {
    console.log('会話の抽出を開始します');
    const conversations = [];

    // Perplexityの会話要素を探す
    const messageElements = document.querySelectorAll('.react-scroll-to-bottom > div > div > div');

    messageElements.forEach((element, index) => {
        const roleElement = element.querySelector('div[class^="ConversationItem_role"]');
        const contentElement = element.querySelector('div[class^="ConversationItem_content"]');
        
        if (roleElement && contentElement) {
            const role = roleElement.textContent.trim();
            const content = contentElement.textContent.trim();
            
            console.log(`メッセージ ${index + 1}:`, { role, content });
            
            if (role && content) {
                conversations.push({ role, content });
            }
        }
    });

    console.log('抽出された会話:', conversations);
    return conversations;
}

// Perplexityのページからテキストを抽��する関数
function extractPerplexityContent() {
    // 複数のセレクタを試して、最適なものを使用
    const selectors = [
        '.prose',
        '.react-scroll-to-bottom div[class^="ConversationItem_content"]',
        '.message-content'
    ];

    let extractedText = '';
    
    for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
            elements.forEach(element => {
                const text = element.textContent.trim();
                if (text) {
                    extractedText += text + '\n\n';
                }
            });
            break; // 最初に見つかったセレクタを使用
        }
    }
    
    return extractedText || 'テキストが見つかりませんでした。';
}

// メッセージリスナー
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('メッセージを受信:', request);
    if (request.action === 'extractText') {
        const text = extractPerplexityContent();
        console.log('抽出されたテキスト:', text);
        sendResponse({ text: text });
    }
    return true;
});
