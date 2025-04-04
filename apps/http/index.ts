import express from "express";
import prisma from "@repo/db";

const app = express();

app.post("/signup", (req, res) => {});
app.post("/login", (req, res) => {});
app.get("/profile", (req, res) => {});

app.listen(3001, () => console.log("Server started on PORT 3000"));
