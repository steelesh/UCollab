# 🎨 UCollab Color Schemes

##  Overview
UCollab follows a **modern and accessible color scheme** optimized for both **light mode** and **dark mode**. Below is a breakdown of the colors used in the platform.

---

## 🌞 Light Mode Colors
| Color Name       | HEX Code  | Preview |
|-----------------|----------|---------|
|  **Primary** | `#e00122` | <div style="width:50px; height:20px; background-color:#e00122; border:1px solid #000;"></div> |
|  **Primary Focus** | `#ff4d4d` | <div style="width:50px; height:20px; background-color:#ff4d4d; border:1px solid #000;"></div> |
|  **Primary Content** | `#e00122` | <div style="width:50px; height:20px; background-color:#e00122; border:1px solid #000;"></div> |
|  **Secondary** | `#ffffff` | <div style="width:50px; height:20px; background-color:#ffffff; border:1px solid #000;"></div> |
|  **Secondary Focus** | `#004b91` | <div style="width:50px; height:20px; background-color:#004b91; border:1px solid #000;"></div> |
|  **Secondary Content** | `#ffffff` | <div style="width:50px; height:20px; background-color:#ffffff; border:1px solid #000;"></div> |
|  **Accent** | `#333333` | <div style="width:50px; height:20px; background-color:#333333; border:1px solid #000;"></div> |
|  **Accent Focus** | `#1a1a1a` | <div style="width:50px; height:20px; background-color:#1a1a1a; border:1px solid #000;"></div> |
|  **Accent Content** | `#333333` | <div style="width:50px; height:20px; background-color:#333333; border:1px solid #000;"></div> |

---

## 🌙 Dark Mode Colors
| Color Name       | HEX Code  | Preview |
|-----------------|----------|---------|
|  **Primary** | `#e00122` | <div style="width:50px; height:20px; background-color:#e00122; border:1px solid #000;"></div> |
|  **Primary Focus** | `#ff4d4d` | <div style="width:50px; height:20px; background-color:#ff4d4d; border:1px solid #000;"></div> |
|  **Primary Content** | `#e00122` | <div style="width:50px; height:20px; background-color:#e00122; border:1px solid #000;"></div> |
|  **Neutral** | `#666666` | <div style="width:50px; height:20px; background-color:#666666; border:1px solid #000;"></div> |
|  **Neutral Focus** | `#4d4d4d` | <div style="width:50px; height:20px; background-color:#4d4d4d; border:1px solid #000;"></div> |
|  **Neutral Content** | `#666666` | <div style="width:50px; height:20px; background-color:#666666; border:1px solid #000;"></div> |
|  **Base 100** | `#ffffff` | <div style="width:50px; height:20px; background-color:#ffffff; border:1px solid #000;"></div> |
|  **Base 200** | `#fafafa` | <div style="width:50px; height:20px; background-color:#fafafa; border:1px solid #000;"></div> |
|  **Base 300** | `#f5f5f5` | <div style="width:50px; height:20px; background-color:#f5f5f5; border:1px solid #000;"></div> |
|  **Base Content** | `#000000` | <div style="width:50px; height:20px; background-color:#000000; border:1px solid #000;"></div> |

---

## ⚠️ Additional Colors
| Color Name       | HEX Code  | Preview |
|-----------------|----------|---------|
|  **Info** | `#00b5fb` | <div style="width:50px; height:20px; background-color:#00b5fb; border:1px solid #000;"></div> |
|  **Info Content** | `#000000` | <div style="width:50px; height:20px; background-color:#000000; border:1px solid #000;"></div> |
|  **Success** | `#00a96e` | <div style="width:50px; height:20px; background-color:#00a96e; border:1px solid #000;"></div> |
|  **Success Content** | `#000000` | <div style="width:50px; height:20px; background-color:#000000; border:1px solid #000;"></div> |
|  **Warning** | `#ffbf00` | <div style="width:50px; height:20px; background-color:#ffbf00; border:1px solid #000;"></div> |
|  **Warning Content** | `#000000` | <div style="width:50px; height:20px; background-color:#000000; border:1px solid #000;"></div> |
|  **Error** | `#ff6368` | <div style="width:50px; height:20px; background-color:#ff6368; border:1px solid #000;"></div> |
|  **Error Content** | `#000000` | <div style="width:50px; height:20px; background-color:#000000; border:1px solid #000;"></div> |

---

## **🛠️ How to Use the Colors in Code**
### **Tailwind CSS Usage**
Since Tailwind CSS is used, colors can be applied with:
```css
.text-primary { color: var(--color-primary); }
.bg-dark { background-color: var(--color-base-100); }
.border-accent { border-color: var(--color-accent); }

If using CSS variables
:root {
  --primary-color: #e00122;
  --secondary-color: #004b91;
  --accent-color: #333333;
}
