# SMEW Automation Toolkit - Comprehensive Guide

## Overview

SMEW Automation Toolkit is a powerful workflow automation creation tool that allows you to create automated testing and web interaction processes without writing code.

### Basic Usage
1. **Drag and drop** nodes from the left sidebar to the canvas
2. **Connect** nodes by dragging from one output port to another input port
3. **Configure** properties for each node in the right panel
4. **Test** workflow with the "Test" button
5. **Export** workflow as JSON file

---

# Start

## <i class="fas fa-play-circle" style="color: #10b981;"></i> start - Start
**Purpose**: Starting node of workflow, every workflow must begin with this node.

### JSON Format
```json
{
  "id": "start",
  "type": "start",
  "x": 50,
  "y": 100,
  "params": {}
}
```

### Characteristics
- The only node without input port
- Every workflow must have exactly one start node
- Workflow execution begins from this node
- Only has output port to connect to next node

---

# Control Flow

## <i class="fas fa-code-branch" style="color: #6366f1;"></i> if - Condition
**Purpose**: Create conditional branching in workflow based on boolean expression.

### Parameters
- **condition** (text): Condition expression to evaluate
  - *Examples*: `variable1 == "success"`, `count > 5`, `status != "error"`

### JSON Format
```json
{
  "id": "node-123",
  "type": "if",
  "x": 100,
  "y": 200,
  "params": {
    "condition": "pageTitle == \"Welcome\""
  }
}
```

### Ports
- **Input**: Receives from previous node
- **Output Then**: Executes when condition is TRUE
- **Output Else**: Executes when condition is FALSE

## <i class="fas fa-sync-alt" style="color: #8b5cf6;"></i> forEach - Loop
**Purpose**: Loop through array or execute a specific number of times.

### Parameters
- **list** (text): Array variable name or number of iterations
  - *Examples*: `myArray`, `5`, `productList`

### JSON Format
```json
{
  "id": "node-124",
  "type": "forEach",
  "x": 300,
  "y": 200,
  "params": {
    "list": "productList"
  }
}
```

### Ports
- **Input**: Receives from previous node
- **Output Loop**: Executes for each iteration
- **Output Done**: Executes when loop completes

## <i class="fas fa-equals" style="color: #ec4899;"></i> setVariable - Set Variable
**Purpose**: Store value in variable for use in other nodes.

### Parameters
- **name** (text): Variable name
- **value** (text): Value to store

### JSON Format
```json
{
  "id": "node-125",
  "type": "setVariable",
  "x": 500,
  "y": 200,
  "params": {
    "name": "userName",
    "value": "john_doe"
  }
}
```

## <i class="fas fa-stop-circle" style="color: #ef4444;"></i> stop - Stop
**Purpose**: Stop workflow execution.

### JSON Format
```json
{
  "id": "node-126",
  "type": "stop",
  "x": 700,
  "y": 200,
  "params": {}
}
```

## <i class="fas fa-comment-dots" style="color: #6b7280;"></i> comment - Comment
**Purpose**: Add explanatory comment to workflow.

### Parameters
- **text** (text): Comment content

### JSON Format
```json
{
  "id": "node-127",
  "type": "comment",
  "x": 900,
  "y": 200,
  "params": {
    "text": "This is an explanatory comment"
  }
}
```

---

# Navigation

## <i class="fas fa-link" style="color: #0ea5e9;"></i> goto - Go To
**Purpose**: Navigate to another URL.

### Parameters
- **url** (text): Target URL to navigate to

### JSON Format
```json
{
  "id": "node-201",
  "type": "goto",
  "x": 100,
  "y": 300,
  "params": {
    "url": "https://example.com"
  }
}
```

## <i class="fas fa-redo" style="color: #10b981;"></i> reload - Reload
**Purpose**: Reload current page.

### JSON Format
```json
{
  "id": "node-202",
  "type": "reload",
  "x": 300,
  "y": 300,
  "params": {}
}
```

## <i class="fas fa-arrow-left" style="color: #64748b;"></i> goBack - Go Back
**Purpose**: Go back to previous page in history.

