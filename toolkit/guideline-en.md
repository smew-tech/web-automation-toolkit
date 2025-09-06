# SMEW Automation Toolkit - Complete Guide

## Overview

SMEW Automation Toolkit is a powerful workflow automation tool that allows you to create automated testing and web interaction processes without writing code.

### Basic Usage
1. **Drag & Drop** nodes from the left sidebar to canvas
2. **Connect** nodes by dragging from output port to input port
3. **Configure** properties for each node in the right panel
4. **Test** workflow using the "Test" button
5. **Export** workflow as JSON file

---

# CONTROL NODES

## if - Condition
**Purpose**: Create conditional branching in workflow based on boolean expressions.

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

---

## forEach - Loop
**Purpose**: Loop through array or execute a specific number of times.

### Parameters
- **list** (text): Array variable name or number of iterations
  - *Examples*: `myArray`, `5`, `productList`
- **variable** (text): Variable name for each element in the loop
  - *Examples*: `item`, `product`, `user`

### JSON Format
```json
{
  "id": "node-124",
  "type": "forEach",
  "x": 300,
  "y": 200,
  "params": {
    "list": "productList",
    "variable": "product"
  }
}
```

### Ports
- **Input**: Receives from previous node
- **Loop Body**: Content to be repeated
- **Output**: Continues after loop completion

---

## setVariable - Set Variable
**Purpose**: Create or update variable value for use in workflow.

### Parameters
- **variable** (text): Variable name
  - *Examples*: `counter`, `userName`, `baseURL`
- **value** (text): Value to assign to variable
  - *Examples*: `"admin"`, `0`, `"https://example.com"`

### JSON Format
```json
{
  "id": "node-125",
  "type": "setVariable",
  "x": 500,
  "y": 200,
  "params": {
    "variable": "userName",
    "value": "admin123"
  }
}
```

---

## stop - Stop
**Purpose**: Stop workflow execution at this point.

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

---

## comment - Comment
**Purpose**: Add notes, comments to workflow (does not affect execution).

### Parameters
- **text** (text): Comment content
  - *Examples*: `"This step checks login"`, `"TODO: Add validation"`

### JSON Format
```json
{
  "id": "node-127",
  "type": "comment",
  "x": 900,
  "y": 200,
  "params": {
    "text": "Check login success"
  }
}
```

---

# NAVIGATION NODES

## goto - Go To
**Purpose**: Navigate browser to a specific URL.

### Parameters
- **url** (text): Target URL
  - *Examples*: `"https://google.com"`, `"http://localhost:3000/login"`

### JSON Format
```json
{
  "id": "node-201",
  "type": "goto",
  "x": 100,
  "y": 300,
  "params": {
    "url": "https://example.com/dashboard"
  }
}
```

---

## reload - Reload
**Purpose**: Refresh the current page.

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

---

## goBack - Go Back
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

---

## goForward - Go Forward
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

# INTERACTION NODES

## click - Click
**Purpose**: Click on element on the page.

### Parameters
- **selector** (selector): CSS selector of element to click
  - *Examples*: `"#login-button"`, `".submit-btn"`, `"button[type='submit']"`
- **type** (select): Click type
  - **left**: Left click (default)
  - **right**: Right click
  - **double**: Double click

### JSON Format
```json
{
  "id": "node-301",
  "type": "click",
  "x": 100,
  "y": 400,
  "params": {
    "selector": "#login-button",
    "type": "left"
  }
}
```

---

## fill - Fill
**Purpose**: Enter text into input field.

### Parameters
- **selector** (selector): CSS selector of input field
- **value** (text): Content to enter
  - *Examples*: `"admin@example.com"`, `"password123"`

### JSON Format
```json
{
  "id": "node-302",
  "type": "fill",
  "x": 300,
  "y": 400,
  "params": {
    "selector": "#email",
    "value": "user@test.com"
  }
}
```

---

## clearInput - Clear Input
**Purpose**: Clear content of input field.

