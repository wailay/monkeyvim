# monkeyvim

Practice vim like a monkey

## Practice Modes

| Mode       | What you practice                                       |
| ---------- | ------------------------------------------------------- |
| **motion** | Navigating with `w`, `b`, `e`, `gg`, `G`, `%`, and more |
| **find**   | Character search with `f`, `F`, `t`, `T`                |
| **delete** | The `d` operator combined with motions and text objects |
| **change** | The `c` operator for replacing text                     |
| **yank**   | Copying text with `y` and pasting with `p`              |
| **random** | A mix of all the above                                  |

Each challenge gives you a starting buffer, a goal state, and optionally a hint. Your edits are validated in real time against the expected result.

## Features

- Real vim keybindings via CodeMirror + [@replit/codemirror-vim](https://github.com/nicknisi/codemirror-vim)
- Multiple difficulty levels per mode
- Session tracking with time, keystrokes, and score
- Hint system for when you're stuck
- Light and dark themes with multiple color schemes
- Adjustable font size

## Tech Stack

- [Next.js 16](https://nextjs.org/) with App Router
- [React 19](https://react.dev/) with React Compiler
- [CodeMirror 6](https://codemirror.net/) for the editor
- [Tailwind CSS 4](https://tailwindcss.com/) for styling
- [Framer Motion](https://motion.dev/) for animations
- [Lucide](https://lucide.dev/) for icons
- TypeScript

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Bun](https://bun.sh/) (recommended) or npm

### Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/monkeyvim.git
cd monkeyvim

# Install dependencies
bun install

# Start the dev server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to start practicing.           |

### Project Structure

```text
app/                  Next.js app router pages and layout
components/           React components (editor, challenges, selectors)
hooks/                Custom hooks (challenge state, theme, timer)
lib/
  challenges/         Challenge definitions organized by mode
  types.ts            TypeScript interfaces
  themes.ts           Theme definitions
```

## Adding Challenges

Challenges live in `lib/challenges/`. Each challenge defines:

- `startContent` — the initial buffer text
- `expectedContent` — what the buffer should look like after the correct edit
- `cursorStart` / `cursorEnd` — starting and expected cursor positions
- `hint` — an optional hint string
- `difficulty` — a level from 1 to 3

Add new challenges to the appropriate mode file and they'll automatically appear in the app.

## License

MIT
