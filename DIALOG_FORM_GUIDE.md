# Dialog Component & Form UI Guide

## Overview

A professional, accessible dialog modal for creating new Instagram posts with the following structure:

---

## 📐 Form Layout

```
┌─────────────────────────────────────────────────────┐
│  Create New Post                            [X]      │
│  Add a new Instagram post to your library           │
├─────────────────────────────────────────────────────┤
│                                                       │
│  Caption                                             │
│  ┌────────────────────────────────────────────────┐  │
│  │ Write your post caption here...               │  │
│  │                                                │  │
│  │                                                │  │
│  └────────────────────────────────────────────────┘  │
│                                                       │
│  Post Type                                           │
│  ┌────────────────────────────────────────────────┐  │
│  │ Image                          ▼                │  │
│  └────────────────────────────────────────────────┘  │
│    Options: Image, Video, Carousel, Reel, Story     │
│                                                       │
│  Status                                              │
│  ┌────────────────────────────────────────────────┐  │
│  │ Draft                          ▼                │  │
│  └────────────────────────────────────────────────┘  │
│    Options: Draft, Scheduled, Backlog, Published    │
│                                                       │
│  * Scheduled Date (only shows when Status = Scheduled)
│  ┌────────────────────────────────────────────────┐  │
│  │ YYYY-MM-DD                     📅               │  │
│  └────────────────────────────────────────────────┘  │
│                                                       │
├─────────────────────────────────────────────────────┤
│  [Cancel]  [Create Post]                             │
└─────────────────────────────────────────────────────┘
```

---

## 🎨 Color Scheme

### Dialog Background
- **Background**: Dark card color
- **Border**: Subtle border-color
- **Text**: Light foreground color

### Form Elements

#### Text Fields
```
┌──────────────────────────────┐
│ Input text here...           │  ← placeholder text (gray)
└──────────────────────────────┘
```

#### Dropdown Fields
```
┌──────────────────────────────┐
│ Select Option              ▼ │
└──────────────────────────────┘
     ↓ (shows options on click)
```

#### Date Input
```
┌──────────────────────────────┐
│ YYYY-MM-DD             📅     │
└──────────────────────────────┘
```

#### Buttons
- **Cancel**: Gray background, white text
- **Create Post**: Primary blue, white text

---

## 📱 Interactive States

### Default State
- All fields enabled
- Date field hidden (unless Status = scheduled)
- Buttons ready to click

### Focus State
- Input focused: Blue ring border
- Field highlighted for easy visibility
- Cursor visible in text field

### Hover State
- Cancel button: Slightly lighter gray
- Create Post button: Darker blue
- Dropdown options: Light highlight

### Disabled State
- Date picker disabled (when status ≠ scheduled)
- Submit button disabled if caption empty

---

## 🎯 Field Details

### 1. Caption (Textarea)
```tsx
<textarea
  placeholder="Write your post caption here..."
  rows={3}
  className="..."
/>
```
- **Type**: Multi-line text
- **Rows**: 3 lines visible
- **Placeholder**: Helpful hint text
- **Required**: Yes
- **Max Length**: Unlimited (consider limiting to 2,200)

### 2. Post Type (Dropdown)
```tsx
<select>
  <option>Image</option>
  <option>Video</option>
  <option>Carousel</option>
  <option>Reel</option>
  <option>Story</option>
</select>
```
- **Type**: Dropdown select
- **Default**: Image
- **Options**: 5 choices
- **Required**: Yes

### 3. Status (Dropdown)
```tsx
<select>
  <option>Draft</option>
  <option>Scheduled</option>
  <option>Backlog</option>
  <option>Published</option>
</select>
```
- **Type**: Dropdown select
- **Default**: Draft
- **Options**: 4 choices
- **Required**: Yes
- **Behavior**: Shows date picker when = "Scheduled"

### 4. Scheduled Date (Date Picker)
```tsx
<input
  type="date"
  placeholder="YYYY-MM-DD"
  required={formData.status === 'scheduled'}
/>
```
- **Type**: HTML5 date input
- **Format**: YYYY-MM-DD
- **Visibility**: Conditional (Status = Scheduled only)
- **Required**: Only when Status = Scheduled

---

## 🔄 Form Flow

### Step 1: Open Dialog
```
User clicks "New Post" button
         ↓
Dialog slides in from center
Form fields ready to input
```

### Step 2: Fill Caption
```
Click caption textarea
Type post description
Auto-focus on field
```

### Step 3: Select Post Type
```
Click "Post Type" dropdown
See 5 options (Image, Video, etc.)
Choose one
```

### Step 4: Choose Status
```
Click "Status" dropdown
See 4 options (Draft, Scheduled, etc.)
Choose one
If "Scheduled":
  → Date picker appears below
```

### Step 5: Set Date (if Scheduled)
```
Click date input field
Date picker calendar opens
Select date from calendar
```

