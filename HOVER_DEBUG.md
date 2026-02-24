# Testing Hover Menu Visibility

To debug the hover menu issue, try:

## 1. Check Hover Area
- Hover over the left edge of any block in the editor
- Look for a subtle gray background change on hover
- The menu should appear about 50px to the left of the text

## 2. Keyboard Shortcut
- Press **⌘+Shift+T** to toggle the chat panel
- This should work immediately

## 3. Manual Thread Creation
- Use the keyboard shortcut to open the chat panel
- Click "New Thread Here" to create a thread
- This will add a 💬 badge to the heading

## 4. Debug Steps
If the hover menu still doesn't show:
1. Open browser dev tools
2. Look for CSS issues with `.group-hover:opacity-100`
3. Check if the elements are positioned correctly
4. Verify the `group` class is applied to parent containers

## Expected Behavior
- Hover over any block → see plus icon on the left
- Click plus icon → see thread and link buttons extend right
- Click 💬 button → creates thread for that section
- Created threads show as badges on headings