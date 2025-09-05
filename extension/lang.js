const LANGUAGES = {
    vi: {
        extensionTitle: "Element Selector",
        extensionSubtitle: "Chọn element và copy selector dễ dàng",
        tutorialButton: "Xem hướng dẫn chi tiết",
        startSelectionButton: "Bắt đầu chọn element",
        stopSelectionButton: "Dừng chọn",
        statusInactive: "Chưa kích hoạt",
        statusActive: "Đang chọn element...",
        addToChrome: "Thêm vào Chrome",
        addToStore: "Extension này sẽ sớm có mặt trên Chrome Web Store!",
        
        // Content script notifications
        selectionStarted: "Chế độ chọn element đã bật. Click vào element để copy selector.",
        selectorCopied: "Đã copy",
        selectorCopyFailed: "Không thể copy:",
        selectorTypeId: " (ID)",
        selectorTypeIdContext: " (ID với context)",
        selectorTypeClass: " (Class)",
        selectorTypeClassContext: " (Class với context)",
        selectorTypeData: " (Data attribute)",
        selectorTypeFullPath: " (Full path)",
        
        // Tutorial page
        tutorialTitle: "Hướng Dẫn Sử Dụng",
        tutorialSubtitle: "Element Selector - Chọn element và copy selector dễ dàng",
        tutorialCloseButton: "Đóng hướng dẫn",
        howToUse: "Cách Sử Dụng",
        features: "Tính Năng Nổi Bật",
        tips: "Mẹo Sử Dụng",
        examples: "Ví Dụ Selector",
        troubleshooting: "Khắc Phục Sự Cố",
        
        // Additional tutorial content
        tipsShortcuts: "Phím Tắt & Thao Tác:",
        exampleIntro: "Extension tạo selector thông minh theo độ ưu tiên và độ chính xác:",
        troubleshootingIntro: "Nếu gặp vấn đề:",
        
        // Selector examples
        example1Title: "1. ID với Context (Chính xác nhất):",
        example1Desc: "ID kết hợp với parent context để tránh trùng lặp",
        example2Title: "2. Data Attributes (Automation-friendly):",
        example2Desc: "Ưu tiên các attribute dành cho automation testing",
        example3Title: "3. Class với Context:",
        example3Desc: "Classes cụ thể (loại bỏ generic class) với parent context",
        example4Title: "4. Full Path với Attributes:",
        example4Desc: "Path đầy đủ với attributes và position khi cần thiết",
        
        // Troubleshooting items
        trouble1: "Refresh trang web nếu extension không phản hồi",
        trouble2: "Kiểm tra console (F12) để xem lỗi",
        trouble3: "Tắt và bật lại extension nếu cần",
        trouble4: "Extension hoạt động tốt nhất trên các trang web thông thường",
        
        // Tips items
        tip1: "Nhấn ESC để thoát chế độ chọn",
        tip2: "Click nút '⏹️ Dừng chọn' để dừng thủ công",
        tip3: "Sau khi copy, có thể tiếp tục chọn element khác",
        tip4: "Notification sẽ hiển thị kết quả copy",
        
        // Tutorial specific content
        tutorialFeature1Title: "Chính Xác",
        tutorialFeature1Desc: "Ưu tiên ID, class, tạo selector chính xác nhất",
        tutorialFeature2Title: "Nhanh Chóng",
        tutorialFeature2Desc: "Copy selector chỉ với 1 click, không cần inspect",
        tutorialFeature3Title: "Liên Tục",
        tutorialFeature3Desc: "Chọn nhiều element liên tiếp mà không cần bật lại",
        tutorialFeature4Title: "Trực Quan",
        tutorialFeature4Desc: "Highlight element rõ ràng, dễ nhìn",
        
        // Steps
        step1Title: "Cài Đặt Extension",
        step1Desc: "Thêm extension vào Chrome từ store hoặc load local (xem hướng dẫn cài đặt bên dưới)",
        step2Title: "Mở Extension", 
        step2Desc: "Click vào icon extension trên toolbar Chrome. Popup sẽ hiển thị giao diện điều khiển",
        step3Title: "Bật Chế Độ Chọn",
        step3Desc: "Click nút \"Bắt đầu chọn element\" để kích hoạt chế độ chọn element",
        step4Title: "Chọn Element",
        step4Desc: "Di chuyển chuột qua các element trên trang web. Element sẽ được highlight màu đỏ",
        step5Title: "Copy Selector", 
        step5Desc: "Click vào element mong muốn. Selector sẽ tự động được copy vào clipboard",
        step6Title: "Tiếp Tục Chọn",
        step6Desc: "Sau khi copy, có thể tiếp tục chọn element khác mà không cần bật lại chế độ chọn",
        step7Title: "Dừng Chọn",
        step7Desc: "Nhấn phím ESC hoặc click nút \"Dừng chọn\" để thoát chế độ chọn",
        step8Title: "Sử Dụng Selector",
        step8Desc: "Paste selector đã copy vào code, automation tool, hoặc bất kỳ nơi nào cần thiết",
        
        // Installation
        installTitle: "Hướng Dẫn Cài Đặt Extension",
        installLocal: "Cài Đặt Local (Hiện tại)",
        installStore: "Chrome Web Store (Sắp tới)",
        availableNow: "Có sẵn ngay",
        comingSoon: "Coming Soon",
        
        // Additional popup translations
        currentMethod: "Hiện tại:",
        upcomingMethod: "Sắp tới:",
        localInstall: "Load extension từ thư mục local",
        storeInstall: "Cài đặt từ Chrome Store với 1 click!",
    },
    
    en: {
        // Extension popup
        extensionTitle: "Element Selector",
        extensionSubtitle: "Select elements and copy selectors easily",
        tutorialButton: "View detailed guide",
        startSelectionButton: "Start selecting elements",
        stopSelectionButton: "Stop selection",
        statusInactive: "Inactive",
        statusActive: "Selecting elements...",
        addToChrome: "Add to Chrome",
        addToStore: "This extension will soon be available on Chrome Web Store!",
        
        // Content script notifications
        selectionStarted: "Element selection mode activated. Click on elements to copy their selectors.",
        selectorCopied: "Copied",
        selectorCopyFailed: "Failed to copy:",
        selectorTypeId: " (ID)",
        selectorTypeIdContext: " (ID with context)",
        selectorTypeClass: " (Class)",
        selectorTypeClassContext: " (Class with context)",
        selectorTypeData: " (Data attribute)",
        selectorTypeFullPath: " (Full path)",
        
        // Tutorial page
        tutorialTitle: "User Guide",
        tutorialSubtitle: "Element Selector - Select elements and copy selectors easily",
        tutorialCloseButton: "← Close guide",
        howToUse: "How to Use",
        features: "Key Features",
        tips: "Usage Tips",
        examples: "Selector Examples",
        troubleshooting: "Troubleshooting",
        
        // Additional tutorial content  
        tipsShortcuts: "Shortcuts & Actions:",
        exampleIntro: "Extension creates smart selectors based on priority and accuracy:",
        troubleshootingIntro: "If you encounter issues:",
        
        // Selector examples
        example1Title: "1. ID with Context (Most accurate):",
        example1Desc: "ID combined with parent context to avoid duplication",
        example2Title: "2. Data Attributes (Automation-friendly):",
        example2Desc: "Prioritize attributes designed for automation testing",
        example3Title: "3. Class with Context:",
        example3Desc: "Specific classes (excluding generic classes) with parent context",
        example4Title: "4. Full Path with Attributes:",
        example4Desc: "Complete path with attributes and position when necessary",
        
        // Troubleshooting items
        trouble1: "Refresh the webpage if extension doesn't respond",
        trouble2: "Check console (F12) to see errors",
        trouble3: "Turn off and on extension if needed",
        trouble4: "Extension works best on regular websites",
        
        // Tips items
        tip1: "Press ESC to exit selection mode",
        tip2: "Click 'Stop selection' button to stop manually",
        tip3: "After copying, you can continue selecting other elements",
        tip4: "Notification will display copy results",
        
        // Steps
        step1Title: "Install Extension",
        step1Desc: "Add extension to Chrome from store or load locally (see installation guide below)",
        step2Title: "Open Extension",
        step2Desc: "Click extension icon on Chrome toolbar. Popup will show control interface",
        step3Title: "Enable Selection Mode",
        step3Desc: "Click \"Start selecting elements\" button to activate element selection mode",
        step4Title: "Select Elements",
        step4Desc: "Move mouse over elements on the webpage. Elements will be highlighted in red",
        step5Title: "Copy Selector",
        step5Desc: "Click on desired element. Selector will be automatically copied to clipboard",
        step6Title: "Continue Selecting",
        step6Desc: "After copying, you can continue selecting other elements without restarting selection mode",
        step7Title: "Stop Selection",
        step7Desc: "Press ESC key or click \"Stop selection\" button to exit selection mode",
        step8Title: "Use Selector",
        step8Desc: "Paste the copied selector into your code, automation tool, or wherever needed",
        
        // Installation
        installTitle: "Extension Installation Guide",
        installLocal: "Local Installation (Current)",
        installStore: "Chrome Web Store (Coming Soon)",
        availableNow: "Available Now",
        comingSoon: "Coming Soon",
        
        // Additional popup translations
        currentMethod: "Current:",
        upcomingMethod: "Coming:",
        localInstall: "Load extension from local folder",
        storeInstall: "Install from Chrome Store with 1 click!",
    }
};

// Language management
class LanguageManager {
    constructor() {
        this.currentLanguage = this.getStoredLanguage() || this.detectBrowserLanguage();
        this.translations = LANGUAGES[this.currentLanguage] || LANGUAGES.en;
    }
    
    detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.startsWith('en')) return 'en';
        if (browserLang.startsWith('vi')) return 'vi';
        return 'en';
    }
    
    getStoredLanguage() {
        return localStorage.getItem('elementSelectorLanguage');
    }
    
    setLanguage(lang) {
        if (LANGUAGES[lang]) {
            this.currentLanguage = lang;
            this.translations = LANGUAGES[lang];
            localStorage.setItem('elementSelectorLanguage', lang);
            return true;
        }
        return false;
    }
    
    t(key) {
        return this.translations[key] || key;
    }
    
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    
    getAvailableLanguages() {
        return Object.keys(LANGUAGES);
    }
}

window.langManager = new LanguageManager();