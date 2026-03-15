<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EngiDocs: Collaborative Workspace for Remote Engineering Teams</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        /* General Reset & Base Styles */
        :root {
            --primary-blue: #007bff;
            --secondary-green: #28a745;
            --dark-text: #333;
            --light-text: #666;
            --background-light: #f8f9fa;
            --background-white: #fff;
            --border-color: #e0e0e0;
            --shadow-light: rgba(0, 0, 0, 0.08);
            --shadow-medium: rgba(0, 0, 0, 0.12);
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Outfit', sans-serif;
            line-height: 1.6;
            color: var(--dark-text);
            background-color: var(--background-white);
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            opacity: 0; /* Hidden initially for fade-in */
            animation: fadeIn 0.8s ease-out forwards;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        /* Typography */
        h1, h2, h3 {
            font-weight: 600;
            line-height: 1.2;
            margin-bottom: 0.5em;
        }

        h1 { font-size: 2.8em; }
        h2 { font-size: 2.2em; }
        h3 { font-size: 1.6em; }

        p {
            margin-bottom: 1em;
            color: var(--light-text);
        }

        a {
            color: var(--primary-blue);
            text-decoration: none;
            transition: color 0.3s ease;
        }

        a:hover {
            color: #0056b3; /* Darker blue on hover */
        }

        /* Buttons */
        .btn {
            display: inline-block;
            padding: 12px 28px;
            border-radius: 8px;
            font-weight: 500;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            border: none;
        }

        .btn-primary {
            background-color: var(--primary-blue);
            color: var(--background-white);
            box-shadow: 0 4px 15px var(--shadow-medium);
        }

        .btn-primary:hover {
            background-color: #0056b3;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px var(--shadow-medium);
        }

        .btn-secondary {
            background-color: transparent;
            color: var(--primary-blue);
            border: 2px solid var(--primary-blue);
            padding: 10px 26px; /* Adjust padding for border */
        }

        .btn-secondary:hover {
            background-color: var(--primary-blue);
            color: var(--background-white);
            transform: translateY(-2px);
        }

        /* Navbar */
        .navbar {
            position: sticky;
            top: 0;
            width: 100%;
            background-color: var(--background-white);
            box-shadow: 0 2px 10px var(--shadow-light);
            padding: 15px 0;
            z-index: 1000;
        }

        .navbar .container {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .navbar-brand {
            font-size: 1.8em;
            font-weight: 700;
            color: var(--primary-blue);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .navbar-brand span {
            font-size: 1.2em;
            color: var(--secondary-green);
        }

        .nav-links {
            display: flex;
            gap: 30px;
        }

        .nav-links a {
            font-weight: 500;
            color: var(--dark-text);
            transition: color 0.3s ease;
        }

        .nav-links a:hover {
            color: var(--primary-blue);
        }

        .nav-toggle {
            display: none; /* Hidden on desktop */
            font-size: 2em;
            cursor: pointer;
            color: var(--dark-text);
        }

        /* Hero Section */