### Parameters
- **selector** (selector): CSS selector of input field to clear

### JSON Format
```json
{
  "id": "node-303",
  "type": "clearInput",
  "x": 500,
  "y": 400,
  "params": {
    "selector": "#search-box"
  }
}
```

---

## setCheckboxState - Set Checkbox State
**Purpose**: Set checked/unchecked state for checkbox.

### Parameters
- **selector** (selector): CSS selector of checkbox
- **state** (select): Desired state
  - **check**: Check checkbox
  - **uncheck**: Uncheck checkbox

### JSON Format
```json
{
  "id": "node-304",
  "type": "setCheckboxState",
  "x": 700,
  "y": 400,
  "params": {
    "selector": "#agree-terms",
    "state": "check"
  }
}
```

---

## selectOption - Select Option
**Purpose**: Select option in dropdown/select.

### Parameters
- **selector** (selector): CSS selector of select element
- **value** (text): Value of option to select

### JSON Format
```json
{
  "id": "node-305",
  "type": "selectOption",
  "x": 900,
  "y": 400,
  "params": {
    "selector": "#country",
    "value": "Vietnam"
  }
}
```

---

## hover - Hover
**Purpose**: Hover mouse over element (to show dropdown menu, tooltip...).

### Parameters
- **selector** (selector): CSS selector of element to hover

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

---

## press - Press Key
**Purpose**: Press keyboard key.

### Parameters
- **selector** (selector): CSS selector of focused element (optional)
- **key** (text): Key name to press
  - *Examples*: `"Enter"`, `"Tab"`, `"Escape"`, `"Space"`, `"ArrowDown"`

### JSON Format
```json
{
  "id": "node-307",
  "type": "press",
  "x": 300,
  "y": 500,
  "params": {
    "selector": "#search-input",
    "key": "Enter"
  }
}
```

---

## uploadFile - Upload File
**Purpose**: Upload file through input[type="file"].

### Parameters
- **selector** (selector): CSS selector of file input
- **filePath** (text): Full path to file
  - *Examples*: `"C:\\Users\\Documents\\test.pdf"`, `"/home/user/image.jpg"`

### JSON Format
```json
{
  "id": "node-308",
  "type": "uploadFile",
  "x": 500,
  "y": 500,
  "params": {
    "selector": "input[type='file']",
    "filePath": "C:\\Documents\\resume.pdf"
  }
}
```

---

# WAIT NODES

## waitTimeout - Wait Time
**Purpose**: Wait for a fixed amount of time.

### Parameters
- **timeout** (number): Wait time in milliseconds
  - *Examples*: `1000` (1 second), `5000` (5 seconds)

### JSON Format
```json
{
  "id": "node-401",
  "type": "waitTimeout",
  "x": 100,
  "y": 600,
  "params": {
    "timeout": "3000"
  }
}
```

---

## waitElement - Wait Element
**Purpose**: Wait until element appears on page.

### Parameters
- **selector** (selector): CSS selector of element to wait for

### JSON Format
```json
{
  "id": "node-402",
  "type": "waitElement",
  "x": 300,
  "y": 600,
  "params": {
    "selector": ".loading-complete"
  }
}
```

---

# DATA NODES

## getText - Get Text
**Purpose**: Extract text content from element and save to variable.

### Parameters
- **selector** (selector): CSS selector of element containing text
- **variable** (text): Variable name to save text

### JSON Format
```json
{
  "id": "node-501",
  "type": "getText",
  "x": 100,
  "y": 700,
  "params": {
    "selector": "h1.page-title",
    "variable": "pageTitle"
  }
}
```

---

## getAttribute - Get Attribute
**Purpose**: Extract attribute value from element.

### Parameters
- **selector** (selector): CSS selector of element
- **attribute** (text): Attribute name to get
  - *Examples*: `"href"`, `"src"`, `"data-id"`, `"class"`
- **variable** (text): Variable name to save value

