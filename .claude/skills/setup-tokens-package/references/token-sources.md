# Token Source Files

All files use DTCG format (`$value`, `$type`). Adapted from vite-mf-monorepo reference.

## src/base/color.json

Raw palette. Never use these directly in components — always go through semantic or alias layer.

```json
{
  "color": {
    "base": {
      "$description": "Raw color palette - not for direct use in components",
      "neutral": {
        "0": { "$value": "#ffffff", "$type": "color" },
        "50": { "$value": "#fafafa", "$type": "color" },
        "100": { "$value": "#f5f5f5", "$type": "color" },
        "200": { "$value": "#e5e5e5", "$type": "color" },
        "300": { "$value": "#d4d4d4", "$type": "color" },
        "400": { "$value": "#a3a3a3", "$type": "color" },
        "500": { "$value": "#6b6b6b", "$type": "color" },
        "600": { "$value": "#525252", "$type": "color" },
        "700": { "$value": "#404040", "$type": "color" },
        "800": { "$value": "#262626", "$type": "color" },
        "900": { "$value": "#171717", "$type": "color" },
        "950": { "$value": "#0a0a0a", "$type": "color" }
      },
      "amber": {
        "400": { "$value": "#fbbf24", "$type": "color" },
        "500": { "$value": "#f59e0b", "$type": "color" },
        "600": { "$value": "#d97706", "$type": "color" },
        "700": { "$value": "#b45309", "$type": "color" }
      },
      "red": {
        "500": { "$value": "#ef4444", "$type": "color" },
        "600": { "$value": "#dc2626", "$type": "color" }
      },
      "green": {
        "500": { "$value": "#22c55e", "$type": "color" },
        "600": { "$value": "#16a34a", "$type": "color" }
      }
    }
  }
}
```

> Adjust the palette to match the Frontend Mentor personal finance challenge colors
> if they differ. The structure stays the same.

## src/base/spacing.json

```json
{
  "spacing": {
    "$description": "Spacing scale based on 0.25rem (4px) increments",
    "0": { "$value": "0", "$type": "dimension" },
    "px": { "$value": "1px", "$type": "dimension" },
    "0.5": { "$value": "0.125rem", "$type": "dimension" },
    "1": { "$value": "0.25rem", "$type": "dimension" },
    "1.5": { "$value": "0.375rem", "$type": "dimension" },
    "2": { "$value": "0.5rem", "$type": "dimension" },
    "2.5": { "$value": "0.625rem", "$type": "dimension" },
    "3": { "$value": "0.75rem", "$type": "dimension" },
    "3.5": { "$value": "0.875rem", "$type": "dimension" },
    "4": { "$value": "1rem", "$type": "dimension" },
    "5": { "$value": "1.25rem", "$type": "dimension" },
    "6": { "$value": "1.5rem", "$type": "dimension" },
    "7": { "$value": "1.75rem", "$type": "dimension" },
    "8": { "$value": "2rem", "$type": "dimension" },
    "9": { "$value": "2.25rem", "$type": "dimension" },
    "10": { "$value": "2.5rem", "$type": "dimension" },
    "11": { "$value": "2.75rem", "$type": "dimension" },
    "12": { "$value": "3rem", "$type": "dimension" },
    "14": { "$value": "3.5rem", "$type": "dimension" },
    "16": { "$value": "4rem", "$type": "dimension" },
    "20": { "$value": "5rem", "$type": "dimension" },
    "24": { "$value": "6rem", "$type": "dimension" },
    "28": { "$value": "7rem", "$type": "dimension" },
    "32": { "$value": "8rem", "$type": "dimension" },
    "36": { "$value": "9rem", "$type": "dimension" },
    "40": { "$value": "10rem", "$type": "dimension" },
    "44": { "$value": "11rem", "$type": "dimension" },
    "48": { "$value": "12rem", "$type": "dimension" },
    "52": { "$value": "13rem", "$type": "dimension" },
    "56": { "$value": "14rem", "$type": "dimension" },
    "60": { "$value": "15rem", "$type": "dimension" },
    "64": { "$value": "16rem", "$type": "dimension" },
    "72": { "$value": "18rem", "$type": "dimension" },
    "80": { "$value": "20rem", "$type": "dimension" },
    "96": { "$value": "24rem", "$type": "dimension" }
  }
}
```

## src/base/radius.json

