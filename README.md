Indian Railway Manuals Quiz App
A simple, interactive quiz website for learning and testing knowledge of nine key Indian Railway manuals. Built with HTML, CSS, and JavaScript, this app supports multiple quiz sets, each corresponding to a different manual.

🚄 Manuals Covered
Indian Railway Works Manual

Indian Railway P-way Manual

Indian Railway Schedule of Dimensions

Indian Railway Engineering Code

Indian Railway Small Track Machine Manual

Indian Railway USFD Manual

Indian Railway FBW Manual

Indian Railway Store Manual

Indian Railway Account Manual

📝 Features
Clean, responsive interface

Separate quiz for each manual

Multiple-choice questions

Instant feedback and scoring

Easily update questions via JSON files

📁 Project Structure
text
.
├── index.html        # Home page with manual selection
├── quiz.html         # Quiz interface (one for all manuals)
├── style.css         # Styling for all pages
├── script.js         # Quiz logic, loads questions from JSON
├── irwm-questions.json      # Example: Works Manual questions
├── irpwm-questions.json     # Example: P-way Manual questions
├── ...               # Additional JSON files for other manuals
🚀 Getting Started
1. Clone or Fork the Repository
bash
git clone https://github.com/yourusername/your-repo-name.git
2. Add or Edit Questions
Each manual has its own JSON file (e.g., irwm-questions.json).

Each file contains an array of questions, for example:

json
[
  {
    "question": "Which is the largest animal in the world?",
    "answers": [
      { "text": "Shark", "correct": false },
      { "text": "Blue Whale", "correct": true },
      { "text": "Elephant", "correct": false },
      { "text": "Giraffe", "correct": false }
    ]
  }
]
3. Run Locally
Open index.html in your browser.
Select a manual to start its quiz.

4. Deploy on GitHub Pages
Go to your repository settings

Enable GitHub Pages from the main branch, root folder

Access your site at https://yourusername.github.io/your-repo-name/

✨ Customization
To add more manuals, create a new JSON file and add a button in index.html.

Update questions any time by editing the relevant JSON file.

🛠️ Technologies Used
HTML5

CSS3 (Poppins font)

Vanilla JavaScript

📄 License
This project is open-source and available under the MIT License.

Enjoy learning with the Indian Railway Manuals Quiz App!