### JSON Format
```json
{
  "id": "node-502",
  "type": "getAttribute",
  "x": 300,
  "y": 700,
  "params": {
    "selector": "a.product-link",
    "attribute": "href",
    "variable": "productURL"
  }
}
```

---

## getInputValue - Get Input Value
**Purpose**: Get current value of input field.

### Parameters
- **selector** (selector): CSS selector of input
- **variable** (text): Variable name to save value

### JSON Format
```json
{
  "id": "node-503",
  "type": "getInputValue",
  "x": 500,
  "y": 700,
  "params": {
    "selector": "#user-name",
    "variable": "currentUserName"
  }
}
```

---

## screenshot - Screenshot
**Purpose**: Take screenshot of screen or specific element.

### Parameters
- **filename** (text): Image file name
  - *Examples*: `"homepage.png"`, `"login-error.jpg"`
- **selector** (selector, optional): CSS selector of element to capture (empty = full screen)

### JSON Format
```json
{
  "id": "node-504",
  "type": "screenshot",
  "x": 700,
  "y": 700,
  "params": {
    "filename": "dashboard.png",
    "selector": ".main-content"
  }
}
```

---

# TESTING NODES

## Basic Assertions

### assertVisible - Assert Visible
**Purpose**: Verify element is visible on page.

#### Parameters
- **selector** (selector): CSS selector of element to check

#### JSON Format
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

---

### assertText - Assert Text
**Purpose**: Verify text content of element.

#### Parameters
- **selector** (selector): CSS selector of element
- **text** (text): Expected text

#### JSON Format
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

---

### assertURL - Assert URL
**Purpose**: Verify current page URL.

#### Parameters
- **expectedURL** (text): Expected URL

#### JSON Format
```json
{
  "id": "node-603",
  "type": "assertURL",
  "x": 500,
  "y": 800,
  "params": {
    "expectedURL": "https://example.com/dashboard"
  }
}
```

---

### assertTitle - Assert Title
**Purpose**: Verify page title.

#### Parameters
- **expectedTitle** (text): Expected title

#### JSON Format
```json
{
  "id": "node-604",
  "type": "assertTitle",
  "x": 700,
  "y": 800,
  "params": {
    "expectedTitle": "Dashboard - My App"
  }
}
```

---

### assertAttribute - Assert Attribute
**Purpose**: Verify element attribute value.

#### Parameters
- **selector** (selector): CSS selector of element
- **attribute** (text): Attribute name
- **expectedValue** (text): Expected value

#### JSON Format
```json
{
  "id": "node-605",
  "type": "assertAttribute",
  "x": 900,
  "y": 800,
  "params": {
    "selector": "input[name='email']",
    "attribute": "type",
    "expectedValue": "email"
  }
}
```

---

### assertElementCount - Assert Element Count
**Purpose**: Verify number of elements matching selector.

#### Parameters
- **selector** (selector): CSS selector
- **operator** (select): Comparison operator
  - **equals**: Equal (=)
  - **greater**: Greater than (>)
  - **less**: Less than (<)
  - **greaterEqual**: Greater than or equal (>=)
  - **lessEqual**: Less than or equal (<=)
- **expectedCount** (number): Expected count

#### JSON Format
```json
{
  "id": "node-606",
  "type": "assertElementCount",
  "x": 100,
  "y": 900,
  "params": {
    "selector": ".product-card",
    "operator": "greater",
    "expectedCount": "5"
  }
}
```

---

### assertNotVisible - Assert Not Visible
**Purpose**: Verify element is not visible or does not exist.

#### Parameters
- **selector** (selector): CSS selector of element

#### JSON Format
```json
{
  "id": "node-607",
  "type": "assertNotVisible",
  "x": 300,
  "y": 900,
  "params": {
    "selector": ".loading-spinner"
  }
}
```

---

### assertContainsText - Assert Contains Text
**Purpose**: Verify element contains partial text.

#### Parameters
- **selector** (selector): CSS selector of element
- **containsText** (text): Partial text to find

