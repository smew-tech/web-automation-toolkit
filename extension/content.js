let isSelectionMode = false;
let highlightedElement = null;
let overlayElement = null;

// Simple translation function for content script
function getTranslation(key, fallback) {
  const lang = navigator.language.startsWith('vi') ? 'vi' : 'en';
  const translations = {
    vi: {
      selectionStarted: 'Chế độ chọn element đã bật. Click vào element để copy selector.',
      selectorCopied: '✅ Đã copy',
      selectorCopyFailed: '⚠️ Không thể copy:',
      selectorTypeId: ' (ID)',
      selectorTypeIdContext: ' (ID với context)',
      selectorTypeClass: ' (Class)',
      selectorTypeClassContext: ' (Class với context)',
      selectorTypeData: ' (Data attribute)',
      selectorTypeFullPath: ' (Full path)',
    },
    en: {
      selectionStarted: 'Element selection mode activated. Click on elements to copy their selectors.',
      selectorCopied: '✅ Copied',
      selectorCopyFailed: '⚠️ Failed to copy:',
      selectorTypeId: ' (ID)',
      selectorTypeIdContext: ' (ID with context)',
      selectorTypeClass: ' (Class)',
      selectorTypeClassContext: ' (Class with context)',
      selectorTypeData: ' (Data attribute)',
      selectorTypeFullPath: ' (Full path)',
    }
  };
  
  // Try to get from stored language preference
  const storedLang = localStorage.getItem('elementSelectorLanguage') || lang;
  return translations[storedLang]?.[key] || translations[lang]?.[key] || fallback || key;
}

function generateSelector(element) {
  function isUniqueSelector(selector) {
    try {
      const elements = document.querySelectorAll(selector);
      return elements.length === 1 && elements[0] === element;
    } catch (e) {
      return false;
    }
  }
  
  function getNthChild(el) {
    let index = 1;
    let sibling = el.previousElementSibling;
    while (sibling) {
      if (sibling.nodeType === 1) index++;
      sibling = sibling.previousElementSibling;
    }
    return index;
  }
  
  function buildPath(targetElement) {
    const path = [];
    let current = targetElement;
    
    while (current && current !== document.body && current !== document.documentElement) {
      let selector = current.tagName.toLowerCase();
      
      if (current.id) {
        selector += `#${CSS.escape(current.id)}`;
      }
      
      if (current.className) {
        const classes = current.className.split(/\s+/).filter(cls => {
          cls = cls.trim();
          const genericClasses = ['active', 'selected', 'hover', 'focus', 'disabled', 'hidden', 'show', 'hide', 'open', 'close', 'loading'];
          return cls && !genericClasses.includes(cls.toLowerCase()) && cls.length > 1;
        });
        
        if (classes.length > 0) {
          const sortedClasses = classes.slice(0, 3).map(cls => CSS.escape(cls));
          selector += '.' + sortedClasses.join('.');
        }
      }
      
      const importantAttrs = ['data-test', 'data-testid', 'data-cy', 'data-automation', 'role', 'name', 'type'];
      for (const attr of importantAttrs) {
        const value = current.getAttribute(attr);
        if (value) {
          selector += `[${attr}="${CSS.escape(value)}"]`;
          break;
        }
      }
      
      const siblings = Array.from(current.parentElement?.children || [])
        .filter(child => child.tagName === current.tagName);
      
      if (siblings.length > 1) {
        const nthChild = getNthChild(current);
        selector += `:nth-child(${nthChild})`;
      }
      
      path.unshift(selector);
      current = current.parentElement;
    }
    
    return path.join(' > ');
  }
  
  if (element.id) {
    const idSelector = `#${CSS.escape(element.id)}`;
    if (isUniqueSelector(idSelector)) {
      const parent = element.parentElement;
      if (parent && parent !== document.body) {
        let parentSelector = parent.tagName.toLowerCase();
        if (parent.id) parentSelector += `#${CSS.escape(parent.id)}`;
        else if (parent.className) {
          const classes = parent.className.split(/\s+/).filter(cls => cls.trim()).slice(0, 2);
          if (classes.length > 0) {
            parentSelector += '.' + classes.map(cls => CSS.escape(cls)).join('.');
          }
        }
        return `${parentSelector} > ${idSelector}`;
      }
      return idSelector;
    }
  }
  
  if (element.className) {
    const classes = element.className.split(/\s+/).filter(cls => {
      cls = cls.trim();
      const genericClasses = ['active', 'selected', 'hover', 'focus', 'disabled', 'hidden', 'show', 'hide'];
      return cls && !genericClasses.includes(cls.toLowerCase());
    });
    
    if (classes.length > 0) {
      const tag = element.tagName.toLowerCase();
      const classSelector = '.' + classes.slice(0, 3).map(cls => CSS.escape(cls)).join('.');
      const elementSelector = `${tag}${classSelector}`;
      
      if (isUniqueSelector(elementSelector)) {
        const parent = element.parentElement;
        if (parent && parent !== document.body) {
          let parentSelector = parent.tagName.toLowerCase();
          if (parent.id) parentSelector += `#${CSS.escape(parent.id)}`;
          else if (parent.className) {
            const parentClasses = parent.className.split(/\s+/).filter(cls => cls.trim()).slice(0, 2);
            if (parentClasses.length > 0) {
              parentSelector += '.' + parentClasses.map(cls => CSS.escape(cls)).join('.');
            }
          }
          return `${parentSelector} > ${elementSelector}`;
        }
        return elementSelector;
      }
    }
  }
  
  const dataAttrs = ['data-test', 'data-testid', 'data-cy', 'data-automation'];
  for (const attr of dataAttrs) {
    const value = element.getAttribute(attr);
    if (value) {
      const attrSelector = `[${attr}="${CSS.escape(value)}"]`;
      if (isUniqueSelector(attrSelector)) {
        return `${element.tagName.toLowerCase()}${attrSelector}`;
      }
    }
  }
  
  const fullPath = buildPath(element);
  if (fullPath && isUniqueSelector(fullPath)) {
    return fullPath;
  }
  
  let selector = element.tagName.toLowerCase();
  
  if (element.id) {
    selector += `#${CSS.escape(element.id)}`;
  } else if (element.className) {
    const classes = element.className.split(/\s+/).filter(cls => cls.trim()).slice(0, 2);
    if (classes.length > 0) {
      selector += '.' + classes.map(cls => CSS.escape(cls)).join('.');
    }
  }
  
  const parent = element.parentElement;
  if (parent) {
    const siblings = Array.from(parent.children).filter(child => 
      child.tagName === element.tagName
    );
    if (siblings.length > 1) {
      const index = siblings.indexOf(element) + 1;
      selector += `:nth-child(${index})`;
    }
  }
  
  if (parent && parent !== document.body) {
    let parentSelector = parent.tagName.toLowerCase();
    if (parent.id) {
      parentSelector += `#${CSS.escape(parent.id)}`;
    } else if (parent.className) {
      const parentClasses = parent.className.split(/\s+/).filter(cls => cls.trim()).slice(0, 2);
      if (parentClasses.length > 0) {
        parentSelector += '.' + parentClasses.map(cls => CSS.escape(cls)).join('.');
      }
    }
    selector = `${parentSelector} > ${selector}`;
  }
  
  return selector;
}

