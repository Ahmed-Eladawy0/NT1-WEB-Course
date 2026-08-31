# 👥 Users Management System (Component Communication)

A modern Angular application built to demonstrate state-of-the-art **Component Communication** using Angular v22 Signals. This project showcases how parent and child components seamlessly share data and events.

## ✨ Features & Concepts Applied

- **Parent to Child (`input()`):** The parent component dynamically passes user data down to the child cards.
- **Child to Parent (`output()`):** Each user card emits a custom event containing its specific ID when the "Delete" button is clicked, prompting the parent to update the UI instantly.
- **Content Projection (`<ng-content>`):** Dynamic HTML content (like the "User Information" label) is injected from the parent directly into the child component's layout.
- **Modern Control Flow:** Utilizes `@for` for efficient list rendering and `track` for optimized DOM updates.

## 📇 Current Team Roster

The application state is initialized with the following custom user base:

- **Adawy** - _Admin_
- **Jana** - _User_
- **Soli** - _Admin_
- **Sara** - _User_
- **Dana** - _User_

## 🚀 Tech Stack

- Framework: Angular (v22)
- Architecture: Standalone Components
- Reactivity: Signals (`input.required`, `output`)
- Styling: Custom CSS (Flexbox for clean card layouts)

## 🛠️ How to Run the Project

1. Open the project folder in your terminal.
2. Install the necessary dependencies:
   ```bash
   npm install

   ```
3. Start the local development server:
   Bash
   ng serve -o

4. The application will open automatically in your browser at http://localhost:4200/.

Developed by Ahmed Eladawy
Cybersecurity Engineering Student
