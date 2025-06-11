
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Nova paleta de cores para Doce Doçura
				'brand-brown': {
					50: '#faf9f7',
					100: '#f3f1ec',
					200: '#e7e2d9',
					300: '#d4cbbc',
					400: '#beb09a',
					500: '#a8957d',
					600: '#8a7760',
					700: '#6b5c47',
					800: '#4B3821', // Cor primária
					900: '#3a2b1a'
				},
				'brand-yellow': {
					50: '#fffef0',
					100: '#fffacc',
					200: '#fff599',
					300: '#ffeb4d',
					400: '#FFCC00', // Cor secundária
					500: '#e6b800',
					600: '#cc9900',
					700: '#b38600',
					800: '#997300',
					900: '#806000'
				},
				'brand-neutral': {
					50: '#fafafa',
					100: '#f5f5f5',
					200: '#e5e5e5',
					300: '#d4d4d4',
					400: '#a3a3a3',
					500: '#737373',
					600: '#525252',
					700: '#404040',
					800: '#262626',
					900: '#171717'
				},

				'primaria': '#4B3821',   // Marrom
				'secundaria': '#FFCC00', // Amarelo
				neutra: {
					'branco': '#FFFFFF',
					'cinza1': '#F5F5F5',
					'cinza2': '#E5E5E5',
					'cinza3': '#D4D4D4',
					'cinza4': '#A3A3A3',
					'cinza5': '#737373',
				},

			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					"0%": {
						opacity: "0",
						transform: "translateY(10px)"
					},
					"100%": {
						opacity: "1",
						transform: "translateY(0)"
					}
				},
				'brand-glow': {
					"0%, 100%": {
						boxShadow: "0 0 20px rgba(255, 204, 0, 0.3)"
					},
					"50%": {
						boxShadow: "0 0 30px rgba(255, 204, 0, 0.5)"
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'brand-glow': 'brand-glow 2s ease-in-out infinite'
			},
			backgroundImage: {
				'brand-gradient': 'linear-gradient(135deg, #fafafa 0%, #fff599 100%)',
				'brand-gradient-dark': 'linear-gradient(135deg, #4B3821 0%, #FFCC00 100%)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