```json
{
  "radius": {
    "$description": "Border radius scale",
    "none": { "$value": "0", "$type": "dimension" },
    "sm": { "$value": "0.25rem", "$type": "dimension" },
    "default": { "$value": "0.5rem", "$type": "dimension" },
    "md": { "$value": "0.5rem", "$type": "dimension" },
    "lg": { "$value": "0.75rem", "$type": "dimension" },
    "xl": { "$value": "1rem", "$type": "dimension" },
    "2xl": { "$value": "1.5rem", "$type": "dimension" },
    "3xl": { "$value": "2rem", "$type": "dimension" },
    "full": { "$value": "9999px", "$type": "dimension" }
  }
}
```

## src/base/typography.json

```json
{
  "font": {
    "family": {
      "$description": "Font family stacks",
      "sans": { "$value": "'Public Sans', ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'", "$type": "fontFamily" }
    },
    "size": {
      "$description": "Font size scale",
      "xs": { "$value": "0.75rem", "$type": "dimension" },
      "sm": { "$value": "0.875rem", "$type": "dimension" },
      "base": { "$value": "1rem", "$type": "dimension" },
      "lg": { "$value": "1.125rem", "$type": "dimension" },
      "xl": { "$value": "1.25rem", "$type": "dimension" },
      "2xl": { "$value": "1.5rem", "$type": "dimension" },
      "3xl": { "$value": "1.875rem", "$type": "dimension" },
      "4xl": { "$value": "2.25rem", "$type": "dimension" },
      "5xl": { "$value": "3rem", "$type": "dimension" }
    },
    "weight": {
      "$description": "Font weight scale",
      "normal": { "$value": "400", "$type": "fontWeight" },
      "medium": { "$value": "500", "$type": "fontWeight" },
      "semibold": { "$value": "600", "$type": "fontWeight" },
      "bold": { "$value": "700", "$type": "fontWeight" }
    },
    "lineHeight": {
      "$description": "Line height scale",
      "none": { "$value": "1", "$type": "number" },
      "tight": { "$value": "1.25", "$type": "number" },
      "snug": { "$value": "1.375", "$type": "number" },
      "normal": { "$value": "1.5", "$type": "number" },
      "relaxed": { "$value": "1.625", "$type": "number" },
      "loose": { "$value": "2", "$type": "number" }
    }
  }
}
```

> The Frontend Mentor challenge uses "Public Sans" as the primary font. Adjust
> the family stack as needed.

## src/base/shadow.json

```json
{
  "shadow": {
    "$description": "Box shadow scale (web-only but tracked as design token)",
    "none": { "$value": "none", "$type": "shadow" },
    "sm": { "$value": "0 1px 2px 0 rgb(0 0 0 / 0.05)", "$type": "shadow" },
    "default": { "$value": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)", "$type": "shadow" },
    "md": { "$value": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)", "$type": "shadow" },
    "lg": { "$value": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)", "$type": "shadow" },
    "xl": { "$value": "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)", "$type": "shadow" },
    "2xl": { "$value": "0 25px 50px -12px rgb(0 0 0 / 0.25)", "$type": "shadow" }
  }
}
```

## src/semantic/color.semantic.json

Maps base palette to UI roles. Components should use these, not base colors.

