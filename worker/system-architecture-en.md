# SMEW Worker - System Architecture

## Overview

**SMEW Worker** is an automation execution engine responsible for executing JSON workflows with **absolute accuracy**. The system consists of 2 main components:

### TOOLKIT (Completed)
- Visual workflow designer with drag & drop interface
- Export workflow JSON standard format
- Real-time validation and documentation system

### WORKER (Needs Implementation)
- JSON workflow parser and execution engine
- Browser automation with stealth capabilities
- Comprehensive error handling and recovery
- Detailed logging and progress monitoring
- Configuration management system

## Core Architecture

### System Components Overview
```
 SMEW WORKER

 Config Manager JSON Parser Workflow Validator

 Worker Settings Schema Check Dependency Graph
 Stealth Config Validation Flow Analysis
 Logging Setup Migration Error Detection


 EXECUTION ENGINE

 Node Browser State
 Processors Controller Manager

 47+ Nodes Stealth Variables
 Processing Controls Context
 Lifecycle Checkpoints



 MONITORING & RECOVERY SYSTEM

 Progress Error Log
 Tracker Handler Manager

 Real-time Retry Structured
 Monitoring Recovery Logging
 Metrics Fallback Aggregation


```

### Worker Core Architecture

The SMEW Worker follows a modular architecture with three main layers:

- **Configuration Layer**: Manages worker settings and environment-specific configurations
- **Execution Layer**: Handles workflow parsing, node processing, and state management
- **Monitoring Layer**: Provides real-time monitoring, logging, and recovery capabilities

## Configuration Management

### Worker Configuration Structure
```json
{
 "workerId": "worker-{uuid}",
 "name": "Production Worker 01",
 "version": "1.0.0",
 "environment": "production|staging|development",

 "browser": {
 "engine": "playwright|selenium",
 "type": "chromium|firefox|webkit",
 "headless": true,
 "viewport": { "width": 1920, "height": 1080 },
 "stealth": {
 "enabled": true,
 "userAgent": "custom|random|default",
 "plugins": ["stealth-user-agent", "stealth-webgl", "stealth-canvas"],
 "fingerprint": {
 "canvas": "noise|block|fake",
 "webgl": "noise|block|fake",
 "fonts": "fake|block|default",
 "timezone": "fake|system|custom"
 }
 },
 "network": {
 "proxy": {
 "enabled": false,
 "type": "http|socks5",
 "host": "",
 "port": 0,
 "username": "",
 "password": ""
 },
 "userAgent": "",
 "acceptLanguage": "en-US,en;q=0.9",
 "timeout": {
 "navigation": 30000,
 "request": 15000,
 "response": 15000
 }
 }
 },

 "execution": {
 "maxConcurrentWorkflows": 3,
 "defaultTimeout": 10000,
 "retryPolicy": {
 "maxAttempts": 3,
 "backoffMultiplier": 2,
 "initialDelay": 1000,
 "maxDelay": 30000,
 "jitterEnabled": true
 },
 "recovery": {
 "enabled": true,
 "checkpointInterval": 5,
 "maxCheckpoints": 10,
 "autoRestore": true
 }
 },

 "logging": {
 "level": "info|debug|warn|error",
 "format": "json|plain",
 "outputs": ["console", "file", "database"],
 "fileConfig": {
 "directory": "./logs",
 "maxSize": "100MB",
 "maxFiles": 30,
 "compress": true
 },
 "includeScreenshots": true,
 "includeHar": false,
 "sensitiveDataMask": true
 },

 "monitoring": {
 "metricsEnabled": true,
 "healthCheckInterval": 30000,
 "performanceTracking": true,
 "resourceMonitoring": {
 "memory": { "enabled": true, "threshold": "512MB" },
 "cpu": { "enabled": true, "threshold": 80 },
 "disk": { "enabled": true, "threshold": "1GB" }
 }
 },

 "security": {
 "sandboxEnabled": true,
 "fileSystemAccess": "restricted",
 "networkAccess": "filtered",
 "executionTimeout": 3600000,
 "allowedDomains": [],
 "blockedDomains": []
 }
}
```

### Configuration Management Implementation

#### Core Features
- **Config Loader**: Load from file, environment variables, or remote config service
- **Validation**: Schema validation for all config parameters
- **Hot Reload**: Update config without restart for non-critical settings
- **Environment Override**: Environment-specific configurations
- **Security**: Encrypt sensitive config data (passwords, API keys)

#### Configuration Sources
- **File-based**: JSON/YAML configuration files
- **Environment Variables**: Override settings via env vars
- **Remote Config**: Fetch from centralized config service
- **Command Line**: Override specific settings via CLI args

## Browser Management

### Stealth System Implementation

#### Anti-Detection Architecture
```
Browser Launch Stealth Plugins Fingerprint Masking Network Disguise Behavior Simulation
```

#### Stealth Modules

##### User Agent Masking
- **Random User Agents**: Pool of realistic user agents for different browsers/OS
- **Consistent Headers**: Match Accept, Accept-Language, Accept-Encoding with user agent
- **Version Cycling**: Rotate through recent browser versions
- **Platform Consistency**: Ensure user agent matches platform indicators

##### Canvas Fingerprint Protection
- **Noise Injection**: Add subtle noise to canvas rendering
- **Fake Canvas**: Return predetermined canvas fingerprints
- **Blocking Mode**: Block canvas fingerprinting attempts entirely
- **Dynamic Response**: Different responses for repeated requests

##### WebGL Fingerprint Masking
- **WebGL Parameters**: Modify renderer, vendor strings
- **Extension Spoofing**: Fake available WebGL extensions
- **Performance Masking**: Alter performance benchmarks
- **Texture Noise**: Add noise to WebGL texture generation

##### Font Detection Evasion
- **Font List Spoofing**: Return fake list of installed fonts
- **Metrics Modification**: Alter font metrics measurements
- **Loading Behavior**: Simulate font loading patterns
- **Fallback Handling**: Consistent fallback font behavior

##### Timezone & Locale Masking
- **Timezone Spoofing**: Override system timezone
- **Locale Consistency**: Match timezone with locale settings
- **Date Object**: Consistent Date object behavior
- **Intl API**: Override Intl API responses

##### Plugin & Extension Simulation
- **Plugin Lists**: Simulate realistic plugin installations
- **MIME Types**: Fake MIME type support
- **Extension APIs**: Mock extension-specific APIs
- **Version Consistency**: Match plugin versions with browser version

##### Network Behavior Simulation
- **Request Timing**: Human-like request intervals
- **Connection Reuse**: Realistic connection pooling
- **Header Ordering**: Natural header order variation
- **Compression**: Realistic compression acceptance

##### Mouse & Keyboard Simulation
- **Human Movement**: Bezier curves for mouse movement
- **Typing Patterns**: Realistic typing speeds and patterns
- **Click Variation**: Natural click coordinates variation
- **Pause Simulation**: Human-like pauses between actions

## Node Processing Architecture

### Node Processor Interface
```typescript
interface NodeProcessor {
 type: string;
 validate(params: any): ValidationResult;
 execute(params: any, context: ExecutionContext): Promise<ExecutionResult>;
 getRequiredCapabilities(): string[];
 getTimeout(params: any): number;
}
```

### Node Categories

## Start Nodes

### START Node
**Purpose**: Workflow entry point and initialization
**Parameters**: None

#### Implementation Requirements
- Initialize browser session with stealth configuration
- Setup execution context with empty variable store
- Validate workflow graph integrity
- Create first checkpoint
- Log workflow start event

#### Processing Strategy
- **Session Setup**: Launch browser with configured options and stealth plugins
- **Context Creation**: Initialize global variable store, execution stack, checkpoint system
- **Validation**: Ensure no incoming connections, exactly one per workflow
- **Browser Initialization**: Apply stealth configuration, set viewport, user agent
- **Checkpoint**: Create initial state snapshot with browser state
- **Next Node**: Identify and queue first executable node

#### Error Handling
- Browser launch failure → Retry with different browser engine
- Configuration invalid → Terminate with detailed error report
- Stealth setup failure → Fallback to basic browser mode

#### Success Criteria
- Browser launched successfully
- Stealth configuration applied
- Initial checkpoint created
- Execution context initialized

## Logic Control Nodes

### IF Node
**Purpose**: Conditional branching based on expression evaluation
**Parameters**:
- condition (text): Boolean expression to evaluate (e.g., "variable == 'value'")

#### Implementation Requirements
- JavaScript expression parser with variable substitution
- Boolean evaluation with type coercion
- Branch selection based on result
- Context cloning for multiple paths

#### Processing Strategy
- **Expression Parsing**: Parse condition string, identify variables and operators
- **Variable Substitution**: Replace variable names with current values from context
- **Operator Support**: Handle ==, !=, >, <, >=, <=, &&, ||, contains, startsWith, endsWith
- **Type Coercion**: Handle string/number/boolean comparisons appropriately
- **Safe Evaluation**: Execute in sandboxed environment to prevent code injection
- **Branch Selection**: Choose then/else path based on boolean result
- **Context Cloning**: Clone execution context for each branch to isolate state

##### Supported Expressions
- **Equality**: `username == "admin"`, `count != 0`
- **Comparison**: `price > 100`, `items.length <= 5`
- **String Operations**: `title contains "Welcome"`, `url startsWith "https"`
- **Logical**: `status == "active" && verified == true`
- **Existence**: `errorMessage exists`, `loadingSpinner not exists`

##### Connection Handling
- **Input**: Single connection from previous node
- **Output Then**: Execute if condition evaluates to true
- **Output Else**: Execute if condition evaluates to false

#### Error Handling
- Invalid expression syntax → Detailed syntax error with suggestions
- Undefined variables → List available variables, suggest corrections
- Type mismatch → Attempt type coercion, warn if unexpected
- Evaluation timeout → Prevent infinite loops in expressions

#### Success Criteria
- Expression parsed successfully
- All variables resolved
- Boolean result determined
- Appropriate branch selected

### FOREACH Node
**Purpose**: Iterative execution over arrays or numeric ranges
**Parameters**:
- list (text): Array variable name or numeric count (e.g., "productList" or "5")
- variable (text): Variable name for current item (e.g., "item")

#### Implementation Requirements
- Array iteration with index tracking
- Nested scope management
- Loop control (break conditions)
- Performance monitoring to prevent infinite loops

#### Processing Strategy
- **Collection Resolution**: Parse list parameter - if numeric, create range; if variable, resolve array
- **Array Validation**: Ensure array variable exists and is iterable
- **Iterator Setup**: Create iterator with currentIndex, currentItem variables
- **Scope Creation**: Create nested execution scope with loop variables
- **Loop Control**: Track iterations, implement max iteration limits
- **Item Variable**: Set loop variable to current item in each iteration
- **Index Tracking**: Maintain currentIndex variable (0-based)
- **State Aggregation**: Collect results and errors from all iterations
- **Break Conditions**: Support early exit on errors or specific conditions

##### Loop Types
- **Array Iteration**: Loop through array elements
- **Numeric Range**: Loop N times (0 to N-1)
- **Object Iteration**: Loop through object keys (future enhancement)

##### Loop Variables Available
- **{variable}**: Current item value (user-defined name)
- **currentIndex**: Current iteration index (0-based)
- **currentItem**: Alias for current item (system-defined)
- **iterationCount**: Total number of iterations planned

##### Connection Handling
- **Input**: Single connection from previous node
- **Output Loop**: Execute loop body for each iteration
- **Output Done**: Execute after loop completion or break

#### Error Handling
- Array variable not found → Report available variables
- Non-iterable value → Attempt to convert to array or error
- Infinite loop detection → Stop after max iterations (default: 1000)
- Loop body errors → Continue with next iteration or exit based on configuration

#### Success Criteria
- Collection resolved successfully
- All iterations completed or stopped appropriately
- Loop variables set correctly in each iteration
- Final state aggregated properly

### SET-VARIABLE Node
**Purpose**: Store values in global variable store

