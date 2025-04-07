# 🎨 UCollab Color Schemes

##  Overview
UCollab follows a **modern and accessible color scheme** optimized for both **light mode** and **dark mode**. Below is a breakdown of the colors used in the platform.

---

## 🌞 Light Mode Colors
| Color Name       | HSL Value  | Description |
|-----------------|----------|---------|
| **Background** | `0 0% 100%` | Main background color |
| **Foreground** | `0 0% 3.9%` | Main text color |
| **Primary** | `0 0% 9%` | Primary interactive elements |
| **Primary Foreground** | `0 0% 98%` | Text on primary elements |
| **Secondary** | `0 0% 96.1%` | Secondary interactive elements |
| **Secondary Foreground** | `0 0% 9%` | Text on secondary elements |
| **Accent** | `0 0% 96.1%` | Accent elements |
| **Accent Foreground** | `0 0% 9%` | Text on accent elements |
| **Muted** | `0 0% 96.1%` | Muted/subtle elements |
| **Muted Foreground** | `0 0% 45.1%` | Text on muted elements |
| **Destructive** | `350 99% 44%` | Error/destructive elements |
| **Destructive Foreground** | `0 0% 98%` | Text on destructive elements |

## 🎓 UC Brand Colors (Light & Dark Mode)
| Color Name       | HSL Value  | Description |
|-----------------|----------|---------|
| **UC Red** | `350 99% 44%` | Main UC brand color |
| **UC Red Dark** | `350 99% 36%` | Darker shade of UC red |
| **UC Red Darker** | `350 93% 28%` | Even darker shade for hover states |
| **UC Black** | `0 0% 0%` | Pure black |
| **UC Black Light** | `0 0% 20%` | Lighter black |
| **UC White** | `0 0% 100%` | Pure white |
| **UC Grey** | `0 0% 95%` | Light grey |
| **UC Grey Silver** | `260 3% 66%` | Silver grey |
| **UC Grey Mist** | `260 7% 88%` | Misty grey |
| **UC Gold** | `35 47% 64%` | UC gold accent |
| **UC Tan** | `35 47% 84%` | Light tan accent |

---

## 🌙 Dark Mode Colors
| Color Name       | HSL Value  | Description |
|-----------------|----------|---------|
| **Background** | `0 0% 3.9%` | Main background color |
| **Foreground** | `0 0% 98%` | Main text color |
| **Primary** | `0 0% 98%` | Primary interactive elements |
| **Primary Foreground** | `0 0% 9%` | Text on primary elements |
| **Secondary** | `0 0% 15%` | Secondary interactive elements |
| **Secondary Foreground** | `0 0% 98%` | Text on secondary elements |
| **Accent** | `0 0% 15%` | Accent elements |
| **Accent Foreground** | `0 0% 98%` | Text on accent elements |
| **Muted** | `0 0% 15%` | Muted/subtle elements |
| **Muted Foreground** | `0 0% 65%` | Text on muted elements |
| **Destructive** | `350 99% 44%` | Error/destructive elements |
| **Destructive Foreground** | `0 0% 98%` | Text on destructive elements |

---

## 📊 Chart Colors
| Color Name       | HSL Value  | Description |
|-----------------|----------|---------|
| **Chart 1** | `12 76% 61%` | Primary chart color |
| **Chart 2** | `173 58% 39%` | Secondary chart color |
| **Chart 3** | `197 37% 24%` | Tertiary chart color |
| **Chart 4** | `43 74% 66%` | Quaternary chart color |
| **Chart 5** | `27 87% 67%` | Quinary chart color |

---

## 🛠️ How to Use the Colors in Code

### **Tailwind CSS Usage**
```css
/* Using the HSL variables in Tailwind */
.bg-primary { background-color: hsl(var(--primary)); }
.text-accent-foreground { color: hsl(var(--accent-foreground)); }
.border-uc-red { border-color: hsl(var(--uc-red)); }
```

### **CSS Variables**
All colors are defined as CSS variables:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --primary: 0 0% 9%;
  /* and so on */
}

.dark {
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
  /* dark mode overrides */
}
```

These colors create a cohesive design system that maintains accessibility while embracing the University of Cincinnati's brand identity.
