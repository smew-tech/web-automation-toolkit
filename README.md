# SMEW Automation Tool

A comprehensive web automation toolkit consisting of a visual workflow builder and a Chrome extension for element selection. This project enables users to create, test, and execute web automation workflows through an intuitive drag-and-drop interface.


![Demo thông báo](images/Screenshot%202025-09-05%20at%2018.08.25.png)

## 🚀 Features

### Visual Workflow Builder
- **Drag-and-Drop Interface**: Create automation workflows using visual blocks
- **Real-time Testing**: Test workflows with live simulation and debugging
- **Multiple Action Types**: Support for navigation, interaction, data extraction, and logic operations
- **Export/Import**: Save and load workflow configurations as JSON files
- **Dark/Light Theme**: Responsive design with theme switching

### Chrome Extension - Element Selector Tool
- **Smart Element Selection**: Advanced CSS selector generation with multiple fallback strategies
- **Multi-language Support**: Available in English and Vietnamese
- **One-Click Copying**: Automatically copy selectors to clipboard
- **Element Highlighting**: Visual feedback during element selection
- **Cross-tab Communication**: Seamless integration with the workflow builder

## 📁 Project Structure

```
Automation-tool/
├── toolkit/
│   └── index.html          # Main workflow builder application
└── extension/
    ├── manifest.json       # Chrome extension manifest
    ├── popup.html         # Extension popup interface
    ├── popup.js           # Popup logic and controls
    ├── content.js         # Content script for element selection
    ├── content.css        # Styling for element highlighting
    ├── background.js      # Extension background service worker
    ├── lang.js            # Internationalization support
    ├── tutorial.html      # User tutorial and documentation
    └── icons/             # Extension icons
```

## 🛠️ Installation

### Chrome Extension Setup
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked" and select the `extension` folder
4. The Element Selector Tool will appear in your extensions toolbar

### Workflow Builder Setup
1. Open the `toolkit/index.html` file in any modern web browser
2. No additional installation required - it's a standalone web application

## 📖 Usage

### Creating Automation Workflows

1. **Start Building**: Open the workflow builder and drag action blocks from the left sidebar
2. **Configure Actions**: Select blocks to configure their properties in the right panel
3. **Connect Blocks**: Drag from output ports to input ports to create workflow connections
4. **Test Workflow**: Use the Test button to simulate your workflow execution

### Available Action Categories

#### Logic Operations
- **If Condition**: Conditional branching based on variables or expressions
- **For Each Loop**: Iterate over arrays or repeat actions multiple times
- **Set Variable**: Store and manipulate data during workflow execution
- **Stop**: Terminate workflow execution
- **Comment**: Add documentation to your workflows

#### Navigation
- **Go to URL**: Navigate to specific web pages
- **Reload Page**: Refresh the current page
- **Go Back**: Navigate to previous page in history
- **Go Forward**: Navigate to next page in history

#### Interactions
- **Click**: Click on elements (left, right, or double-click)
- **Fill Input**: Enter text into form fields
- **Clear Input**: Remove text from input fields
- **Set Checkbox**: Check or uncheck checkbox elements
- **Select Dropdown**: Choose options from dropdown menus
- **Hover**: Move mouse over elements
- **Press Key**: Send keyboard input to elements
- **Upload File**: Handle file upload operations

#### Wait Operations
- **Wait Timeout**: Pause execution for specified duration
- **Wait for Element**: Wait until specific elements appear on the page

#### Data Extraction
- **Get Text**: Extract text content from elements
- **Get Attribute**: Retrieve HTML attributes from elements
- **Get Input Value**: Extract values from form inputs
- **Screenshot**: Capture page or element screenshots

#### Validation
- **Assert Visible**: Verify elements are displayed
- **Assert Text**: Verify elements contain expected text

### Using the Element Selector Tool

1. **Activate Extension**: Click the Element Selector Tool icon in Chrome
2. **Start Selection**: Click "Start" to enter selection mode
3. **Select Elements**: Click on any page element to generate and copy its CSS selector
4. **View Results**: The selector is automatically copied to your clipboard
5. **Stop Selection**: Click "Stop" to exit selection mode

### Integration Workflow

1. Create a workflow in the builder with actions that need element selectors
2. Use the "crosshairs" button next to selector fields to open the element selection tool
3. The tool will open the target URL in a new tab for element selection
4. Follow the guided instructions to select elements and copy selectors
5. Paste the selectors back into your workflow configuration

## 🎯 Key Features in Detail

### Intelligent CSS Selector Generation
The extension uses multiple strategies to generate reliable selectors:
- ID-based selectors (highest priority)
- Class-based selectors with context awareness
- Data attribute selectors for test automation
- Structural selectors with nth-child positioning
- Full CSS path as fallback

### Workflow Canvas Navigation
- **Pan**: Hold Space + drag or middle-click drag to pan around the canvas
- **Zoom**: Ctrl + scroll wheel to zoom in/out
- **Select**: Click on blocks to view/edit properties
- **Connect**: Drag from output ports (right side) to input ports (left side)

### Testing and Debugging
- Real-time workflow execution simulation
- Step-by-step action logging
- Visual highlighting of currently executing blocks
- Error detection and infinite loop prevention

## 🔧 Technical Details

### Supported Browsers
- **Chrome Extension**: Chrome, Edge, and other Chromium-based browsers
- **Workflow Builder**: All modern browsers with ES6+ support

### Data Storage
- Extension settings stored in Chrome's local storage
- Workflows can be exported as JSON files for backup and sharing
- No external servers required - everything runs locally

### Security
- Content scripts run in isolated environments
- No data transmission to external servers
- Minimal permissions required for extension functionality

## 📝 Development

### Extension Development
The Chrome extension follows Manifest V3 specifications:
- Service worker for background processing
- Content scripts for page interaction
- Popup interface for user controls

### Workflow Builder Architecture
- Vanilla JavaScript with modern ES6+ features
- Canvas-based node editor with SVG connections
- Modular action system for easy extensibility

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with both components
5. Submit a pull request with detailed description

## 📄 License

This project is open source. Please refer to the license file for more details.

## 🆘 Support

For issues, questions, or feature requests:
1. Check the tutorial.html file in the extension folder for detailed usage instructions
2. Review the built-in help and tooltips in the applications
3. Submit issues through the project repository

## 🔄 Version History

- **v1.0**: Initial release with core functionality
  - Visual workflow builder with drag-and-drop interface
  - Chrome extension for element selection
  - Multi-language support (English/Vietnamese)
  - Import/export capabilities
  - Real-time workflow testing

---

*Built with ❤️ for web automation enthusiasts*