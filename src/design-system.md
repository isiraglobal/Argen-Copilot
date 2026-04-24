# ArGen Design System

## Colors
| Token           | Hex       | Usage                          |
|-----------------|-----------|--------------------------------|
| --bg-primary    | #F5F1E8   | Page background (warm cream)   |
| --bg-dark       | #1A1A1A   | Dark sections, cards           |
| --bg-accent     | #2D5F4F   | Primary CTA (forest green)     |
| --text-primary  | #1A1A1A   | Default text                   |
| --text-inverse  | #F5F1E8   | Text on dark/green bg          |
| --border-color  | #1A1A1A   | All borders                    |

## CSS Classes
```
.retro-box        cream bg + 3px black border
.retro-box-dark   dark bg + 3px black border + cream text
.retro-box-green  green bg + 3px black border + cream text
.retro-btn        cream button, bold, hover opacity
.retro-btn-primary green button, bold, hover opacity
```

## Rules
- ZERO border-radius
- ZERO box shadows
- All borders: 3px solid #1A1A1A
- Font: Cascadia Mono (monospace)
- Responsive via Tailwind md: breakpoint (768px)
- Mobile: bottom nav (fixed, 60px)
- Desktop: top header nav

## Logo
- CDN: https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e56aecdd4fda27f20c52c4/9ebe8a13a_ArGenLogo-2.png
- Save as: public/logo.png
- On dark bg: CSS filter: invert(1)
