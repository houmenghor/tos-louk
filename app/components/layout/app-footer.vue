<template>
  <footer class="app-footer border-top">
    <div class="container">
      <div class="row g-5">
        <!-- Brand Info Column -->
        <div class="col-lg-4 col-md-6">
          <div class="d-flex align-items-center gap-2 mb-3">
            <span
              class="brand-logo d-flex align-items-center justify-content-center text-white fw-bold"
            >
              TL
            </span>
            <span class="fs-4 fw-bold text-gradient brand-title">Tos Louk</span>
          </div>
          <p class="footer-desc mb-4">
            Discover what defines modern living. Shop our premium collections of
            clothing, accessories, and state-of-the-art electronics.
          </p>
          <!-- Social Icons -->
          <div class="d-flex gap-3 social-group">
            <a href="#" class="social-btn" title="Facebook"
              ><i class="bi bi-facebook"></i
            ></a>
            <a href="#" class="social-btn" title="Telegram"
              ><i class="bi bi-telegram"></i
            ></a>
            <a href="#" class="social-btn" title="Instagram"
              ><i class="bi bi-instagram"></i
            ></a>
            <a href="#" class="social-btn" title="YouTube"
              ><i class="bi bi-youtube"></i
            ></a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="col-lg-2 col-md-6 col-6">
          <h6 class="footer-heading text-uppercase fw-bold mb-3">Shop Link</h6>
          <ul class="list-unstyled footer-links d-flex flex-column gap-2">
            <li><a href="#best-seller">Best Sellers</a></li>
            <li><a href="#discount">Flash Sales</a></li>
            <li><a href="/categories">All Categories</a></li>
            <li><a href="#">New Arrivals</a></li>
          </ul>
        </div>

        <!-- Support Info -->
        <div class="col-lg-2 col-md-6 col-6">
          <h6 class="footer-heading text-uppercase fw-bold mb-3">Support</h6>
          <ul class="list-unstyled footer-links d-flex flex-column gap-2">
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Shipping Info</a></li>
            <li><a href="#">Returns & Policy</a></li>
            <li><a href="#">Order Tracking</a></li>
          </ul>
        </div>

        <!-- Contact Column -->
        <div class="col-lg-4 col-md-6">
          <h6 class="footer-heading text-uppercase fw-bold mb-3">Contact Us</h6>
          <ul class="list-unstyled footer-contact d-flex flex-column gap-3">
            <li class="d-flex gap-3 align-items-start">
              <i class="bi bi-geo-alt-fill text-primary-icon mt-1"></i>
              <span>123 Russian Boulevard, Phnom Penh, Cambodia</span>
            </li>
            <li class="d-flex gap-3 align-items-center">
              <i class="bi bi-telephone-fill text-primary-icon"></i>
              <a href="tel:+85512345678" class="contact-link"
                >+855 (0) 12 345 678</a
              >
            </li>
            <li class="d-flex gap-3 align-items-center">
              <i class="bi bi-envelope-fill text-primary-icon"></i>
              <a href="mailto:info@toslouk.com" class="contact-link"
                >info@toslouk.com</a
              >
            </li>
          </ul>
        </div>
      </div>

      <!-- Footer Bottom -->
      <hr class="footer-divider my-3" />

      <div class="row align-items-center justify-content-between gy-3">
        <div class="col-md-6 text-center text-md-start">
          <p class="copyright-text mb-0">
            &copy; {{ currentYear }}
            <strong class="brand-title-small">Tos Louk</strong>. All rights
            reserved.
          </p>
        </div>
        <div class="col-md-6 text-center text-md-end">
          <!-- Mock Payment Badges -->
          <div
            class="d-flex align-items-center justify-content-center justify-content-md-end gap-3 payment-badges"
          >
            <span class="payment-badge" title="ABA Pay">ABA</span>
            <span class="payment-badge" title="Visa">Visa</span>
            <span class="payment-badge" title="Mastercard">Master</span>
            <span class="payment-badge" title="PayPal">Paypal</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from "vue";

const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
.app-footer {
  background-color: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border) !important;
  color: var(--color-text-secondary);
  font-size: 0.85rem;
  padding-top: 3.5rem;
  padding-bottom: 2rem;
}

.brand-logo {
  background: var(--color-primary);
  width: 40px;
  height: 40px;
  border-radius: 10px;
  font-size: 1.25rem;
  box-shadow: 0 4px 10px rgba(0, 220, 130, 0.2);
}

.brand-title {
  color: var(--color-text);
  letter-spacing: -0.5px;
}

.brand-title-small {
  color: var(--color-text);
}

.text-gradient {
  background: linear-gradient(135deg, var(--color-primary) 0%, #00c16f 100%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.footer-desc {
  line-height: 1.6;
}

.footer-heading {
  color: var(--color-text);
  font-size: 0.95rem;
  letter-spacing: 0.5px;
}

/* Social Buttons */
.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  transition: all 0.3s ease;
  text-decoration: none;
}

.social-btn:hover {
  background: var(--color-primary);
  color: #ffffff;
  border-color: var(--color-primary);
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0, 220, 130, 0.2);
}

/* Link transitions */
.footer-links a {
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: all 0.25s ease;
  display: inline-block;
}

.footer-links a:hover {
  color: var(--color-primary);
  transform: translateX(4px);
}

/* Contact Links */
.contact-link {
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.2s;
}

.contact-link:hover {
  color: var(--color-primary);
}

.text-primary-icon {
  color: var(--color-primary);
  font-size: 1.1rem;
}

.footer-divider {
  border-color: var(--color-border);
  opacity: 0.6;
}

.copyright-text {
  font-size: 0.85rem;
}

/* Payment Badges */
.payment-badges {
  font-size: 0.75rem;
}

.payment-badge {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 4px 12px;
  border-radius: 6px;
  font-weight: 600;
  color: var(--color-text-secondary);
  cursor: default;
  transition: all 0.2s;
}

.payment-badge:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
</style>
