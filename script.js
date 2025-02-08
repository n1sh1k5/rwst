// Select elements
const chatBox = document.getElementById("chat-box");
const userInputField = document.getElementById("user-input-field");
const sendButton = document.getElementById("send-button");

// Global Cuisines List
const cuisines = {
  italian: ["Pizza Margherita", "Lasagna", "Spaghetti Carbonara", "Risotto", "Focaccia", "Pasta Alfredo", "Bruschetta", "Gnocchi"],
  spanish: ["Paella", "Tortilla Española", "Gazpacho", "Churros", "Croquetas", "Patatas Bravas", "Pisto"],
  chinese: ["Dim Sum", "Kung Pao Chicken", "Sweet and Sour Pork", "Fried Rice", "Spring Rolls", "Mapo Tofu", "Peking Duck"],
  indian: ["Butter Chicken", "Biryani", "Palak Paneer", "Chole Bhature", "Samosas", "Dosa", "Paneer Tikka", "Rogan Josh"],
  mexican: ["Tacos", "Enchiladas", "Quesadilla", "Guacamole", "Churros", "Burrito", "Tamales", "Pozole"],
  japanese: ["Sushi", "Ramen", "Tempura", "Sashimi", "Okonomiyaki", "Tonkatsu", "Takoyaki"],
  french: ["Croissants", "Escargot", "Coq au Vin", "Bouillabaisse", "Crêpes", "Ratatouille", "Quiche"],
  greek: ["Moussaka", "Souvlaki", "Gyro", "Spanakopita", "Baklava", "Tzatziki", "Fasolada"],
  korean: ["Bibimbap", "Kimchi", "Samgyeopsal", "Tteokbokki", "Bulgogi", "Japchae", "Sundubu Jjigae"],
  thai: ["Pad Thai", "Tom Yum", "Green Curry", "Som Tum", "Mango Sticky Rice", "Massaman Curry", "Pad Kra Pao"]
};

// Global Variables for Order Handling
let selectedCuisine = "";
let selectedDish = "";
let selectedDrink = "";
let waitingForSpiceLevel = false;
let waitingForDrink = false;
let orderCompleted = false;

// Start the conversation with a greeting
function startChat() {
  addMessage("Welcome to Podar Bytes! 😊 What type of cuisine would you like to explore today? (e.g., Italian, Spanish, Chinese, Indian, etc.)");
}

// Add messages to the chatbox
function addMessage(message, sender = "bot") {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add(sender === "bot" ? "bot-message" : "user-message");
  messageDiv.innerHTML = message;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the latest message
}

// Handle user input and make responses
function handleUserInput() {
  const userMessage = userInputField.value;
  if (userMessage.trim()) {
    addMessage(userMessage, "user"); // Add user message to chat
    userInputField.value = ""; // Clear input field

    // Process user message
    processUserMessage(userMessage.toLowerCase());
  }
}

// Process the message based on user input
function processUserMessage(message) {
  if (message.toLowerCase() === "hey" && orderCompleted) {
    resetOrder();
    addMessage("Great! Let's start a new order. 😊", "bot");
    addMessage("What type of cuisine would you like to explore today? (e.g., Italian, Spanish, Chinese, Indian, etc.)", "bot");
    return;
  }

  if (!selectedCuisine) {
    let cuisineFound = false;
    Object.keys(cuisines).forEach(cuisine => {
      if (message.includes(cuisine)) {
        selectedCuisine = cuisine; 
        suggestDishes(cuisine);
        cuisineFound = true;
      }
    });

    if (!cuisineFound) {
      addMessage("Sorry, I didn't understand. Please choose a cuisine like Italian, Spanish, Chinese, Indian, etc.", "bot");
    }
  } else if (waitingForSpiceLevel) {
    handleSpiceLevel(message);
  } else if (!waitingForDrink) {
    handleDishSelection(message);
  } else {
    handleDrinkSelection(message);
  }
}

// Suggest dishes based on cuisine
function suggestDishes(cuisine) {
  addMessage(`Great choice! Here are some popular dishes from ${cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}:`);
  cuisines[cuisine].forEach(dish => {
    addMessage(`${dish}!`, "bot");
  });
  addMessage("What would you like to order?", "bot");
}

// Handle user selection of a dish
function handleDishSelection(message) {
  const dishFound = cuisines[selectedCuisine].find(dish => message.toLowerCase().includes(dish.toLowerCase()));

  if (dishFound) {
    selectedDish = dishFound; 
    addMessage(`Great choice! You've selected ${selectedDish}. Would you like to choose a spice level? (Mild, Medium, Spicy)`, "bot");
    waitingForSpiceLevel = true;
  } else {
    addMessage("Sorry, I didn't catch that. Could you please choose a dish from the list?", "bot");
  }
}

// Handle spice level selection
function handleSpiceLevel(message) {
  const spiceLevels = ["mild", "medium", "spicy"];

  if (spiceLevels.includes(message.toLowerCase())) {
    addMessage(`Got it! You've chosen ${message.charAt(0).toUpperCase() + message.slice(1)} spice level for your ${selectedDish}.`, "bot");
    waitingForSpiceLevel = false;
    waitingForDrink = true;
    addMessage("Would you like anything to drink with that? (e.g., Soda, Juice, Water, Coffee, Tea, Wine)", "bot");
  } else if (message.toLowerCase() === "no" || message.toLowerCase() === "skip") {
    waitingForSpiceLevel = false;
    waitingForDrink = true;
    addMessage("No problem! Would you like anything to drink with that? (e.g., Soda, Juice, Water, Coffee, Tea, Wine)", "bot");
  } else {
    addMessage("Please choose a spice level: Mild, Medium, or Spicy. Or say 'No' to skip.", "bot");
  }
}

// Handle drink selection
function handleDrinkSelection(message) {
  const drinks = ["soda", "juice", "water", "coffee", "tea", "wine"];
  const drinkFound = drinks.find(drink => message.toLowerCase().includes(drink));

  if (drinkFound) {
    selectedDrink = drinkFound; 
    addMessage(`You have chosen ${selectedDrink}. Your order will be prepared shortly! 😊`, "bot");
    concludeOrder();  
  } else {
    addMessage("Would you like a drink? You can choose from Soda, Juice, Water, Coffee, Tea, or Wine.", "bot");
  }
}

// Conclude the order and ask if they want to order more
function concludeOrder() {
  addMessage(`Thank you for your order of ${selectedDish} with ${selectedDrink}! Your meal will be prepared shortly. 😊`, "bot");
  addMessage("Say 'Hey' to start a new order! 😊", "bot");
  orderCompleted = true;
  selectedCuisine = "";
  selectedDish = "";
  selectedDrink = "";
  waitingForDrink = false;
}

// Reset the order variables for starting over
function resetOrder() {
  selectedCuisine = "";
  selectedDish = "";
  selectedDrink = "";
  waitingForSpiceLevel = false;
  waitingForDrink = false;
  orderCompleted = false;
}

// Event listener for the "Send" button
sendButton.addEventListener("click", handleUserInput);

// Event listener for the "Enter" key to submit message
userInputField.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleUserInput();
  }
});

// Start the chatbot with a greeting message
startChat();
