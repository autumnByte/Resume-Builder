# Resume Builder

## Overview

The **Interactive Resume Builder** is a responsive, web-based application that allows users to create and preview a professional resume in real-time. Users can input personal information, education, skills, and experience, and see a live preview of their resume with smooth animations and a pastel-themed design.

## Features

* **Real-time Resume Preview:** As users type or add information, the resume updates instantly.
* **Dynamic Sections:** Add multiple rows for education and experience.
* **Skill Tags:** Select from predefined skills or add custom skills.
* **Responsive Design:** Works well on desktop, tablet, and mobile screens.
* **CSS Animations:** Smooth transitions and hover effects for enhanced UX.
* **Progress Bar:** Shows form completion percentage.
* **Download as PDF:** Export the resume as a PDF directly from the browser.
* **Clear Form:** Reset the form and preview at any time.

## Technologies Used

* **HTML5** - Structure and form elements
* **CSS3** - Styling, animations, and responsive design
* **JavaScript** - Real-time updates, dynamic sections, and PDF generation
* **html2pdf.js** - Client-side PDF export (loaded via CDN)

## File Structure

```
interactive-resume-builder/
│
├── index.html      # Main HTML file
├── styles.css      # Pastel-themed CSS styles
├── script.js       # JavaScript for interactivity
└── README.md       # Project documentation
```

## Usage

1. Open `index.html` in a web browser.
2. Fill in your personal information in the form on the left.
3. Add education and experience using the `+ Add` buttons.
4. Select skills or add custom skills.
5. Watch the live preview on the right update in real-time.
6. Use the **Download PDF** button to save your resume.
7. Use the **Clear Form** button to reset all fields.

## Customization

* **Pastel Theme:** Adjust the color variables in `styles.css` to change the pastel palette.
* **Skills:** Modify `defaultSkills` in `script.js` to change the predefined skill options.
* **Template:** Update HTML templates in `index.html` for education and experience formatting.

## Notes

* The PDF download uses `html2pdf.js` CDN; ensure you have internet access the first time to load the library.
* The application is fully client-side; no backend is required.

## License

This project is free to use and modify for educational and personal purposes.
