db = db.getSiblingDB('itsupporter');

db.createCollection('users');

db.users.insertMany([
  {
    "_id": ObjectId("63457db9a70e578dacbc4b29"),
    "studentCode": "admin",
    "studentName": "admin",
    "studentClass": "HTTT1-K12",
    "studentPhone": "0123456789",
    "password": "$2b$10$.fk..fBDMWtl5FpnN4lgEeJLM9ENLq.qtyRtAmTq6VhOMAhqPUY1C",
    "role": "admin",
    "isOnline": false,
    "status": NumberInt(0),
    "createdAt": ISODate("2022-10-11T14:29:13.334+0000"),
    "updatedAt": ISODate("2022-10-11T14:29:13.334+0000"),
    "__v": NumberInt(0)
  },
  {
    "studentCode": "2017604482",
    "studentName": "Tung",
    "studentClass": "HTTT1-K12",
    "studentPhone": "0123456789",
    "password": "123456",
    "role": "user",
    "isOnline": false,
    "status": NumberInt(0),
    "createdAt": ISODate("2022-10-11T14:29:13.334+0000"),
    "updatedAt": ISODate("2022-10-11T14:29:13.334+0000"),
    "__v": NumberInt(0)
  }
]);

db.createCollection('questions');

db.questions.insertMany([
  {
    "content": "1+1=?",
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
    "correctAnswer": NumberInt(2)
  },
  {
    "content": "2+2=?",
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
    "correctAnswer": NumberInt(4)
  },
  {
    "content": "3+3=?",
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
    "correctAnswer": NumberInt(4)
  },
  {
    "content": "3+3=?",
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
    "correctAnswer": NumberInt(4)
  }
])