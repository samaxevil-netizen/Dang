# replit.md

## Overview

This is a Facebook Messenger chatbot built using the FCA (Facebook Chat API) unofficial library. The bot is designed for Arabic-speaking communities and provides various interactive features including games, image generation, currency/economy system, media downloading, and utility commands. The bot operates on Facebook Messenger groups and direct messages.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Core Architecture
- **Runtime**: Node.js application with obfuscated main entry points (`index.js`, `main.js`)
- **Entry Point**: `index.js` (via npm start script) which loads `main.js`
- **Bot Framework**: Multiple FCA (Facebook Chat API) unofficial libraries for Messenger integration:
  - `@dongdev/fca-unofficial`
  - `@xaviabot/fca-unofficial`
  - `fca-prjvt`
  - `meta-horizonn`

### Database Layer
- **ORM**: Sequelize with SQLite storage
- **Database File**: `data.sqlite` (configured in `config.json`)
- **Models**: Three core models defined in `includes/database/models/`:
  - `Users` - User data and profiles
  - `Threads` - Group/thread information
  - `Currencies` - Virtual economy/money system

### Command System
- **Command Location**: `modules/commands/` directory
- **Command Structure**: Each command exports a `config` object and `run` function
- **Event Handlers**: Optional `handleEvent`, `handleReply`, `handleReaction` for interactive commands
- **Multi-language Support**: Commands can define language strings in Vietnamese (`vi`) and English (`en`)

### Handler Architecture (in `includes/handle/`)
- `handleCommand.js` - Main command dispatcher with prefix detection, permissions, cooldowns
- `handleEvent.js` - Facebook event processing (member joins/leaves, name changes)
- `handleReply.js` - Reply-based command interactions
- `handleReaction.js` - Reaction-based command interactions
- `handleCreateDatabase.js` - Auto-creation of user/thread records
- `handleRefresh.js` - Real-time thread data synchronization
- `handleNotification.js` - Facebook notification forwarding to admins

### Controller Layer (in `includes/controllers/`)
- `users.js` - User CRUD operations and Facebook API wrappers
- `threads.js` - Thread/group management
- `currencies.js` - Virtual currency operations

### Configuration
- `config.json` - Main bot configuration:
  - Language setting (Vietnamese default)
  - Bot prefix (`.`)
  - Admin user IDs
  - Database settings
  - FCA options
- `appstate.json` - Facebook session cookies for authentication
- `includes/FastConfigFca.json` - FCA library advanced settings

### Authentication
- Cookie-based Facebook session stored in `appstate.json`
- Session auto-refresh and MQTT reconnection configured in `fca-config.json`
- Admin permissions defined by user IDs in `config.json`

### Permission System
- Level 0: All users
- Level 1: Group administrators
- Level 2: Bot administrators (defined in `ADMINBOT` array)

## External Dependencies

### Facebook Integration
- Multiple FCA (Facebook Chat API) unofficial libraries for Messenger connectivity
- MQTT protocol for real-time message listening
- Facebook Graph API for user/notification data

### Media Processing
- `canvas` / `jimp` - Image manipulation and generation
- `fluent-ffmpeg` with `@ffmpeg-installer/ffmpeg` - Audio/video processing
- `gifencoder` - GIF creation
- `gtts` - Google Text-to-Speech

### External APIs
- Google Translate API (for translation features)
- Google Generative AI (`@google/generative-ai`)
- Wolfram Alpha API (math solving, key in config)
- Various image APIs (popcat.xyz, imgur, etc.)
- YouTube (`@distube/ytdl-core`) for media downloading

### Web Server
- `express` with `helmet` security middleware
- `express-rate-limit` for API protection
- Serves `index.html` as a status page

### Utility Libraries
- `axios` - HTTP requests
- `cheerio` - HTML parsing
- `moment-timezone` - Date/time handling
- `fs-extra` - Enhanced file system operations
- `string-similarity` - Command fuzzy matching