### JSON Format
```json
{
  "id": "node-203",
  "type": "goBack",
  "x": 500,
  "y": 300,
  "params": {}
}
```

## <i class="fas fa-arrow-right" style="color: #64748b;"></i> goForward - Go Forward
**Purpose**: Go forward to next page in history.

### JSON Format
```json
{
  "id": "node-204",
  "type": "goForward",
  "x": 700,
  "y": 300,
  "params": {}
}
```

---

# Interaction

## <i class="fas fa-hand-pointer" style="color: #f59e0b;"></i> click - Click
**Purpose**: Click on element.

### Parameters
- **selector** (selector): CSS selector of element to click

### JSON Format
```json
{
  "id": "node-301",
  "type": "click",
  "x": 100,
  "y": 400,
  "params": {
    "selector": "#submit-button"
  }
}
```

## <i class="fas fa-keyboard" style="color: #8b5cf6;"></i> fill - Fill
**Purpose**: Fill text into input field.

### Parameters
- **selector** (selector): CSS selector of input field
- **value** (text): Value to fill

### JSON Format
```json
{
  "id": "node-302",
  "type": "fill",
  "x": 300,
  "y": 400,
  "params": {
    "selector": "#username",
    "value": "john_doe"
  }
}
```

## <i class="fas fa-eraser" style="color: #ef4444;"></i> clearInput - Clear Input
**Purpose**: Clear content of input field.

### Parameters
- **selector** (selector): CSS selector of input field

### JSON Format
```json
{
  "id": "node-303",
  "type": "clearInput",
  "x": 500,
  "y": 400,
  "params": {
    "selector": "#search-field"
  }
}
```

## <i class="fas fa-check-square" style="color: #3b82f6;"></i> setCheckboxState - Set Checkbox State
**Purpose**: Set checked/unchecked state for checkbox.

### Parameters
- **selector** (selector): CSS selector of checkbox
- **checked** (boolean): true to check, false to uncheck

### JSON Format
```json
{
  "id": "node-304",
  "type": "setCheckboxState",
  "x": 700,
  "y": 400,
  "params": {
    "selector": "#agree-terms",
    "checked": true
  }
}
```

## <i class="fas fa-list-ul" style="color: #f97316;"></i> selectOption - Select Option
**Purpose**: Select option in select dropdown.

### Parameters
- **selector** (selector): CSS selector of select element
- **value** (text): Option value to select

### JSON Format
```json
{
  "id": "node-305",
  "type": "selectOption",
  "x": 900,
  "y": 400,
  "params": {
    "selector": "#country",
    "value": "vietnam"
  }
}
```

## <i class="fas fa-mouse-pointer" style="color: #06b6d4;"></i> hover - Hover
**Purpose**: Hover mouse over element to trigger hover effect.

### Parameters
- **selector** (selector): CSS selector of element

### JSON Format
```json
{
  "id": "node-306",
  "type": "hover",
  "x": 100,
  "y": 500,
  "params": {
    "selector": ".menu-item"
  }
}
```

## <i class="fas fa-arrow-turn-down" style="color: #14b8a6;"></i> press - Press Key
**Purpose**: Press key on keyboard.

### Parameters
- **key** (text): Key to press (Enter, Tab, Escape, etc.)

### JSON Format
```json
{
  "id": "node-307",
  "type": "press",
  "x": 300,
  "y": 500,
  "params": {
    "key": "Enter"
  }
}
```

## <i class="fas fa-file-upload" style="color: #d946ef;"></i> uploadFile - Upload File
**Purpose**: Upload file through file input.

### Parameters
- **selector** (selector): CSS selector of file input
- **filePath** (text): Path to file to upload

### JSON Format
```json
{
  "id": "node-308",
  "type": "uploadFile",
  "x": 500,
  "y": 500,
  "params": {
    "selector": "#file-upload",
    "filePath": "/path/to/file.pdf"
  }
}
```

---

# Wait

## <i class="fas fa-clock" style="color: #6b7280;"></i> waitTimeout - Wait Timeout
**Purpose**: Wait for a specific amount of time.