#### JSON Format
```json
{
  "id": "node-608",
  "type": "assertContainsText",
  "x": 500,
  "y": 900,
  "params": {
    "selector": ".error-message",
    "containsText": "required field"
  }
}
```

---

## Advanced Assertions

### assertEnabled - Assert Enabled
**Purpose**: Verify element is enabled and interactive.

#### Parameters
- **selector** (selector): CSS selector of element to check

#### JSON Format
```json
{
  "id": "node-609",
  "type": "assertEnabled",
  "x": 100,
  "y": 1000,
  "params": {
    "selector": "#submit-button"
  }
}
```

---

### assertDisabled - Assert Disabled
**Purpose**: Verify element is disabled and not interactive.

#### Parameters
- **selector** (selector): CSS selector of element to check

#### JSON Format
```json
{
  "id": "node-610",
  "type": "assertDisabled",
  "x": 300,
  "y": 1000,
  "params": {
    "selector": "#submit-button"
  }
}
```

---

### assertChecked - Assert Checked
**Purpose**: Verify checkbox or radio button is checked.

#### Parameters
- **selector** (selector): CSS selector of checkbox/radio element

#### JSON Format
```json
{
  "id": "node-611",
  "type": "assertChecked",
  "x": 500,
  "y": 1000,
  "params": {
    "selector": "#agree-terms"
  }
}
```

---

### assertUnchecked - Assert Unchecked
**Purpose**: Verify checkbox or radio button is not checked.

#### Parameters
- **selector** (selector): CSS selector of checkbox/radio element

#### JSON Format
```json
{
  "id": "node-612",
  "type": "assertUnchecked",
  "x": 700,
  "y": 1000,
  "params": {
    "selector": "#newsletter"
  }
}
```

---

### assertCSSProperty - Assert CSS Property
**Purpose**: Verify element's CSS property has expected value.

#### Parameters
- **selector** (selector): CSS selector of element
- **property** (text): CSS property name
- **expectedValue** (text): Expected property value

#### JSON Format
```json
{
  "id": "node-613",
  "type": "assertCSSProperty",
  "x": 900,
  "y": 1000,
  "params": {
    "selector": ".highlight",
    "property": "background-color",
    "expectedValue": "rgb(255, 255, 0)"
  }
}
```

---

## Quality Assurance Nodes

### validateForm - Validate Form
**Purpose**: Comprehensive form validation check.

#### Parameters
- **selector** (selector): CSS selector of form element
- **validationType** (select): Type of validation
  - **required**: Check required fields
  - **format**: Check input formats
  - **all**: Complete validation

#### JSON Format
```json
{
  "id": "node-614",
  "type": "validateForm",
  "x": 100,
  "y": 1100,
  "params": {
    "selector": "#contact-form",
    "validationType": "all"
  }
}
```

---

### checkBrokenLinks - Check Broken Links
**Purpose**: Scan page for broken or invalid links.

#### Parameters
- **scope** (select): Scope of link checking
  - **page**: Current page only
  - **domain**: Same domain links
  - **all**: All links

#### JSON Format
```json
{
  "id": "node-615",
  "type": "checkBrokenLinks",
  "x": 300,
  "y": 1100,
  "params": {
    "scope": "page"
  }
}
```

---

### checkImageLoading - Check Image Loading
**Purpose**: Verify all images load successfully.

#### Parameters
- **selector** (selector, optional): CSS selector for specific images (empty = all images)

#### JSON Format
```json
{
  "id": "node-616",
  "type": "checkImageLoading",
  "x": 500,
  "y": 1100,
  "params": {
    "selector": ".gallery img"
  }
}
```

---

### checkPageSpeed - Check Page Speed
**Purpose**: Measure page loading performance.

#### Parameters
- **metric** (select): Performance metric to measure
  - **load**: Page load time
  - **dom**: DOM ready time
  - **first-paint**: First contentful paint
- **threshold** (number): Maximum acceptable time in milliseconds