#### Implementation Requirements
- Variable name validation
- Type coercion and serialization
- Scope management
- Change tracking for debugging

#### Processing Strategy
- **Name Validation**: Ensure valid variable name
- **Value Processing**: Type coercion, serialization if needed
- **Store Update**: Save to global variable store
- **Change Logging**: Track variable changes for audit trail
- **Context Update**: Update execution context

### STOP Node
**Purpose**: Graceful workflow termination

#### Implementation Requirements
- Cleanup browser resources
- Generate final execution report
- Save final checkpoint
- Close all open connections

#### Processing Strategy
- **Resource Cleanup**: Close browser, cleanup temp files
- **Report Generation**: Compile execution report
- **State Preservation**: Save final state for analysis
- **Logging**: Log successful completion
- **Termination**: Clean process exit

### COMMENT Node
**Purpose**: Documentation and debugging information

#### Implementation Requirements
- Text storage and retrieval
- No execution impact
- Debugging metadata

#### Processing Strategy
- **Text Logging**: Log comment text at debug level
- **Passthrough**: No execution changes
- **Metadata**: Store comment in execution trace

## Navigation Nodes

### GOTO-URL Node
**Purpose**: Navigate to specified URL

#### Implementation Requirements
- URL validation and normalization
- Load state detection
- Redirect handling
- Error recovery

#### Processing Strategy
- **URL Validation**: Parse and validate URL format
- **Navigation**: Execute page navigation
- **Load Detection**: Wait for complete page load (DOM + Network + JS)
- **Redirect Handling**: Follow redirects, update context
- **Error Recovery**: Handle navigation failures, implement retry

##### Wait Conditions
- DOM Content Loaded
- Network idle (no requests for 500ms)
- JavaScript execution complete
- All resources loaded

### RELOAD Node
**Purpose**: Refresh current page

#### Implementation Requirements
- Current page detection
- Reload execution
- State preservation options
- Cache handling

#### Processing Strategy
- **Page State**: Capture current page URL
- **Reload Execution**: Hard refresh with cache bypass option
- **Load Detection**: Same as goto node
- **State Check**: Verify successful reload

### GO-BACK Node
**Purpose**: Navigate to previous page in browser history

#### Implementation Requirements
- History availability check
- Navigation execution
- History state management

#### Processing Strategy
- **History Check**: Verify back history exists
- **Navigation**: Execute browser back action
- **Wait**: Wait for navigation complete
- **Validation**: Confirm successful navigation

### GO-FORWARD Node
**Purpose**: Navigate to next page in browser history

#### Implementation Requirements
- Forward history availability check
- Navigation execution
- State synchronization

#### Processing Strategy
- **History Check**: Verify forward history exists
- **Navigation**: Execute browser forward action
- **Wait**: Wait for navigation complete
- **Validation**: Confirm successful navigation

## Interaction Nodes

### Element Location Strategy
All interaction nodes share common element location logic:

#### Selector Resolution Pipeline
```
CSS Selector Element Search Visibility Check Interactability Check Stability Verification
```

#### Smart Waiting Implementation
- **Progressive Timeout**: Start with short timeout, increase progressively
- **Condition Polling**: Check element conditions every 100ms
- **DOM Mutation Observer**: React to DOM changes
- **Stability Verification**: Ensure element position/size stable for 200ms

### CLICK Node
**Purpose**: Perform mouse click on element
**Parameters**:
- selector (selector): CSS selector for target element
- type (select): Click type - left|right|double (default: left)

#### Implementation Requirements
- Element location and visibility verification
- Scroll to view if needed
- Click coordinate calculation
- Event simulation

#### Processing Strategy
- **Element Location**: Find element using selector with smart waiting
- **Visibility Check**: Ensure element is visible, in viewport, and clickable
- **Scroll to View**: Auto-scroll if element not in viewport
- **Overlay Detection**: Check for overlapping elements that might intercept click
- **Coordinate Calculation**: Calculate click coordinates (element center with slight randomization)
- **Click Type Handling**: Execute left, right, or double-click based on type parameter
- **Event Sequence**: Fire mousedown, mouseup, click events in correct order
- **Verification**: Check for expected DOM changes or navigation

##### Click Type Support
- **Left Click**: Standard primary mouse button click
- **Right Click**: Context menu trigger (mousedown, mouseup, contextmenu events)
- **Double Click**: Two rapid clicks with correct timing (dblclick event)

##### Advanced Features
- **Human Simulation**: Add micro-movements before click
- **Pressure Simulation**: Vary click duration and pressure
- **Coordinate Randomization**: Slightly randomize click position
- **Anti-Detection**: Avoid bot-like perfectly centered clicks

#### Error Handling
- Element not found → Wait and retry with progressive timeouts
- Element not clickable → Check for overlays, scroll issues
- Click intercepted → Identify intercepting element, suggest solutions
- Navigation blocked → Handle pop-up blockers, JavaScript errors

#### Success Criteria
- Click events fired successfully
- Expected interaction occurred
- No JavaScript errors triggered
- Element state changed as expected

### FILL Node
**Purpose**: Enter text into input fields

#### Implementation Requirements
- Input field identification
- Clear existing content
- Text simulation with realistic timing
- Input validation triggering

#### Processing Strategy
- **Field Location**: Find input/textarea element
- **Focus**: Click to focus field
- **Clear Existing**: Clear current content (Ctrl+A, Delete)
- **Text Input**: Simulate typing with human-like delays
- **Validation Trigger**: Trigger input/change events
- **Verification**: Confirm text was entered correctly

##### Typing Simulation
- **Human Timing**: Variable delays between keystrokes (50-200ms)
- **Error Simulation**: Occasional backspace/correction (optional)
- **Paste Simulation**: Support for paste operations
- **Special Characters**: Handle Unicode, emojis, special symbols

### CLEAR-INPUT Node
**Purpose**: Clear input field content

#### Implementation Requirements
- Field identification
- Content removal
- Event triggering

#### Processing Strategy
- **Field Location**: Find target input field
- **Content Selection**: Select all content (Ctrl+A or triple-click)
- **Deletion**: Delete selected content
- **Event Triggering**: Fire input/change events
- **Verification**: Confirm field is empty

### CHECKBOX-STATE Node
**Purpose**: Set checkbox/radio button state
**Parameters**:
- selector (selector): CSS selector for checkbox/radio element
- state (select): Desired state - check|uncheck

#### Implementation Requirements
- Checkbox identification
- Current state detection
- State change execution
- Event handling

#### Processing Strategy
- **Element Location**: Find checkbox/radio input element
- **Type Validation**: Verify element is checkbox or radio input
- **Current State**: Get current checked property value
- **State Comparison**: Compare current state with desired state
- **Conditional Action**: Only perform click if state change needed
- **Click Execution**: Use click simulation if state change required
- **Event Triggering**: Fire change, input events after state change
- **Verification**: Confirm checked property matches desired state
- **Form Validation**: Trigger any form validation related to this input

##### Element Support
- **Checkbox Inputs**: `<input type="checkbox">`
- **Radio Buttons**: `<input type="radio">`
- **Custom Checkboxes**: Elements with checkbox ARIA roles
- **Switch Controls**: Toggle switches implemented as checkboxes

##### State Management
- **Check**: Set checked = true
- **Uncheck**: Set checked = false
- **Radio Groups**: Handle radio button group exclusivity
- **Indeterminate**: Handle tri-state checkboxes

#### Error Handling
- Wrong element type → Verify selector targets checkbox/radio input
- Element disabled → Check if element can be interacted with
- Radio group conflict → Handle radio button exclusivity properly
- Event blocked → Retry with direct property setting

#### Success Criteria
- Element checked property matches desired state
- Change events fired successfully
- Form validation updated if applicable
- Visual state updated in UI

### SELECT-DROPDOWN Node
**Purpose**: Select option from dropdown menu

#### Implementation Requirements
- Dropdown identification
- Option matching (by value, text, or index)
- Selection execution
- Event handling

#### Processing Strategy
- **Dropdown Location**: Find select element
- **Option Identification**: Match option by value/text/index
- **Selection**: Execute option selection
- **Event Triggering**: Fire change events
- **Verification**: Confirm correct option selected

##### Selection Strategies
- **By Value**: Match option value attribute
- **By Text**: Match visible option text
- **By Index**: Select by position (0-based)
- **Fuzzy Matching**: Partial text matching with similarity scoring

### HOVER Node
**Purpose**: Trigger mouse hover effects

#### Implementation Requirements
- Element location
- Mouse movement simulation
- Hover state maintenance
- Event triggering

#### Processing Strategy
- **Element Location**: Find target element
- **Mouse Movement**: Simulate realistic mouse movement to element
- **Hover State**: Maintain hover for specified duration
- **Event Triggering**: Fire mouseover/mouseenter events
- **Continuation**: Move to next action while maintaining hover

### KEY-PRESS Node
**Purpose**: Simulate keyboard key presses
**Parameters**:
- selector (selector): Element to focus before key press
- key (text): Key to press (Enter, Tab, Escape, etc.)

#### Implementation Requirements
- Key identification and mapping
- Focus context management
- Key event simulation
- Modifier support

#### Processing Strategy
- **Element Focus**: Find and focus target element if selector provided
- **Key Mapping**: Map key names to key codes (Enter → 13, Tab → 9, etc.)
- **Modifier Detection**: Parse modifier keys (Ctrl+Enter, Alt+Tab)
- **Key Simulation**: Send keydown, keypress, keyup events in sequence
- **Event Timing**: Add realistic delays between events
- **Special Keys**: Handle function keys, arrow keys, special characters

##### Key Mapping Support
- **Text Keys**: a-z, 0-9, symbols
- **Function Keys**: F1-F12
- **Navigation**: ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Home, End
- **Control**: Enter, Tab, Escape, Backspace, Delete
- **Modifiers**: Ctrl, Alt, Shift, Meta (Cmd on Mac)

#### Error Handling
- Invalid key name → Log warning, attempt best-guess mapping
- Element not focusable → Focus body element instead
- Key event blocked → Retry with different event types

#### Success Criteria
- Key events fired successfully
- Target element received focus
- Expected behavior triggered (form submission, navigation, etc.)

### UPLOAD-FILE Node
**Purpose**: Upload files through file input
**Parameters**:
- selector (selector): CSS selector for file input element
- filePath (text): Absolute path to file to upload

#### Implementation Requirements
- File input identification
- File path validation
- Upload simulation
- Progress monitoring

#### Processing Strategy
- **Input Location**: Find file input element using selector
- **Input Validation**: Verify element is file input type
- **File Validation**: Check file exists, is readable, get file stats
- **Path Normalization**: Convert relative paths to absolute
- **File Upload**: Set files property on input element
- **Event Triggering**: Fire change events to trigger upload
- **Progress Monitoring**: Monitor upload progress via XHR events
- **Validation**: Verify file appears in input.files array

##### File Support
- **File Types**: All types supported by browser
- **Multiple Files**: Support for multiple file selection
- **File Size**: Check file size limits
- **File Formats**: Validate file extensions if required

#### Error Handling
- File not found → Detailed error with path information
- File access denied → Check permissions, suggest solutions
- Invalid file input → Verify selector targets file input
- Upload timeout → Configurable timeout with progress updates

#### Success Criteria
- File successfully loaded into input
- Change events fired
- File visible in DOM
- Upload progress completed (if applicable)

## Synchronization Nodes

### WAIT-TIMEOUT Node
**Purpose**: Pause execution for specified duration

#### Implementation Requirements
- Timeout handling
- Interruptible waiting
- Progress reporting

#### Processing Strategy
- **Duration Parsing**: Parse timeout value (milliseconds)
- **Wait Implementation**: Use async sleep with cancellation support
- **Progress Updates**: Report wait progress at intervals
- **Interruption Handling**: Allow cancellation if needed

### WAIT-ELEMENT Node
**Purpose**: Wait for element to meet specified conditions

#### Implementation Requirements
- Element condition checking
- Progressive timeout strategy
- Condition state monitoring
- Performance optimization

