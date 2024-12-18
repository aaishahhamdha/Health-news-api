const healthKeywords = [
    "health", "medical", "medicine", "disease", "hospital",
    "treatment", "vaccination", "surgery", "virus", "nutrition", 
    "covid", "pandemic", "therapy", "patient", "doctor", "nurse", 
    "cancer", "diabetes", "pharmaceutical", "diagnosis", "epidemic", 
    "physician", "clinic", "symptoms", "infection prevention", 
    "vaccines", "public health", "diet", "weight loss", "HIV", "AIDS"
  ];
  
  function isHealthRelated(text) {
    return healthKeywords.some(keyword =>
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  }
  
  module.exports = { isHealthRelated };
  