### Parameters
- **timeout** (number): Wait time (milliseconds)

### JSON Format
```json
{
  "id": "node-401",
  "type": "waitTimeout",
  "x": 100,
  "y": 600,
  "params": {
    "timeout": 3000
  }
}
```

## <i class="fas fa-binoculars" style="color: #3b82f6;"></i> waitElement - Wait Element
**Purpose**: Wait for element to appear on page.

### Parameters
- **selector** (selector): CSS selector of element to wait for
- **timeout** (number): Maximum wait time (milliseconds)

### JSON Format
```json
{
  "id": "node-402",
  "type": "waitElement",
  "x": 300,
  "y": 600,
  "params": {
    "selector": ".loading-spinner",
    "timeout": 10000
  }
}
```

---

# Extract

## <i class="fas fa-quote-left" style="color: #f43f5e;"></i> getText - Get Text
**Purpose**: Extract text content of element.

### Parameters
- **selector** (selector): CSS selector of element
- **variable** (text): Variable name to store text

### JSON Format
```json
{
  "id": "node-501",
  "type": "getText",
  "x": 100,
  "y": 700,
  "params": {
    "selector": "h1",
    "variable": "pageTitle"
  }
}
```

## <i class="fas fa-at" style="color: #84cc16;"></i> getAttribute - Get Attribute
**Purpose**: Extract attribute value of element.

### Parameters
- **selector** (selector): CSS selector of element
- **attribute** (text): Attribute name
- **variable** (text): Variable name to store value

### JSON Format
```json
{
  "id": "node-502",
  "type": "getAttribute",
  "x": 300,
  "y": 700,
  "params": {
    "selector": "a",
    "attribute": "href",
    "variable": "linkURL"
  }
}
```

## <i class="fas fa-i-cursor" style="color: #8b5cf6;"></i> getInputValue - Get Input Value
**Purpose**: Extract value of input field.

### Parameters
- **selector** (selector): CSS selector of input field
- **variable** (text): Variable name to store value

### JSON Format
```json
{
  "id": "node-503",
  "type": "getInputValue",
  "x": 500,
  "y": 700,
  "params": {
    "selector": "#username",
    "variable": "currentUser"
  }
}
```

## <i class="fas fa-camera" style="color: #6b7280;"></i> screenshot - Screenshot
**Purpose**: Take screenshot of current page.

### Parameters
- **filename** (text): Image filename

### JSON Format
```json
{
  "id": "node-504",
  "type": "screenshot",
  "x": 700,
  "y": 700,
  "params": {
    "filename": "page-screenshot.png"
  }
}
```

---

# Basic Assertions

## <i class="fas fa-eye" style="color: #10b981;"></i> assertVisible - Assert Visible
**Purpose**: Verify element is visible on page.

### Parameters
- **selector** (selector): CSS selector of element to check

### JSON Format
```json
{
  "id": "node-601",
  "type": "assertVisible",
  "x": 100,
  "y": 800,
  "params": {
    "selector": ".welcome-message"
  }
}
```

## <i class="fas fa-check-double" style="color: #eab308;"></i> assertText - Assert Text
**Purpose**: Verify text content of element.

### Parameters
- **selector** (selector): CSS selector of element
- **text** (text): Expected text

### JSON Format
```json
{
  "id": "node-602",
  "type": "assertText",
  "x": 300,
  "y": 800,
  "params": {
    "selector": "h1",
    "text": "Welcome to Dashboard"
  }
}
```

## <i class="fas fa-link" style="color: #3b82f6;"></i> assertURL - Assert URL
**Purpose**: Verify current URL of page.

### Parameters
- **url** (text): Expected URL

### JSON Format
```json
{
  "id": "node-603",
  "type": "assertURL",
  "x": 500,
  "y": 800,
  "params": {
    "url": "https://example.com/dashboard"
  }
}
```

## <i class="fas fa-heading" style="color: #8b5cf6;"></i> assertTitle - Assert Title
**Purpose**: Verify page title.

