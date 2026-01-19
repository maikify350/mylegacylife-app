# MyLegacyLife.AI - Homepage Section Reference Guide

This document provides clear names for all sections and components on the homepage to facilitate precise communication about layout changes.

---

## Page Structure Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      HERO SECTION                           │
│  ┌──────────┐  ┌────────────────────────────────────────┐  │
│  │          │  │  Hero Text Block                       │  │
│  │  Logo    │  │  ├─ Heading (H1): "MyLegacyLife.AI"   │  │
│  │  Image   │  │  ├─ Tagline: "Preserve your life's..." │  │
│  │          │  │  └─ Description: "Share your memories"│  │
│  └──────────┘  └────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓ (gap-1 = 4px)
┌─────────────────────────────────────────────────────────────┐
│                   CTA BUTTONS SECTION                       │
│  ┌──────────────────────────┐  ┌─────────────────────────┐ │
│  │  Primary CTA             │  │  Secondary CTA          │ │
│  │  "Start Recording..."    │  │  "Learn More"           │ │
│  └──────────────────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓ (mt-2 = 8px)
┌─────────────────────────────────────────────────────────────┐
│                    FEATURES SECTION                         │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐                │
│  │Feature  │    │Feature  │    │Feature  │                │
│  │Card 1   │    │Card 2   │    │Card 3   │                │
│  │🎤       │    │🌳       │    │📚       │                │
│  │Voice-   │    │Family   │    │Beautiful│                │
│  │First    │    │Tree     │    │Book     │                │
│  └─────────┘    └─────────┘    └─────────┘                │
└─────────────────────────────────────────────────────────────┘
                            ↓ (mt-2 = 8px)
┌─────────────────────────────────────────────────────────────┐
│                 HOW IT WORKS SECTION                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Section Heading (H2): "How It Works"              │   │
│  │                                                      │   │
│  │  ┌───┐  Step 1: "Receive Weekly Questions"         │   │
│  │  │ 1 │  Description text...                         │   │
│  │  └───┘                                               │   │
│  │                                                      │   │
│  │  ┌───┐  Step 2: "Record Your Answer"                │   │
│  │  │ 2 │  Description text...                         │   │
│  │  └───┘                                               │   │
│  │                                                      │   │
│  │  ┌───┐  Step 3: "Get Your Book"                     │   │
│  │  │ 3 │  Description text...                         │   │
│  │  └───┘                                               │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓ (mt-2 = 8px)
┌─────────────────────────────────────────────────────────────┐
│                    FOOTER CTA SECTION                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Heading: "Ready to preserve your legacy?"         │   │
│  │  Subtext: "Start sharing your stories today..."    │   │
│  │                                                      │   │
│  │  ┌──────────────────┐  ┌──────────────────┐        │   │
│  │  │ Begin Your Story │  │ View All Questions│        │   │
│  │  └──────────────────┘  └──────────────────┘        │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓ (mt-2 = 8px)
┌─────────────────────────────────────────────────────────────┐
│                       FOOTER                                │
│  © 2026 MyLegacyLife.AI. Preserving memories...            │
└─────────────────────────────────────────────────────────────┘
```

---

## Detailed Component Names

### 1. HERO SECTION
**Location**: Top of the page  
**Container**: `max-w-4xl mx-auto` (centered, max width 896px)

#### Components:
- **Logo**: 192×192px image (`logo_mocha.png`)
  - File: `app/page.tsx` lines 11-20
  - Classes: `flex-shrink-0`, `w-auto h-auto`
  
- **Hero Text Block**: Text content to the right of logo
  - Container gap from logo: `gap-1` (4px)
  - File: `app/page.tsx` lines 22-38
  
  - **Heading (H1)**: "MyLegacyLife.AI"
    - Font: `font-serif text-6xl md:text-7xl`
    - Line height: `1`
    - Margin: `0`
    
  - **Tagline**: "Preserve your life's stories for future generations"
    - Font: `text-2xl md:text-3xl`
    - Line height: `1.2`
    - Margin: `0`
    
  - **Description**: "Share your memories through voice and stories..."
    - Font: `text-xl`
    - Line height: `1.3`
    - Margin: `0`

**Spacing**:
- Internal text block gap: `2px`
- Bottom margin: `2px`

---

### 2. CTA BUTTONS SECTION
**Location**: Below Hero Section  
**Container**: `flex flex-col sm:flex-row gap-6`

#### Components:
- **Primary CTA**: "Start Recording Your Story" button
  - Class: `btn-voice-primary`
  - Icon: Microphone SVG
  - File: `app/page.tsx` lines 43-58
  
- **Secondary CTA**: "Learn More" button
  - Classes: `px-8 py-4 text-xl border-2`
  - Link: `#learn-more`
  - File: `app/page.tsx` lines 60-64