#### JSON Format
```json
{
  "id": "node-617",
  "type": "checkPageSpeed",
  "x": 700,
  "y": 1100,
  "params": {
    "metric": "load",
    "threshold": "3000"
  }
}
```

---

### checkResponsive - Check Responsive Design
**Purpose**: Test responsive design across different screen sizes.

#### Parameters
- **devices** (select): Device types to test
  - **mobile**: Mobile devices
  - **tablet**: Tablet devices
  - **desktop**: Desktop sizes
  - **all**: All device types

#### JSON Format
```json
{
  "id": "node-618",
  "type": "checkResponsive",
  "x": 900,
  "y": 1100,
  "params": {
    "devices": "all"
  }
}
```

---

### checkAccessibility - Check Accessibility
**Purpose**: Test WCAG accessibility compliance.

#### Parameters
- **level** (select): WCAG compliance level
  - **A**: Level A compliance
  - **AA**: Level AA compliance
  - **AAA**: Level AAA compliance

#### JSON Format
```json
{
  "id": "node-619",
  "type": "checkAccessibility",
  "x": 100,
  "y": 1200,
  "params": {
    "level": "AA"
  }
}
```

---

### checkSEO - Check SEO
**Purpose**: Analyze page SEO factors.

#### Parameters
- **checks** (select): SEO elements to check
  - **meta**: Meta tags
  - **headings**: Heading structure
  - **images**: Image alt texts
  - **links**: Link structure
  - **all**: All SEO factors

#### JSON Format
```json
{
  "id": "node-620",
  "type": "checkSEO",
  "x": 300,
  "y": 1200,
  "params": {
    "checks": "all"
  }
}
```

---

## Network & Performance Nodes

### interceptNetwork - Intercept Network
**Purpose**: Intercept and modify network requests.

#### Parameters
- **url** (text): URL pattern to intercept
- **method** (select): HTTP method to intercept
- **action** (select): Action to take
  - **block**: Block the request
  - **modify**: Modify the request
  - **delay**: Add delay to request

#### JSON Format
```json
{
  "id": "node-621",
  "type": "interceptNetwork",
  "x": 500,
  "y": 1200,
  "params": {
    "url": "*/api/users",
    "method": "GET",
    "action": "delay"
  }
}
```

---

### setCookie - Set Cookie
**Purpose**: Set browser cookies for testing.

#### Parameters
- **name** (text): Cookie name
- **value** (text): Cookie value
- **domain** (text, optional): Cookie domain

#### JSON Format
```json
{
  "id": "node-622",
  "type": "setCookie",
  "x": 700,
  "y": 1200,
  "params": {
    "name": "sessionId",
    "value": "test123",
    "domain": "example.com"
  }
}
```

---

### checkConsoleErrors - Check Console Errors
**Purpose**: Monitor and validate browser console for errors.

#### Parameters
- **threshold** (number): Maximum acceptable error count

#### JSON Format
```json
{
  "id": "node-623",
  "type": "checkConsoleErrors",
  "x": 900,
  "y": 1200,
  "params": {
    "threshold": "0"
  }
}
```

---

### checkMemoryUsage - Check Memory Usage
**Purpose**: Monitor memory consumption during test execution.

#### Parameters
- **threshold** (number): Maximum memory usage in MB

#### JSON Format
```json
{
  "id": "node-624",
  "type": "checkMemoryUsage",
  "x": 100,
  "y": 1300,
  "params": {
    "threshold": "512"
  }
}
```

---

### checkLocalStorage - Check Local Storage
**Purpose**: Validate browser local storage data.

#### Parameters
- **key** (text): Storage key to check
- **expectedValue** (text, optional): Expected value

#### JSON Format
```json
{
  "id": "node-625",
  "type": "checkLocalStorage",
  "x": 300,
  "y": 1300,
  "params": {
    "key": "userPreferences",
    "expectedValue": "dark-mode"
  }
}
```

---

### checkSessionStorage - Check Session Storage
**Purpose**: Validate browser session storage data.

#### Parameters
- **key** (text): Storage key to check
- **expectedValue** (text, optional): Expected value