### Parameters
- **title** (text): Expected title

### JSON Format
```json
{
  "id": "node-604",
  "type": "assertTitle",
  "x": 700,
  "y": 800,
  "params": {
    "title": "Dashboard - My App"
  }
}
```

## <i class="fas fa-tags" style="color: #f97316;"></i> assertAttribute - Assert Attribute
**Purpose**: Verify attribute value of element.

### Parameters
- **selector** (selector): CSS selector of element
- **attribute** (text): Attribute name
- **value** (text): Expected value

### JSON Format
```json
{
  "id": "node-605",
  "type": "assertAttribute",
  "x": 900,
  "y": 800,
  "params": {
    "selector": "input",
    "attribute": "placeholder",
    "value": "Enter username"
  }
}
```

## <i class="fas fa-list-ol" style="color: #6366f1;"></i> assertElementCount - Assert Element Count
**Purpose**: Verify number of elements matching selector.

### Parameters
- **selector** (selector): CSS selector of elements
- **count** (number): Expected count

### JSON Format
```json
{
  "id": "node-606",
  "type": "assertElementCount",
  "x": 100,
  "y": 900,
  "params": {
    "selector": ".product-item",
    "count": 12
  }
}
```

## <i class="fas fa-eye-slash" style="color: #ef4444;"></i> assertNotVisible - Assert Not Visible
**Purpose**: Verify element is not visible or doesn't exist.

### Parameters
- **selector** (selector): CSS selector of element

### JSON Format
```json
{
  "id": "node-607",
  "type": "assertNotVisible",
  "x": 300,
  "y": 900,
  "params": {
    "selector": ".error-message"
  }
}
```

## <i class="fas fa-toggle-on" style="color: #14b8a6;"></i> assertEnabled - Assert Enabled
**Purpose**: Verify element is interactive.

### Parameters
- **selector** (selector): CSS selector of element

### JSON Format
```json
{
  "id": "node-608",
  "type": "assertEnabled",
  "x": 500,
  "y": 900,
  "params": {
    "selector": "#submit-btn"
  }
}
```

## <i class="fas fa-toggle-off" style="color: #6b7280;"></i> assertDisabled - Assert Disabled
**Purpose**: Verify element is disabled.

### Parameters
- **selector** (selector): CSS selector of element

### JSON Format
```json
{
  "id": "node-609",
  "type": "assertDisabled",
  "x": 700,
  "y": 900,
  "params": {
    "selector": "#submit-btn"
  }
}
```

## <i class="fas fa-check-square" style="color: #10b981;"></i> assertChecked - Assert Checked
**Purpose**: Verify checkbox/radio is checked.

### Parameters
- **selector** (selector): CSS selector of checkbox/radio

### JSON Format
```json
{
  "id": "node-610",
  "type": "assertChecked",
  "x": 900,
  "y": 900,
  "params": {
    "selector": "#agree-terms"
  }
}
```

## <i class="fas fa-square" style="color: #ec4899;"></i> assertUnchecked - Assert Unchecked
**Purpose**: Verify checkbox/radio is unchecked.

### Parameters
- **selector** (selector): CSS selector of checkbox/radio

### JSON Format
```json
{
  "id": "node-611",
  "type": "assertUnchecked",
  "x": 100,
  "y": 1000,
  "params": {
    "selector": "#newsletter"
  }
}
```

## <i class="fas fa-search" style="color: #06b6d4;"></i> assertContainsText - Assert Contains Text
**Purpose**: Verify element contains specific text.

### Parameters
- **selector** (selector): CSS selector of element
- **text** (text): Text to find

### JSON Format
```json
{
  "id": "node-612",
  "type": "assertContainsText",
  "x": 300,
  "y": 1000,
  "params": {
    "selector": ".message",
    "text": "success"
  }
}
```

---

# Element States

## <i class="fab fa-css3-alt" style="color: #8b5cf6;"></i> assertCSSProperty - Assert CSS Property
**Purpose**: Verify CSS property value of element.

