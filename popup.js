document.addEventListener('DOMContentLoaded', function() {
    const extractBtn = document.getElementById('extractBtn');
    const resultArea = document.getElementById('resultArea');
    const copyBtn = document.getElementById('copyBtn');
    const saveBtn = document.getElementById('saveBtn');

    // テキスト抽出の処理
    extractBtn.addEventListener('click', async () => {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab) {
                throw new Error('アクティブなタブが見つかりません');
            }

            if (!tab.url.includes('perplexity.ai')) {
                throw new Error('PerplexityのURLでのみ動作します');
            }

            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['content.js']
            });

            const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractText' });
            if (response && response.text) {
                resultArea.value = response.text;
            } else {
                throw new Error('テキストの抽出に失敗しました');
            }
        } catch (error) {
            resultArea.value = 'エラーが発生しました: ' + error.message;
            console.error('Error:', error);
        }
    });

    // クリップボードにコピーする処理
    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(resultArea.value);
            const originalText = resultArea.value;
            resultArea.value = 'テキストをクリップボードにコピーしました！';
            setTimeout(() => {
                resultArea.value = originalText;
            }, 1000);
        } catch (error) {
            resultArea.value = 'コピーに失敗しました: ' + error.message;
        }
    });

    // テキストファイルとして保存する処理
    saveBtn.addEventListener('click', () => {
        try {
            const blob = new Blob([resultArea.value], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `perplexity_${new Date().toISOString().slice(0,10)}.txt`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            resultArea.value = '保存に失敗しました: ' + error.message;
        }
    });
});