#### Processing Strategy
- **Condition Definition**: Parse wait conditions (visible, hidden, present, absent)
- **Polling Loop**: Check conditions every 100ms
- **Timeout Management**: Implement progressive timeout with backoff
- **Performance**: Optimize selector queries, cache elements
- **State Changes**: React to DOM mutations for faster detection

##### Wait Conditions
- **Present**: Element exists in DOM
- **Absent**: Element does not exist in DOM
- **Visible**: Element is visible (display !== none, visibility !== hidden)
- **Hidden**: Element is present but not visible
- **Clickable**: Element is visible and not disabled
- **Stable**: Element position unchanged for 200ms

## Data Extraction Nodes

### GET-TEXT Node
**Purpose**: Extract text content from elements

#### Implementation Requirements
- Element text retrieval
- Text normalization
- Variable storage
- Multiple element handling

#### Processing Strategy
- **Element Location**: Find target element(s)
- **Text Extraction**: Get innerText or textContent based on requirements
- **Normalization**: Trim whitespace, normalize line breaks
- **Multiple Elements**: Handle selector matching multiple elements
- **Variable Storage**: Store extracted text in specified variable
- **Logging**: Log extraction success/failure

##### Text Extraction Options
- **Inner Text**: Visible text only (innerText)
- **Text Content**: All text including hidden (textContent)
- **Formatted**: Preserve formatting and line breaks
- **Trimmed**: Remove leading/trailing whitespace

### GET-ATTRIBUTE Node
**Purpose**: Extract attribute values from elements

#### Implementation Requirements
- Attribute retrieval
- Multiple attribute support
- Null handling
- Type conversion

#### Processing Strategy
- **Element Location**: Find target element
- **Attribute Extraction**: Get specified attribute value
- **Null Handling**: Handle missing attributes gracefully
- **Type Conversion**: Convert to appropriate data type
- **Variable Storage**: Store in specified variable

### GET-INPUT-VALUE Node
**Purpose**: Extract current value from input fields

#### Implementation Requirements
- Input field identification
- Value extraction
- Type-specific handling
- Validation state

#### Processing Strategy
- **Field Location**: Find input/textarea/select element
- **Value Extraction**: Get current value property
- **Type Handling**: Handle different input types (text, number, date, etc.)
- **Selected Options**: Handle select multiple options
- **Variable Storage**: Store extracted value

### SCREENSHOT Node
**Purpose**: Capture screenshots of page or elements

#### Implementation Requirements
- Screenshot capture
- File management
- Element highlighting
- Format options

#### Processing Strategy
- **Capture Type**: Full page, viewport, or specific element
- **File Naming**: Generate unique filename with timestamp
- **Format Selection**: PNG, JPEG with quality options
- **Element Highlighting**: Highlight target elements if specified
- **File Storage**: Save to configured directory
- **Path Logging**: Log screenshot file path

## Assertion Nodes

### Assertion Framework Architecture
All assertion nodes follow common pattern:
```
Element/State Location Value Extraction Comparison Result Logging Pass/Fail Decision
```

### ASSERT-VISIBLE Node
**Purpose**: Verify element visibility

#### Implementation Requirements
- Element location
- Visibility calculation
- Viewport checking
- Opacity considerations

#### Processing Strategy
- **Element Location**: Find element using selector
- **Visibility Check**: Verify element is visible (not hidden)
- **Viewport Check**: Ensure element is within viewport (optional)
- **Opacity Check**: Consider opacity values
- **Assertion Result**: Pass/fail based on visibility

##### Visibility Criteria
- **Display**: display !== 'none'
- **Visibility**: visibility !== 'hidden'
- **Opacity**: opacity > 0
- **Size**: width > 0 && height > 0
- **Viewport**: Element intersects with viewport

### ASSERT-TEXT Node
**Purpose**: Verify element text content

#### Implementation Requirements
- Text extraction
- Comparison modes
- Case sensitivity options
- Whitespace handling

#### Processing Strategy
- **Element Location**: Find target element
- **Text Extraction**: Get element text content
- **Text Normalization**: Handle whitespace, case sensitivity
- **Comparison**: Exact match, contains, regex, starts/ends with
- **Assertion Result**: Pass/fail based on comparison

##### Comparison Modes
- **Exact**: Exact string match
- **Contains**: Text contains substring
- **Regex**: Regular expression match
- **Starts With**: Text starts with specified string
- **Ends With**: Text ends with specified string
- **Case Insensitive**: All modes with case insensitivity option

### ASSERT-URL Node
**Purpose**: Verify current page URL

#### Implementation Requirements
- URL retrieval
- URL parsing
- Comparison logic
- Protocol handling

#### Processing Strategy
- **URL Retrieval**: Get current page URL
- **URL Normalization**: Handle trailing slashes, protocols
- **Comparison**: Support exact, contains, regex matching
- **Fragment Handling**: Include/exclude URL fragments
- **Query Parameters**: Handle query parameter variations

### ASSERT-TITLE Node
**Purpose**: Verify page title

#### Implementation Requirements
- Title extraction
- Text comparison
- Dynamic title handling

#### Processing Strategy
- **Title Extraction**: Get document title
- **Comparison**: Same options as assertText
- **Dynamic Updates**: Handle title changes after page load
- **Encoding**: Handle Unicode and special characters

### ASSERT-ATTRIBUTE Node
**Purpose**: Verify element attribute values

#### Implementation Requirements
- Attribute extraction
- Value comparison
- Type handling
- Missing attribute handling

#### Processing Strategy
- **Element Location**: Find target element
- **Attribute Extraction**: Get specified attribute value
- **Type Conversion**: Convert to expected data type
- **Comparison**: Compare with expected value
- **Null Handling**: Handle missing attributes

### ASSERT-ELEMENT-COUNT Node
**Purpose**: Verify number of elements matching selector

#### Implementation Requirements
- Element counting
- Selector evaluation
- Numeric comparison
- Dynamic content handling

#### Processing Strategy
- **Element Search**: Find all elements matching selector
- **Count Calculation**: Get total count
- **Numeric Comparison**: Compare with expected count
- **Operators**: Support equals, greater than, less than, range
- **Dynamic Content**: Wait for stable count if needed

### Additional Assertion Nodes

#### ASSERT-NOT-VISIBLE Node
**Purpose**: Verify element is not visible

#### ASSERT-ENABLED/ASSERT-DISABLED Nodes
**Purpose**: Verify element interaction state

#### ASSERT-CHECKED/ASSERT-UNCHECKED Nodes
**Purpose**: Verify checkbox/radio button state

#### ASSERT-CONTAINS-TEXT Node
**Purpose**: Verify element contains specific text

## Advanced Quality Assurance Nodes

### ASSERT-CSS-PROPERTY Node
**Purpose**: Verify computed CSS property values

#### Implementation Requirements
- Computed style calculation
- Property value extraction
- Unit handling
- Color format normalization

#### Processing Strategy
- **Element Location**: Find target element
- **Computed Styles**: Get computed style values
- **Property Extraction**: Get specific CSS property
- **Value Normalization**: Handle units, colors, formats
- **Comparison**: Compare with expected value

### VALIDATE-FORM Node
**Purpose**: Comprehensive form validation checking

#### Implementation Requirements
- Form field discovery
- Validation state checking
- Error message detection
- Submit button state

#### Processing Strategy
- **Form Discovery**: Find all form elements in specified form
- **Validation Check**: Check HTML5 validation states
- **Custom Validation**: Detect custom validation messages
- **Submit State**: Check form submission capability
- **Error Collection**: Collect all validation errors

### CHECK-BROKEN-LINKS Node
**Purpose**: Verify all links on page are functional

#### Implementation Requirements
- Link discovery
- HTTP status checking
- Concurrent requests
- Result aggregation

#### Processing Strategy
- **Link Discovery**: Find all `<a>` tags with href attributes
- **URL Validation**: Filter out javascript:, mailto:, tel: links
- **HTTP Checking**: Send HEAD requests to verify status
- **Concurrent Requests**: Batch requests to improve performance
- **Result Aggregation**: Collect broken links with status codes

### CHECK-IMAGE-LOADING Node
**Purpose**: Verify all images load successfully

#### Implementation Requirements
- Image discovery
- Load state checking
- Natural size verification
- Error detection

#### Processing Strategy
- **Image Discovery**: Find all <img> elements
- **Load State**: Check complete property and naturalWidth/Height
- **Error Detection**: Check for load errors
- **Size Validation**: Verify images have actual dimensions
- **Result Collection**: List failed images

### CHECK-PAGE-SPEED Node
**Purpose**: Analyze page performance metrics

#### Implementation Requirements
- Performance API access
- Metric calculation
- Resource timing analysis
- Score generation

#### Processing Strategy
- **Performance Metrics**: Use Navigation Timing API
- **Resource Analysis**: Analyze resource loading times
- **Core Metrics**: Calculate LCP, FID, CLS scores
- **Score Calculation**: Generate performance score
- **Threshold Comparison**: Compare with acceptable thresholds

### CHECK-RESPONSIVE Node
**Purpose**: Test responsive design at different viewports

#### Implementation Requirements
- Viewport simulation
- Layout verification
- Element positioning
- Media query testing

#### Processing Strategy
- **Viewport Simulation**: Test common screen sizes
- **Layout Check**: Verify layout doesn't break
- **Element Visibility**: Ensure important elements remain visible
- **Media Queries**: Verify CSS media query responses
- **Breakpoint Testing**: Test at common breakpoints

### CHECK-ACCESSIBILITY Node
**Purpose**: Verify accessibility compliance

#### Implementation Requirements
- Accessibility rule checking
- ARIA validation
- Color contrast analysis
- Keyboard navigation testing

#### Processing Strategy
- **Rule Checking**: Apply WCAG 2.1 rules
- **ARIA Validation**: Check ARIA attributes and roles
- **Contrast Analysis**: Verify color contrast ratios
- **Focus Management**: Test keyboard navigation
- **Screen Reader**: Verify screen reader compatibility

### CHECK-SEO Node
**Purpose**: Basic SEO compliance checking

#### Implementation Requirements
- Meta tag analysis
- Heading structure verification
- Image alt text checking
- Internal link analysis

#### Processing Strategy
- **Meta Tags**: Check title, description, keywords
- **Heading Structure**: Verify H1-H6 hierarchy
- **Image Analysis**: Check alt attributes
- **Link Analysis**: Verify internal link structure
- **Schema Markup**: Check structured data

## Network & Browser Control Nodes

### INTERCEPT-NETWORK Node
**Purpose**: Intercept and control network requests
**Parameters**:
- url (text): URL pattern to intercept (e.g., "*/api/users*")
- method (text): HTTP method to intercept (GET, POST, PUT, DELETE, etc.)

#### Implementation Requirements
- Request interception setup
- Pattern matching
- Response modification
- Request blocking

#### Processing Strategy
- **Interception Setup**: Enable browser network interception via CDP/DevTools Protocol
- **Pattern Matching**: Match requests by URL pattern (supports wildcards, regex)
- **Method Filtering**: Filter by HTTP method if specified
- **Request Analysis**: Inspect headers, body, timing
- **Control Actions**: Block, delay, modify, or allow requests
- **Response Mocking**: Return custom responses instead of actual network calls
- **Logging**: Log all intercepted requests with details

##### Interception Actions
- **Block**: Prevent request from being sent
- **Delay**: Add artificial delay to request/response
- **Modify Request**: Change headers, body, URL before sending
- **Mock Response**: Return fake response without sending request
- **Monitor Only**: Log request details but allow normal flow

##### Pattern Matching Support
- **Wildcards**: `*/api/*`, `*example.com*`
- **Exact URLs**: `https://api.example.com/users`
- **Regex**: Support regex patterns for complex matching
- **Domain-based**: `*.example.com`

#### Error Handling
- Invalid URL pattern → Log warning, suggest valid patterns
- Interception setup failed → Retry with fallback methods
- Browser doesn't support interception → Use alternative approaches