### Parameters
- **selector** (selector): CSS selector of element
- **property** (text): CSS property name
- **value** (text): Expected value

### JSON Format
```json
{
  "id": "node-701",
  "type": "assertCSSProperty",
  "x": 100,
  "y": 1100,
  "params": {
    "selector": ".modal",
    "property": "display",
    "value": "block"
  }
}
```

---

# Page Quality

## <i class="fas fa-clipboard-check" style="color: #f59e0b;"></i> validateForm - Validate Form
**Purpose**: Check form validation validity.

### Parameters
- **selector** (selector): CSS selector of form

### JSON Format
```json
{
  "id": "node-801",
  "type": "validateForm",
  "x": 100,
  "y": 1200,
  "params": {
    "selector": "#contact-form"
  }
}
```

## <i class="fas fa-unlink" style="color: #f43f5e;"></i> checkBrokenLinks - Check Broken Links
**Purpose**: Check for broken links on page.

### JSON Format
```json
{
  "id": "node-802",
  "type": "checkBrokenLinks",
  "x": 300,
  "y": 1200,
  "params": {}
}
```

## <i class="fas fa-image" style="color: #84cc16;"></i> checkImageLoading - Check Image Loading
**Purpose**: Check if all images load successfully.

### JSON Format
```json
{
  "id": "node-803",
  "type": "checkImageLoading",
  "x": 500,
  "y": 1200,
  "params": {}
}
```

## <i class="fas fa-tachometer-alt" style="color: #0ea5e9;"></i> checkPageSpeed - Check Page Speed
**Purpose**: Measure page loading speed and performance.

### JSON Format
```json
{
  "id": "node-804",
  "type": "checkPageSpeed",
  "x": 700,
  "y": 1200,
  "params": {}
}
```

## <i class="fas fa-mobile-alt" style="color: #64748b;"></i> checkResponsive - Check Responsive
**Purpose**: Check if page is responsive across different screen sizes.

### JSON Format
```json
{
  "id": "node-805",
  "type": "checkResponsive",
  "x": 900,
  "y": 1200,
  "params": {}
}
```

## <i class="fas fa-universal-access" style="color: #10b981;"></i> checkAccessibility - Check Accessibility
**Purpose**: Check accessibility of web page.

### JSON Format
```json
{
  "id": "node-806",
  "type": "checkAccessibility",
  "x": 100,
  "y": 1300,
  "params": {}
}
```

## <i class="fas fa-search-plus" style="color: #eab308;"></i> checkSEO - Check SEO
**Purpose**: Check basic SEO factors of page.

### JSON Format
```json
{
  "id": "node-807",
  "type": "checkSEO",
  "x": 300,
  "y": 1300,
  "params": {}
}
```

---

# Advanced Testing

## <i class="fas fa-ban" style="color: #ef4444;"></i> interceptNetwork - Intercept Network
**Purpose**: Intercept and control network requests.

### Parameters
- **url** (text): URL pattern to intercept
- **method** (text): HTTP method (GET, POST, etc.)

### JSON Format
```json
{
  "id": "node-901",
  "type": "interceptNetwork",
  "x": 100,
  "y": 1400,
  "params": {
    "url": "*/api/users*",
    "method": "GET"
  }
}
```

## <i class="fas fa-cloud" style="color: #8b5cf6;"></i> mockAPI - Mock API
**Purpose**: Create mock response for API calls.

### Parameters
- **url** (text): API URL pattern
- **response** (text): Mock response JSON

### JSON Format
```json
{
  "id": "node-902",
  "type": "mockAPI",
  "x": 300,
  "y": 1400,
  "params": {
    "url": "*/api/data*",
    "response": "{\"status\": \"success\", \"data\": []}"
  }
}
```

## <i class="fas fa-cookie-bite" style="color: #f97316;"></i> setCookie - Set Cookie
**Purpose**: Set cookie for current domain.

### Parameters
- **name** (text): Cookie name
- **value** (text): Cookie value
- **domain** (text): Domain (optional)

