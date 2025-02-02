
import { definePreset } from "@primevue/themes";
import Aura from "@primevue/themes/aura";
import tailwindConfig from '../tailwind.config.js'
import resolveConfig from 'tailwindcss/resolveConfig'

const fullConfig = resolveConfig(tailwindConfig)

export const PrimePreset = definePreset(Aura, {
    primitive: {
        borderRadius: {
            none: "0",
            xs: "2px",
            sm: "4px",
            md: "6px",
            lg: "8px",
            xl: "12px"
        },
        emerald: fullConfig.theme.colors.primary,
        green: fullConfig.theme.colors.secondary,
        lime: fullConfig.theme.colors.lime,
        red: fullConfig.theme.colors.red,
        orange: fullConfig.theme.colors.orange,
        amber: fullConfig.theme.colors.amber,
        yellow: fullConfig.theme.colors.yellow,
        teal: fullConfig.theme.colors.teal,
        cyan: fullConfig.theme.colors.cyan,
        sky: fullConfig.theme.colors.sky,
        blue: fullConfig.theme.colors.blue,
        indigo: fullConfig.theme.colors.indigo,
        violet: fullConfig.theme.colors.violet,
        purple: fullConfig.theme.colors.purple,
        fuchsia: fullConfig.theme.colors.fuchsia,
        pink: fullConfig.theme.colors.pink,
        rose: fullConfig.theme.colors.rose,
        slate: fullConfig.theme.colors.slate,
        gray: fullConfig.theme.colors.gray,
        zinc: fullConfig.theme.colors.zinc,
        neutral: fullConfig.theme.colors.neutral,
        stone: fullConfig.theme.colors.stone,
    },
    semantic: {
        transitionDuration: "0.4s",
        focusRing: {
            width: "0",
            style: "none",
            color: "transparent",
            offset: "0"
        },
        disabledOpacity: "0.6",
        iconSize: "1rem",
        anchorGutter: "2px",
        primary: fullConfig.theme.colors.primary,
        formField: {
            paddingX: "0.75rem",
            paddingY: "0.625rem",
            sm: {
                fontSize: "0.875rem",
                paddingX: "0.625rem",
                paddingY: "0.5rem"
            },
            lg: {
                fontSize: "1rem",
                paddingX: "0.875rem",
                paddingY: "0.75rem"
            },
            borderRadius: "{border.radius.md}",
            focusRing: {
                width: "{focus.ring.width}",
                style: "{focus.ring.style}",
                color: "#c5dcff",
                offset: "{focus.ring.offset}",
                shadow: "{focus.ring.shadow}"
            },
            transitionDuration: "{transition.duration}"
        },
        list: {
            padding: "0.5rem 0",
            gap: "0",
            header: {
                padding: "0.625rem 1rem 0 1rem"
            },
            option: {
                padding: "0.625rem 1rem",
                borderRadius: "0"
            },
            optionGroup: {
                padding: "0.625rem 1rem",
                fontWeight: "600"
            }
        },
        content: {
            borderRadius: "{border.radius.md}"
        },
        mask: {
            transitionDuration: "0.15s"
        },
        navigation: {
            list: {
                padding: "0.5rem 0",
                gap: "0"
            },
            item: {
                padding: "0.625rem 1rem",
                borderRadius: "0",
                gap: "0.5rem"
            },
            submenuLabel: {
                padding: "0.625rem 1rem",
                fontWeight: "600"
            },
            submenuIcon: {
                size: "0.875rem"
            }
        },
        overlay: {
            select: {
                borderRadius: "{border.radius.md}",
                shadow: "0 2px 12px 0 rgba(0, 0, 0, 0.1)"
            },
            popover: {
                borderRadius: "{border.radius.md}",
                padding: "1rem",
                shadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
            },
            modal: {
                borderRadius: "{border.radius.xl}",
                padding: "1.5rem",
                shadow: "0 1px 3px rgba(0, 0, 0, 0.3)"
            },
            navigation: {
                shadow: "0 2px 12px 0 rgba(0, 0, 0, 0.1)"
            }
        },
        colorScheme: {
            light: {
                surface: fullConfig.theme.colors.slate,
                primary: {
                    color: "{primary.500}",
                    contrastColor: "#ffffff",
                    hoverColor: "{primary.600}",
                    activeColor: "{primary.700}"
                },
                highlight: {
                    background: "{primary.50}",
                    focusBackground: "{primary.100}",
                    color: "{primary.700}",
                    focusColor: "{primary.800}"
                },
                focusRing: {
                    shadow: "0 0 0 0.2rem {primary.200}"
                },
                mask: {
                    background: "rgba(0,0,0,0.4)",
                    color: "{surface.200}"
                },
                formField: {
                    background: "{surface.0}",
                    disabledBackground: "{surface.200}",
                    filledBackground: "{surface.50}",
                    filledHoverBackground: "{surface.50}",
                    filledFocusBackground: "{surface.0}",
                    borderColor: "{surface.300}",
                    hoverBorderColor: "{primary.color}",
                    focusBorderColor: "{primary.color}",
                    invalidBorderColor: "{red.400}",
                    color: "{surface.700}",
                    disabledColor: "{surface.500}",
                    placeholderColor: "{surface.500}",
                    invalidPlaceholderColor: "{red.600}",
                    floatLabelColor: "{surface.500}",
                    floatLabelFocusColor: "{primary.600}",
                    floatLabelActiveColor: "{surface.500}",
                    floatLabelInvalidColor: "{form.field.invalid.placeholder.color}",
                    iconColor: "{surface.500}",
                    shadow: "none"
                },
                text: {
                    color: "{surface.700}",
                    hoverColor: "{surface.800}",
                    mutedColor: "{surface.500}",
                    hoverMutedColor: "{surface.600}"
                },
                content: {
                    background: "{surface.0}",
                    hoverBackground: "{surface.100}",
                    borderColor: "{surface.200}",
                    color: "{text.color}",
                    hoverColor: "{text.hover.color}"
                },
                overlay: {
                    select: {
                        background: "{surface.0}",
                        borderColor: "{surface.200}",
                        color: "{text.color}"
                    },
                    popover: {
                        background: "{surface.0}",
                        borderColor: "{surface.200}",
                        color: "{text.color}"
                    },
                    modal: {
                        background: "{surface.0}",
                        borderColor: "{surface.200}",
                        color: "{text.color}"
                    }
                },
                list: {
                    option: {
                        focusBackground: "{surface.100}",
                        selectedBackground: "{highlight.background}",
                        selectedFocusBackground: "{highlight.focus.background}",
                        color: "{text.color}",
                        focusColor: "{text.hover.color}",
                        selectedColor: "{highlight.color}",
                        selectedFocusColor: "{highlight.focus.color}",
                        icon: {
                            color: "{surface.400}",
                            focusColor: "{surface.500}"
                        }
                    },
                    optionGroup: {
                        background: "transparent",
                        color: "{text.color}"
                    }
                },
                navigation: {
                    item: {
                        focusBackground: "{surface.100}",
                        activeBackground: "{surface.100}",
                        color: "{text.color}",
                        focusColor: "{text.hover.color}",
                        activeColor: "{text.hover.color}",
                        icon: {
                            color: "{surface.400}",
                            focusColor: "{surface.500}",
                            activeColor: "{surface.500}"
                        }
                    },
                    submenuLabel: {
                        background: "transparent",
                        color: "{text.color}"
                    },
                    submenuIcon: {
                        color: "{surface.400}",
                        focusColor: "{surface.500}",
                        activeColor: "{surface.500}"
                    }
                }
            },
        }
    }
});
