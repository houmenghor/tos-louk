<template>
  <div class="contact-page position-relative mt-0">

    <div class="container position-relative z-1 py-5 mt-5 pt-md-5">
      
      <div class="row justify-content-center">
        <div class="col-lg-10 col-xl-9">
          
          <div class="text-center mb-5">
            <h1 class="display-4 fw-bold text-main mb-3">Get in touch</h1>
            <p class="lead subtitle-text mx-auto" style="max-width: 500px;">
              We'd love to hear from you. Please fill out this form or shoot us an email.
            </p>
          </div>

          <div class="contact-wrapper glass-card-clean rounded-5 overflow-hidden shadow-lg mb-5">
            <div class="row g-0">
              
              <!-- Left Side: Contact Information -->
              <div class="col-md-5 bg-primary-gradient text-white p-4 p-md-5 d-flex flex-column justify-content-between position-relative overflow-hidden">
                <div class="position-relative z-1">
                  <h3 class="fw-bold mb-4">Contact Information</h3>
                  <p class="text-white-50 mb-5">
                    Our team is here to help. Reach out to us through any of these channels.
                  </p>
                  
                  <div class="d-flex flex-column gap-4">
                    <div class="d-flex align-items-start gap-3">
                      <i class="bi bi-geo-alt-fill fs-5 mt-1"></i>
                      <div>
                        <h6 class="fw-semibold mb-1">Our Location</h6>
                        <p class="text-white-50 small mb-0">123 Innovation Drive<br>Tech City, TC 10100</p>
                      </div>
                    </div>
                    
                    <div class="d-flex align-items-start gap-3">
                      <i class="bi bi-telephone-fill fs-5 mt-1"></i>
                      <div>
                        <h6 class="fw-semibold mb-1">Phone Number</h6>
                        <p class="text-white-50 small mb-0">+1 (555) 123-4567</p>
                      </div>
                    </div>
                    
                    <div class="d-flex align-items-start gap-3">
                      <i class="bi bi-envelope-fill fs-5 mt-1"></i>
                      <div>
                        <h6 class="fw-semibold mb-1">Email Address</h6>
                        <p class="text-white-50 small mb-0">support@example.com</p>
                      </div>
                    </div>

                    <div class="d-flex align-items-start gap-3">
                      <i class="bi bi-clock-fill fs-5 mt-1"></i>
                      <div>
                        <h6 class="fw-semibold mb-1">Office Hours</h6>
                        <p class="text-white-50 small mb-0">Mon - Fri: 8:00 AM - 6:00 PM<br>Sat - Sun: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Decorative circles in the background of the left panel -->
                <div class="circle-decoration circle-1"></div>
                <div class="circle-decoration circle-2"></div>
              </div>

              <!-- Right Side: The Form -->
              <div class="col-md-7 p-4 p-md-5 form-panel">
                <form @submit.prevent="handleSubmit">
                  <div class="row g-4 mt-1">
                    <div class="col-sm-6">
                      <div class="form-floating-custom">
                        <input type="text" class="form-control clean-input" id="firstName" placeholder=" " required>
                        <label for="firstName" class="clean-label">First Name <span class="text-danger">*</span></label>
                      </div>
                    </div>
                    <div class="col-sm-6">
                      <div class="form-floating-custom">
                        <input type="text" class="form-control clean-input" id="lastName" placeholder=" " required>
                        <label for="lastName" class="clean-label">Last Name <span class="text-danger">*</span></label>
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="form-floating-custom">
                        <input type="email" class="form-control clean-input" id="email" placeholder=" " required>
                        <label for="email" class="clean-label">Email Address <span class="text-danger">*</span></label>
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="form-floating-custom">
                        <textarea class="form-control clean-input" id="message" rows="4" placeholder=" " required></textarea>
                        <label for="message" class="clean-label">Your Message <span class="text-danger">*</span></label>
                      </div>
                    </div>
                    <div class="col-12 mt-5">
                      <button type="submit" class="btn btn-primary w-100 py-3 rounded-pill fw-bold submit-btn-clean">
                        Send Message
                      </button>
                    </div>
                  </div>
                </form>
              </div>

            </div>
          </div>

          <!-- Location Map Section -->
          <div class="map-section mt-5 fade-in-up">
            <h3 class="fw-bold text-main mb-4 text-center">Find Us on the Map</h3>
            <div class="glass-card-clean rounded-5 p-2 overflow-hidden shadow-sm">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125322.44173167123!2d104.8119864233767!3d11.579666900000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109513dc76a6be3%3A0x9c668b6eb50519de!2sPhnom%20Penh!5e0!3m2!1sen!2skh!4v1714578160000!5m2!1sen!2skh" 
                width="100%" 
                height="450" 
                style="border:0; border-radius: 1.5rem;" 
                allowfullscreen="" 
                loading="lazy" 
                referrerpolicy="no-referrer-when-downgrade"
                class="d-block w-100">
              </iframe>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "default",
});

const handleSubmit = () => {
  alert("Your message has been sent successfully! We will get back to you soon.");
};
</script>

<style scoped>
.contact-page {
  background-color: var(--color-bg);
  min-height: calc(100vh - 80px);
}

.text-main {
  color: var(--color-text);
}

.subtitle-text {
  color: var(--color-text-secondary);
}

/* Very subtle background gradient */
.clean-gradient-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50vh;
  background: linear-gradient(180deg, color-mix(in srgb, var(--color-primary) 5%, transparent) 0%, transparent 100%);
  z-index: 0;
}
.dark .clean-gradient-bg {
  background: linear-gradient(180deg, color-mix(in srgb, var(--color-primary) 8%, transparent) 0%, transparent 100%);
}

/* Glass Card */
.glass-card-clean {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}

.dark .glass-card-clean {
  background: color-mix(in srgb, var(--color-surface) 60%, transparent);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid color-mix(in srgb, #ffffff 10%, transparent);
}

/* Left Panel */
.bg-primary-gradient {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
}

.text-white-50 {
  color: rgba(255, 255, 255, 0.75) !important;
}

.circle-decoration {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%);
}

.circle-1 {
  width: 250px;
  height: 250px;
  bottom: -50px;
  right: -50px;
}

.circle-2 {
  width: 120px;
  height: 120px;
  bottom: 150px;
  right: 80px;
}

/* Right Panel (Form) */
.form-panel {
  background-color: transparent;
}

/* Clean Floating Labels */
.form-floating-custom {
  position: relative;
  margin-top: 1rem;
}

.clean-input {
  background: transparent !important;
  border: none;
  border-bottom: 2px solid var(--color-border);
  border-radius: 0;
  padding: 0.5rem 0;
  color: var(--color-text);
  box-shadow: none !important;
  transition: border-color 0.3s ease;
}

.clean-input:focus {
  border-bottom: 2px solid var(--color-primary);
  background: transparent !important;
}

.clean-label {
  position: absolute;
  top: 0.5rem;
  left: 0;
  color: var(--color-text-secondary);
  pointer-events: none;
  transition: all 0.3s ease;
  transform-origin: left top;
}

.clean-input:focus ~ .clean-label,
.clean-input:not(:placeholder-shown) ~ .clean-label {
  transform: translateY(-1.5rem) scale(0.85);
  color: var(--color-primary);
}

textarea.clean-input {
  resize: none;
}

/* Submit Button */
.submit-btn-clean {
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px color-mix(in srgb, var(--color-primary) 20%, transparent);
}
.submit-btn-clean:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px color-mix(in srgb, var(--color-primary) 30%, transparent);
}
</style>
