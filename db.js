const db = {
  users: [
    {
      id: 1,
      name: "John Doe",
      role: "member",
      blocked: false,
    },
    {
      id: 2,
      name: "Snow Mountain",
      role: "member",
      blocked: false,
    },
    {
      id: 3,
      name: "David Woods",
      role: "member",
      blocked: true,
    },
    {
      id: 4,
      name: "Maria Waters",
      role: "moderator",
      blocked: false,
    },
    {
      id: 5,
      name: "Grace Stones",
      role: "moderator",
      blocked: true,
    },
  ],
  posts: [
    {
      id: 366283,
      title: "Introduction to Cerbos",
      content:
        "In this article you will learn how to integrate Cerbos authorization into an existing application",
      userId: 1,
      flagged: false,
    },
  ],
};

module.exports = db;