**Spacing**:
- Top margin: `2px`
- Gap between buttons: `gap-6` (24px)

---

### 3. FEATURES SECTION
**Location**: Below CTA Buttons  
**Container**: `grid md:grid-cols-3 gap-8`

#### Components:
- **Feature Card 1**: Voice-First (🎤)
  - Padding: `p-2`
  - File: `app/page.tsx` lines 69-77
  
- **Feature Card 2**: Family Tree (🌳)
  - Padding: `p-2`
  - File: `app/page.tsx` lines 79-87
  
- **Feature Card 3**: Beautiful Book (📚)
  - Padding: `p-2`
  - File: `app/page.tsx` lines 89-97

**Card Structure**:
- Icon: `text-4xl mb-4`
- Heading (H3): `text-2xl font-serif mb-3`
- Description: `text-lg leading-relaxed`

**Spacing**:
- Top margin: `mt-2` (8px)
- Gap between cards: `gap-8` (32px)

---

### 4. HOW IT WORKS SECTION
**Location**: Below Features Section  
**Container**: `max-w-3xl mx-auto`  
**ID**: `learn-more` (anchor link target)

#### Components:
- **Section Heading (H2)**: "How It Works"
  - Font: `text-4xl font-serif font-bold`
  - Bottom margin: `mb-2` (8px)
  - File: `app/page.tsx` line 102
  
- **Steps Container**: `space-y-6` (24px gap between steps)
  - File: `app/page.tsx` lines 106-148

**Each Step Contains**:
- **Number Badge**: Circular badge (1, 2, 3)
  - Size: `w-12 h-12`
  - Classes: `rounded-full bg-accent text-accent-foreground`
  
- **Step Content**:
  - Heading (H4): `text-2xl font-semibold mb-2`
  - Description: `text-lg leading-relaxed`

**Spacing**:
- Top margin: `mt-2` (8px)
- Gap between number and text: `gap-6` (24px)

---

### 5. FOOTER CTA SECTION
**Location**: Below How It Works Section  
**Container**: `p-8 rounded-2xl bg-gradient-to-br`

#### Components:
- **Heading (H2)**: "Ready to preserve your legacy?"
  - Font: `text-3xl font-serif font-bold`
  - Bottom margin: `mb-4`
  - File: `app/page.tsx` line 153
  
- **Subtext**: "Start sharing your stories today..."
  - Font: `text-xl`
  - Bottom margin: `mb-8`
  - File: `app/page.tsx` line 156
  
- **CTA Buttons**:
  - "Begin Your Story" (Primary)
  - "View All Questions" (Secondary)
  - Gap: `gap-4` (16px)

**Spacing**:
- Top margin: `mt-2` (8px)
- Internal padding: `p-8` (32px)

---

### 6. FOOTER
**Location**: Bottom of page  
**Container**: `pt-8 border-t-2`

#### Components:
- **Copyright Text**: "© 2026 MyLegacyLife.AI..."
  - Font: `text-lg text-muted-foreground`
  - File: `app/page.tsx` lines 185-189

**Spacing**:
- Top margin: `mt-2` (8px)
- Top padding: `pt-8` (32px)

---

## Common Spacing Values Reference

| Class | Pixels | Usage |
|-------|--------|-------|
| `gap-1` | 4px | Logo to text block |
| `gap-2` | 8px | Internal text spacing |
| `gap-4` | 16px | Footer CTA buttons |
| `gap-6` | 24px | CTA buttons, How It Works steps |
| `gap-8` | 32px | Feature cards |
| `mt-2` | 8px | Section top margins |
| `mb-1` | 4px | Small bottom margins |
| `mb-2` | 8px | Medium bottom margins |
| `p-2` | 8px | Feature card padding |
| `p-8` | 32px | Footer CTA padding |

---

## How to Use This Reference

When requesting changes, use these section names:

**Examples**:
- ✅ "Reduce the gap between Logo and Hero Text Block"
- ✅ "Change the Tagline font size"
- ✅ "Add more spacing to the Features Section"
- ✅ "Move the Primary CTA button to the left"
- ✅ "Reduce top margin of How It Works Section"

**Avoid vague terms**:
- ❌ "Move the text over there"
- ❌ "The thing at the top"
- ❌ "The buttons below"

---

**Last Updated**: 2026-01-18  
**Version**: 1.0
