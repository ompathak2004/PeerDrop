# PeerDrop - P2P File Sharing

A secure, peer-to-peer file sharing application built with React, TypeScript, and WebRTC.

## Features

- 🔒 Secure P2P file transfer using WebRTC
- 📁 Multiple file uploads (up to 5 files)
- 💨 Fast direct transfers between peers
- 🎯 No server storage - files transfer directly between browsers
- 🔍 File preview before download
- 📱 Responsive design with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher

### Installation

```bash
# Clone the repository
git clone [your-repo-url]

# Navigate to project directory
cd fileSharing

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

## Usage

1. **Start a Session**
   - Click "Start Session" to get your unique peer ID
   - Your ID will be in format: `adjective-noun-number` (e.g., `swift-phoenix-123`)

2. **Connect with Peers**
   - Share your ID with other users
   - Enter another user's ID to connect
   - Connected peers will appear in the "Connected Peers" list

3. **Sending Files**
   - Select up to 5 files (max 100MB each)
   - Choose a connected peer from the list
   - Click "Send" to initiate transfer

4. **Receiving Files**
   - When someone sends you files, you'll see a confirmation dialog
   - Preview file details before accepting
   - Choose to accept or reject the transfer
   - Files download automatically after accepting

## Technical Stack

- **Frontend**: React + TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS + Ant Design
- **P2P**: PeerJS (WebRTC)
- **Build Tool**: Vite

## File Size Limits

- Individual file: 100MB
- Maximum files per transfer: 5
- Supported file types: All

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Project Structure

```
fileSharing/
├── src/
│   ├── helpers/        # Utility functions and hooks
│   ├── store/          # Redux store configuration
│   │   ├── peer/       # Peer connection state
│   │   └── connection/ # Connection management
│   ├── App.tsx        # Main application component
│   └── main.tsx       # Application entry point
└── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- PeerJS for WebRTC implementation
- Tailwind CSS for styling
- Ant Design for UI components