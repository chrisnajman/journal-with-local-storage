---
permalink: /index.html
---

[Website (Git Pages)](https://chrisnajman.github.io/journal-with-local-storage)

# Journal with Local Storage

Use your browser as a journal (entries can only be viewed locally).

## Features

- **Create an entry**:
  - add date (optional)
  - add heading (required)
  - add text (required).
    - Show error messages if required fields not filled.
  - Publish: saves to local storage, or
  - cancel.
- **Edit an entry**:
  - heading,
  - text.
    - Save to local storage.
- **Delete an entry**:
  - deletes from local storage.

## HTML

- `template` used for journal entry item.
- `contenteditable` used for entry editing.

## Javascript

- ES6 (no transpilation to ES5)
- Unique local storage key, `V1_ENTRIES-LIST-entries`:
  - If journal entries are deleted, no other local storage will be affected.

## CSS

- `grid` used for page layout.
- `flexbox` used for element layout.
- `CSS variables` used for common properties.

## Testing

- Tested on:
  - Windows 10
    - Chrome
    - Firefox
    - Microsoft Edge

## Acknowledgements

- The code is a refactored and extended version of the _Advanced Todo List_ tutorial in the [Javascript Simplified](https://courses.webdevsimplified.com/view/courses/javascript-simplified-beginner) course, by Kyle Cook.
