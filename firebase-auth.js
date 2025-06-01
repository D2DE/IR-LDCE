import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { app } from "./firebase-config.js";

export const auth = getAuth(app);
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"></script>
    <script>
      const db = firebase.firestore();

      document.getElementById('contactForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        db.collection('contacts').add({
          name: name,
          email: email,
          subject: subject,
          message: message,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
          alert('Message sent successfully!');
          document.getElementById('contactForm').reset();
        })
        .catch((error) => {
          alert('Error sending message: ' + error.message);
        });
      });
    </script>
