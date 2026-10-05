/**
 * NOURIVA — Authentication Controller (Demo Frontend)
 * Handles Login, Signup with Topic Personalization, and Password Reset State Machine
 */

(function () {
  'use strict';

  const USER_KEY = 'nouriva_user_profile';
  const INTERESTS_KEY = 'nouriva_user_interests';

  function getCurrentUser() {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  function getUserInterests() {
    try {
      const data = localStorage.getItem(INTERESTS_KEY);
      return data ? JSON.parse(data) : ['Nutrition Fundamentals', 'Recovery Nutrition'];
    } catch (e) {
      return ['Nutrition Fundamentals', 'Recovery Nutrition'];
    }
  }

  function saveUserSession(user, interests = []) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    if (interests && interests.length) {
      localStorage.setItem(INTERESTS_KEY, JSON.stringify(interests));
    }
  }

  function initLogin() {
    const loginForm = document.getElementById('nourivaLoginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const pass = document.getElementById('loginPassword').value.trim();
      const submitBtn = loginForm.querySelector('button[type="submit"]');

      if (!email || !pass) {
        alert('Please provide your email and password.');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span> Signing In...';
      }

      setTimeout(() => {
        const user = {
          name: email.split('@')[0],
          email: email,
          isLoggedIn: true,
          loginTime: new Date().toISOString()
        };
        saveUserSession(user);

        if (window.NourivaBookmarks && window.NourivaBookmarks.showToast) {
          window.NourivaBookmarks.showToast('Welcome back! Personalized recommendations loaded.', 'success');
        }

        setTimeout(() => {
          window.location.href = 'index.html';
        }, 800);
      }, 700);
    });

    // Preset Fill buttons
    document.querySelectorAll('.btn-demo-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        const emailInput = document.getElementById('loginEmail');
        const passInput = document.getElementById('loginPassword');
        if (emailInput && passInput) {
          emailInput.value = btn.getAttribute('data-email') || 'researcher@nouriva.org';
          passInput.value = 'EvidenceRecovery2026!';
        }
      });
    });
  }

  function initSignup() {
    const signupForm = document.getElementById('nourivaSignupForm');
    if (!signupForm) return;

    // Interactive Interest Checkbox Chips
    const interestLabels = document.querySelectorAll('.interest-checkbox-label');
    interestLabels.forEach(label => {
      label.addEventListener('click', (e) => {
        e.preventDefault();
        const checkbox = label.querySelector('input[type="checkbox"]');
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
          label.classList.toggle('selected', checkbox.checked);
        }
      });
    });

    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signupName').value.trim();
      const email = document.getElementById('signupEmail').value.trim();
      const pass = document.getElementById('signupPassword').value.trim();
      const confirmPass = document.getElementById('signupConfirmPassword').value.trim();
      const terms = document.getElementById('signupTerms').checked;
      const submitBtn = signupForm.querySelector('button[type="submit"]');

      if (!name || !email || !pass) {
        alert('Please fill out all required fields.');
        return;
      }

      if (pass !== confirmPass) {
        alert('Passwords do not match. Please re-enter.');
        return;
      }

      if (!terms) {
        alert('Please accept the Educational Terms & Privacy Guidelines.');
        return;
      }

      const selectedInterests = [];
      document.querySelectorAll('.interest-checkbox-label.selected').forEach(label => {
        const val = label.getAttribute('data-interest');
        if (val) selectedInterests.push(val);
      });

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span> Creating Account...';
      }

      setTimeout(() => {
        const user = {
          name: name,
          email: email,
          isLoggedIn: true,
          joinedAt: new Date().toISOString()
        };
        saveUserSession(user, selectedInterests.length ? selectedInterests : ['Nutrition Fundamentals', 'Recovery Nutrition']);

        if (window.NourivaBookmarks && window.NourivaBookmarks.showToast) {
          window.NourivaBookmarks.showToast('Account created! Customizing your knowledge feed...', 'success');
        }

        setTimeout(() => {
          window.location.href = 'index.html';
        }, 900);
      }, 750);
    });
  }

  function initForgotPassword() {
    const form = document.getElementById('nourivaForgotForm');
    const resetCard = document.getElementById('forgotFormCard');
    const successCard = document.getElementById('forgotSuccessCard');
    const userEmailSpan = document.getElementById('sentEmailAddress');

    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('forgotEmail').value.trim();
      if (!email) {
        alert('Please enter your email address.');
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span> Sending link...';
      }

      setTimeout(() => {
        if (userEmailSpan) userEmailSpan.textContent = email;
        if (resetCard) resetCard.style.display = 'none';
        if (successCard) successCard.style.display = 'block';

        if (window.NourivaBookmarks && window.NourivaBookmarks.showToast) {
          window.NourivaBookmarks.showToast(`Password reset link sent to ${email}`, 'success');
        }
      }, 650);
    });
  }

  function initPasswordToggles() {
    document.querySelectorAll('.btn-toggle-password').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const input = document.getElementById(targetId);
        const icon = btn.querySelector('i');
        if (input) {
          const isPass = input.type === 'password';
          input.type = isPass ? 'text' : 'password';
          if (icon) {
            icon.className = isPass ? 'bi bi-eye-slash' : 'bi bi-eye';
          }
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initLogin();
    initSignup();
    initForgotPassword();
    initPasswordToggles();
  });

  window.NourivaAuth = {
    getUser: getCurrentUser,
    getInterests: getUserInterests,
    saveSession: saveUserSession
  };
})();
