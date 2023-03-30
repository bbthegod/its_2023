db = db.getSiblingDB('itsupporter');

db.createCollection('users');

db.users.insertMany([
  {
    "studentCode": "admin",
    "studentName": "admin",
    "studentClass": "HTTT1-K12",
    "studentPhone": "0123456789",
    "password": "$2b$10$.fk..fBDMWtl5FpnN4lgEeJLM9ENLq.qtyRtAmTq6VhOMAhqPUY1C",
    "role": "admin",
    "isOnline": false,
  },
  {
    "studentCode": "2017604482",
    "studentName": "Tung",
    "studentClass": "HTTT1-K12",
    "studentPhone": "0123456789",
    "password": "$2b$10$.fk..fBDMWtl5FpnN4lgEeJLM9ENLq.qtyRtAmTq6VhOMAhqPUY1C",
    "role": "user",
    "isOnline": false,
  }
]);

db.createCollection('questions');

db.questions.insertMany([
  {
    "content": "easy",
    "options": [
      {
        "numbering": NumberInt(1),
        "answer": "1"
      },
      {
        "numbering": NumberInt(2),
        "answer": "2"
      },
      {
        "numbering": NumberInt(3),
        "answer": "3"
      },
      {
        "numbering": NumberInt(4),
        "answer": "4"
      }
    ],
    "correctAnswer": NumberInt(2),
    "level": "easy"
  },
  {
    "content": "easy2",
    "options": [
      {
        "numbering": NumberInt(1),
        "answer": "1"
      },
      {
        "numbering": NumberInt(2),
        "answer": "2"
      },
      {
        "numbering": NumberInt(3),
        "answer": "3"
      },
      {
        "numbering": NumberInt(4),
        "answer": "4"
      }
    ],
    "correctAnswer": NumberInt(4),
    "level": "easy"
  },
  {
    "content": "easy3",
    "options": [
      {
        "numbering": NumberInt(1),
        "answer": "1"
      },
      {
        "numbering": NumberInt(2),
        "answer": "2"
      },
      {
        "numbering": NumberInt(3),
        "answer": "3"
      },
      {
        "numbering": NumberInt(4),
        "answer": "4"
      }
    ],
    "correctAnswer": NumberInt(4),
    "level": "easy"
  },
  {
    "content": "easy4",
    "options": [
      {
        "numbering": NumberInt(1),
        "answer": "1"
      },
      {
        "numbering": NumberInt(2),
        "answer": "2"
      },
      {
        "numbering": NumberInt(3),
        "answer": "3"
      },
      {
        "numbering": NumberInt(4),
        "answer": "4"
      }
    ],
    "correctAnswer": NumberInt(4),
    "level": "easy"
  },
  {
    "content": "easy5",
    "options": [
      {
        "numbering": NumberInt(1),
        "answer": "1"
      },
      {
        "numbering": NumberInt(2),
        "answer": "2"
      },
      {
        "numbering": NumberInt(3),
        "answer": "3"
      },
      {
        "numbering": NumberInt(4),
        "answer": "4"
      }
    ],
    "correctAnswer": NumberInt(4),
    "level": "easy"
  },
  {
    "content": "medium",
    "options": [
      {
        "numbering": NumberInt(1),
        "answer": "1"
      },
      {
        "numbering": NumberInt(2),
        "answer": "2"
      },
      {
        "numbering": NumberInt(3),
        "answer": "3"
      },
      {
        "numbering": NumberInt(4),
        "answer": "4"
      }
    ],
    "correctAnswer": NumberInt(4),
    "level": "medium"
  },
  {
    "content": "medium2",
    "options": [
      {
        "numbering": NumberInt(1),
        "answer": "1"
      },
      {
        "numbering": NumberInt(2),
        "answer": "2"
      },
      {
        "numbering": NumberInt(3),
        "answer": "3"
      },
      {
        "numbering": NumberInt(4),
        "answer": "4"
      }
    ],
    "correctAnswer": NumberInt(4),
    "level": "medium"
  },
  {
    "content": "hard",
    "options": [
      {
        "numbering": NumberInt(1),
        "answer": "1"
      },
      {
        "numbering": NumberInt(2),
        "answer": "2"
      },
      {
        "numbering": NumberInt(3),
        "answer": "3"
      },
      {
        "numbering": NumberInt(4),
        "answer": "4"
      }
    ],
    "correctAnswer": NumberInt(4),
    "level": "hard"
  }
])