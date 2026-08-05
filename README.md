# Zād: The Preacher's Provision

Build a comprehensive Islamic mobile web app named "Zad Al-Duat" (زاد الدعاة) designed for Islamic preachers and general users, including a complete Admin Dashboard (لوحة تحكم) to manage all content. 



The app must support Arabic text perfectly (using Cairo font and RTL direction) with a clean, spiritual emerald green and white color theme.



Please implement the following structure and features:



1. Mobile Client Views (with Bottom Navigation):

- Home Page: Features a beautiful header banner ("زادك العلمي والدعوي في مكان واحد"), quick-action buttons (Favorites, Friday Khutbah, Azkar, Tasbih), an App Sections grid, and a "Hadith of the Day" card.

- Friday Khutbah (خطب الجمعة): Categorized by topics, with text display tools (adjust font size, toggle night mode, and save to favorites).

- Quran & Hadith: A clean interface for reading, searching, and browsing verses or selected prophetic sayings.

- Azkar & Adhiya: Contains daily Azkar (Hisn al-Muslim) and an interactive electronic Tasbih counter.

- Favorites (المفضلة): Displays all saved texts for offline reading.



2. Admin Dashboard (لوحة تحكم كاملة):

- Secure Admin Login: A dedicated page/route (e.g., /admin) to access management tools.

- Content Management (CRUD): Full interfaces to Add, Edit, and Delete:

  * Friday Khutbahs (Title, detailed text content, date, category).

  * Daily Azkar & Supplications.

  * Main categories or sections.

- Hadith of the Day Controller: A simple input field to update the featured Hadith shown on the user's home page instantly.



3. Core Functionality & UI:

- Implement a global state or settings for Night Mode and Font Size scaling across all reading pages.

- Highly responsive mobile-first UI that feels like a native application when saved to the phone's home screen.

- Set up a clean mockup state for data that can easily connect to Supabase for persistent storage.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://zad-alduat.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/24aa0d61-bdde-4cb6-922d-c427f5ee0279).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
