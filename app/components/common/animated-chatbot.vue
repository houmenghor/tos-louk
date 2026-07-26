<template>
  <div>
    <!-- The Chatbot Trigger Button -->
    <button
      @click="triggerAnimation"
      class="chatbot-trigger-btn d-flex align-items-center justify-content-center shadow"
      aria-label="Open Chatbot"
    >
      <i class="bi bi-chat-dots-fill"></i>
    </button>

    <!-- The Running Robot Animation & Chat Window -->
    <div 
      v-if="isVisible" 
      class="chatbot-container"
      :class="{ 'is-running': isMoving, 'is-stopped': !isMoving }"
    >
      <!-- Chat Window Bubble -->
      <transition name="fade-up">
        <div v-if="showChat" class="chatbot-window shadow">
          <div class="chat-header d-flex justify-content-between align-items-center">
            <strong>Tos Louk Assistant</strong>
            <button @click="closeChat" class="btn-close btn-close-white" aria-label="Close"></button>
          </div>
          <div class="chat-messages" ref="messagesContainer">
            <div 
              v-for="(msg, index) in messages" 
              :key="index"
              class="message"
              :class="msg.isUser ? 'message-user' : 'message-bot'"
            >
              {{ msg.text }}
            </div>
          </div>
          <div class="chat-input d-flex">
            <input 
              v-model="newMessage" 
              @keyup.enter="sendMessage"
              type="text" 
              class="form-control" 
              placeholder="Ask about Tos Louk..."
            />
            <button @click="sendMessage" class="btn btn-primary ms-2">
              <i class="bi bi-send-fill"></i>
            </button>
          </div>
        </div>
      </transition>

      <!-- The Robot Sprite -->
      <div class="chatbot-robot" :class="{ 'sprite-animated': isMoving }"></div>
    </div>

    <!-- Hidden Preloader for New Browser Sessions -->
    <div style="display: none;" aria-hidden="true">
      <img src="/chatbot-run.png" alt="" />
      <img src="/chatbot-hi-transparent.png" alt="" />
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from "vue";

// Preload assets immediately on page mount for new browser sessions
onMounted(() => {
  if (process.client) {
    const img1 = new Image();
    img1.src = "/chatbot-run.png";
    const img2 = new Image();
    img2.src = "/chatbot-hi-transparent.png";
  }
});

const isVisible = ref(false);
const isMoving = ref(false);
const showChat = ref(false);

const messages = ref([
  { text: "Hi there! 👋 I'm the Tos Louk Assistant. What would you like to know about our products?", isUser: false }
]);
const newMessage = ref("");
const messagesContainer = ref(null);

const triggerAnimation = () => {
  if (isVisible.value) return; 
  
  isVisible.value = true;
  isMoving.value = true;
  
  // After 4 seconds, the robot reaches the right side.
  setTimeout(() => {
    isMoving.value = false;
    
    // Show the chat bubble shortly after stopping
    setTimeout(() => {
      showChat.value = true;
    }, 400);
  }, 4000);
};

const closeChat = () => {
  showChat.value = false;
  isVisible.value = false; // Hide the robot completely until clicked again
  
  // Reset for next time
  messages.value = [
    { text: "Hi there! 👋 I'm the Tos Louk Assistant. What would you like to know about our products?", isUser: false }
  ];
};

const sendMessage = () => {
  if (!newMessage.value.trim()) return;
  
  // Add user message
  messages.value.push({ text: newMessage.value, isUser: true });
  const userText = newMessage.value;
  newMessage.value = "";
  
  scrollToBottom();
  
  // Simulate bot typing response
  setTimeout(() => {
    messages.value.push({ 
      text: `That's a great question about "${userText}"! I'm still learning, but our team at Tos Louk is here to help!`, 
      isUser: false 
    });
    scrollToBottom();
  }, 1000);
};

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};
</script>

<style scoped>
/* Floating button on the bottom right (above scroll-to-top) */
.chatbot-trigger-btn {
  position: fixed;
  bottom: 6rem; /* Placed just above the scroll-to-top button */
  right: 2rem;
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background-color: var(--color-primary, #00dc82);
  color: #ffffff;
  border: none;
  z-index: 1040;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.chatbot-trigger-btn i {
  font-size: 1.25rem;
  transition: transform 0.3s ease;
}

.chatbot-trigger-btn:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 220, 130, 0.35);
}

.chatbot-trigger-btn:active {
  transform: translateY(-2px) scale(0.92);
}

/* Chatbot animation container */
.chatbot-container {
  position: fixed;
  bottom: 20px;
  z-index: 9999;
  display: flex;
  align-items: flex-end;
}

/* State 1: Running across the screen */
.chatbot-container.is-running {
  left: -200px; /* Start completely off-screen to the left */
  animation: runAcrossScreen 4s linear forwards; 
}

/* State 2: Stopped on the right side */
.chatbot-container.is-stopped {
  right: 6rem; 
  left: auto;
}

.chatbot-robot {
  width: 150px;  
  height: 186px; 
  background-image: url('/chatbot-run.png');
  background-size: 1500px 100%; 
  background-repeat: no-repeat;
  flex-shrink: 0;
}

/* When stopped, swap the image to the robot waving "hi"! */
.chatbot-container.is-stopped .chatbot-robot {
  background-image: url('/chatbot-hi-transparent.png');
  background-size: contain; 
  background-position: center bottom;
}

.chatbot-robot.sprite-animated {
  animation: playSprite 0.8s steps(10) infinite;
}

@keyframes playSprite {
  from { background-position: 0px 0; }
  to { background-position: -1500px 0; } 
}

@keyframes runAcrossScreen {
  0% { transform: translateX(0); }
  100% { transform: translateX(calc(100vw - 6rem - 150px + 200px)); }
}

/* Chat Window Styles */
.chatbot-window {
  width: 300px;
  height: 400px;
  background-color: var(--color-bg, #1a1e29);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  margin-right: 15px; /* space between robot and chat */
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  background-color: var(--color-primary, #00dc82);
  color: #fff;
  padding: 12px 16px;
  font-size: 1rem;
}

.chat-messages {
  flex-grow: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  max-width: 85%;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 0.9rem;
  line-height: 1.4;
}

.message-bot {
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--color-text, #fff);
  align-self: flex-start;
  border-bottom-left-radius: 4px;
}

.message-user {
  background-color: var(--color-primary, #00dc82);
  color: #fff;
  align-self: flex-end;
  border-bottom-right-radius: 4px;
}

.chat-input {
  padding: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.chat-input input {
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--color-text, #fff);
}

.chat-input input:focus {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: var(--color-primary, #00dc82);
  color: var(--color-text, #fff);
  box-shadow: none;
}

/* Transitions */
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

/* Responsive adjustments for mobile */
@media (max-width: 768px) {
  .chatbot-trigger-btn {
    right: 1rem;
    bottom: 5rem;
  }

  .chatbot-container {
    flex-direction: column;
    align-items: flex-end;
  }

  .chatbot-container.is-stopped {
    right: 1rem;
  }

  .chatbot-window {
    width: calc(100vw - 2rem);
    max-width: 340px;
    height: 350px;
    margin-right: 0;
    margin-bottom: 10px;
  }

  .chatbot-robot {
    transform: scale(0.85);
    transform-origin: bottom right;
  }

  @keyframes runAcrossScreen {
    0% { transform: translateX(0); }
    100% { transform: translateX(calc(100vw - 1rem - 150px + 200px)); }
  }
}
</style>
