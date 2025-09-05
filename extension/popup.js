document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const statusIndicator = document.getElementById('status-indicator');
    const tutorialBtn = document.getElementById('tutorial-btn');
    const langButtons = document.querySelectorAll('.lang-btn');
    
    let isActive = false;
    
    // Language functionality
    function updateLanguage() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = window.langManager.t(key);
            element.textContent = translation;
        });
        
        // Update document language attribute
        document.documentElement.lang = window.langManager.getCurrentLanguage();
        
        // Update language button active state
        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === window.langManager.getCurrentLanguage());
        });
    }
    
    // Language button event listeners
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const newLang = btn.dataset.lang;
            window.langManager.setLanguage(newLang);
            updateLanguage();
        });
    });
    
    // Initialize language
    updateLanguage();
    
    tutorialBtn.addEventListener('click', function() {
        chrome.tabs.create({ url: chrome.runtime.getURL('tutorial.html') });
    });
    
    function updateUI(active) {
        isActive = active;
        
        if (active) {
            startBtn.disabled = true;
            stopBtn.disabled = false;
            statusIndicator.className = 'status-active';
            statusIndicator.innerHTML = `<span class="status-dot"></span><span>${window.langManager.t('statusActive')}</span>`;
        } else {
            startBtn.disabled = false;
            stopBtn.disabled = true;
            statusIndicator.className = 'status-inactive';
            statusIndicator.innerHTML = `<span class="status-dot"></span><span>${window.langManager.t('statusInactive')}</span>`;
        }
    }
    
    startBtn.addEventListener('click', function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            const tabId = tabs[0].id;
            
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['content.js']
            }, function() {
                if (chrome.runtime.lastError) {
                    console.error('Script injection failed:', chrome.runtime.lastError);
                    return;
                }
                
                chrome.scripting.insertCSS({
                    target: { tabId: tabId },
                    files: ['content.css']
                });
                
                setTimeout(() => {
                    chrome.tabs.sendMessage(tabId, { action: 'startSelection' }, function(response) {
                        if (!chrome.runtime.lastError) {
                            updateUI(true);
                            chrome.storage.local.set({ selectorToolActive: true });
                        } else {
                            console.error('Message failed:', chrome.runtime.lastError);
                        }
                    });
                }, 200);
            });
        });
    });
    
    stopBtn.addEventListener('click', function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'stopSelection' }, function(response) {
                updateUI(false);
                chrome.storage.local.set({ selectorToolActive: false });
            });
        });
    });
    
    chrome.storage.local.get(['selectorToolActive'], function(result) {
        updateUI(result.selectorToolActive || false);
    });
    
    chrome.storage.onChanged.addListener(function(changes, namespace) {
        if (changes.selectorToolActive) {
            updateUI(changes.selectorToolActive.newValue);
        }
    });
    
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        console.log('Popup received message:', request);
        if (request.action === 'selectionStopped') {
            updateUI(false);
            chrome.storage.local.set({ selectorToolActive: false });
        }
        sendResponse({ status: 'ok' });
    });
});