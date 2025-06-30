# Diff Viewer

A responsive web application for visualizing Git diff/patch files with an intuitive interface and multiple viewing modes.

## Features

### Core Functionality
- **File Upload**: Upload `.diff`, `.patch`, or `.txt` files containing Git diffs
- **Dual View Modes**: Switch between unified and split-view diff displays
- **Directory Tree**: Navigate through changed files using an organized sidebar tree structure
- **File Statistics**: View comprehensive statistics including additions, deletions, and change types
- **Error Handling**: Robust error handling for malformed or corrupted diff files

### View Modes
- **Unified View**: Traditional single-column diff display with line-by-line changes
- **Split View**: Side-by-side comparison showing old and new versions
- **Word-level Highlighting**: Precise highlighting of changes within modified lines
- **Line Numbers**: Accurate line numbering for both old and new file versions

### User Experience
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Loading States**: Visual feedback during file processing
- **Toast Notifications**: User-friendly success and error messages
- **Collapsible Sidebar**: Adjustable interface for optimal viewing

### File Change Support
- **Added files**: New files in the repository
- **Modified files**: Changes to existing files
- **Deleted files**: Removed files (excluded from tree view)
- **Renamed files**: Files that have been moved or renamed

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- pnpm (recommended) or npm/yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/barrymun/diff-viewer.git
   cd diff-viewer
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or alternatively: npm install / yarn install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   # or alternatively: npm run dev / yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

## Usage

### Basic Usage
1. **Upload a diff file**: Click the "Upload files" button and select a `.diff`, `.patch`, or `.txt` file
2. **Browse files**: Use the sidebar directory tree to navigate through changed files
3. **Switch views**: Toggle between "Unified" and "Split" view modes using the view toggle buttons
4. **Examine changes**: Review detailed line-by-line changes with syntax highlighting

### Supported File Formats
- **Git diff output**: Standard `git diff` command output
- **Git format-patch**: Output from `git format-patch`
- **Unix diff**: Traditional Unix diff format
- **Custom patches**: Any text file following standard diff format

### Generating Compatible Diff Files

#### From Git repositories:
```bash
# Generate diff for uncommitted changes
git diff > changes.diff

# Generate diff between commits
git diff commit1..commit2 > changes.diff

# Generate formatted patches
git format-patch -1 HEAD --output-directory=patches/
```

#### From command line:
```bash
# Compare two files
diff -u file1.txt file2.txt > changes.diff

# Compare directories
diff -ur directory1/ directory2/ > changes.diff
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── app/            # Main application component
│   ├── loader/         # Loading indicator
│   └── styled/         # Styled Material-UI components
├── contexts/           # React contexts for state management
├── features/           # Feature-specific components
│   ├── diffViewer/     # Core diff viewing functionality
│   │   ├── components/ # Upload, view toggle, patch info
│   │   ├── splitViewer/# Split view implementation
│   │   └── unifiedViewer/ # Unified view implementation
│   └── directoryTree/  # File tree navigation
├── hooks/             # Custom React hooks
├── utils/             # Utility functions and types
└── zustand/          # Global state management
```

## Development

### Available Scripts

```bash
# Development
pnpm dev             # Start development server
pnpm build           # Build for production
pnpm preview         # Preview production build

# Code Quality
pnpm lint            # Run ESLint
pnpm lint-fix        # Fix ESLint issues automatically
pnpm test            # Run test suite
pnpm cspell          # Run spell checker

# Git Hooks
pnpm prepare         # Setup Husky pre-commit hooks
```

### Technology Stack

**Frontend Framework**
- React 19.1.0 with TypeScript
- Vite for build tooling and development

**UI Library**
- Material-UI (MUI) v7 for components and theming
- Material Icons for iconography
- Custom styled components

**State Management**
- Zustand for global state
- React Context for feature-specific state

**Diff Processing**
- `diff` library for parsing patch files
- Custom algorithms for line alignment and word-level diffing

**Code Quality**
- ESLint with strict TypeScript rules
- Prettier for code formatting
- Husky for pre-commit hooks
- CSpell for spell checking
- Vitest for unit testing

### Code Standards

The project enforces strict code quality standards:
- **No relative imports**: All imports use absolute paths with `@/` prefix
- **Strict TypeScript**: Comprehensive type checking enabled
- **Consistent formatting**: Prettier configuration for uniform code style
- **File naming**: camelCase naming convention enforced
- **Import organization**: Automatic import sorting and grouping

## Testing

Run the test suite:
```bash
pnpm test
```

The project includes unit tests for core functionality:
- Diff parsing and processing
- Line alignment algorithms
- Component rendering logic

## Roadmap

### Completed Features
- Error handling for malformed files
- Toast notifications and user feedback
- Loading states and progress indicators
- Strict linting and code quality tools
- Absolute import paths with TypeScript
- Code formatting with Prettier
- Spell checking integration
- Pre-commit hooks with Husky
- Performance optimization with code chunking

### Planned Features
See [TODO.md](TODO.md)

## Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/new-feature`
3. **Make your changes** following the established code standards
4. **Run tests**: `pnpm test`
5. **Run linting**: `pnpm lint`
6. **Commit your changes**: `git commit -m 'Add new feature'`
7. **Push to branch**: `git push origin feature/new-feature`
8. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript strict mode requirements
- Use absolute imports with `@/` prefix
- Write unit tests for new features
- Ensure all linting passes before committing
- Use conventional commit messages

## License

This project is available under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Issues and Support

If you encounter any issues or have questions:
1. Check existing issues in the repository
2. Create a new issue with detailed reproduction steps
3. Include browser version and any error messages

## Performance Considerations

- **File Size**: The application handles large diff files efficiently, but very large files (>10MB) may impact performance
- **Format**: Ensure your diff files follow standard Git diff format for optimal parsing
- **Browser**: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+) provide the best experience
- **Screen Size**: Split view works best on larger screens; unified view is optimized for mobile devices