### JSON Format
```json
{
  "id": "node-903",
  "type": "setCookie",
  "x": 500,
  "y": 1400,
  "params": {
    "name": "sessionId",
    "value": "abc123",
    "domain": "example.com"
  }
}
```

## <i class="fas fa-exclamation-triangle" style="color: #ef4444;"></i> checkConsoleErrors - Check Console Errors
**Purpose**: Check for JavaScript errors in console.

### JSON Format
```json
{
  "id": "node-904",
  "type": "checkConsoleErrors",
  "x": 700,
  "y": 1400,
  "params": {}
}
```

## <i class="fas fa-memory" style="color: #3b82f6;"></i> checkMemoryUsage - Check Memory Usage
**Purpose**: Check page memory usage.

### JSON Format
```json
{
  "id": "node-905",
  "type": "checkMemoryUsage",
  "x": 900,
  "y": 1400,
  "params": {}
}
```

## <i class="fas fa-database" style="color: #14b8a6;"></i> checkLocalStorage - Check Local Storage
**Purpose**: Check value in localStorage.

### Parameters
- **key** (text): Key to check
- **value** (text): Expected value (optional)

### JSON Format
```json
{
  "id": "node-906",
  "type": "checkLocalStorage",
  "x": 100,
  "y": 1500,
  "params": {
    "key": "userPrefs",
    "value": "dark-mode"
  }
}
```

## <i class="fas fa-archive" style="color: #6366f1;"></i> checkSessionStorage - Check Session Storage
**Purpose**: Check value in sessionStorage.

### Parameters
- **key** (text): Key to check
- **value** (text): Expected value (optional)

### JSON Format
```json
{
  "id": "node-907",
  "type": "checkSessionStorage",
  "x": 300,
  "y": 1500,
  "params": {
    "key": "tempData",
    "value": "cached"
  }
}
```

## <i class="fas fa-globe" style="color: #059669;"></i> testCrossBrowser - Test Cross Browser
**Purpose**: Test compatibility across different browsers.

### Parameters
- **browsers** (text): List of browsers (chrome,firefox,safari)

### JSON Format
```json
{
  "id": "node-908",
  "type": "testCrossBrowser",
  "x": 500,
  "y": 1500,
  "params": {
    "browsers": "chrome,firefox,safari"
  }
}
```

## <i class="fas fa-wifi" style="color: #eab308;"></i> simulateNetworkCondition - Simulate Network Condition
**Purpose**: Simulate slow network or offline conditions.

### Parameters
- **condition** (text): Condition type (slow3g, fast3g, offline)

### JSON Format
```json
{
  "id": "node-909",
  "type": "simulateNetworkCondition",
  "x": 700,
  "y": 1500,
  "params": {
    "condition": "slow3g"
  }
}
```

---

# General Guidelines

## Workflow Design Principles

### 1. Workflow Structure
- **Start**: Every workflow must have a `start` node
- **Sequential**: Nodes execute in connection order
- **Branching**: Use `if` node for conditional logic
- **Looping**: Use `forEach` node for repeated operations
- **Termination**: Workflow ends when no more nodes to execute

### 2. Variable Management
- **Naming**: Use meaningful variable names (`userName`, `productCount`)
- **Scope**: Variables can be used in all nodes after creation
- **Reference**: Use `${variableName}` to reference variables
- **Types**: Supports string, number, boolean, array

### 3. Selector Strategy
- **Priority ID**: `#unique-id` (highest priority)
- **Class selectors**: `.class-name` 
- **Attribute selectors**: `[data-testid="value"]`
- **Hierarchy selectors**: `.parent .child`
- **Avoid**: Complex XPath, position-based selectors

### 4. Error Prevention
- **Validation**: Always check element exists before interaction
- **Timeouts**: Set appropriate timeouts for wait operations
- **Fallbacks**: Have plans for when elements aren't found
- **Screenshots**: Take screenshots for debugging when needed

## Best Practices

### Design Patterns
1. **Page Navigation Pattern**
   ```
   start → goto → waitElement → [page actions] → assertURL
   ```

2. **Form Filling Pattern**
   ```
   start → fill(field1) → fill(field2) → click(submit) → assertVisible(success)
   ```

