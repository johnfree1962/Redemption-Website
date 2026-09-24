# MediCare Pharmacy Website

A comprehensive, professional pharmacy website built with HTML, CSS, and JavaScript.

## Project Structure

```
New Pharmacy System/
├── index.html              # Main homepage
├── services.html           # Services page
├── products.html           # Products catalog
├── about.html              # About Us page
├── contact.html            # Contact page
├── styles.css              # Global styling
├── script.js               # JavaScript functionality
└── README.md               # This file
```

## Features

### 📄 Pages

1. **Homepage (index.html)**
   - Hero section with call-to-action buttons
   - Statistics section showcasing achievements
   - Featured services with icons
   - Featured products grid
   - Why choose us section
   - Customer testimonials
   - Newsletter signup CTA
   - Professional footer

2. **Services (services.html)**
   - Prescription filling
   - Home delivery
   - Health consultations
   - Vaccination services
   - Health screening
   - Wellness programs
   - Specialized services information
   - Operating hours

3. **Products (products.html)**
   - Product catalog with filtering
   - Multiple product categories
   - Pain relief medications
   - Vitamins & supplements
   - Cold & flu products
   - Skincare products
   - Digestive health items
   - Product pricing and details

4. **About Us (about.html)**
   - Company history
   - Mission, vision, and values
   - Team profiles
   - Achievements and certifications
   - Community commitment
   - Social responsibility initiatives

5. **Contact (contact.html)**
   - Contact form with validation
   - Multiple contact methods
   - Business hours
   - Social media links
   - FAQ section
   - Map information

### 🎨 Design Features

- **Responsive Design**: Mobile-first approach, works on all screen sizes
- **Modern Color Scheme**: Professional blues, reds, and greens
- **Smooth Animations**: Fade-in effects on scroll
- **Interactive Elements**: Hover effects, smooth transitions
- **Font Awesome Icons**: 200+ professional icons included
- **Accessibility**: Semantic HTML, proper heading hierarchy

### ⚙️ Functionality

- **Mobile Menu**: Hamburger menu for small screens
- **Smooth Scrolling**: Smooth navigation between sections
- **Form Validation**: Contact form with email validation
- **Product Filtering**: Filter products by category
- **Animation on Scroll**: Elements animate as they come into view
- **Responsive Navigation**: Sticky navbar that adapts to screen size

## Getting Started

1. Open any HTML file in your web browser
2. Or set up a local web server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   http-server
   ```
3. Navigate to `http://localhost:8000` in your browser

## Customization

### Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #2c5f8d;      /* Main blue */
    --secondary-color: #e74c3c;    /* Red accent */
    --accent-color: #27ae60;       /* Green */
    --light-bg: #ecf0f1;           /* Light grey */
    --dark-text: #2c3e50;          /* Dark text */
}
```

### Content
- Update pharmacy name, address, phone in all files
- Modify product listings in `products.html`
- Update team information in `about.html`
- Customize services in `services.html`

### Images
Replace icon fonts with actual images:
1. Add images to the project folder
2. Update `<i class="fas fa-..."></i>` tags with `<img>` tags

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Lightweight HTML/CSS/JS - no dependencies except Font Awesome
- Fast loading times
- Optimized for mobile devices
- SEO-friendly structure

## Contact Form

The contact form currently shows a success alert. To make it fully functional:

1. **Using a Backend Service:**
   - Set up a backend service (Node.js, PHP, etc.)
   - Update form action and method

2. **Using FormSubmit.co (Free):**
   - Update form action to: `https://formsubmit.co/your@email.com`
   - Change method to: `POST`

3. **Using Netlify Forms (Free with Netlify hosting):**
   - Deploy to Netlify
   - Add `netlify` attribute to form

## Deployment

### Easy Deployment Options:

1. **Netlify** (Free)
   - Drag and drop folder
   - Automatic SSL/HTTPS

2. **GitHub Pages** (Free)
   - Push to GitHub
   - Enable GitHub Pages in settings

3. **Standard Web Hosting**
   - Upload all files via FTP
   - No special configuration needed

## SEO Optimization

Already included:
- Meta descriptions
- Proper heading hierarchy
- Semantic HTML
- Open Graph meta tags ready
- Mobile viewport settings

## Future Enhancements

- Add backend for prescription management
- Implement user accounts
- Add online ordering system
- Integrate payment gateway
- Add appointment booking
- Create admin dashboard
- Add chat support
- Implement loyalty program tracking

## License

This website template is free to use for your pharmacy business.

## Support

For issues or questions, contact: support@medicarepharmacy.com

---

**Created:** February 2026
**Version:** 1.0
**Status:** Production Ready
