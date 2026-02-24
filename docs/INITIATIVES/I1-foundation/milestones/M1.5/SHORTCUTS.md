# Keyboard Shortcuts Reference

## Global Navigation

| Shortcut | Action | Context |
|----------|--------|---------|
| `⌘K` | Open view switcher | Always |
| `⌘=` | Go up to Spec (abstraction) | Always |
| `⌘-` | Go down to Exploration | Always |
| `Esc` | Close view switcher | In switcher |

## Editing (Block Editor)

| Shortcut | Action | Context |
|----------|--------|---------|
| `Enter` | Create new block below | In editor |
| `Shift+Enter` | Line break within block | In editor |
| `Backspace` | Merge with previous (at start) | In editor |
| `Backspace` | Delete block (if empty) | In editor |

## Lifting

| Shortcut | Action | Context |
|----------|--------|---------|
| `⌘⇧L` | Lift semantic scope to Spec | Exploration (block selected) |
| `⌘↩` | Jump to source | Spec (planned) |

## Semantic Scope Rules

When you press `⌘⇧L` to lift:

- **H1 block** → Lifts until next H1
- **H2 block** → Lifts until next H2 (stops at H1)
- **H3 block** → Lifts until next H3 (stops at H1/H2)
- **Bullet** → Lifts entire nested subtree
- **Paragraph** → Lifts itself and children

## View Switcher

When `⌘K` is pressed:

- `↑`/`↓` - Navigate views (planned)
- `Enter` - Select view (planned)
- `Esc` - Close switcher
- Click view - Select and close

## Transcluded Content (Spec)

When hovering over lifted blocks:

- Provenance badge appears
- Edit button → Edit source inline
- Remove button → Remove reference (keeps source)

## Tips

1. **No "Add Node" button** - Just start typing
2. **Lifting works mid-block** - Cursor position doesn't matter
3. **Edits in Spec update Exploration** - Live references
4. **Navigation preserves cursor** - Position remembered per view
5. **Toasts confirm actions** - Shows block count on lift

## Default Keybindings (macOS)

Replace `⌘` with `Ctrl` on Windows/Linux.

## Future Shortcuts (Planned)

- `⌘/` - Block type menu
- `⌘B` - Bold (if rich text added)
- `⌘I` - Italic (if rich text added)
- `⌘[` - Outdent bullet
- `⌘]` - Indent bullet