3. **Data Extraction Pattern**
   ```
   start → getText → setVariable → [use variable] → screenshot
   ```

4. **Conditional Testing Pattern**
   ```
   start → getText → setVariable → if(condition) → [then/else actions]
   ```

### Naming Conventions
- **Nodes**: Use descriptive names (`loginForm`, `submitButton`)
- **Variables**: camelCase (`userName`, `isLoggedIn`)
- **Selectors**: Clear, not dependent on CSS framework

---

# Advanced Techniques

## Dynamic Content Handling

### 1. Waiting for Dynamic Elements
```javascript
// Pattern: Wait → Check → Action
waitElement → assertVisible → click
```

### 2. Handling AJAX Requests
- Use `waitElement` for loading indicators
- Wait for elements to appear after AJAX completion
- Check network requests with `interceptNetwork`

### 3. Scroll and Lazy Loading
```javascript
// Pattern: Scroll → Wait → Extract
hover(trigger) → waitElement(content) → getText
```

## Complex Workflows

### 1. Multi-Step Forms
```javascript
start → goto(page1) → fill(step1) → click(next) → 
waitElement(page2) → fill(step2) → click(next) →
waitElement(page3) → fill(step3) → click(submit) →
assertText(success)
```

### 2. Data-Driven Testing
```javascript
start → setVariable(testData) → forEach(testData) →
fill(${currentItem.field}) → click(submit) →
assertText(${currentItem.expected})
```

### 3. Cross-Page Workflows
```javascript
start → goto(page1) → getText(data) → setVariable(extractedData) →
goto(page2) → fill(${extractedData}) → click(submit) →
assertURL(resultPage)
```

## API Integration

### 1. Mock API Responses
```javascript
start → mockAPI(endpoint, mockData) → goto(page) →
// Page will receive mock data instead of real API
assertText(mockData.result)
```

### 2. Network Interception
```javascript
start → interceptNetwork(apiEndpoint, GET) →
goto(page) → // Check request is sent
assertVisible(loadingIndicator)
```

## Performance Optimization

### 1. Efficient Waiting
- Use `waitElement` instead of `waitTimeout` when possible
- Set short but reasonable timeouts
- Combine multiple checks in one assertion

### 2. Batch Operations
```javascript
// Instead of multiple separate assertions:
assertVisible(element1) → assertVisible(element2) → assertVisible(element3)

// Use element count:
assertElementCount(.required-element, 3)
```

---

# Troubleshooting

## Common Issues

### 1. Element Not Found
**Symptoms**: "Element not found" error
**Causes**:
- Incorrect selector
- Element not fully loaded
- Element hidden by CSS

**Solutions**:
```javascript
// Add wait before interaction
waitElement(selector) → click(selector)

// Check selector in DevTools
// F12 → Console → document.querySelector('your-selector')

// Use screenshot for debugging
screenshot(debug-image) → click(selector)
```

### 2. Timeout Issues
**Symptoms**: Workflow timeouts
**Causes**:
- Slow network
- Slow JavaScript execution
- Slow element loading

**Solutions**:
```javascript
// Increase timeout for specific operations
waitElement(selector, 30000) // 30 seconds

// Use network simulation
simulateNetworkCondition(fast3g) → goto(page)

// Check page speed
checkPageSpeed() → screenshot(performance-debug)
```

### 3. Variable Issues
**Symptoms**: Variables not working correctly
**Causes**:
- Variable not set
- Incorrect syntax
- Scope issues

**Solutions**:
```javascript
// Check variable is set correctly
getText(element, myVar) → comment(Variable set: ${myVar})

// Debug variable value
setVariable(debugVar, ${myVar}) → screenshot(var-debug)

// Ensure variable exists before use
if(${myVar} != null) → fill(input, ${myVar})
```

### 4. Assertion Failures
**Symptoms**: Assertions fail unexpectedly
**Causes**:
- Data changes
- Timing issues
- Environment differences