### Step 6: Submit Form
```
Click "Create Post" button
Validate form:
  ✓ Caption required
  ✓ Date required if scheduled
If valid:
  → Create post
  → Add to library
  → Show in correct tab
  → Close dialog
Otherwise:
  → Show error message
  → Keep dialog open
```

---

## 🎨 Visual Styling Details

### Typography
```
Title: "Create New Post"
  → Font size: lg (18px)
  → Weight: semibold (600)
  → Color: foreground (white-ish)

Description: "Add a new Instagram post to your library"
  → Font size: sm (14px)
  → Weight: normal (400)
  → Color: muted-foreground (gray)

Labels: "Caption", "Post Type", etc.
  → Font size: sm (14px)
  → Weight: medium (500)
  → Color: foreground (white-ish)
```

### Spacing
```
Between form sections: 1rem (gap-4)
Between label and input: 0.5rem
Padding in dialog: 1.5rem
Button gap: 0.75rem
```

### Borders & Shadows
```
Dialog:
  Border: 1px solid border-color
  Shadow: lg (large shadow for elevation)
  Radius: sm (0.5rem - 8px)

Input fields:
  Border: 1px solid border-color
  Radius: lg (0.5rem - 8px)
  Focus ring: 2px primary color
```

---

## ♿ Accessibility Features

### Keyboard Navigation
```
Tab            → Move to next field
Shift+Tab      → Move to previous field
Enter/Space    → Click button or open dropdown
Escape         → Close dialog
Arrow Keys     → Navigate dropdown options
```

### Screen Reader Support
```
Dialog has proper ARIA labels
Buttons have semantic HTML
Form labels linked to inputs
Error messages announced
```

### Focus Management
```
Focus trap within dialog
Return to trigger button on close
Visual focus indicator on all elements
High contrast text (dark theme)
```

### Touch Friendly
```
Buttons: 44px minimum height
Dropdowns: Large touch targets
Date picker: Easy to interact
Scrollable on small screens
```

---

## 🎬 Animation Details

### Dialog Entry
```
Fade in: 200ms
Zoom in: 200ms scale 95% → 100%
Slide in: From top-center
Easing: ease-out
```

### Dialog Exit
```
Fade out: 200ms
Zoom out: 200ms scale 100% → 95%
Slide out: To top-center
Easing: ease-in
```

### Focus Ring
```
Color: primary blue
Width: 2px
Offset: 2px
Animation: smooth transition
```

---

## 💡 Pro Tips for Users

1. **Keep captions concise** - Instagram has character limits
2. **Schedule posts** - Plan content in advance
3. **Use drafts** - Save work-in-progress
4. **Organize backlog** - Store future ideas
5. **Vary post types** - Mix images, videos, reels for engagement

---

## 🔗 Related Components

### Dialog Component (`components/ui/Dialog.tsx`)
- Provides modal functionality
- Handles overlay and animations
- Manages focus and keyboard

### Button Component (`components/ui/Button.tsx`)
- Used for "Cancel" and "Create Post"
- Supports variants (default, outline)

### Card Component (`components/ui/Card.tsx`)
- NOT used in dialog (Dialog provides structure)
- Used for post display and stats

---

## 📊 Form States Reference

### Initial State
```tsx
{
  caption: '',
  type: 'Image',
  status: 'draft',
  date: ''
}
```

### After User Input (Example)
```tsx
{
  caption: 'Beautiful sunset over the mountains',
  type: 'Image',
  status: 'scheduled',
  date: '2024-04-20'
}
```

### After Submission
```
Creates Post object:
{
  id: 5,
  caption: 'Beautiful sunset over the mountains',
  type: 'Image',
  status: 'scheduled',
  date: '2024-04-20'
}

Then:
→ Clears form to initial state
→ Closes dialog
→ Adds post to library
→ Updates tab counts
```

---

## 🐛 Common Issues & Solutions

### Issue: Date picker not showing
**Solution**: Ensure status is set to "scheduled"

### Issue: Form validation error
**Solution**: Check caption is not empty

### Issue: Dialog won't close
**Solution**: Try pressing Escape key, or click Cancel button

### Issue: New post not in tab
**Solution**: Make sure you're viewing the correct tab matching the status

---

## 📱 Mobile Responsiveness

### Small Screens (<640px)
```
Dialog width: 100% with margins
Buttons: Stack vertically
Labels: Full width
Inputs: Full width
Font: Slightly reduced
```

### Medium Screens (641-1024px)
```
Dialog width: max-width-lg
Layout: side-by-side buttons
Readable font sizes
Comfortable spacing
```

### Large Screens (1024px+)
```
Dialog width: max-width-lg centered
Full feature visibility
Optimized spacing
All features accessible
```

---

**Dialog UI Guide Version**: 1.0  
**Last Updated**: April 2024  
**Component Status**: ✅ Production Ready