#### Success Criteria
- Network interception enabled successfully
- Requests matching pattern intercepted
- Specified actions applied correctly
- No impact on non-matching requests

### MOCK-API Node
**Purpose**: Create mock responses for API calls
**Parameters**:
- url (text): API URL pattern to mock (e.g., "/api/users", "*/products/*")
- response (text): Mock response JSON data

#### Implementation Requirements
- URL pattern matching
- Response simulation
- Status code handling
- Content type management

#### Processing Strategy
- **URL Pattern Setup**: Configure URL pattern matching for API endpoints
- **Response Parsing**: Parse mock response JSON, validate format
- **Interception Integration**: Work with network interception to catch API calls
- **Response Generation**: Generate mock responses with proper HTTP structure
- **Headers Setup**: Set appropriate Content-Type, CORS headers
- **Status Code**: Return configurable status codes (default: 200)
- **Dynamic Data**: Support template variables in response data
- **Persistence**: Maintain mock responses throughout workflow execution

##### Response Features
- **JSON Response**: Parse and return JSON data
- **Status Codes**: Support 200, 404, 500, custom codes
- **Response Headers**: Set Content-Type, Cache-Control, CORS headers
- **Dynamic Values**: Support timestamp, random data placeholders
- **Response Delay**: Add realistic API response delays
- **Sequential Responses**: Return different responses for repeated calls

##### Template Variables
- **{{timestamp}}**: Current timestamp
- **{{uuid}}**: Random UUID
- **{{random(min, max)}}**: Random number in range
- **{{date}}**: Current date
- **{{increment}}**: Auto-incrementing counter

##### Example Mock Responses
```json
{
 "users": [
 {"id": "{{uuid}}", "name": "User {{increment}}", "timestamp": "{{timestamp}}"}
 ],
 "status": "success",
 "count": 1
}
```

#### Error Handling
- Invalid JSON response → Parse error with line/column info
- URL pattern conflict → Warn about overlapping patterns
- Template variable error → Log invalid variable, use fallback

#### Success Criteria
- Mock API endpoint registered successfully
- Requests to URL pattern return mock response
- Response format matches expected API contract
- Dynamic variables resolved correctly

### SET-COOKIE Node
**Purpose**: Set browser cookies

#### Implementation Requirements
- Cookie creation
- Domain/path handling
- Expiration management
- Security flags

#### Processing Strategy
- **Cookie Creation**: Create cookie with specified name/value
- **Domain Setting**: Set appropriate domain and path
- **Expiration**: Handle expiration dates/max-age
- **Security**: Set secure, httpOnly, sameSite flags
- **Validation**: Verify cookie was set successfully

### CHECK-CONSOLE-ERRORS Node
**Purpose**: Monitor browser console for errors

#### Implementation Requirements
- Console monitoring setup
- Error categorization
- Message filtering
- Severity assessment

#### Processing Strategy
- **Monitor Setup**: Listen to console events
- **Error Collection**: Collect errors, warnings, logs
- **Categorization**: Classify by severity level
- **Filtering**: Filter out known harmless messages
- **Reporting**: Report significant errors

### CHECK-MEMORY-USAGE Node
**Purpose**: Monitor browser memory usage
**Parameters**:
- threshold (number): Memory threshold in MB (default: 100)

#### Implementation Requirements
- Memory API access
- Usage calculation
- Threshold comparison
- Leak detection

#### Processing Strategy
- **Memory Access**: Use Performance.measureUserAgentSpecificMemory API
- **Usage Calculation**: Calculate current heap memory usage
- **Process Memory**: Get total process memory if available
- **Threshold Check**: Compare current usage with threshold parameter
- **Trend Analysis**: Track memory usage over time to detect leaks
- **Garbage Collection**: Trigger GC if memory usage excessive
- **Reporting**: Generate detailed memory report with breakdown

##### Memory Metrics
- **Heap Usage**: JavaScript heap memory
- **DOM Nodes**: Number of DOM nodes in memory
- **Event Listeners**: Active event listener count
- **Images/Resources**: Loaded resource memory usage
- **Web Workers**: Memory used by background workers

#### Error Handling
- Memory API not available → Use alternative memory estimation methods
- Memory threshold exceeded → Log warning, suggest cleanup actions
- Memory leak detected → Report potential leak sources

#### Success Criteria
- Memory usage measured accurately
- Threshold comparison completed
- Memory report generated
- Trend analysis updated

### CHECK-LOCAL-STORAGE Node
**Purpose**: Verify localStorage contents
**Parameters**:
- key (text): Storage key to check (optional - if not provided, checks all keys)
- expectedValue (text): Expected value for the key (optional)

#### Implementation Requirements
- Storage access
- Key/value retrieval
- Data validation
- Type handling

#### Processing Strategy
- **Storage Access**: Access localStorage object
- **Key Validation**: Check if specified key exists
- **Value Retrieval**: Get stored value for key
- **Type Detection**: Detect data type (string, JSON object, array)
- **JSON Parsing**: Parse JSON strings if applicable
- **Value Comparison**: Compare actual value with expected value if provided
- **Storage Enumeration**: List all keys if no specific key provided
- **Size Calculation**: Calculate total storage usage

##### Validation Modes
- **Key Existence**: Verify key exists in localStorage
- **Value Match**: Verify value matches expected value exactly
- **JSON Validation**: Verify JSON structure validity
- **Storage Quota**: Check storage usage against browser limits

#### Error Handling
- Storage access denied → Check privacy settings, incognito mode
- JSON parse error → Report malformed JSON with details
- Key not found → Report missing key with available keys list
- Storage quota exceeded → Report storage usage statistics

#### Success Criteria
- Storage accessed successfully
- Key/value validation completed
- Expected conditions met
- Storage state verified

### CHECK-SESSION-STORAGE Node
**Purpose**: Verify sessionStorage contents
**Parameters**:
- key (text): Storage key to check (optional - if not provided, checks all keys)
- expectedValue (text): Expected value for the key (optional)

#### Implementation Requirements
Same as localStorage but for sessionStorage

#### Processing Strategy
- **Session Access**: Access sessionStorage object
- **Session Scope**: Verify session-specific data
- **Tab Isolation**: Handle session isolation between tabs
- **Session Persistence**: Verify data persists across page reloads
- Same validation and error handling as localStorage

##### Key Differences from localStorage
- **Session Scope**: Data cleared when tab/window closes
- **Tab Isolation**: Different tabs have separate sessionStorage
- **Persistence**: Survives page reloads but not browser restart

### TEST-CROSS-BROWSER Node
**Purpose**: Execute tests across multiple browsers

#### Implementation Requirements
- Multi-browser management
- Result aggregation
- Difference detection
- Report generation

#### Processing Strategy
- **Browser Launch**: Start multiple browser instances
- **Parallel Execution**: Run same workflow in different browsers
- **Result Collection**: Collect results from all browsers
- **Comparison**: Identify differences between browsers
- **Aggregation**: Generate cross-browser compatibility report

### SIMULATE-NETWORK-CONDITION Node
**Purpose**: Simulate different network conditions

#### Implementation Requirements
- Network throttling
- Latency simulation
- Bandwidth limiting
- Connection simulation

#### Processing Strategy
- **Throttling Setup**: Configure network throttling
- **Speed Simulation**: Simulate 3G, 4G, wifi speeds
- **Latency**: Add network latency
- **Packet Loss**: Simulate connection issues
- **Recovery**: Restore normal network conditions

## State Management & Variable System

### Variable Store Architecture
```json
{
 "global": {
 "variableName": {
 "value": "any type",
 "type": "string|number|boolean|object|array",
 "created": "timestamp",
 "lastModified": "timestamp",
 "source": "nodeId that created it"
 }
 },
 "scoped": {
 "forEach_node_123": {
 "currentIndex": 0,
 "currentItem": "item value",
 "iterationCount": 5
 }
 },
 "temporary": {
 "lastClickResult": "success",
 "lastScreenshot": "/path/to/screenshot.png"
 }
}
```

### Variable Management Implementation

#### Variable Operations
- **Set Variable**: Store value with type detection
- **Get Variable**: Retrieve value with type conversion
- **Delete Variable**: Remove variable from store
- **List Variables**: Get all available variables
- **Variable History**: Track changes for debugging

#### Scoping Rules
- **Global Scope**: Variables accessible from any node
- **Loop Scope**: Variables only accessible in forEach iterations
- **Temporary Scope**: System-generated variables (auto-cleanup)
- **Readonly Variables**: System variables that cannot be modified

#### Type Handling
- **Automatic Coercion**: Smart type conversion
- **Type Validation**: Ensure type consistency
- **Serialization**: Convert objects to JSON for storage
- **Deserialization**: Parse JSON back to objects

### Execution Context Management
```json
{
 "executionId": "uuid",
 "workflowId": "workflow_name",
 "currentNode": "node_123",
 "previousNode": "node_122",
 "completedNodes": ["start", "node_121", "node_122"],
 "failedNodes": [],
 "variables": "variable store reference",
 "browser": "browser instance reference",
 "startTime": "timestamp",
 "checkpoints": [
 {
 "nodeId": "node_120",
 "timestamp": "timestamp",
 "variables": "snapshot",
 "url": "current page URL"
 }
 ],
 "metrics": {
 "nodesExecuted": 15,
 "totalDuration": 45000,
 "averageNodeTime": 3000,
 "errorCount": 2,
 "retryCount": 5
 }
}
```

#### Context Operations
- **Context Creation**: Initialize new execution context
- **Context Cloning**: Create copy for branching
- **Context Merging**: Combine contexts from branches
- **Context Cleanup**: Remove temporary data
- **Context Persistence**: Save state for recovery

## Checkpoint & Recovery System

### Checkpoint Strategy
```
Checkpoint Triggers: Every N nodes, Before risky operations, Manual checkpoints, Time intervals
```

### Checkpoint Data Structure
```json
{
 "checkpointId": "uuid",
 "timestamp": "ISO timestamp",
 "nodeId": "current node",
 "executionContext": "full context snapshot",
 "browserState": {
 "url": "current page URL",
 "cookies": "browser cookies",
 "localStorage": "local storage snapshot",
 "sessionStorage": "session storage snapshot",
 "userAgent": "current user agent"
 },
 "variableState": "complete variable store snapshot",
 "systemState": {
 "workingDirectory": "/path",
 "temporaryFiles": ["list of temp files"],
 "openConnections": ["network connections"]
 }
}
```

### Recovery Implementation

#### Automatic Recovery Triggers
- **Browser Crash**: Browser process terminated unexpectedly
- **Page Crash**: Current page becomes unresponsive
- **Network Failure**: Extended network connectivity loss
- **Timeout Exceeded**: Node execution exceeds maximum timeout
- **Memory Exhaustion**: System running out of memory
- **Process Kill**: External process termination

#### Recovery Process
1. **Failure Detection**: Monitor system health, detect failures
2. **Checkpoint Selection**: Choose most recent valid checkpoint
3. **State Restoration**: Restore execution context and variables
4. **Browser Recovery**: Launch new browser instance
5. **Page Recreation**: Navigate to last known URL
6. **Storage Restoration**: Restore localStorage/sessionStorage
7. **Execution Resume**: Continue from checkpoint node

#### Recovery Validation
- **State Verification**: Verify restored state matches checkpoint
- **Page Validation**: Confirm page loaded correctly
- **Element Availability**: Check required elements still exist
- **Data Integrity**: Verify variable values are intact

## Logging & Monitoring System

### Structured Logging Format
```json
{
 "timestamp": "2025-01-15T10:30:45.123Z",
 "level": "info|debug|warn|error",
 "workerId": "worker-uuid",
 "executionId": "execution-uuid",
 "nodeId": "current-node-id",
 "nodeType": "click",
 "message": "Human readable message",
 "data": {
 "selector": "#button",
 "duration": 1250,
 "success": true,
 "retryCount": 0
 },
 "context": {
 "url": "https://example.com",
 "viewport": "1920x1080",
 "userAgent": "Chrome/..."
 },
 "performance": {
 "memoryUsage": "45MB",
 "cpuUsage": "12%",
 "networkRequests": 3
 },
 "screenshot": "/path/to/screenshot.png",
 "stackTrace": "error stack trace if applicable"
}
```