```json
{
  "color": {
    "semantic": {
      "$description": "Semantic tokens - use these in components",
      "background": {
        "default": { "$value": "{color.base.neutral.0}", "$type": "color" },
        "subtle": { "$value": "{color.base.neutral.50}", "$type": "color" },
        "muted": { "$value": "{color.base.neutral.100}", "$type": "color" }
      },
      "foreground": {
        "default": { "$value": "{color.base.neutral.900}", "$type": "color" },
        "muted": { "$value": "{color.base.neutral.500}", "$type": "color" },
        "subtle": { "$value": "{color.base.neutral.400}", "$type": "color" }
      },
      "primary": {
        "default": { "$value": "{color.base.amber.500}", "$type": "color" },
        "hover": { "$value": "{color.base.amber.600}", "$type": "color" },
        "foreground": { "$value": "{color.base.neutral.900}", "$type": "color" }
      },
      "secondary": {
        "default": { "$value": "{color.base.neutral.100}", "$type": "color" },
        "hover": { "$value": "{color.base.neutral.200}", "$type": "color" },
        "foreground": { "$value": "{color.base.neutral.900}", "$type": "color" }
      },
      "card": {
        "background": { "$value": "{color.base.neutral.0}", "$type": "color" },
        "foreground": { "$value": "{color.base.neutral.900}", "$type": "color" }
      },
      "border": {
        "default": { "$value": "{color.base.neutral.200}", "$type": "color" },
        "muted": { "$value": "{color.base.neutral.100}", "$type": "color" }
      },
      "input": {
        "background": { "$value": "{color.base.neutral.0}", "$type": "color" },
        "border": { "$value": "{color.base.neutral.300}", "$type": "color" },
        "placeholder": { "$value": "{color.base.neutral.400}", "$type": "color" }
      },
      "destructive": {
        "default": { "$value": "{color.base.red.500}", "$type": "color" },
        "hover": { "$value": "{color.base.red.600}", "$type": "color" },
        "foreground": { "$value": "{color.base.neutral.0}", "$type": "color" }
      },
      "success": {
        "default": { "$value": "{color.base.green.500}", "$type": "color" },
        "hover": { "$value": "{color.base.green.600}", "$type": "color" },
        "foreground": { "$value": "{color.base.neutral.0}", "$type": "color" }
      }
    }
  }
}
```

## src/aliases/color.aliases.json

Flat names for Tailwind class consumption (`bg-primary`, `text-foreground`, etc.).
These reference semantic tokens, never base tokens directly.

```json
{
  "color": {
    "$description": "Flat aliases for Tailwind CSS classes — reference semantic tokens only",
    "background": { "$value": "{color.semantic.background.default}", "$type": "color" },
    "background-subtle": { "$value": "{color.semantic.background.subtle}", "$type": "color" },
    "background-muted": { "$value": "{color.semantic.background.muted}", "$type": "color" },
    "foreground": { "$value": "{color.semantic.foreground.default}", "$type": "color" },
    "foreground-muted": { "$value": "{color.semantic.foreground.muted}", "$type": "color" },
    "foreground-subtle": { "$value": "{color.semantic.foreground.subtle}", "$type": "color" },
    "primary": { "$value": "{color.semantic.primary.default}", "$type": "color" },
    "primary-hover": { "$value": "{color.semantic.primary.hover}", "$type": "color" },
    "primary-foreground": { "$value": "{color.semantic.primary.foreground}", "$type": "color" },
    "secondary": { "$value": "{color.semantic.secondary.default}", "$type": "color" },
    "secondary-hover": { "$value": "{color.semantic.secondary.hover}", "$type": "color" },
    "secondary-foreground": { "$value": "{color.semantic.secondary.foreground}", "$type": "color" },
    "card": { "$value": "{color.semantic.card.background}", "$type": "color" },
    "card-foreground": { "$value": "{color.semantic.card.foreground}", "$type": "color" },
    "border": { "$value": "{color.semantic.border.default}", "$type": "color" },
    "border-muted": { "$value": "{color.semantic.border.muted}", "$type": "color" },
    "input": { "$value": "{color.semantic.input.border}", "$type": "color" },
    "destructive": { "$value": "{color.semantic.destructive.default}", "$type": "color" },
    "destructive-hover": { "$value": "{color.semantic.destructive.hover}", "$type": "color" },
    "destructive-foreground": { "$value": "{color.semantic.destructive.foreground}", "$type": "color" },
    "success": { "$value": "{color.semantic.success.default}", "$type": "color" },
    "success-hover": { "$value": "{color.semantic.success.hover}", "$type": "color" },
    "success-foreground": { "$value": "{color.semantic.success.foreground}", "$type": "color" },
    "muted": { "$value": "{color.semantic.background.muted}", "$type": "color" },
    "muted-foreground": { "$value": "{color.semantic.foreground.muted}", "$type": "color" }
  }
}
```

## Three-Layer Color Architecture

```
base/color.json          raw hex    (#f59e0b)
     |
     v
semantic/color.semantic  role alias ({color.base.amber.500})
     |
     v
aliases/color.aliases    flat name  ({color.semantic.primary.default})
```

- **Base**: designers edit these when rebranding
- **Semantic**: maps palette to UI roles (primary, destructive, etc.)
- **Aliases**: flattens deep paths into Tailwind-friendly names (`bg-primary`)

Components always consume semantic or alias tokens, never base.
