# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a web automation toolkit consisting of two main components:
1. **Visual Workflow Builder** (`toolkit/`) - A standalone web application for creating automation workflows through drag-and-drop interface
2. **Chrome Extension** (`extension/`) - Element selector tool for generating CSS selectors

The project enables users to create, test, and execute web automation workflows without external dependencies.

## Development Commands

### Chrome Extension Development
- **Load Extension**: Open `chrome://extensions/`, enable Developer mode, click "Load unpacked" and select the `extension/` folder
- **Testing**: Use the `extension/test.html` file for testing extension functionality
- **Manifest**: Follows Manifest V3 specifications with service worker architecture

### Workflow Builder Development
- **Run Locally**: Open `toolkit/index.html` directly in any modern browser
- **No Build Required**: Pure vanilla JavaScript/HTML/CSS with CDN dependencies (Tailwind CSS, Font Awesome)
- **Testing**: Use the built-in Test button within the workflow builder interface

## Architecture

### Chrome Extension Architecture
- **Background Service Worker** (`background.js`): Handles cross-tab communication and message routing
- **Content Script** (`content.js`): Injected into web pages for element selection and CSS selector generation
- **Popup Interface** (`popup.js/html`): Extension control panel with start/stop functionality
- **Multi-language Support** (`lang.js`): English/Vietnamese localization system

### Workflow Builder Architecture
- **Canvas-based Editor**: SVG connections between workflow nodes with pan/zoom functionality
- **Modular Action System**: 47+ predefined action types organized in categories (Logic, Navigation, Interactions, Data Extraction, Validation)
- **State Management**: Variables and workflow execution context managed in JavaScript
- **Real-time Testing**: Step-by-step execution simulation with visual feedback

### Key Components
- **CSS Selector Generation**: Multiple fallback strategies (ID → Class → Data attributes → Structural → Full path)
- **Workflow JSON Export/Import**: Standard format for workflow persistence and sharing
- **Cross-component Integration**: Extension communicates with workflow builder via URL parameters and clipboard

## File Structure

```
├── extension/              # Chrome extension files
│   ├── manifest.json      # Extension manifest (v3)
│   ├── popup.html/js      # Extension popup interface
│   ├── content.js         # Element selection content script
│   ├── background.js      # Service worker for message handling
│   ├── lang.js           # Internationalization support
│   └── tutorial.html     # User documentation
├── toolkit/               # Workflow builder application
│   ├── index.html        # Main application (self-contained)
│   ├── guideline-*.md    # Development guidelines
│   └── archive/          # Previous versions
└── worker/                # Future automation worker implementation
    └── system-architecture-en.md  # Worker architecture specification
```

## Workflow Node Types

The system supports these action categories:
- **Logic**: If conditions, loops, variables, comments
- **Navigation**: URL navigation, page reload, browser history
- **Interactions**: Click, fill input, checkboxes, dropdowns, hover, keyboard input, file upload
- **Wait Operations**: Timeout delays, element waiting
- **Data Extraction**: Text/attribute extraction, screenshots, HTTP requests, data export
- **Validation**: Element visibility and text assertions

### Advanced Data Processing Nodes with Command System

**HTTP Request Node** (`httpRequest`):
- **Methods**: GET, POST, PUT, DELETE
- **Data Source Commands**: `GET_VARIABLE:variableName`, `GET_CONTEXT:contextPath`
- **Body Template**: Uses `${data.fieldName}` syntax for dynamic data substitution
- **Processing Modes**: Single request, forEach loop, or batch processing
- **Response Handling Commands**:
  - `STORE_VARIABLE:variableName` - Store complete response
  - `EXTRACT_FIELD:jsonPath>variableName` - Extract specific fields
- **Error Handling**: Stop workflow, continue, or retry on failure

**Extract Multiple Data Node** (`extractMultiple`):
- **Container/Item Selectors**: Target repeated content structures
- **Extraction Commands**:
  - `EXTRACT_TEXT:selector>variableName` - Extract text content
  - `EXTRACT_ATTR:element@attribute>variableName` - Extract attributes