### Log Categories

#### Execution Logs
- **Node Start**: Log before node execution
- **Node Success**: Log successful completion
- **Node Failure**: Log failures with detailed error info
- **Node Retry**: Log retry attempts
- **Performance**: Log execution duration, resource usage

#### System Logs
- **Startup**: Worker initialization
- **Configuration**: Config loading and validation
- **Browser Lifecycle**: Browser launch, crash, restart
- **Resource Management**: Memory, CPU, disk usage
- **Security Events**: Security violations, suspicious activity

#### Debug Logs
- **Variable Changes**: Track variable modifications
- **Element Discovery**: Log element location attempts
- **Network Activity**: HTTP requests/responses
- **JavaScript Errors**: Browser console errors
- **DOM Mutations**: Significant DOM changes

#### Audit Logs
- **Workflow Execution**: Complete workflow runs
- **User Actions**: All user-simulated actions
- **Data Access**: Sensitive data access attempts
- **Configuration Changes**: System config modifications
- **Security Decisions**: Access control decisions

### Log Management Implementation

#### Log Aggregation
- **Local Storage**: Store logs locally with rotation
- **Remote Shipping**: Send logs to central logging system
- **Real-time Streaming**: Stream logs in real-time for monitoring
- **Buffering**: Buffer logs to prevent I/O blocking
- **Compression**: Compress old log files

#### Log Rotation
- **Size-based**: Rotate when files exceed size limit
- **Time-based**: Daily, weekly log rotation
- **Count-based**: Keep maximum number of files
- **Compression**: Compress rotated files
- **Cleanup**: Delete old compressed files

#### Log Analysis
- **Pattern Detection**: Identify common failure patterns
- **Performance Analysis**: Analyze execution performance trends
- **Error Correlation**: Correlate errors across workflows
- **Alerting**: Generate alerts based on log patterns
- **Reporting**: Generate execution reports

## Progress Monitoring & Control

### Real-time Progress Tracking
```json
{
 "executionId": "uuid",
 "status": "running|paused|completed|failed|cancelled",
 "progress": {
 "totalNodes": 25,
 "completedNodes": 15,
 "currentNode": "node_016",
 "percentage": 60,
 "estimatedTimeRemaining": "00:02:30"
 },
 "performance": {
 "startTime": "timestamp",
 "currentDuration": "00:05:15",
 "averageNodeTime": 1200,
 "slowestNode": {
 "nodeId": "node_010",
 "duration": 5000,
 "type": "waitElement"
 }
 },
 "health": {
 "memoryUsage": "156MB",
 "cpuUsage": "25%",
 "networkRequests": 45,
 "errorsCount": 2,
 "retriesCount": 7
 },
 "lastCheckpoint": {
 "nodeId": "node_015",
 "timestamp": "timestamp"
 }
}
```

### Progress Control Operations

#### Execution Control
- **Pause Execution**: Pause after current node completes
- **Resume Execution**: Resume from paused state
- **Cancel Execution**: Gracefully stop execution
- **Force Stop**: Immediately terminate execution
- **Step Mode**: Execute one node at a time

#### Speed Control
- **Normal Speed**: Default execution speed
- **Fast Mode**: Skip optional waits, reduce delays
- **Slow Mode**: Add extra delays for debugging
- **Turbo Mode**: Maximum speed with minimal safety checks
- **Custom Speed**: User-defined speed multiplier

#### Monitoring Interfaces
- **REST API**: HTTP endpoints for progress queries
- **WebSocket**: Real-time progress updates
- **File-based**: Progress updates written to file
- **Database**: Progress stored in database
- **Event Callbacks**: Callback functions for progress events

### Performance Monitoring

#### Execution Metrics
- **Node Execution Time**: Individual node performance
- **Wait Time Analysis**: Time spent waiting for conditions
- **Network Performance**: Request/response times
- **Browser Performance**: Page load, render times
- **Resource Usage**: Memory, CPU, disk utilization

#### Bottleneck Detection
- **Slow Nodes**: Identify consistently slow nodes
- **Wait Timeouts**: Detect excessive wait times
- **Network Issues**: Identify network-related delays
- **Browser Performance**: Detect browser performance issues
- **Resource Constraints**: Detect resource limitations

#### Optimization Recommendations
- **Selector Optimization**: Suggest better selectors
- **Wait Strategy**: Recommend better wait strategies
- **Parallel Execution**: Identify parallelization opportunities
- **Resource Optimization**: Suggest resource improvements
- **Configuration Tuning**: Recommend config changes

## Error Handling & Recovery Framework

### Error Classification System
```json
{
 "errorTypes": {
 "FATAL": {
 "description": "Errors that prevent continuation",
 "examples": ["Invalid workflow JSON", "Browser launch failure"],
 "action": "terminate_immediately"
 },
 "RECOVERABLE": {
 "description": "Errors that can be retried",
 "examples": ["Element not found", "Network timeout"],
 "action": "retry_with_backoff"
 },
 "WARNING": {
 "description": "Issues that don't prevent execution",
 "examples": ["Slow page load", "Console warning"],
 "action": "log_and_continue"
 },
 "IGNORED": {
 "description": "Known harmless conditions",
 "examples": ["Third-party script errors", "Ad blockers"],
 "action": "no_action"
 }
 }
}
```

### Retry Strategy Implementation

#### Exponential Backoff with Jitter
```
Initial Delay: 1000ms
Backoff Multiplier: 2.0
Max Delay: 30000ms
Jitter: ±25% random variation
Max Attempts: 3-5 (configurable by node type)
```

#### Node-Specific Retry Policies
- **Navigation Nodes**: 3 attempts, 5s initial delay
- **Interaction Nodes**: 5 attempts, 1s initial delay
- **Wait Nodes**: 10 attempts, 2s initial delay
- **Assertion Nodes**: 2 attempts, 1s initial delay
- **Extraction Nodes**: 3 attempts, 1s initial delay

#### Retry Decision Logic
1. **Error Classification**: Determine if error is retryable
2. **Attempt Count**: Check if max attempts reached
3. **Backoff Calculation**: Calculate delay with jitter
4. **Context Validation**: Ensure context is still valid
5. **Recovery Actions**: Execute recovery steps before retry

### Recovery Mechanisms

#### Browser Recovery
- **Page Refresh**: Reload current page
- **Browser Restart**: Close and relaunch browser
- **Session Reset**: Clear browser data and restart
- **Profile Switch**: Switch to different browser profile
- **Engine Switch**: Switch to backup browser engine

#### Element Recovery
- **Wait Extension**: Extend wait timeout
- **Selector Fallback**: Try alternative selectors
- **Page Interaction**: Scroll, click to trigger elements
- **JavaScript Execution**: Run custom JS to fix page state
- **Frame Switching**: Switch to different iframe

#### Network Recovery
- **Request Retry**: Retry failed requests
- **Proxy Switch**: Switch to different proxy
- **User Agent Change**: Change user agent string
- **Network Reset**: Reset network connections
- **Offline Mode**: Handle offline scenarios

#### State Recovery
- **Variable Restoration**: Restore variables from checkpoint
- **Context Rebuild**: Rebuild execution context
- **Page State**: Navigate back to required page state
- **Form Data**: Restore form field values
- **Authentication**: Re-authenticate if needed

### Error Context Collection

#### System Context
- **Worker Configuration**: Current worker settings
- **Browser State**: Browser version, capabilities, current page
- **Network State**: Connection status, proxy settings
- **Resource Usage**: Memory, CPU, disk space
- **Environment**: OS, hardware, runtime environment

#### Execution Context
- **Current Node**: Node being executed when error occurred
- **Previous Nodes**: Recent execution history
- **Variable State**: Current variable values
- **Workflow Progress**: Overall execution progress
- **Performance Metrics**: Recent performance data

#### Error Details
- **Error Message**: Human-readable error description
- **Stack Trace**: Technical stack trace if available
- **Screenshots**: Visual state when error occurred
- **Network Logs**: Recent network activity
- **Console Logs**: Browser console messages

#### Recovery Context
- **Recovery Attempts**: Previous recovery attempts
- **Success Rate**: Historical success rate of recovery strategies
- **Alternative Options**: Available alternative approaches
- **Resource Availability**: Available system resources
- **Time Constraints**: Remaining execution time

## Webhook & External Integration System

### Webhook Architecture Overview
```

 WEBHOOK INTEGRATION LAYER


 INCOMING OUTGOING BIDIRECTIONAL
 WEBHOOKS WEBHOOKS COMMUNICATION

 • Remote Start • Status Events • Management
 • Control Cmds • Progress Data • Live Control
 • Config Update • Results • Monitoring
 • Shutdown • Errors • Scaling



 WEBHOOK PROCESSING ENGINE

 Request Event Response
 Validator Router Formatter

 Auth Check Handler Status Codes
 Schema Val Dispatch Error Format
 Rate Limit Queue Mgmt Data Transform



```

### Webhook Configuration
```json
{
 "webhooks": {
 "server": {
 "enabled": true,
 "host": "0.0.0.0",
 "port": 8080,
 "basePath": "/webhook",
 "ssl": {
 "enabled": false,
 "certFile": "/path/to/cert.pem",
 "keyFile": "/path/to/key.pem"
 }
 },
 "authentication": {
 "method": "bearer|hmac|basic|none",
 "bearerToken": "secret-token",
 "hmacSecret": "signing-secret",
 "basicAuth": {
 "username": "webhook-user",
 "password": "webhook-pass"
 }
 },
 "rateLimiting": {
 "enabled": true,
 "requestsPerMinute": 60,
 "requestsPerHour": 1000,
 "burstLimit": 10
 },
 "incoming": {
 "endpoints": {
 "/start": {
 "method": "POST",
 "description": "Start workflow execution",
 "auth": true,
 "rateLimit": true
 },
 "/stop": {
 "method": "POST",
 "description": "Stop workflow execution",
 "auth": true,
 "rateLimit": true
 },
 "/status": {
 "method": "GET",
 "description": "Get worker status",
 "auth": false,
 "rateLimit": false
 },
 "/config": {
 "method": "PUT",
 "description": "Update configuration",
 "auth": true,
 "rateLimit": true
 }
 }
 },
 "outgoing": {
 "endpoints": [
 {
 "name": "status_updates",
 "url": "https://api.management-system.com/worker-status",
 "method": "POST",
 "events": ["workflow_started", "workflow_completed", "workflow_failed"],
 "auth": {
 "type": "bearer",
 "token": "external-api-token"
 },
 "retries": 3,
 "timeout": 5000
 },
 {
 "name": "progress_reports",
 "url": "https://monitoring.company.com/metrics",
 "method": "POST",
 "events": ["progress_update", "performance_metrics"],
 "headers": {
 "X-API-Key": "monitoring-key"
 },
 "retries": 1,
 "timeout": 3000
 }
 ]
 }
 }
}
```

## Incoming Webhook Endpoints

### POST /webhook/start - Start Workflow Execution
**Purpose**: Remotely trigger workflow execution
**Authentication**: Required
**Rate Limit**: 10 requests/minute

#### Request Format
```json
{
 "workflowId": "workflow-uuid-or-name",
 "workflow": {
 "nodes": [...],
 "connections": [...]
 },
 "variables": {
 "startUrl": "https://example.com",
 "username": "testuser",
 "testData": ["item1", "item2"]
 },
 "config": {
 "timeout": 3600000,
 "retries": 3,
 "screenshots": true,
 "checkpoints": true
 },
 "metadata": {
 "executionId": "custom-execution-id",
 "priority": "high|normal|low",
 "tags": ["regression", "smoke-test"],
 "callback": {
 "url": "https://external-system.com/callback",
 "token": "callback-auth-token"
 }
 }
}
```

