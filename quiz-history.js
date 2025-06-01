<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Quiz History</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; background-color: #f5f7fa; }
    header { background-color: #004080; color: white; padding: 15px 20px; position: relative; }
    nav { display: flex; justify-content: space-between; align-items: center; }
    .logo { font-size: 1.8rem; font-weight: bold; color: white; text-decoration: none; }
    ul.menu { list-style: none; display: none; flex-direction: column; position: absolute; top: 60px; right: 20px; background: #004080; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.2); padding: 10px 0; margin: 0; z-index: 1000; }
    ul.menu.active { display: flex; }
    ul.menu li a { color: white; text-decoration: none; padding: 10px 20px; display: block; font-weight: 500; }
    ul.menu li a:hover { background: rgba(255,255,255,0.1); }
    .hamburger { display: flex; flex-direction: column; cursor: pointer; background: none; border: none; padding: 0; }
    .hamburger div { width: 25px; height: 3px; background: white; margin: 4px 0; }
    @media (max-width: 768px) {
      ul.menu { display: none; flex-direction: column; position: absolute; top: 60px; left: 0; background: #004080; width: 100%; padding: 10px 0; }
    }
    main { display: flex; flex-wrap: wrap; padding: 20px; }
    .content { flex: 3; min-width: 250px; padding: 20px; }
    .sidebar { flex: 1; min-width: 200px; padding: 20px; background-color: #e0ecff; border-left: 20px solid #ccc; }
    .card { background-color: white; margin-bottom: 20px; padding: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); border-radius: 8px; }
    h2 { color: #004080; }
    footer { background-color: #004080; color: white; text-align: center; padding: 20px; }
    .quiz-list { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; margin-top: 20px; margin-bottom: 40px; }
    .manual-btn { background-color: #1976d2; color: white; font-weight: bold; padding: 18px 20px; border-radius: 12px; text-align: center; min-width: 320px; flex: 1 1 320px; box-shadow: 0 2px 8px rgba(0,0,0,0.13); cursor: pointer; border: none; font-size: 1.15rem; margin-bottom: 0; margin-top: 0; transition: background 0.2s, box-shadow 0.2s; display: block; }
    .manual-btn:hover { background-color: #125ca4; box-shadow: 0 4px 16px rgba(0,0,0,0.18); }
    .btn-white-black { background-color: white; color: black; border: 1px solid #ccc; font-weight: bold; border-radius: 6px; padding: 6px 12px; transition: background-color 0.3s, color 0.3s; text-decoration: none; display: inline-block; }
    .btn-white-black:hover { background-color: #f0f0f0; color: #000; }
    .d-flex { display: flex; align-items: center; }
    .me-3 { margin-right: 1rem; }
    .btn-outline-primary { background-color: transparent; border: 2px solid #1976d2; color: #1976d2; }
    .btn-outline-primary:hover { background-color: #1976d2; color: white; }
    .alert { padding: 15px; margin-bottom: 20px; border: 1px solid transparent; border-radius: 4px; }
    .alert-danger { color: #721c24; background-color: #f8d7da; border-color: #f5c6cb; }
    .d-none { display: none !important; }
    .text-center { text-align: center; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 15px; }
    .py-4 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
    .mb-3 { margin-bottom: 1rem; }
    .mb-4 { margin-bottom: 1.5rem; }
    .table-responsive { display: flex; justify-content: center; padding: 20px; width: 100%; max-width: 800px; }
    .table-wrapper { display: flex; justify-content: center; width: 100%; }
    .quiz-table { width: 100%; max-width: 800px; border-collapse: collapse; background-color: white; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border-radius: 8px; overflow: hidden; text-align: center; }
    .quiz-table th, .quiz-table td { padding: 12px 16px; border-bottom: 1px solid #e0e0e0; }
    .quiz-table th { background-color: #004080; color: white; font-weight: bold; text-transform: uppercase; }
    .quiz-table tr:nth-child(even) { background-color: #f9f9f9; }
    .quiz-table tr:hover { background-color: #e6f0ff; }
    .align-middle { vertical-align: middle; }
    .text-muted { color: #6c757d; }
    .text-danger { color: #21c3545; }
  </style>
</head>
<body>
  <header>
    <nav>
      <a href="index.html" class="logo">IR-LDCE</a>
      <div class="d-flex align-items-center">
        <a href="login.html" id="loginLink" class="btn-white-black me-3">Login</a>
        <button id="logoutButton" class="btn-white-black" style="display: none;">Logout</button>
        <a href="dashboard.html" id="dashboardLink" class="btn btn-sm btn-white-black" style="display: none;">Dashboard</a>
      </div>
      <button class="hamburger" id="hamburger">
        <div></div>
        <div></div>
        <div></div>
      </button>
      <ul class="menu" id="navMenu">
        <li><a href="index.html">🏠 Home</a></li>
        <li><a href="categories.html">📐 MCQ Categories</a></li>
        <li><a href="manual-quizzes.html">📊 Manual Based MCQ</a></li>
        <li><a href="pyq-quizzes.html">📄 PYQ Based MCQ</a></li>
        <li><a href="establishment.html">🔄 Establishment MCQ</a></li>
        <li><a href="current-affairs.html">🌐 Current Affairs</a></li>
        <li><a href="gk.html">💡 General Knowledge</a></li>
        <li><a href="contact.html">📧 Contact Us</a></li>
      </ul>
    </nav>
  </header>

  <main class="dashboard-container container py-4">
    <div id="error-message" class="alert alert-danger text-center d-none">
      You are not logged in. <a href="login.html">Go to login</a>
    </div>
    <section class="dashboard-section quiz-history mb-4">
      <h3 class="mb-3 text-center">Quiz History</h3>
      <div class="table-wrapper">
        <table class="quiz-table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Manual</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody id="quizHistoryBody">
            <tr>
              <td colspan="3" class="text-center text-muted">Loading...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>

  <footer>
    &copy; 2025 IR-LDCE. All Rights Reserved.
  </footer>

  <!-- Firebase SDK v9 compat -->
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"></script>

  <!-- Firebase Configuration -->
  <script>
    const firebaseConfig = {
      apiKey: "AIzaSyCRhKq7k4v2MdiE5xT4H7-Yb7SLQ5mvTn8",
      authDomain: "quiz-app-1b48b.firebaseapp.com",
      projectId: "quiz-app-1b48b",
      appId: "1:765334603137:web:1c8a13f6086a6773c2d480"
    };
    firebase.initializeApp(firebaseConfig);
    // Expose Firestore for quiz-history.js
    const db = firebase.firestore();
  </script>

  <!-- Hamburger Menu Toggle -->
  <script>
    document.getElementById('hamburger').addEventListener('click', function() {
      document.getElementById('navMenu').classList.toggle('active');
    });
  </script>

  <!-- Load Quiz History Logic -->
  <script src="quiz-history.js"></script>
</body>
</html>
