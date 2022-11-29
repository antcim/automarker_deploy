import { createTheme } from 'react-data-table-component';

// createTheme creates a new theme named solarized that overrides the build in dark theme
createTheme('customDark', {
    text: {
        primary: '#FFFFFF',
        secondary: 'rgba(255, 255, 255, 0.7)',
        disabled: 'rgba(0,0,0,.12)',
    },
    background: {
        default: '#212529',
    },
    context: {
        background: '#cb4b16',
        text: '#FFFFFF',
    },
    divider: {
        default: '#373b3e',
    },
    
    selected: {
        default: '#2c3034',
        text: '#FFFFFF',
    },
    highlightOnHover: {
        default: '#323539',
        text: '#FFFFFF',
    },
    striped: {
		default: '#2c3034',
		text: '#FFFFFF',
	},
    
}, 'dark');