#### Response Format
```json
{
 "success": true,
 "executionId": "exec-uuid-123",
 "workerId": "worker-uuid-456",
 "status": "started",
 "estimatedDuration": 300000,
 "trackingUrl": "https://worker.com/status/exec-uuid-123",
 "timestamp": "2025-01-15T10:30:45.123Z"
}
```

#### Implementation Strategy
- **Request Validation**: Validate JSON schema, workflow format
- **Resource Check**: Verify worker capacity, queue availability
- **Execution Queue**: Add to execution queue with priority
- **Response**: Return execution ID and tracking information
- **Async Processing**: Start workflow execution asynchronously

### POST /webhook/stop - Stop Workflow Execution
**Purpose**: Remotely stop running workflow
**Authentication**: Required

#### Request Format
```json
{
 "executionId": "exec-uuid-123",
 "force": false,
 "reason": "User requested cancellation",
 "saveResults": true
}
```

#### Response Format
```json
{
 "success": true,
 "executionId": "exec-uuid-123",
 "status": "stopping|stopped|force_stopped",
 "message": "Workflow will be stopped gracefully",
 "timestamp": "2025-01-15T10:35:22.456Z"
}
```

### GET /webhook/status - Get Worker Status
**Purpose**: Get current worker and execution status
**Authentication**: Optional
**Rate Limit**: None

#### Query Parameters
- `executionId`: Get specific execution status
- `detailed`: Include detailed metrics
- `format`: Response format (json|prometheus)

#### Response Format
```json
{
 "worker": {
 "id": "worker-uuid-456",
 "name": "Production Worker 01",
 "status": "active|busy|maintenance|error",
 "uptime": 86400000,
 "version": "1.0.0",
 "capacity": {
 "maxConcurrent": 5,
 "currentlyRunning": 2,
 "queuedWorkflows": 3
 }
 },
 "executions": [
 {
 "executionId": "exec-uuid-123",
 "workflowId": "login-flow",
 "status": "running|completed|failed|cancelled",
 "progress": {
 "currentNode": "node_015",
 "completedNodes": 14,
 "totalNodes": 25,
 "percentage": 56
 },
 "startTime": "2025-01-15T10:30:45.123Z",
 "estimatedCompletion": "2025-01-15T10:35:30.000Z",
 "performance": {
 "averageNodeTime": 1200,
 "memoryUsage": "245MB",
 "errorCount": 1,
 "retryCount": 3
 }
 }
 ],
 "system": {
 "memoryUsage": "512MB",
 "cpuUsage": "25%",
 "diskSpace": "8.5GB available",
 "networkStatus": "connected"
 }
}
```

### PUT /webhook/config - Update Configuration
**Purpose**: Hot-update worker configuration
**Authentication**: Required

#### Request Format
```json
{
 "section": "logging|execution|browser|monitoring",
 "config": {
 "logging": {
 "level": "debug"
 }
 },
 "restart": false
}
```

### POST /webhook/control - Execution Control
**Purpose**: Control running executions
**Authentication**: Required

#### Control Commands
```json
{
 "executionId": "exec-uuid-123",
 "command": "pause|resume|step|screenshot|checkpoint",
 "parameters": {
 "reason": "Manual intervention required",
 "timeout": 60000
 }
}
```

## Outgoing Webhook Events

### Event Types & Payloads

#### workflow_started
```json
{
 "event": "workflow_started",
 "timestamp": "2025-01-15T10:30:45.123Z",
 "workerId": "worker-uuid-456",
 "executionId": "exec-uuid-123",
 "workflowId": "login-flow",
 "data": {
 "totalNodes": 25,
 "estimatedDuration": 300000,
 "startUrl": "https://example.com",
 "browserType": "chromium",
 "variables": {
 "username": "testuser"
 }
 }
}
```

#### workflow_progress
```json
{
 "event": "workflow_progress",
 "timestamp": "2025-01-15T10:32:15.456Z",
 "workerId": "worker-uuid-456",
 "executionId": "exec-uuid-123",
 "data": {
 "currentNode": {
 "id": "node_015",
 "type": "click",
 "name": "Click Submit Button"
 },
 "progress": {
 "completedNodes": 14,
 "totalNodes": 25,
 "percentage": 56
 },
 "performance": {
 "duration": 105000,
 "averageNodeTime": 1200,
 "memoryUsage": "245MB"
 },
 "lastCheckpoint": {
 "nodeId": "node_010",
 "timestamp": "2025-01-15T10:31:45.123Z"
 }
 }
}
```

#### workflow_completed
```json
{
 "event": "workflow_completed",
 "timestamp": "2025-01-15T10:35:30.789Z",
 "workerId": "worker-uuid-456",
 "executionId": "exec-uuid-123",
 "data": {
 "status": "success|failed|cancelled",
 "duration": 285000,
 "nodesExecuted": 25,
 "errors": 0,
 "retries": 2,
 "screenshots": [
 "/screenshots/exec-uuid-123/final-result.png"
 ],
 "extractedData": {
 "loginResult": "success",
 "userProfile": {
 "name": "Test User",
 "email": "test@example.com"
 }
 },
 "performance": {
 "averageNodeTime": 1140,
 "slowestNode": {
 "id": "node_018",
 "duration": 5200,
 "type": "waitElement"
 },
 "memoryPeak": "312MB",
 "totalRequests": 45
 }
 }
}
```

#### workflow_failed
```json
{
 "event": "workflow_failed",
 "timestamp": "2025-01-15T10:33:15.123Z",
 "workerId": "worker-uuid-456",
 "executionId": "exec-uuid-123",
 "data": {
 "error": {
 "type": "ELEMENT_NOT_FOUND",
 "message": "Submit button not found after 10 seconds",
 "nodeId": "node_015",
 "nodeType": "click",
 "selector": "#submit-btn"
 },
 "context": {
 "url": "https://example.com/login",
 "screenshot": "/screenshots/exec-uuid-123/error-state.png",
 "consoleLogs": [
 "ERROR: JavaScript error in login.js:45"
 ]
 },
 "progress": {
 "completedNodes": 14,
 "failedAt": "node_015",
 "duration": 165000
 },
 "recovery": {
 "attempted": true,
 "strategies": ["wait_extension", "selector_fallback"],
 "success": false,
 "checkpointAvailable": "node_010"
 }
 }
}
```

#### worker_status
```json
{
 "event": "worker_status",
 "timestamp": "2025-01-15T10:30:00.000Z",
 "workerId": "worker-uuid-456",
 "data": {
 "status": "active|busy|maintenance|error|offline",
 "uptime": 86400000,
 "capacity": {
 "maxConcurrent": 5,
 "currentlyRunning": 2,
 "queueSize": 3
 },
 "performance": {
 "memoryUsage": "512MB",
 "cpuUsage": "25%",
 "diskSpace": "8.5GB"
 },
 "executions": {
 "total": 1247,
 "successful": 1189,
 "failed": 58,
 "successRate": 95.3
 }
 }
}
```

#### performance_metrics
```json
{
 "event": "performance_metrics",
 "timestamp": "2025-01-15T10:30:00.000Z",
 "workerId": "worker-uuid-456",
 "data": {
 "timeWindow": "last_5_minutes",
 "metrics": {
 "executionsStarted": 12,
 "executionsCompleted": 10,
 "averageExecutionTime": 245000,
 "errorRate": 8.3,
 "memoryUsage": {
 "current": "445MB",
 "peak": "512MB",
 "average": "387MB"
 },
 "cpuUsage": {
 "current": 22,
 "peak": 45,
 "average": 28
 },
 "nodePerformance": {
 "averageNodeTime": 1350,
 "slowestNodeType": "waitElement",
 "fastestNodeType": "setVariable"
 }
 }
 }
}
```

## Webhook Delivery & Reliability

### Delivery Strategy
```
Event Generation Queue Retry Logic Success/Failure Tracking Dead Letter Queue
```

#### Reliable Delivery Implementation
- **Event Queue**: Buffer events in memory and persistent storage
- **Retry Policy**: Exponential backoff with max attempts (3-5)
- **Timeout Handling**: Configurable request timeouts (3-30 seconds)
- **Circuit Breaker**: Disable endpoints after consecutive failures
- **Dead Letter Queue**: Store permanently failed deliveries
- **Monitoring**: Track delivery success rates, response times

#### Retry Configuration
```json
{
 "retryPolicy": {
 "maxAttempts": 3,
 "initialDelay": 1000,
 "backoffMultiplier": 2,
 "maxDelay": 30000,
 "timeoutPerAttempt": 5000,
 "circuitBreakerThreshold": 5
 }
}
```

### Event Filtering & Routing

#### Event Subscription Model
```json
{
 "subscriptions": [
 {
 "endpoint": "https://monitoring.company.com/webhooks",
 "events": ["workflow_completed", "workflow_failed"],
 "filters": {
 "workflowId": ["critical-*", "prod-*"],
 "status": ["failed", "success"],
 "duration": ">300000"
 },
 "transform": {
 "includeScreenshots": false,
 "includeVariables": ["result", "errorMessage"],
 "format": "slack"
 }
 }
 ]
}
```

#### Dynamic Routing
- **Event Matching**: Route events based on patterns
- **Load Balancing**: Distribute events across multiple endpoints
- **Conditional Routing**: Route based on execution context
- **Priority Handling**: High-priority events get faster delivery

## External Management Integration

### Worker Pool Management

#### Registration Protocol
```json
{
 "action": "register",
 "worker": {
 "id": "worker-uuid-456",
 "name": "Production Worker 01",
 "capabilities": ["chromium", "firefox", "stealth-mode"],
 "capacity": {
 "maxConcurrent": 5,
 "memoryLimit": "1GB"
 },
 "location": {
 "datacenter": "us-west-1",
 "hostname": "worker-node-01"
 },
 "endpoints": {
 "webhook": "https://worker-01.company.com:8080/webhook",
 "status": "https://worker-01.company.com:8080/status"
 }
 }
}
```

#### Heartbeat System
```json
{
 "workerId": "worker-uuid-456",
 "timestamp": "2025-01-15T10:30:45.123Z",
 "status": "active",
 "load": {
 "runningWorkflows": 2,
 "queuedWorkflows": 1,
 "cpuUsage": 25,
 "memoryUsage": 445
 },
 "health": {
 "browserStatus": "healthy",
 "diskSpace": 8500,
 "networkLatency": 45
 }
}
```

### Orchestration System Integration

#### Workflow Distribution
- **Load Balancing**: Distribute workflows based on worker capacity
- **Affinity Rules**: Route workflows to specific workers
- **Failover**: Redirect workflows from failed workers
- **Queue Management**: Global workflow queue with priority handling

#### Scaling Integration
- **Auto-scaling Triggers**: Scale based on queue size, response times
- **Worker Provisioning**: Integration with container orchestration
- **Health Monitoring**: Continuous worker health assessment
- **Resource Optimization**: Optimize resource allocation

### CI/CD Integration

#### Pipeline Integration
```json
{
 "pipeline": {
 "id": "build-123",
 "stage": "e2e-testing",
 "branch": "main",
 "commit": "abc123def456"
 },
 "workflow": {
 "name": "regression-test-suite",
 "parallel": true,
 "workers": 3
 },
 "callbacks": {
 "success": "https://ci-system.com/success",
 "failure": "https://ci-system.com/failure"
 }
}
```

#### Result Integration
- **Test Results**: JUnit XML, TAP format export
- **Artifacts**: Screenshots, videos, logs
- **Metrics**: Performance data, coverage reports
- **Status Updates**: Real-time pipeline status updates

## Security & Authentication

### Webhook Security Implementation

#### Authentication Methods

##### Bearer Token Authentication
```http
POST /webhook/start
Authorization: Bearer your-secret-token
Content-Type: application/json
```

##### HMAC Signature Authentication
```http
POST /webhook/start
X-Webhook-Signature: sha256=calculated-hmac-signature
X-Webhook-Timestamp: 1642234567
Content-Type: application/json
```

##### Basic Authentication
```http
POST /webhook/start
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
Content-Type: application/json
```