**Solutions**:
```javascript
// Use partial text matching
assertContainsText(element, partial-text) instead of assertText(element, exact-text)

// Add wait before assertion
waitElement(element) → assertVisible(element)

// Use screenshots for debugging
screenshot(before-assertion) → assertText(element, expected)
```

## Debug Techniques

### 1. Screenshot Strategy
```javascript
// At key points
start → screenshot(01-start) → goto(page) → 
screenshot(02-page-loaded) → fill(input) → 
screenshot(03-form-filled) → click(submit) → 
screenshot(04-after-submit)
```

### 2. Console Monitoring
```javascript
// Check for JavaScript errors
checkConsoleErrors() → screenshot(console-state)

// Monitor network requests
interceptNetwork(*) → goto(page) → screenshot(network-debug)
```

### 3. Step-by-Step Verification
```javascript
// Verify each step
start → assertVisible(startPage) → 
click(button) → assertVisible(nextPage) → 
fill(input) → assertAttribute(input, value, expected)
```

---

# Tips and Tricks

## Workflow Development

### 1. Incremental Development
- Start with simple workflow
- Test each node before connecting
- Add complexity gradually
- Always keep backup of working version

### 2. Node Organization
- Arrange nodes by logic flow
- Use `comment` nodes for explanation
- Group related nodes together
- Use consistent naming

### 3. Reusability
```javascript
// Create reusable patterns
// Login pattern: goto → fill(username) → fill(password) → click(login) → waitElement(dashboard)

// Navigation pattern: click(menu) → waitElement(submenu) → click(item)

// Form validation pattern: fill(invalid) → click(submit) → assertVisible(error)
```

## Testing Strategies

### 1. Happy Path Testing
```javascript
start → goto(app) → fill(validData) → click(submit) → assertText(success)
```

### 2. Error Path Testing
```javascript
start → goto(app) → fill(invalidData) → click(submit) → assertVisible(errorMessage)
```

### 3. Edge Case Testing
```javascript
// Empty inputs
start → goto(form) → click(submit) → assertVisible(requiredFieldError)

// Long inputs
start → setVariable(longText, very-long-string) → fill(input, ${longText}) → click(submit)

// Special characters
start → setVariable(specialChars, !@#$%^&*) → fill(input, ${specialChars}) → click(submit)
```

## Maintenance Tips

### 1. Regular Updates
- Update selectors when UI changes
- Test workflows on new environments
- Review and optimize performance
- Update expected values when needed

### 2. Documentation
- Use `comment` nodes to document workflow
- Note business logic
- Document known issues and workarounds
- Maintain changelog for major updates

### 3. Version Control
- Export workflows regularly
- Backup before major changes
- Test thoroughly before deployment
- Have rollback plan

## Performance Optimization

### 1. Minimize Waits
```javascript
// Instead of:
waitTimeout(5000) → click(button)

// Use:
waitElement(button) → click(button)
```

### 2. Efficient Selectors
```javascript
// Fast selectors
#id               // Fastest
.class            // Fast
[data-testid]     // Good
.parent > .child  // Moderate
.complex .nested .selector  // Slow
```

### 3. Batch Operations
```javascript
// Combine assertions
assertVisible(element1) AND assertText(element2) AND assertAttribute(element3)

// Group related actions
fill(field1) → fill(field2) → fill(field3) → click(submit)
```

## Common Patterns

### 1. Login Flow
```javascript
start → goto(loginPage) → 
fill(#username, testUser) → 
fill(#password, testPass) → 
click(#loginButton) → 
waitElement(.dashboard) → 
assertURL(dashboard-url)
```

### 2. Search Flow
```javascript
start → goto(searchPage) → 
fill(#searchInput, query) → 
press(Enter) → 
waitElement(.search-results) → 
assertElementCount(.result-item, expectedCount)
```

### 3. Form Submission
```javascript
start → goto(formPage) → 
fill(#field1, value1) → 
selectOption(#dropdown, option) → 
setCheckboxState(#checkbox, true) → 
click(#submit) → 
waitElement(.success-message) → 
assertContainsText(.success-message, success)
```