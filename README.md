# Campus Parking Management Web Application

![Project Banner](./frontend/assets/banner.png) <!-- Replace with an actual image if available -->

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Demo](#demo)
- [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Backend Setup](#backend-setup)
    - [Frontend Setup](#frontend-setup)
- [Usage](#usage)
    - [Check In](#check-in)
    - [Check Out](#check-out)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Project Overview

The **Campus Parking Management Web Application** is a comprehensive solution designed to streamline parking management at Maynooth University. This application allows users to **check in** to parking spots, view real-time **parking availability** on an interactive map, and monitor **parking occupancy** through dynamic charts. The system enhances user experience by providing intuitive interfaces and real-time data updates, ensuring efficient parking utilization across the campus.

---

## Features

- **User Authentication**: Secure login and registration system (optional enhancement).
- **Interactive Parking Map**: View available and occupied parking spots on a dynamic map using **Leaflet.js**.
- **Real-Time Updates**: Live updates on parking spot availability and user locations.
- **Parking Occupancy Chart**: Visual representation of parking occupancy from **6 AM to 6 PM** using **Chart.js**.
- **Check-In/Check-Out Functionality**: Easily check in to a parking spot and check out when leaving.
- **Responsive Design**: Optimized for desktops, tablets, and mobile devices using **Bootstrap**.
- **Backend API**: Robust backend built with **Express.js** and **MongoDB** for data management.

---

## Technologies Used

- **Frontend:**
    - HTML5 & CSS3
    - JavaScript (ES6+)
    - [Bootstrap 4](https://getbootstrap.com/)
    - [Leaflet.js](https://leafletjs.com/) for interactive maps
    - [Chart.js](https://www.chartjs.org/) for data visualization

- **Backend:**
    - [Node.js](https://nodejs.org/) (v20.17.0)
    - [Express.js](https://expressjs.com/)
    - [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) ODM

- **Version Control:**
    - [Git](https://git-scm.com/)
    - [GitLab](https://gitlab.com/) for repository hosting

- **Development Tools:**
    - [WebStorm](https://www.jetbrains.com/webstorm/) IDE
    - [Nodemon](https://nodemon.io/) for automatic server restarts

---

## Demo

![Parking Map](./frontend/assets/map_screenshot.png) <!-- Replace with actual screenshots -->
*Interactive parking map displaying available and occupied spots.*

![Parking Occupancy Chart](./frontend/assets/chart_screenshot.png) <!-- Replace with actual screenshots -->
*Bar chart showing parking occupancy from 6 AM to 6 PM.*

---

## Installation

To set up and run the **Campus Parking Management Web Application** locally, follow the steps below.

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (v14.x or later)
- **npm** (comes bundled with Node.js)
- **MongoDB**:
    - **Local Installation**: [Download MongoDB](https://www.mongodb.com/try/download/community)
    - **MongoDB Atlas**: [Sign Up for MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for a cloud-based solution
- **Git**: [Install Git](https://git-scm.com/downloads)
- **WebStorm** or any other preferred code editor
- **Live Server Extension** (optional, for serving frontend)

### Backend Setup

1. **Clone the Repository**

   ```bash
