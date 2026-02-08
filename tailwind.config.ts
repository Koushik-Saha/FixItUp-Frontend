import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	container: {
  		center: true,
  		padding: {
  			DEFAULT: '1rem',
  			sm: '1.5rem',
  			lg: '2rem'
  		},
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
  			retail: {
  				primary: '#3B82F6',
  				dark: '#2563EB',
  				light: '#60A5FA',
  				accent: '#8B5CF6',
  				'accent-light': '#A78BFA'
  			},
  			business: {
  				primary: '#10B981',
  				dark: '#059669',
  				light: '#34D399',
  				accent: '#F59E0B',
  				'accent-dark': '#D97706'
  			},
  			neutral: {
  				'50': '#FEFEFE',
  				'100': '#F9FAFB',
  				'200': '#F3F4F6',
  				'300': '#E5E7EB',
  				'400': '#D1D5DB',
  				'500': '#9CA3AF',
  				'600': '#6B7280',
  				'700': '#404040',
  				'800': '#262626',
  				'900': '#1A1A1A',
  				'950': '#0A0A0A'
  			},
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
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'var(--font-inter)',
  				'Inter',
  				'system-ui',
  				'sans-serif'
  			],
  			mono: [
  				'var(--font-jetbrains)',
  				'JetBrains Mono',
  				'monospace'
  			]
  		},
  		fontSize: {
  			display: [
  				'56px',
  				{
  					lineHeight: '64px',
  					letterSpacing: '-0.02em',
  					fontWeight: '700'
  				}
  			],
  			h1: [
  				'48px',
  				{
  					lineHeight: '56px',
  					letterSpacing: '-0.01em',
  					fontWeight: '700'
  				}
  			],
  			h2: [
  				'36px',
  				{
  					lineHeight: '44px',
  					letterSpacing: '-0.01em',
  					fontWeight: '600'
  				}
  			],
  			h3: [
  				'28px',
  				{
  					lineHeight: '36px',
  					fontWeight: '600'
  				}
  			],
  			h4: [
  				'20px',
  				{
  					lineHeight: '28px',
  					fontWeight: '600'
  				}
  			],
  			'body-lg': [
  				'18px',
  				{
  					lineHeight: '28px',
  					fontWeight: '400'
  				}
  			],
  			body: [
  				'16px',
  				{
  					lineHeight: '24px',
  					fontWeight: '400'
  				}
  			],
  			'body-sm': [
  				'14px',
  				{
  					lineHeight: '20px',
  					fontWeight: '400'
  				}
  			],
  			caption: [
  				'12px',
  				{
  					lineHeight: '16px',
  					fontWeight: '400'
  				}
  			]
  		},
  		spacing: {
  			'18': '4.5rem',
  			'88': '22rem',
  			'128': '32rem'
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
  			'slide-up': {
  				'0%': {
  					transform: 'translateY(20px)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'translateY(0)',
  					opacity: '1'
  				}
  			},
  			'slide-down': {
  				'0%': {
  					transform: 'translateY(-20px)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'translateY(0)',
  					opacity: '1'
  				}
  			},
  			'slide-right': {
  				'0%': {
  					transform: 'translateX(-20px)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'translateX(0)',
  					opacity: '1'
  				}
  			},
  			'fade-in': {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			'scale-in': {
  				'0%': {
  					transform: 'scale(0.95)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'scale(1)',
  					opacity: '1'
  				}
  			},
  			float: {
  				'0%, 100%': {
  					transform: 'translateY(0)'
  				},
  				'50%': {
  					transform: 'translateY(-10px)'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'slide-up': 'slide-up 0.3s ease-out',
  			'slide-down': 'slide-down 0.3s ease-out',
  			'slide-right': 'slide-right 0.3s ease-out',
  			'fade-in': 'fade-in 0.3s ease-out',
  			'scale-in': 'scale-in 0.2s ease-out',
  			float: 'float 3s ease-in-out infinite'
  		},
  		boxShadow: {
  			xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
  			sm: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  			md: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.05)',
  			lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
  			xl: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
  			'2xl': '0 25px 50px rgba(0, 0, 0, 0.15)',
  			inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
  			retail: '0 8px 24px rgba(59, 130, 246, 0.15)',
  			business: '0 8px 24px rgba(16, 185, 129, 0.15)'
  		},
  		backgroundImage: {
  			'gradient-retail': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  			'gradient-business': 'linear-gradient(135deg, #10b981 0%, #f59e0b 100%)',
  			'gradient-hero': 'linear-gradient(180deg, #F9FAFB 0%, #FFFFFF 100%)'
  		},
  		transitionProperty: {
  			height: 'height',
  			spacing: 'margin, padding'
  		}
  	}
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
