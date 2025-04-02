"use client";

import React, { useState } from 'react';

interface Option {
  text: string;
  traits: Record<string, number | string>;
}

interface Question {
  id: number;
  text: string;
  options: Option[];
}

const personalityTraits: Record<string, string[] | null> = {
  socialEnergy: ["Introvert", "Social Introvert", "Ambivert", "Social Extrovert", "Extrovert"],
  emotionalDepth: ["Pragmatic", "Practical", "Balanced", "Sensitive", "Deeply Empathetic"],
  adventureSeeking: ["Creature of Habit", "Comfort Seeker", "Flexible", "Adventure Curious", "Thrill Seeker"],
  relationshipPace: ["Slow and Steady", "Deliberate", "Moderate", "Quick Connection", "Fast Mover"],
  communicationStyle: ["Listener", "Reserved Communicator", "Balanced", "Expressive", "Direct Communicator"],
  lifeBalance: ["Relationship Focused", "Partnership Oriented", "Balanced", "Goal Oriented", "Career Driven"],
  conflictResolution: ["Peacekeeper", "Harmonious", "Balanced", "Assertive", "Confrontational"],
  loveLanguage: null
};

const traitDescriptions: Record<string, string> = {
  "Romantic Idealist": "You value deep emotional connections and often prioritize relationships. You're attentive, empathetic, and willing to put in the work for love.",
  "Social Butterfly": "You thrive in social settings and enjoy meeting new people. Your charismatic nature makes you approachable and fun to be around.",
  "Steady Companion": "You're reliable, consistent, and value trust above all. You build relationships carefully and create a stable foundation for lasting connection.",
  "Adventure Seeker": "You crave new experiences and spontaneity. You bring excitement and unpredictability to relationships, always looking for the next thrill.",
  "Thoughtful Observer": "You process deeply before acting. Your careful consideration and emotional intelligence help you navigate relationships with wisdom.",
  "Independent Spirit": "You value personal freedom and space. Your self-sufficiency brings a healthy autonomy to relationships without sacrificing connection.",
  "Harmonious Mediator": "You seek peace and balance in relationships. Your diplomatic nature helps navigate conflicts with minimal drama.",
  "Passionate Pursuer": "You approach love with intensity and dedication. When you're interested, you're all in, creating deep and meaningful connections."
};

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, Option>>({});
  const [showResult, setShowResult] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  
  const questions: Question[] = [
    {
      id: 1,
      text: "Find Your Match!",
      options: [
        { text: "start", traits: {} }
      ]
    },
    {
      id: 2,
      text: "Tell us a little bit more about yourself...\n...what are you looking for currently?",
      options: [
        { text: "a friend", traits: { socialIntent: 1, emotionalDepth: 2, relationshipPace: 1 } },
        { text: "something more", traits: { socialIntent: 3, emotionalDepth: 4, relationshipPace: 3 } },
        { text: "I'm not sure yet", traits: { socialIntent: 2, emotionalDepth: 3, relationshipPace: 2 } }
      ]
    },
    {
      id: 3,
      text: "What does your ideal evening look like?",
      options: [
        { 
          text: "chill, cozy night in", 
          traits: { 
            socialEnergy: 1, 
            adventureSeeking: 1,
            lifeBalance: "Quality Time"
          } 
        },
        { 
          text: "doing some homework", 
          traits: { 
            socialEnergy: 1, 
            lifeBalance: 4,
            communicationStyle: 1
          } 
        },
        { 
          text: "grabbing dinner with a few friends", 
          traits: { 
            socialEnergy: 3, 
            communicationStyle: 3,
            adventureSeeking: 2
          } 
        },
        { 
          text: "crazy lit movie at the club", 
          traits: { 
            socialEnergy: 5, 
            adventureSeeking: 5,
            communicationStyle: 4
          } 
        }
      ]
    },
    {
      id: 4,
      text: "Choose a color that best represents your personality:",
      options: [
        { 
          text: "Vibrant Pink", 
          traits: { 
            emotionalDepth: 4,
            communicationStyle: 3,
            adventureSeeking: 3
          }
        },
        { 
          text: "Calming Green", 
          traits: { 
            emotionalDepth: 3,
            conflictResolution: 1,
            lifeBalance: 3
          }
        },
        { 
          text: "Deep Purple", 
          traits: { 
            emotionalDepth: 4,
            communicationStyle: 2,
            relationshipPace: 1
          }
        },
        { 
          text: "Bright Yellow", 
          traits: { 
            socialEnergy: 4,
            adventureSeeking: 4,
            communicationStyle: 4
          }
        }
      ]
    }
  ];

  const calculatePersonalityType = () => {
    // Initialize trait scores
    const traitScores: Record<string, number> = {
      socialEnergy: 0,
      emotionalDepth: 0,
      adventureSeeking: 0,
      relationshipPace: 0,
      communicationStyle: 0,
      lifeBalance: 0,
      conflictResolution: 0
    };

    // Calculate average scores for each trait
    Object.values(answers).forEach(answer => {
      Object.entries(answer.traits).forEach(([trait, value]) => {
        if (typeof value === 'number' && trait in traitScores) {
          traitScores[trait] += value;
        }
      });
    });

    // Normalize scores
    Object.keys(traitScores).forEach(trait => {
      traitScores[trait] = Math.min(Math.floor(traitScores[trait] / 2), 4);
    });

    // Determine personality type based on dominant traits
    if (traitScores.emotionalDepth > 3 && traitScores.conflictResolution < 2) {
      return "Harmonious Mediator";
    }
    if (traitScores.socialEnergy > 3 && traitScores.adventureSeeking > 3) {
      return "Adventure Seeker";
    }
    if (traitScores.emotionalDepth > 3 && traitScores.communicationStyle > 3) {
      return "Passionate Pursuer";
    }
    if (traitScores.socialEnergy > 3) {
      return "Social Butterfly";
    }
    if (traitScores.emotionalDepth > 3) {
      return "Romantic Idealist";
    }
    if (traitScores.relationshipPace < 2) {
      return "Steady Companion";
    }
    if (traitScores.communicationStyle < 2) {
      return "Thoughtful Observer";
    }
    return "Independent Spirit";
  };

  const getTraitProfile = (personalityType: string) => {
    // Use personalityType to influence trait values
    const baseScore = personalityType === "Harmonious Mediator" ? 1 
      : personalityType === "Passionate Pursuer" ? 3 
      : 2;

    return Object.entries(personalityTraits)
      .filter(([trait]) => trait !== 'loveLanguage')
      .map(([trait, values]) => {
        if (!values) return null;
        const score = Math.min(Math.floor(baseScore + Math.random() * 2), 4);
        return {
          trait,
          value: values[score]
        };
      })
      .filter((item): item is { trait: string; value: string } => item !== null);
  };

  const handleOptionSelect = (option: Option) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: option
    }));
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  if (showThankYou) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-700 p-4">
        <div className="max-w-md mx-auto min-h-screen flex flex-col justify-center text-white px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">Thank you!</h1>
          <p className="text-xl">Have fun meeting your matches!</p>
        </div>
      </div>
    );
  }

  if (showResult) {
    const personalityType = calculatePersonalityType();
    const traitProfile = getTraitProfile(personalityType);
    
    // Find the dominant trait for matching
    const dominantTrait = traitProfile[0];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-700 p-4">
        <div className="max-w-md mx-auto min-h-screen flex flex-col justify-center text-white px-4 text-center">
          <p className="text-sm mb-4">you are a...</p>
          <h1 className="text-6xl font-bold mb-8">{personalityType}</h1>
          <p className="mb-8">{traitDescriptions[personalityType]}</p>
          
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Your Trait Profile:</h2>
            {traitProfile.map(({ trait, value }, index) => (
              <div key={index} className="mb-2 flex justify-center items-center space-x-2">
                <span className="text-purple-200">{trait}:</span>
                <span>{value}</span>
              </div>
            ))}
          </div>

          <div className="space-y-6 text-center">
            <p className="text-lg font-medium">
              Ready to mingle? Look for someone who is a{' '}
              <span className="text-white font-bold underline">{dominantTrait.value}</span>!
            </p>
            <p className="text-sm opacity-75">
              Tip: Start a conversation about what made them choose their answers!
            </p>
            <button 
              onClick={() => setShowThankYou(true)}
              className="w-full bg-purple-900 text-white rounded-full py-4 px-6 text-lg font-medium hover:bg-purple-800 transition-all"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-700 p-4">
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col justify-center text-white px-4 text-center">
          <h2 className="text-4xl font-bold mb-12 whitespace-pre-line leading-relaxed text-center">
            {questions[currentQuestion].text}
          </h2>
          
          <div className="space-y-4 w-full flex flex-col items-center">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                className="w-full bg-white bg-opacity-20 text-purple-900 font-medium rounded-full py-4 px-6 hover:bg-opacity-40 hover:text-purple-800 transition-all text-lg text-center"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>

        <div className="py-8 flex justify-center space-x-2">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentQuestion ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