function createOverlay() {
  overlayElement = document.createElement('div');
  overlayElement.id = 'selector-overlay';
  overlayElement.style.cssText = `
    position: absolute;
    pointer-events: none;
    background-color: rgba(255, 0, 0, 0.3);
    border: 2px solid red;
    z-index: 10000;
    display: none;
  `;
  document.body.appendChild(overlayElement);
}

function highlightElement(element) {
  if (!overlayElement) createOverlay();
  
  const rect = element.getBoundingClientRect();
  overlayElement.style.display = 'block';
  overlayElement.style.left = (rect.left + window.scrollX) + 'px';
  overlayElement.style.top = (rect.top + window.scrollY) + 'px';
  overlayElement.style.width = rect.width + 'px';
  overlayElement.style.height = rect.height + 'px';
  
  highlightedElement = element;
}

function hideHighlight() {
  if (overlayElement) {
    overlayElement.style.display = 'none';
  }
  highlightedElement = null;
}

function handleMouseMove(event) {
  if (!isSelectionMode) return;
  
  event.preventDefault();
  event.stopPropagation();
  
  const element = event.target;
  if (element && element !== overlayElement) {
    highlightElement(element);
  }
}

function handleClick(event) {
  if (!isSelectionMode) return;
  
  event.preventDefault();
  event.stopPropagation();
  
  if (highlightedElement) {
    const selector = generateSelector(highlightedElement);
    
    navigator.clipboard.writeText(selector).then(() => {
      let selectorType = '';
      if (selector.includes('#') && !selector.includes(' > ')) {
        selectorType = getTranslation('selectorTypeId');
      } else if (selector.includes('#') && selector.includes(' > ')) {
        selectorType = getTranslation('selectorTypeIdContext');
      } else if (selector.includes('.') && !selector.includes(' > ')) {
        selectorType = getTranslation('selectorTypeClass');
      } else if (selector.includes('.') && selector.includes(' > ')) {
        selectorType = getTranslation('selectorTypeClassContext');
      } else if (selector.includes('[data-')) {
        selectorType = getTranslation('selectorTypeData');
      } else {
        selectorType = getTranslation('selectorTypeFullPath');
      }
      
      showNotification(`${getTranslation('selectorCopied')}${selectorType}: ${selector}`);
    }).catch(() => {
      showNotification(getTranslation('selectorCopyFailed') + ' ' + selector);
    });
  }
}

function showNotification(message) {
  const existingNotifications = document.querySelectorAll('.selector-notification');
  existingNotifications.forEach(n => n.remove());
  
  const notification = document.createElement('div');
  notification.className = 'selector-notification';
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #4CAF50, #45a049);
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    z-index: 10001;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    max-width: 300px;
    font-size: 14px;
    line-height: 1.4;
    animation: slideIn 0.3s ease-out;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      document.body.removeChild(notification);
    }
  }, 4000);
}

function startSelectionMode() {
  console.log('Starting selection mode...');
  isSelectionMode = true;
  document.body.style.cursor = 'crosshair';
  
  document.addEventListener('mousemove', handleMouseMove, true);
  document.addEventListener('click', handleClick, true);
  
  chrome.storage.local.set({ selectorToolActive: true });
  
  showNotification(getTranslation('selectionStarted'));
}

function stopSelectionMode() {
  console.log('Stopping selection mode...');
  isSelectionMode = false;
  document.body.style.cursor = 'auto';
  
  document.removeEventListener('mousemove', handleMouseMove, true);
  document.removeEventListener('click', handleClick, true);
  
  hideHighlight();
  
  chrome.runtime.sendMessage({ 
    action: 'selectionStopped' 
  }).catch(() => {
  });
  
  chrome.storage.local.set({ selectorToolActive: false });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script received message:', request);
  
  if (request.action === 'startSelection') {
    startSelectionMode();
    sendResponse({ status: 'started' });
  } else if (request.action === 'stopSelection') {
    stopSelectionMode();
    sendResponse({ status: 'stopped' });
  } else {
    sendResponse({ status: 'unknown_action' });
  }
  
  return true;
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && isSelectionMode) {
    stopSelectionMode();
  }
});