- **Output Formats**: Array of objects, CSV, or JSON string
- **Storage Command**: `STORE_VARIABLE:variableName`
- **Filtering Commands**:
  - `FILTER_NOT_EMPTY:fieldName` - Remove empty entries
  - `FILTER_CONTAINS:fieldName>value` - Filter by content
  - `FILTER_LIMIT:number` - Limit results

**Export Excel Node** (`exportExcel`):
- **Data Source Command**: `GET_VARIABLE:variableName`
- **Column Mapping**: `sourceField>Column Header`
- **Formatting Commands**:
  - `HEADER_STYLE:bold` - Style headers
  - `NUMBER_FORMAT:field>format` - Format numbers
  - `DATE_FORMAT:field>format` - Format dates
- **Dynamic Filenames**: Support `${TIMESTAMP}` placeholders

**Export Database Node** (`exportDatabase`):
- **Data Source Command**: `GET_VARIABLE:variableName`
- **Field Mapping**: `sourceField>dbColumn`
- **Operations**: INSERT, UPDATE, UPSERT
- **Constraint Commands**:
  - `PRIMARY_KEY:fieldName`
  - `UNIQUE:fieldName`
  - `NOT_NULL:fieldName`

## Development Guidelines

### Chrome Extension Development
- All content scripts run in isolated environments with minimal permissions
- Use `chrome.runtime.sendMessage` for cross-component communication
- Store user preferences in `chrome.storage.local`
- Follow security best practices - no external server communication

### Workflow Builder Development
- Maintain vanilla JavaScript approach for maximum compatibility
- Use existing CSS classes and Tailwind utilities for consistency
- Canvas operations use transform-based positioning for performance
- Workflow JSON must validate against the established schema

### Code Style
- Use descriptive variable names following camelCase convention
- Maintain consistent indentation (2 spaces for HTML/CSS, 4 for JavaScript)
- Add comments for complex selector generation algorithms
- Follow existing error handling patterns

## Integration Workflow

### Basic Element Selection
1. User creates workflow in builder with placeholder selectors
2. Clicks "crosshairs" button to activate element selection
3. Extension opens target URL in new tab
4. User selects elements, extension generates and copies CSS selectors
5. User pastes selectors back into workflow configuration
6. Workflow can be tested using built-in simulation mode

### Data Flow Between Nodes
1. **Extract Multiple Data Node** → extracts array of objects from webpage
2. **HTTP Request Node** → receives data via `sourceVariable` parameter
3. **Data Mapping** → transforms extracted data using JSON template with `{{sourceData.fieldName}}` syntax
4. **Request Execution** → sends mapped data to API endpoints
5. **Export Nodes** → save API responses to Excel files or databases

### Example Command-Based Workflow

**1. Extract Multiple Data Node:**
```
Container: .product-list
Item: .product-item
Extract Commands:
  EXTRACT_TEXT:.title>name
  EXTRACT_TEXT:.price>price
  EXTRACT_ATTR:img@src>image
  EXTRACT_ATTR:a@href>link
Storage: STORE_VARIABLE:products
```

**2. HTTP Request Node:**
```
Method: POST
URL: https://api.example.com/products
Data Source: GET_VARIABLE:products
Iteration: forEach
Body Template: {
  "name": "${data.name}",
  "price": "${data.price}",
  "image_url": "${data.image}"
}
Response Handler:
  STORE_VARIABLE:apiResponse
  EXTRACT_FIELD:data.id>productId
  EXTRACT_FIELD:data.status>status
```

**3. Export Excel Node:**
```
Data Source: GET_VARIABLE:apiResponse
Filename: products_${TIMESTAMP}.xlsx
Column Mapping:
  name>Product Name
  price>Price (USD)
  productId>API Product ID
Formatting:
  HEADER_STYLE:bold
  NUMBER_FORMAT:price>#,##0.00
```

This creates a clear command-based workflow that the worker can parse and execute systematically.

## Security Considerations

- Extension requires minimal permissions (`activeTab`, `storage`, `scripting`, `tabs`)
- No data transmission to external servers
- All processing happens locally in browser
- Content scripts isolated from page JavaScript context