#### Request Validation
- **Signature Verification**: Verify HMAC signatures
- **Timestamp Validation**: Reject old requests (replay attack prevention)
- **IP Whitelisting**: Allow requests only from trusted IPs
- **Rate Limiting**: Prevent abuse with configurable limits
- **Request Size Limits**: Prevent oversized payloads

#### Secure Communication
- **HTTPS Only**: Enforce encrypted communication
- **Certificate Validation**: Verify client certificates
- **TLS Version**: Minimum TLS 1.2 requirement
- **HSTS Headers**: HTTP Strict Transport Security

### Data Privacy & Compliance

#### Sensitive Data Handling
- **Data Masking**: Mask sensitive data in webhooks
- **PII Detection**: Automatically detect and redact PII
- **Encryption**: Encrypt sensitive webhook payloads
- **Audit Trail**: Log all webhook activities

#### Compliance Features
- **GDPR**: Right to erasure, data portability
- **CCPA**: Privacy rights compliance
- **SOC2**: Security controls implementation
- **ISO27001**: Information security standards

## Monitoring & Observability

### Webhook Metrics Collection

#### Key Performance Indicators
- **Request Rate**: Incoming webhook requests per minute
- **Response Time**: Average webhook processing time
- **Success Rate**: Percentage of successful webhook deliveries
- **Error Rate**: Failed webhook deliveries percentage
- **Queue Size**: Number of pending outgoing webhooks
- **Circuit Breaker Status**: Health of external endpoints

#### Monitoring Dashboard
```json
{
 "metrics": {
 "incoming": {
 "requestsPerMinute": 45,
 "averageResponseTime": 250,
 "errorRate": 2.1,
 "authenticationFailures": 3
 },
 "outgoing": {
 "deliverySuccessRate": 97.5,
 "averageDeliveryTime": 1200,
 "circuitBreakerTrips": 1,
 "deadLetterQueueSize": 15
 },
 "endpoints": [
 {
 "url": "https://external-system.com/webhook",
 "status": "healthy|degraded|down",
 "lastSuccess": "2025-01-15T10:29:45.123Z",
 "consecutiveFailures": 0,
 "averageResponseTime": 850
 }
 ]
 }
}
```

### Alerting System

#### Alert Conditions
- **High Error Rate**: >5% webhook delivery failures
- **Slow Response**: Average response time >5 seconds
- **Circuit Breaker**: External endpoint unavailable
- **Queue Overflow**: >1000 pending outgoing webhooks
- **Authentication Attacks**: >10 auth failures per minute

#### Alert Channels
- **Email**: Critical alerts to operations team
- **Slack**: Real-time notifications
- **PagerDuty**: Incident escalation
- **Webhook**: Meta-webhooks to monitoring systems

## Practical Usage Examples

### Scenario 1: External System Triggers New Workflow Execution

#### Setup: Worker deployed at `https://worker-01.production.com:8080`
#### External System: CI/CD Pipeline needs to run e2e tests

```bash
# External system calls worker to execute new workflow
curl -X POST https://worker-01.production.com:8080/webhook/start \
 -H "Authorization: Bearer prod-ci-secret-token" \
 -H "Content-Type: application/json" \
 -d '{
 "workflowId": "e2e-regression-suite",
 "workflow": {
 "nodes": [
 {
 "id": "start",
 "type": "start",
 "x": 50,
 "y": 100,
 "params": {}
 },
 {
 "id": "navigate-1",
 "type": "goto",
 "x": 200,
 "y": 100,
 "params": {
 "url": "${baseUrl}/login"
 }
 },
 {
 "id": "login-2",
 "type": "fill",
 "x": 350,
 "y": 100,
 "params": {
 "selector": "#username",
 "value": "${testUser}"
 }
 },
 {
 "id": "password-3",
 "type": "fill",
 "x": 500,
 "y": 100,
 "params": {
 "selector": "#password",
 "value": "${testPassword}"
 }
 },
 {
 "id": "submit-4",
 "type": "click",
 "x": 650,
 "y": 100,
 "params": {
 "selector": "#login-btn"
 }
 },
 {
 "id": "verify-5",
 "type": "assertVisible",
 "x": 800,
 "y": 100,
 "params": {
 "selector": ".dashboard"
 }
 }
 ],
 "connections": [
 {"from": "start", "to": "navigate-1"},
 {"from": "navigate-1", "to": "login-2"},
 {"from": "login-2", "to": "password-3"},
 {"from": "password-3", "to": "submit-4"},
 {"from": "submit-4", "to": "verify-5"}
 ]
 },
 "variables": {
 "baseUrl": "https://staging.myapp.com",
 "testUser": "automation@test.com",
 "testPassword": "Test123!@#"
 },
 "config": {
 "timeout": 600000,
 "retries": 2,
 "screenshots": true,
 "checkpoints": true
 },
 "metadata": {
 "executionId": "ci-build-1234-e2e",
 "priority": "high",
 "tags": ["ci", "regression", "staging"],
 "callback": {
 "url": "https://ci-system.company.com/webhook/test-result",
 "token": "ci-callback-token-456"
 }
 }
 }'
```

#### Worker Response
```json
{
 "success": true,
 "executionId": "exec-20250115-103045-abc123",
 "workerId": "worker-01-prod",
 "status": "started",
 "estimatedDuration": 180000,
 "trackingUrl": "https://worker-01.production.com:8080/webhook/status?executionId=exec-20250115-103045-abc123",
 "timestamp": "2025-01-15T10:30:45.123Z"
}
```

#### Real-time Progress Updates (Worker → CI System)
```json
// Progress webhook sent to ci-system.company.com
{
 "event": "workflow_progress",
 "timestamp": "2025-01-15T10:31:15.456Z",
 "workerId": "worker-01-prod",
 "executionId": "exec-20250115-103045-abc123",
 "data": {
 "currentNode": {
 "id": "submit-4",
 "type": "click",
 "name": "Click Login Button"
 },
 "progress": {
 "completedNodes": 4,
 "totalNodes": 6,
 "percentage": 67
 },
 "performance": {
 "duration": 30000,
 "averageNodeTime": 7500,
 "memoryUsage": "156MB"
 }
 }
}
```

### Scenario 2: Monitoring System Requests Worker Configuration Update

#### Setup: Monitoring detected high memory usage, needs to adjust limits

```bash
# Monitoring system updates worker config remotely
curl -X PUT https://worker-01.production.com:8080/webhook/config \
 -H "Authorization: Bearer monitoring-admin-token" \
 -H "Content-Type: application/json" \
 -d '{
 "section": "execution",
 "config": {
 "execution": {
 "maxConcurrentWorkflows": 2,
 "defaultTimeout": 15000,
 "retryPolicy": {
 "maxAttempts": 2
 }
 }
 },
 "restart": false
 }'
```

#### Worker Response
```json
{
 "success": true,
 "message": "Configuration updated successfully",
 "changedSettings": [
 "execution.maxConcurrentWorkflows: 3 → 2",
 "execution.defaultTimeout: 10000 → 15000",
 "execution.retryPolicy.maxAttempts: 3 → 2"
 ],
 "restartRequired": false,
 "timestamp": "2025-01-15T11:15:30.789Z"
}
```

### Scenario 3: Support Team Needs to Stop Problematic Execution

#### Setup: Long-running test is stuck, needs emergency stop

```bash
# Support team stops problematic execution
curl -X POST https://worker-01.production.com:8080/webhook/stop \
 -H "Authorization: Bearer support-emergency-token" \
 -H "Content-Type: application/json" \
 -d '{
 "executionId": "exec-20250115-103045-abc123",
 "force": false,
 "reason": "Stuck on login page - emergency stop requested by support",
 "saveResults": true
 }'
```

#### Worker Response
```json
{
 "success": true,
 "executionId": "exec-20250115-103045-abc123",
 "status": "stopping",
 "message": "Workflow will be stopped gracefully after current node completion",
 "estimatedStopTime": "2025-01-15T11:20:45.000Z",
 "checkpointSaved": true,
 "timestamp": "2025-01-15T11:20:22.456Z"
}
```

### Scenario 4: Load Balancer Checks Worker Health Status

#### Setup: Load balancer needs to verify worker capacity before routing

```bash
# Load balancer checks worker status (no auth required for health checks)
curl -X GET "https://worker-01.production.com:8080/webhook/status?detailed=true&format=json"
```

#### Worker Response
```json
{
 "worker": {
 "id": "worker-01-prod",
 "name": "Production Worker 01",
 "status": "active",
 "uptime": 86400000,
 "version": "1.2.3",
 "capacity": {
 "maxConcurrent": 2,
 "currentlyRunning": 1,
 "queuedWorkflows": 0,
 "availableSlots": 1
 }
 },
 "executions": [
 {
 "executionId": "exec-20250115-140030-def456",
 "workflowId": "smoke-test-suite",
 "status": "running",
 "progress": {
 "currentNode": "node_012",
 "completedNodes": 11,
 "totalNodes": 18,
 "percentage": 61
 },
 "startTime": "2025-01-15T14:00:30.123Z",
 "estimatedCompletion": "2025-01-15T14:05:15.000Z"
 }
 ],
 "system": {
 "memoryUsage": "445MB",
 "memoryLimit": "1GB",
 "cpuUsage": "28%",
 "diskSpace": "7.2GB available",
 "networkStatus": "connected",
 "browserInstances": 1,
 "tempFilesCount": 15
 },
 "health": {
 "overall": "healthy",
 "browserEngine": "healthy",
 "networkLatency": 45,
 "lastError": null,
 "consecutiveSuccesses": 247
 }
}
```

### Common Integration Patterns

#### 1. Webhook Authentication Setup
```bash
# Set up webhook authentication for external system
export WORKER_URL="https://worker-01.production.com:8080"
export AUTH_TOKEN="your-secret-token-here"

# All requests include authentication
HEADERS=(-H "Authorization: Bearer $AUTH_TOKEN" -H "Content-Type: application/json")
```

#### 2. Error Handling Pattern
```bash
# Robust external system integration with error handling
response=$(curl -s -w "%{http_code}" -X POST "$WORKER_URL/webhook/start" \
 "${HEADERS[@]}" \
 -d "$WORKFLOW_PAYLOAD" \
 -o response.json)

http_code="${response: -3}"
if [ "$http_code" != "200" ]; then
 echo "Error: HTTP $http_code"
 cat response.json
 exit 1
else
 execution_id=$(jq -r '.executionId' response.json)
 echo "Workflow started: $execution_id"
fi
```

#### 3. Polling Pattern for Status Updates
```bash
# Poll worker status until completion
execution_id="exec-20250115-103045-abc123"
while true; do
 status=$(curl -s "$WORKER_URL/webhook/status?executionId=$execution_id" \
 "${HEADERS[@]}" | jq -r '.executions[0].status')

 case $status in
 "completed"|"failed"|"cancelled")
 echo "Execution finished: $status"
 break
 ;;
 "running")
 echo "Still running..."
 sleep 30
 ;;
 *)
 echo "Unknown status: $status"
 sleep 10
 ;;
 esac
done
```

## Worker Identity & Management

### Worker Identity System
```json
{
 "workerId": "worker-{uuid}",
 "instanceId": "instance-{timestamp}-{random}",
 "name": "Human readable name",
 "version": "1.0.0",
 "environment": "production|staging|development|test",
 "location": {
 "datacenter": "us-west-1",
 "zone": "zone-a",
 "hostname": "worker-node-01"
 },
 "capabilities": [
 "chromium", "firefox", "webkit",
 "stealth-mode", "proxy-support",
 "screenshot", "pdf-generation",
 "mobile-emulation"
 ],
 "resources": {
 "maxConcurrentWorkflows": 5,
 "maxMemoryPerWorkflow": "512MB",
 "maxExecutionTime": "1 hour",
 "diskSpace": "10GB",
 "networkBandwidth": "100Mbps"
 },
 "registration": {
 "registeredAt": "timestamp",
 "lastHeartbeat": "timestamp",
 "status": "active|inactive|maintenance|error",
 "uptime": "duration since start"
 }
}
```