#### JSON Format
```json
{
  "id": "node-626",
  "type": "checkSessionStorage",
  "x": 500,
  "y": 1300,
  "params": {
    "key": "cartItems",
    "expectedValue": "2"
  }
}
```

---

### testCrossBrowser - Test Cross Browser
**Purpose**: Execute test across multiple browser engines.

#### Parameters
- **browsers** (select): Browsers to test
  - **chrome**: Google Chrome
  - **firefox**: Mozilla Firefox
  - **safari**: Safari
  - **edge**: Microsoft Edge
  - **all**: All browsers

#### JSON Format
```json
{
  "id": "node-627",
  "type": "testCrossBrowser",
  "x": 700,
  "y": 1300,
  "params": {
    "browsers": "all"
  }
}
```

---

### simulateNetworkCondition - Simulate Network Condition
**Purpose**: Test under different network conditions.

#### Parameters
- **condition** (select): Network condition preset
  - **fast-3g**: Fast 3G
  - **slow-3g**: Slow 3G
  - **offline**: Offline mode
  - **custom**: Custom condition
- **downloadSpeed** (number, optional): Download speed in Kbps
- **uploadSpeed** (number, optional): Upload speed in Kbps
- **latency** (number, optional): Network latency in ms

#### JSON Format
```json
{
  "id": "node-628",
  "type": "simulateNetworkCondition",
  "x": 900,
  "y": 1300,
  "params": {
    "condition": "slow-3g"
  }
}
```

---

# Usage Tips

## Common CSS Selectors
- **ID**: `#elementId`
- **Class**: `.className`
- **Attribute**: `[attribute="value"]`
- **Descendant**: `.parent .child`
- **Direct child**: `.parent > .child`
- **Multiple classes**: `.class1.class2`
- **Nth child**: `:nth-child(2)`
- **Contains text**: `:contains("text")`

## Conditional Expressions
- **Comparison**: `==`, `!=`, `>`, `<`, `>=`, `<=`
- **Logic**: `&&` (and), `||` (or), `!` (not)
- **String**: `variable.includes("text")`
- **Number**: `parseInt(variable) > 10`

## Best Practices
1. **Clear variable names**: Use `userName` instead of `var1`
2. **Specific CSS selectors**: Avoid overly generic selectors
3. **Add wait nodes**: Wait for elements to load before interaction
4. **Important screenshots**: Take screenshots at key steps for debugging
5. **Comments**: Add notes for complex workflows
6. **Error handling**: Use assert nodes to validate results

## Workflow Structure Example
```
[Start] → [Goto URL] → [Wait Element] → [Fill Login] → [Click Submit] 
    → [Assert Success] → [Screenshot] → [End]
```

---

# TROUBLESHOOTING

## Common Issues

### Element Not Found
- **Cause**: Incorrect CSS selector or element not loaded
- **Solution**: Verify selector, add `waitElement` before interaction

### Timeout Error
- **Cause**: Element doesn't appear within wait time
- **Solution**: Increase timeout or check loading conditions

### Click Failed
- **Cause**: Element obscured or not clickable
- **Solution**: Scroll to element, use `hover` before clicking

### Variable Not Found
- **Cause**: Variable not initialized or incorrect name
- **Solution**: Ensure `setVariable` was executed beforehand

---

# ADVANCED TECHNIQUES

## Dynamic Selectors
Using variables in selectors:
```
selector: "input[name='" + variableName + "']"
```

## Conditional Workflows
Using `if` nodes for complex conditional flows:
```
if (pageTitle == "Login") → fillLoginForm
else → skipLogin
```

## Data-Driven Testing
Using `forEach` with array data:
```javascript
testData = ["user1", "user2", "user3"]
forEach(testData) → testLogin(currentUser)
```

## Error Handling Patterns
```
action → assert → onSuccess → continue
       ↘ onFail → screenshot → stop
```

---

*This documentation is continuously updated. For more information, please refer to the source code or contact the support team.*