# ARGO Data Chatbot

An AI-powered conversational system for exploring and visualizing oceanographic data from the ARGO float network. This application provides an intuitive interface for querying temperature, salinity, and biogeochemical data from over 3,800 active floats worldwide.

## Features

### 🤖 FloatChat - AI Assistant
- Natural language queries for oceanographic data
- Real-time responses with contextual data visualization
- Sample queries for easy exploration
- Interactive chat interface with typing indicators
- ARGO-specific data interpretation and analysis

### 📊 Interactive Dashboard
- Real-time statistics from active ARGO floats
- Animated metric cards with live data updates
- Recent profile monitoring and status tracking
- Integration status for external services
- Provision for Leafly dashboard embedding

### 🗺️ Interactive Maps
- Global ARGO float position visualization
- Layer controls for different data types (temperature, salinity, bathymetry)
- Float selection and detailed information panels
- Trajectory visualization and historical data
- OpenStreetMap integration ready for deployment

### 🎨 Dynamic UI
- Ocean-themed animated background with mouse interaction
- Smooth transitions between different views
- Responsive design optimized for all screen sizes
- Clean, minimal interface with professional styling
- Real-time visual feedback and loading states

## Technology Stack

- **Frontend**: React.js with Next.js 14
- **Styling**: Tailwind CSS v4 with custom design tokens
- **UI Components**: shadcn/ui component library
- **Animations**: CSS animations with Tailwind utilities
- **Icons**: Lucide React icons
- **TypeScript**: Full type safety throughout the application

## Project Structure

\`\`\`
├── app/
│   ├── globals.css          # Global styles and design tokens
│   ├── layout.tsx           # Root layout with font configuration
│   └── page.tsx             # Main application page
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── dashboard.tsx        # Dashboard view with analytics
│   ├── float-chat.tsx       # AI chatbot component
│   ├── maps.tsx             # Interactive maps interface
│   └── water-background.tsx # Animated background component
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions
└── README.md               # This file
\`\`\`

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm package manager

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd argo-data-chatbot
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Building for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Usage Guide

### FloatChat Interface

1. **Starting a Conversation**
   - Click on the chat input field
   - Type natural language queries about ARGO data
   - Use sample queries for quick exploration

2. **Sample Queries**
   - "Show me salinity profiles near the equator in March 2023"
   - "Compare BGC parameters in the Arabian Sea for the last 6 months"
   - "What are the nearest ARGO floats to coordinates 25.4°N, 157.8°W?"
   - "Display temperature trends in the Pacific Ocean"
   - "Find floats with recent oxygen measurements"

### Dashboard Navigation

1. **Accessing the Dashboard**
   - Click the "Dashboard" button in the top navigation
   - The chat interface will slide to the left
   - Dashboard content appears on the right side

2. **Dashboard Features**
   - View real-time statistics from active floats
   - Monitor recent profile updates
   - Check integration status for external services
   - Access animated metric cards with live data

### Maps Interface

1. **Opening the Maps View**
   - Click the "Maps" button in the navigation
   - Interactive map interface replaces the dashboard
   - Chat remains accessible on the left side

2. **Map Controls**
   - Toggle different data layers (floats, trajectories, temperature, salinity)
   - Search for specific floats by ID or location
   - Click on float markers for detailed information
   - Use zoom controls for navigation

## Integration Setup

### Leafly Dashboard Integration

The application is prepared for Leafly dashboard integration:

1. **Configuration Location**: `components/dashboard.tsx`
2. **Integration Area**: Designated placeholder in the dashboard view
3. **Setup**: Click "Configure Leafly Integration" button when ready

### OpenStreetMap Integration

Map functionality is ready for OpenStreetMap integration:

1. **Configuration Location**: `components/maps.tsx`
2. **Integration Area**: Map container with placeholder
3. **Setup**: Click "Configure Map Integration" button when ready

## Customization

### Design Tokens

The application uses a comprehensive design token system in `app/globals.css`:

- **Colors**: Ocean-themed blue and teal palette
- **Typography**: Geist Sans and Geist Mono fonts
- **Spacing**: Consistent spacing scale
- **Animations**: Smooth transitions and hover effects

### Component Styling

All components use Tailwind CSS classes with semantic design tokens:

\`\`\`css
/* Example usage */
bg-background text-foreground
bg-card text-card-foreground
bg-primary text-primary-foreground
\`\`\`

### Animation Customization

Modify animation durations and effects in component files:

- `water-background.tsx`: Background animations
- `dashboard.tsx`: Metric card animations
- `maps.tsx`: Map interface animations

## API Integration

### ARGO Data API

The application is structured to integrate with ARGO data APIs:

1. **Data Models**: Defined in component interfaces
2. **Mock Data**: Sample data for development and testing
3. **API Endpoints**: Ready for real ARGO data integration

### Vector Database Integration

Prepared for vector database integration for AI queries:

1. **Query Processing**: Natural language to database queries
2. **Response Generation**: Contextual responses with data
3. **Caching**: Optimized data retrieval and storage

## Development

### Adding New Features

1. **Components**: Add new components in the `components/` directory
2. **Styling**: Use existing design tokens for consistency
3. **State Management**: Use React hooks for local state
4. **Animations**: Follow existing animation patterns

### Code Style

- Use TypeScript for all new code
- Follow existing naming conventions
- Use semantic HTML elements
- Implement proper accessibility features
- Add proper error handling and loading states

## Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**
   - Import project to Vercel
   - Configure build settings (auto-detected)

2. **Environment Variables**
   - Add any required API keys
   - Configure integration endpoints

3. **Deploy**
   - Automatic deployment on git push
   - Preview deployments for pull requests

### Other Platforms

The application can be deployed to any platform supporting Next.js:

- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or issues:

1. Check the documentation above
2. Review existing issues in the repository
3. Create a new issue with detailed information
4. Contact the development team

## Acknowledgments

- ARGO Float Program for oceanographic data
- shadcn/ui for the component library
- Tailwind CSS for the styling framework
- Next.js team for the React framework
- Vercel for hosting and deployment platform