### Naming Conventions

#### Worker Naming Strategy
- **Environment Prefix**: prod-, stage-, dev-, test-
- **Location Identifier**: us-west-1, eu-central-1
- **Purpose Identifier**: web-automation, api-testing
- **Instance Number**: 01, 02, 03
- **Example**: prod-us-west-1-web-automation-01

#### Execution Naming
- **Workflow Name**: User-defined workflow name
- **Execution ID**: UUID for each execution
- **Timestamp**: ISO timestamp for execution start
- **Format**: {workflow-name}-{timestamp}-{short-uuid}
- **Example**: login-flow-20250115-103045-a1b2c3

#### Log File Naming
- **Worker ID**: Include worker identifier
- **Date**: Date-based rotation
- **Log Type**: execution, system, debug, error
- **Format**: {worker-id}-{log-type}-{date}.log
- **Example**: worker-123-execution-20250115.log

## Design Patterns Architecture

### State Design Pattern: Node State Management
Each node in the workflow goes through multiple states during execution lifecycle. States include:
- **Pending**: Waiting to be executed
- **Executing**: Currently being executed
- **Success**: Executed successfully
- **Failed**: Execution failed
- **Retrying**: Currently retrying after failure
- **Paused**: Paused by user or system

### Strategy Design Pattern: Node Processing Management
The `NodeProcessor` interface serves as the Strategy pattern foundation:
- **Context**: `Execution Engine`
- **Strategy Interface**: `NodeProcessor` interface
- **Concrete Strategies**: Each node type has its own implementation class

### Saga Pattern: Retry & Recovery Management
Manages long-running workflow transactions with forward recovery:
- **Saga Orchestrator**: `Execution Engine` acts as orchestrator
- **Saga Steps**: Each node execution is a step
- **Failure Handling**: Structured retry and recovery process
- **State Recovery**: Checkpoint-based state restoration

## Implementation Checklist

### Core Infrastructure
- [ ] Worker configuration structure and validation
- [ ] Environment-specific configuration management
- [ ] Hot reload configuration system
- [ ] Worker identification and naming system
- [ ] Structured logging with JSON/plain formats
- [ ] Multi-output logging (console, file, database)
- [ ] Log rotation and compression
- [ ] JSON workflow parser with schema validation
- [ ] Workflow dependency analysis and validation
- [ ] Execution graph construction and optimization
- [ ] Execution context management with cloning
- [ ] Variable store with global/scoped/temporary support
- [ ] Checkpoint system with automatic triggers
- [ ] Recovery system with state restoration

### Browser Management
- [ ] Multi-engine browser support (Playwright, Selenium)
- [ ] Browser lifecycle management (launch, restart, cleanup)
- [ ] Stealth system with anti-detection capabilities
- [ ] Canvas fingerprint protection and masking
- [ ] WebGL fingerprint masking
- [ ] Font detection evasion
- [ ] Timezone and locale masking
- [ ] User agent rotation and consistency
- [ ] Network behavior simulation
- [ ] Mouse and keyboard pattern simulation
- [ ] Proxy support with rotation
- [ ] Network interception via CDP/DevTools
- [ ] Cookie and storage management
- [ ] Viewport and browser window management
- [ ] Resource cleanup and memory management

### Node Processing Engines (53 Nodes Total)

#### Start Node (1 node)
- [ ] START node implementation with browser initialization

#### Logic Control Nodes (5 nodes)
- [ ] IF node - Conditional branching with expression evaluation
- [ ] FOREACH node - Array/numeric iteration with loop variables
- [ ] SETVARIABLE node - Global variable store management
- [ ] STOP node - Graceful workflow termination with cleanup
- [ ] COMMENT node - Documentation and debugging metadata

#### Navigation Nodes (4 nodes)
- [ ] GOTO node - URL navigation with load detection
- [ ] RELOAD node - Page refresh with state preservation
- [ ] GOBACK node - Browser back navigation
- [ ] GOFORWARD node - Browser forward navigation

#### Element Interaction Nodes (8 nodes)
- [ ] CLICK node - Element clicking with human simulation
- [ ] FILL node - Input field text entry with validation
- [ ] CLEARINPUT node - Input field clearing with verification
- [ ] SETCHECKBOXSTATE node - Checkbox state management
- [ ] SELECTOPTION node - Dropdown option selection
- [ ] HOVER node - Element hover with mouse simulation
- [ ] PRESS node - Keyboard key press simulation
- [ ] UPLOADFILE node - File upload with drag-drop simulation

#### Synchronization Nodes (2 nodes)
- [ ] WAITTIMEOUT node - Fixed time waiting with progress
- [ ] WAITELEMENT node - Element condition waiting with smart timeout

#### Data Extraction Nodes (4 nodes)
- [ ] GETTEXT node - Element text extraction with cleaning
- [ ] GETATTRIBUTE node - Element attribute value extraction
- [ ] GETINPUTVALUE node - Input field value extraction
- [ ] SCREENSHOT node - Page/element screenshot with annotation

#### Assertion Nodes (12 nodes)
- [ ] ASSERTVISIBLE node - Element visibility verification
- [ ] ASSERTTEXT node - Text content assertion with patterns
- [ ] ASSERTURL node - URL pattern matching assertion
- [ ] ASSERTTITLE node - Page title assertion
- [ ] ASSERTATTRIBUTE node - Attribute value assertion
- [ ] ASSERTELEMENTCOUNT node - Element count verification
- [ ] ASSERTNOTVISIBLE node - Element invisibility assertion
- [ ] ASSERTENABLED node - Element enabled state assertion
- [ ] ASSERTDISABLED node - Element disabled state assertion
- [ ] ASSERTCHECKED node - Checkbox checked state assertion
- [ ] ASSERTUNCHECKED node - Checkbox unchecked state assertion
- [ ] ASSERTCONTAINSTEXT node - Partial text content assertion

#### Advanced Quality Assurance Nodes (8 nodes)
- [ ] ASSERTCSSPROPERTY node - CSS property value assertion
- [ ] VALIDATEFORM node - Form validation with field checking
- [ ] CHECKBROKENLINKS node - Dead link detection and reporting
- [ ] CHECKIMAGELOADING node - Image load status verification
- [ ] CHECKPAGESPEED node - Page performance metrics analysis
- [ ] CHECKRESPONSIVE node - Responsive design testing
- [ ] CHECKACCESSIBILITY node - WCAG compliance verification
- [ ] CHECKSEO node - SEO optimization analysis

#### Network & Browser Control Nodes (10 nodes)
- [ ] INTERCEPTNETWORK node - Network request interception
- [ ] MOCKAPI node - API response mocking with patterns
- [ ] SETCOOKIE node - Browser cookie management
- [ ] CHECKCONSOLE node - Browser console monitoring
- [ ] CHECKMEMORYUSAGE node - Browser memory monitoring
- [ ] CHECKLOCALSTORAGE node - LocalStorage content verification
- [ ] CHECKSESSIONSTORAGE node - SessionStorage content verification
- [ ] TESTCROSSBROWSER node - Multi-browser compatibility testing
- [ ] SIMULATENETWORKCONDITION node - Network condition simulation

### Element Management
- [ ] CSS selector resolution pipeline
- [ ] Smart waiting with progressive timeout
- [ ] DOM mutation observer integration
- [ ] Element stability verification (200ms stable)
- [ ] Multi-condition element waiting (visible, hidden, present, absent)
- [ ] Element visibility calculation with viewport checking
- [ ] Scroll to view automation
- [ ] Overlay detection and handling
- [ ] Frame and iframe navigation
- [ ] Shadow DOM traversal
- [ ] Element highlighting for screenshots
- [ ] Coordinate calculation with randomization
- [ ] Human-like interaction simulation

### Error Handling & Recovery
- [ ] Four-tier error classification (FATAL, RECOVERABLE, WARNING, IGNORED)
- [ ] Exponential backoff with jitter implementation
- [ ] Node-specific retry policies
- [ ] Context-aware recovery mechanisms
- [ ] Browser recovery (page refresh, browser restart, session reset)
- [ ] Element recovery (wait extension, selector fallback, page interaction)
- [ ] Network recovery (request retry, proxy switch, user agent change)
- [ ] State recovery (variable restoration, context rebuild)
- [ ] Error context collection (system, execution, error details)
- [ ] Recovery attempt tracking and success rate analysis
- [ ] Automatic checkpoint creation and restoration
- [ ] Recovery validation and integrity checking

### Monitoring & Control
- [ ] Real-time progress tracking with percentage completion
- [ ] Execution time estimation and performance metrics
- [ ] Node-level execution time tracking
- [ ] Resource usage monitoring (memory, CPU, disk)
- [ ] Health check system with configurable intervals
- [ ] Execution control API (pause, resume, cancel, force stop)
- [ ] Speed control (normal, fast, slow, turbo, custom)
- [ ] Step-by-step execution mode
- [ ] Bottleneck detection and optimization suggestions
- [ ] Alert and notification system
- [ ] Multiple monitoring interfaces (REST API, WebSocket, file-based)
- [ ] Performance profiling and trend analysis

### Security & Compliance
- [ ] Execution sandbox with restricted access
- [ ] Sensitive data masking in logs and outputs
- [ ] PII detection and redaction system
- [ ] Access control framework with domain filtering
- [ ] IP whitelisting and blacklisting
- [ ] Audit trail system for all operations
- [ ] Network access filtering and monitoring
- [ ] File system access restrictions
- [ ] Process isolation and resource limits
- [ ] Data encryption for sensitive configuration
- [ ] Execution timeout enforcement
- [ ] Security event logging and alerting

### Performance Optimization
- [ ] Browser pool management with lifecycle control
- [ ] Resource cleanup automation and garbage collection
- [ ] Memory management with leak detection
- [ ] Memory threshold monitoring and reporting
- [ ] Concurrent workflow execution support
- [ ] Connection pooling and reuse
- [ ] Request/response optimization
- [ ] Caching strategies for elements and selectors
- [ ] Network optimization and throttling
- [ ] Load balancing across worker instances
- [ ] Performance profiling and bottleneck identification
- [ ] Execution time optimization suggestions

### Testing & Validation
- [ ] Unit test framework for individual node processors
- [ ] Integration test suite for complete workflows
- [ ] Mock API system for testing external dependencies
- [ ] Test data management and generation
- [ ] Performance benchmarking and regression testing
- [ ] Cross-browser compatibility test automation
- [ ] Accessibility compliance testing (WCAG 2.1)
- [ ] SEO compliance validation
- [ ] Link validation and image loading tests
- [ ] Form validation testing framework
- [ ] Responsive design testing across viewports
- [ ] Load testing framework for concurrent executions

### Integration & APIs
- [ ] Webhook server with authentication (Bearer, HMAC, Basic)
- [ ] Incoming webhook endpoints (/start, /stop, /status, /config)
- [ ] Outgoing webhook notifications for events
- [ ] Rate limiting and request validation
- [ ] REST API endpoints for external integration
- [ ] WebSocket real-time communication
- [ ] File-based workflow import/export
- [ ] Database integration for logging and metrics
- [ ] Message queue integration for scalability
- [ ] Plugin system for custom extensions
- [ ] CLI interface for operations and management
- [ ] Circuit breaker pattern for external services

### Documentation & Tools
- [ ] Complete API documentation
- [ ] Node reference documentation
- [ ] Configuration guide
- [ ] Troubleshooting guide
- [ ] Performance tuning guide
- [ ] Security best practices
- [ ] Deployment documentation
- [ ] Monitoring setup guide

### Operations & Deployment
- [ ] Container image creation (Docker)
- [ ] Orchestration configs (Kubernetes)
- [ ] CI/CD pipeline setup
- [ ] Environment configuration management
- [ ] Health monitoring setup
- [ ] Log aggregation setup
- [ ] Backup and disaster recovery
- [ ] Scaling automation

*SMEW Worker - Complete Architecture & Implementation Guide*
*This document serves as the definitive guide for implementing the SMEW Worker system with absolute accuracy requirements.*