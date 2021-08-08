const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");

chai.should();

chai.use(chaiHttp);

let newPostId = 0;

describe("POST API", () => {
  describe("CREATE /posts", () => {
    const AUTHORIZED_ID = 1;
    const UN_AUTHORIZED_ID = 4;

    it("It should create new post as a member only", (done) => {
      chai
        .request(server)
        .post(`/posts`)
        .set("user_id", AUTHORIZED_ID)
        .send({
          title: "Introduction to cerbos Authorization",
          content: "This is a test sample",
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.data.should.be.an("object");
          res.body.code.should.be.equal(201);
          res.body.message.should.be.equal("Post created successfully");
          newPostId = res.body.data.id;
          done();
        });
    });

    it("It should fail to create new post because user is a moderator", (done) => {
      chai
        .request(server)
        .post(`/posts`)
        .set("user_id", UN_AUTHORIZED_ID)
        .send({
          title: "Introduction to cerbos Authorization",
          content: "This is a test sample",
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.code.should.be.equal(400);
          done();
        });
    });
  });

  describe("GET /posts", () => {
    const AUTHORIZED_ID = 1;
    const UN_AUTHORIZED_ID = 24;

    it("It should get all post as a user (moderator and member)", (done) => {
      chai
        .request(server)
        .get(`/posts`)
        .set("user_id", AUTHORIZED_ID)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.should.be.an("array");
          res.body.code.should.be.equal(200);
          done();
        });
    });

    it("It should fail to get all post as an unknown user", (done) => {
      chai
        .request(server)
        .get(`/posts`)
        .set("user_id", UN_AUTHORIZED_ID)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.code.should.be.equal(400);
          done();
        });
    });
  });

  describe("GET /posts/:id", () => {
    const AUTHORIZED_ID = 1;
    const UN_AUTHORIZED_ID = 24;

    it("It should get single post as a user (moderator and member)", (done) => {
      chai
        .request(server)
        .get(`/posts/366283`)
        .set("user_id", AUTHORIZED_ID)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.should.be.an("object");
          res.body.code.should.be.equal(200);
          done();
        });
    });

    it("It should fail to get single post as an unknown user", (done) => {
      chai
        .request(server)
        .get(`/posts/366283`)
        .set("user_id", UN_AUTHORIZED_ID)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.code.should.be.equal(400);
          done();
        });
    });
  });

  describe("POST /posts/flag/:id", () => {
    const UN_AUTHORIZED_ID = 3;
    const AUTHORIZED_MODERATOR_ID = 4;
    const UN_AUTHORIZED_MODERATOR_ID = 5;

    it("It should flag a single post as a moderator", (done) => {
      chai
        .request(server)
        .post(`/posts/flag/366283`)
        .send({
          flag: true,
        })
        .set("user_id", AUTHORIZED_MODERATOR_ID)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.code.should.be.equal(200);
          done();
        });
    });

    it("It should fail to flag a single post as an unauthorized moderator", (done) => {
      chai
        .request(server)
        .post(`/posts/flag/366283`)
        .send({
          flag: true,
        })
        .set("user_id", UN_AUTHORIZED_MODERATOR_ID)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.code.should.be.equal(400);
          done();
        });
    });

    it("It should fail to flag a single post as a member", (done) => {
      chai
        .request(server)
        .post(`/posts/flag/366283`)
        .send({
          flag: true,
        })
        .set("user_id", UN_AUTHORIZED_ID)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.code.should.be.equal(400);
          done();
        });
    });
  });

  describe("PATCH /posts/:id", () => {
    const AUTHORIZED_ID = 1;
    const UN_AUTHORIZED_ID = 2;
    const AUTHORIZED_MODERATOR_ID = 4;
    const UN_AUTHORIZED_MODERATOR_ID = 5;

    it("It should update a single post as owner of post", (done) => {
      chai
        .request(server)
        .patch(`/posts/${newPostId}`)
        .send({
          title: "Authorization in NodeJs",
          content:
            "A guide into implementing authorization in your application",
        })
        .set("user_id", AUTHORIZED_ID)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.code.should.be.equal(200);
          done();
        });
    });

    it("It should fail to update a single post if user is not owner of the post", (done) => {
      chai
        .request(server)
        .patch(`/posts/${newPostId}`)
        .send({
          title: "Authorization in NodeJs",
          content:
            "A guide into implementing authorization in your application",
        })
        .set("user_id", UN_AUTHORIZED_ID)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.code.should.be.equal(400);
          done();
        });
    });

    it("It should update a single post if user is a moderator and post is flagged true", (done) => {
      chai
        .request(server)
        .patch(`/posts/366283`)
        .send({
          title: "Authorization in NodeJs",
          content:
            "A guide into implementing authorization in your application",
        })
        .set("user_id", AUTHORIZED_MODERATOR_ID)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.code.should.be.equal(200);
          done();
        });
    });

    it("It should fail to update a single post if user is a moderator and post is flagged false", (done) => {
      chai
        .request(server)
        .patch(`/posts/366283`)
        .send({
          title: "Authorization in NodeJs",
          content:
            "A guide into implementing authorization in your application",
        })
        .set("user_id", UN_AUTHORIZED_MODERATOR_ID)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.code.should.be.equal(400);
          done();
        });
    });
  });

  describe("DELETE /posts/:id", () => {
    const AUTHORIZED_ID = 1;
    const UN_AUTHORIZED_ID = 2;
    const MODERATOR_ID = 4;

    it("It should delete a single post as owner of post", (done) => {
      chai
        .request(server)
        .delete(`/posts/${newPostId}`)
        .set("user_id", AUTHORIZED_ID)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.code.should.be.equal(200);
          done();
        });
    });

    it("It should fail to delete a single post if user is not owner of the post", (done) => {
      chai
        .request(server)
        .delete(`/posts/${newPostId}`)
        .set("user_id", UN_AUTHORIZED_ID)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.code.should.be.equal(400);
          done();
        });
    });

    it("It should fail to delete a single post if user is a moderator", (done) => {
      chai
        .request(server)
        .delete(`/posts/${newPostId}`)
        .set("user_id", MODERATOR_ID)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.code.should.be.equal(400);
          done();
        });
    });
  });
});
