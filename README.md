# CoCreate - Collaborative Real-Time Editor

A real-time collaborative text editor built with Node.js, Express, ShareDB, and TinyMCE. This application allows multiple users to edit documents simultaneously with real-time synchronization and operational transformation.

## Features

- 🔄 **Real-time collaboration** - Multiple users can edit the same document simultaneously
- 🔧 **Rich text editing** - Powered by TinyMCE with full formatting capabilities
- 🌐 **WebSocket communication** - Low-latency real-time updates
- 📝 **Operational transformation** - Conflict resolution using ShareDB and JSON0 OT
- 🎯 **Unique document URLs** - Each editing session gets a unique UUID-based URL
- 📱 **Responsive design** - Works on desktop and mobile devices

## Tech Stack

- **Backend**: Node.js, Express.js
- **Real-time sync**: ShareDB, Socket.IO, WebSockets
- **Operational Transform**: JSON0 OT, diff-match-patch
- **Frontend**: TinyMCE, Tailwind CSS
- **Build tool**: Webpack
- **Template engine**: EJS

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd CoCreate_Collaborative_Editor
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the frontend bundle:
   ```bash
   npm run build
   ```

## Usage

1. Start the server:
   ```bash
   node server.js
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

3. To create a new collaborative document, visit:
   ```
   http://localhost:3000/editor
   ```
   This will redirect you to a unique editor URL that you can share with others.

4. Share the editor URL with other users to collaborate in real-time.

## Project Structure

```
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── webpack.config.js      # Webpack build configuration
├── public/
│   ├── index.html         # Landing page
│   ├── css/
│   │   └── editorStyle.css # Editor styles
│   ├── js/
│   │   ├── Editor.js      # Main editor logic
│   │   ├── main.js        # Application entry point
│   │   └── utils.js       # Utility functions
│   └── tinymce/           # TinyMCE editor files
└── views/
    └── editor.ejs         # Editor template
```

## API Endpoints

- `GET /` - Landing page
- `GET /editor` - Redirects to a new editor with unique ID
- `GET /editor/:id` - Editor page for specific document ID
- WebSocket connection for real-time collaboration

## Dependencies

### Core Dependencies
- **express** - Web framework
- **sharedb** - Real-time collaborative editing backend
- **socket.io** - WebSocket library
- **ot-json0** - Operational transformation for JSON
- **diff-match-patch** - Text diffing and patching
- **ejs** - Template engine

### Development Dependencies
- **webpack** - Module bundler for frontend assets

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Document persistence with database integration
- [ ] Version history and document recovery
- [ ] User presence indicators (cursors, selections)
- [ ] Document sharing permissions
- [ ] Export functionality (PDF, Word, etc.)
- [ ] Commenting and suggestion system
- [ ] Mobile app support