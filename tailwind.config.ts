
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
				// Nova paleta de cores mais claras para Doce Doçura
				'brand-brown': {
					50: '#fdfcfb',
					100: '#f8f6f2',
					200: '#f2ede4',
					300: '#e8dfd1',
					400: '#ddd0b8',
					500: '#d1c19f',
					600: '#baa882',
					700: '#9d8e6b',
					800: '#7a6d4f', // Cor primária mais clara
					900: '#5c5139'
				},
				'brand-yellow': {
					50: '#fffef7',
					100: '#fffded',
					200: '#fffbd6',
					300: '#fff7b8',
					400: '#fff28a', // Cor secundária mais clara
					500: '#ffe85c',
					600: '#ffd92e',
					700: '#f5c500',
					800: '#ccad00',
					900: '#a39200'
				},
				'brand-neutral': {
					50: '#fdfdfd',
					100: '#f9f9f9',
					200: '#f0f0f0',
					300: '#e6e6e6',
					400: '#c4c4c4',
					500: '#9e9e9e',
					600: '#757575',
					700: '#616161',
					800: '#424242',
					900: '#212121'
				},

				'primaria': '#7a6d4f',   // Marrom mais claro
				'secundaria': '#fff28a', // Amarelo mais claro
				neutra: {
					'branco': '#FFFFFF',
					'cinza1': '#f9f9f9',
					'cinza2': '#f0f0f0',
					'cinza3': '#e6e6e6',
					'cinza4': '#c4c4c4',
					'cinza5': '#9e9e9e',
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
						boxShadow: "0 0 20px rgba(255, 242, 138, 0.3)"
					},
					"50%": {
						boxShadow: "0 0 30px rgba(255, 242, 138, 0.5)"
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'brand-glow': 'brand-glow 2s ease-in-out infinite'
			},
			backgroundImage: {
				'brand-gradient': 'linear-gradient(135deg, #fdfdfd 0%, #fffbd6 100%)',
				'brand-gradient-dark': 'linear-gradient(135deg, #7a6d4f 0%, #fff28a 100%)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
